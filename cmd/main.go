package main

import (
	"context"
	"errors"
	"flag"
	"fmt"
	"log/slog"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"luigimorel.com/opendeploy/config"
	"luigimorel.com/opendeploy/internal/datastore/postgres"
	"luigimorel.com/opendeploy/server"
	"luigimorel.com/opendeploy/web"
)

// Set at build time: -ldflags "-X main.version=v1.2.3 -X main.commit=abc123 -X main.date=..."
var (
	version = "dev"
	commit  = "none"
	date    = "unknown"
)

func main() {
	if err := run(); err != nil {
		slog.Error("fatal", "err", err)
		os.Exit(1)
	}
}

func run() error {
	cfg := config.Load()

	addr := flag.String("addr", cfg.Addr, "listen address (env: ADDR or PORT)")
	showVersion := flag.Bool("version", false, "print version and exit")
	flag.Parse()

	if *showVersion {
		fmt.Printf("open-deploy %s (commit %s, built %s)\n", version, commit, date)
		return nil
	}

	logger := slog.New(slog.NewTextHandler(os.Stdout, nil))

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	db, err := postgres.New(cfg.Database, logger)
	if err != nil {
		return fmt.Errorf("database unavailable (is it running, and did you run `task migrate`?): %w", err)
	}
	defer func() { _ = postgres.Close(db) }()

	srv := &http.Server{
		Addr: *addr,
		Handler: server.NewRouter(server.Options{
			Static:  web.Dist(),
			Version: version,
			Logger:  logger,
		}),
		ReadHeaderTimeout: cfg.ReadHeaderTimeout,
		ReadTimeout:       cfg.ReadTimeout,
		WriteTimeout:      cfg.WriteTimeout,
		IdleTimeout:       cfg.IdleTimeout,
	}

	errCh := make(chan error, 1)
	go func() {
		logger.Info("listening", "addr", *addr, "version", version)
		if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
			errCh <- err
		}
	}()

	select {
	case err := <-errCh:
		return fmt.Errorf("server failed: %w", err)
	case <-ctx.Done():
	}

	logger.Info("shutting down")
	shutdownCtx, cancel := context.WithTimeout(context.Background(), cfg.ShutdownTimeout)
	defer cancel()
	if err := srv.Shutdown(shutdownCtx); err != nil {
		return fmt.Errorf("graceful shutdown failed: %w", err)
	}
	return nil
}

// Command cli holds one-off operational commands: go run ./cmd/cli <command>.
package main

import (
	"context"
	"fmt"
	"log/slog"
	"os"
	"time"

	"luigimorel.com/opendeploy/config"
	"luigimorel.com/opendeploy/internal/datastore/postgres"
	"luigimorel.com/opendeploy/internal/seed"
)

func main() {
	if len(os.Args) < 2 {
		usage()
	}

	switch os.Args[1] {
	case "seed":
		if err := runSeed(); err != nil {
			fmt.Fprintln(os.Stderr, "seed:", err)
			os.Exit(1)
		}
	default:
		usage()
	}
}

func runSeed() error {
	cfg := config.Load()
	db, err := postgres.New(cfg.Database, slog.New(slog.NewTextHandler(os.Stderr, nil)))
	if err != nil {
		return err
	}
	defer func() { _ = postgres.Close(db) }()

	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	id, err := seed.Run(ctx, db)
	if err != nil {
		return err
	}
	fmt.Println("demo organization:", id)
	return nil
}

func usage() {
	fmt.Fprintln(os.Stderr, "usage: go run ./cmd/cli <command>\n\ncommands:\n  seed   insert a demo organization and user (idempotent)")
	os.Exit(2)
}

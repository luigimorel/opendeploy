// Package server wires the chi router: JSON API under /api, SPA for everything else.
package server

import (
	"io/fs"
	"log/slog"
	"net/http"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
)

type Options struct {
	Static  fs.FS // compiled frontend, rooted at index.html
	Version string
	Logger  *slog.Logger
}

type server struct {
	Options
}

// NewRouter builds the full http.Handler.
func NewRouter(opts Options) http.Handler {
	if opts.Logger == nil {
		opts.Logger = slog.Default()
	}
	s := &server{Options: opts}

	r := chi.NewRouter()
	r.Use(
		middleware.RequestID,
		middleware.RealIP,
		requestLogger(opts.Logger),
		middleware.Recoverer,
		middleware.Compress(5),
	)

	r.Route("/api", func(r chi.Router) {
		r.Use(middleware.NoCache)

		r.Get("/healthz", s.handleHealth)
		r.Get("/version", s.handleVersion)

		r.Route("/v1", func(r chi.Router) {
			// Versioned API routes go here.
		})

		// Unknown /api paths must be JSON 404s, never the SPA's index.html.
		r.NotFound(func(w http.ResponseWriter, _ *http.Request) {
			writeError(w, http.StatusNotFound, "not found")
		})
		r.MethodNotAllowed(func(w http.ResponseWriter, _ *http.Request) {
			writeError(w, http.StatusMethodNotAllowed, "method not allowed")
		})
	})

	r.Handle("/*", spaHandler(opts.Static))
	return r
}

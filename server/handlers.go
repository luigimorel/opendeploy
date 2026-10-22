package server

import (
	"errors"
	"net/http"

	"luigimorel.com/opendeploy"
)

func (s *server) handleHealth(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"status": "ok"})
}

func (s *server) handleVersion(w http.ResponseWriter, _ *http.Request) {
	writeJSON(w, http.StatusOK, map[string]string{"version": s.Version})
}

func (s *server) fail(w http.ResponseWriter, r *http.Request, err error) {
	switch {
	case errors.Is(err, opendeploy.ErrNotFound):
		writeError(w, http.StatusNotFound, "not found")
	case errors.Is(err, opendeploy.ErrConflict):
		writeError(w, http.StatusConflict, "already exists")
	case errors.Is(err, opendeploy.ErrInvalid):
		writeError(w, http.StatusBadRequest, err.Error())
	default:
		s.Logger.Error("request failed", "path", r.URL.Path, "err", err)
		writeError(w, http.StatusInternalServerError, "internal error")
	}
}

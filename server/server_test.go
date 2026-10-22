package server

import (
	"errors"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"
	"testing/fstest"

	"luigimorel.com/opendeploy"
)

func newRouter() http.Handler {
	return NewRouter(Options{
		Static: fstest.MapFS{
			"index.html":    {Data: []byte("<!doctype html><title>app</title>")},
			"assets/app.js": {Data: []byte("console.log('hi')")},
		},
		Version: "test",
		Logger:  slog.New(slog.NewTextHandler(io.Discard, nil)),
	})
}

func testServer(t *testing.T) *httptest.Server {
	t.Helper()
	srv := httptest.NewServer(newRouter())
	t.Cleanup(srv.Close)
	return srv
}

func get(t *testing.T, url string) (*http.Response, string) {
	t.Helper()
	res, err := http.Get(url)
	if err != nil {
		t.Fatal(err)
	}
	defer res.Body.Close()
	b, _ := io.ReadAll(res.Body)
	return res, string(b)
}

func TestAPIAndSPA(t *testing.T) {
	srv := testServer(t)

	cases := []struct {
		name, path string
		status     int
		contains   string
		cache      string
	}{
		{"health", "/api/healthz", 200, `"status":"ok"`, ""},
		{"version", "/api/version", 200, `"version":"test"`, ""},
		{"unknown api is json 404", "/api/nope", 404, `"error"`, ""},
		{"unknown v1 route is json 404", "/api/v1/nope", 404, `"error"`, ""},
		{"root serves index", "/", 200, "<title>app</title>", "no-cache"},
		{"client route falls back to index", "/projects", 200, "<title>app</title>", "no-cache"},
		{"asset is immutable", "/assets/app.js", 200, "console.log", "public, max-age=31536000, immutable"},
		{"missing asset is a real 404", "/assets/missing.js", 404, "", ""},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			res, body := get(t, srv.URL+c.path)
			if res.StatusCode != c.status {
				t.Fatalf("status = %d, want %d", res.StatusCode, c.status)
			}
			if !strings.Contains(body, c.contains) {
				t.Fatalf("body %q does not contain %q", body, c.contains)
			}
			if c.cache != "" && res.Header.Get("Cache-Control") != c.cache {
				t.Fatalf("Cache-Control = %q, want %q", res.Header.Get("Cache-Control"), c.cache)
			}
		})
	}
}

func TestFailMapsDomainErrors(t *testing.T) {
	s := &server{Options: Options{Logger: slog.New(slog.NewTextHandler(io.Discard, nil))}}

	cases := []struct {
		name       string
		err        error
		wantStatus int
	}{
		{"not found", fmt.Errorf("project x: %w", opendeploy.ErrNotFound), http.StatusNotFound},
		{"conflict", fmt.Errorf("project x: %w", opendeploy.ErrConflict), http.StatusConflict},
		{"invalid", fmt.Errorf("name: %w", opendeploy.ErrInvalid), http.StatusBadRequest},
		{"anything else is 500", errors.New("db down"), http.StatusInternalServerError},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			rec := httptest.NewRecorder()
			s.fail(rec, httptest.NewRequest(http.MethodGet, "/api/v1/x", nil), c.err)
			if rec.Code != c.wantStatus {
				t.Fatalf("status = %d, want %d", rec.Code, c.wantStatus)
			}
			if c.wantStatus == http.StatusInternalServerError && strings.Contains(rec.Body.String(), "db down") {
				t.Fatalf("internal error leaked to client: %s", rec.Body.String())
			}
		})
	}
}

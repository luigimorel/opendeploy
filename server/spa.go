package server

import (
	"io/fs"
	"net/http"
	"path"
	"strings"
)

// spaHandler serves a single-page app from fsys:
//   - existing files are served as-is (hashed /assets/* are cached forever)
//   - missing files with an extension are a real 404 (no HTML for a missing .js)
//   - any other path falls back to index.html so client-side routing works
func spaHandler(fsys fs.FS) http.Handler {
	files := http.FileServer(http.FS(fsys))

	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if _, err := fs.Stat(fsys, "index.html"); err != nil {
			http.Error(w, "frontend not built: run `task web:build` (or `task build`)", http.StatusServiceUnavailable)
			return
		}

		p := strings.TrimPrefix(path.Clean("/"+r.URL.Path), "/")
		if p == "" {
			p = "index.html"
		}

		if st, err := fs.Stat(fsys, p); err == nil && !st.IsDir() {
			switch {
			case strings.HasPrefix(p, "assets/"):
				// Vite fingerprints these filenames, so they never change.
				w.Header().Set("Cache-Control", "public, max-age=31536000, immutable")
			case p == "index.html":
				w.Header().Set("Cache-Control", "no-cache")
			}
			files.ServeHTTP(w, r)
			return
		}

		if path.Ext(p) != "" {
			http.NotFound(w, r)
			return
		}

		// Client-side route: hand back the app shell.
		w.Header().Set("Cache-Control", "no-cache")
		r2 := r.Clone(r.Context())
		r2.URL.Path = "/"
		files.ServeHTTP(w, r2)
	})
}

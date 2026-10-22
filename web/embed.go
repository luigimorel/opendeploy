// Package web embeds the compiled frontend (web/dist) into the Go binary.
//
// web/dist is produced by `npm run build` (see the Taskfile). It is git-ignored
// except for .gitkeep, which keeps `//go:embed` compiling on a fresh checkout.
package web

import (
	"embed"
	"io/fs"
)

//go:embed all:dist
var distFS embed.FS

// Dist returns the compiled frontend with dist/ as its root.
func Dist() fs.FS {
	sub, err := fs.Sub(distFS, "dist")
	if err != nil {
		panic(err) // only possible if the embed directive above is wrong
	}
	return sub
}

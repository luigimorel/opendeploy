package opendeploy

import (
	"net/http"
	"strconv"
)

const (
	defaultPerPage = 20
	maxPerPage     = 100
)

type PaginatedResultMetadata struct {
	Total int64
}

type Paginator struct {
	PerPage int64
	Page    int64
}

func (p Paginator) Offset() int {
	if p.Page <= 0 {
		return 0
	}
	return int((p.Page - 1) * p.Limit())
}

func (p Paginator) Limit() int64 {
	switch {
	case p.PerPage <= 0:
		return defaultPerPage
	case p.PerPage > maxPerPage:
		return maxPerPage
	default:
		return p.PerPage
	}
}

func PaginatorFromRequest(r *http.Request) Paginator {
	p := Paginator{Page: 1, PerPage: defaultPerPage}
	if n, err := strconv.Atoi(r.URL.Query().Get("page")); err == nil && n > 0 {
		p.Page = int64(n)
	}
	if n, err := strconv.Atoi(r.URL.Query().Get("per_page")); err == nil && n > 0 {
		p.PerPage = int64(n)
	}
	return p
}

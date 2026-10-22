package opendeploy

import (
	"net/http/httptest"
	"testing"
)

func TestPaginator(t *testing.T) {
	cases := []struct {
		name             string
		query            string
		wantPage, wantPP int64
		wantOffset       int
	}{
		{"defaults", "", 1, 20, 0},
		{"page 3", "?page=3&per_page=10", 3, 10, 20},
		{"garbage falls back", "?page=x&per_page=-4", 1, 20, 0},
		{"capped limit", "?page=2&per_page=5000", 2, 5000, 100},
	}
	for _, c := range cases {
		t.Run(c.name, func(t *testing.T) {
			p := PaginatorFromRequest(httptest.NewRequest("GET", "/"+c.query, nil))
			if p.Page != c.wantPage || p.PerPage != c.wantPP {
				t.Fatalf("got page=%d per_page=%d", p.Page, p.PerPage)
			}
			if p.Offset() != c.wantOffset {
				t.Fatalf("offset = %d, want %d", p.Offset(), c.wantOffset)
			}
		})
	}
}

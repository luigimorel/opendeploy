# Open Deploy: one repo, one binary

Git-based hosting, self-hosted. Go (chi router) JSON API + React/Vite frontend, shipped as a
single static executable. The compiled frontend is embedded into the Go binary with `//go:embed`.

```
.
├── organization.go, user.go domain models (json + gorm tags) and repository interfaces
│                            (package opendeploy), one file per model
├── base.go, paginator.go    shared Model (uuid, timestamps, soft delete) and pagination
├── errors.go                sentinel errors (ErrNotFound, ErrInvalid, ErrConflict)
├── cmd/main.go              entrypoint: flags, graceful shutdown, ldflags version
├── cmd/cli/main.go          maintenance commands (`task seed`)
├── config/                  env-based runtime config (ADDR / PORT / DATABASE_URL)
├── server/                  chi router, handlers, middleware, SPA handler, tests
├── internal/datastore/
│   └── postgres/            GORM repositories + SQL migrations/ + integration tests
├── internal/seed/           idempotent demo data
├── mocks/                   hand-written test doubles for the repository interfaces
├── web/                     React + Vite + Tailwind + shadcn app
│   ├── embed.go             //go:embed all:dist  <- the whole trick
│   └── dist/                build output (git-ignored, .gitkeep keeps embed compiling)
├── Taskfile.yml             build / run / test / migrate / dist / docker
├── .air.toml                live reload for `task run:http`
├── .pre-commit-config.yaml  gofmt, go vet, golangci-lint
├── Dockerfile               node build -> go build -> distroless static (~10 MB image)
└── go.mod
```

## Ship it

```bash
task build            # npm ci + vite build, then go build  ->  bin/open-deploy
./bin/open-deploy     # http://localhost:8080  (PORT=9000 or -addr :9000 to change)
```

`bin/open-deploy` is the entire app. Copy it to a server, nothing else is needed:

```bash
scp bin/open-deploy server:/usr/local/bin/
ssh server 'PORT=80 open-deploy'
```

Other tasks: `task dist` (linux/darwin/windows, amd64+arm64), `task docker`,
`task test`, `task lint`, `task clean`, `task --list`. Install the runner from
https://taskfile.dev/installation/.

## Develop

Two terminals, hot reload on the frontend:

```bash
task run:http     # Go API on :8080 (live reload via air)
task run:web      # Vite on :5173, proxies /api -> :8080
```

## Database

GORM + PostgreSQL 13+ (uses the built-in `gen_random_uuid()`, no extensions). The SQL
files in `internal/datastore/postgres/migrations` are the source of truth
(golang-migrate); GORM never auto-migrates, so keep the `gorm` tags on the models in
sync with them.

```bash
task tidy               # first time only: fills go.sum
task tools:install      # golangci-lint, air, migrate (built with your Go)
task db:start           # throwaway Postgres in Docker on :5432
task migrate            # DATABASE_URL defaults to the Docker instance
task seed               # demo organization and user
task run:http           # API on :8080, reading from Postgres
task test-all           # unit + Postgres integration tests (needs a migrated opendeploy_test DB)
```

Tables: `organizations`, `users`.

- **Config:** `DATABASE_URL`, `DB_QUERY_TIMEOUT` (default 10s), `DB_MAX_OPEN_CONNS`,
  `DB_MAX_IDLE_CONNS`, `DB_LOG_QUERIES=true`. Integration tests read `TEST_DATABASE_URL`.
- **Repositories:** one per model in `internal/datastore/postgres` (`NewUserRepository(db)`,
  ...), each behind an interface in the root package. Every call runs under a query timeout.
  `ListAll` returns `(rows, total, err)` and takes a `Paginator`.
- **Tenancy:** every table hangs off `organization_id`. `FindXOptions.OrganizationID`
  filters by it; `uuid.Nil` means "all organizations". The HTTP layer doesn't scope
  requests yet: do that when authentication lands.
- **Errors:** repositories wrap `opendeploy.ErrNotFound` / `ErrConflict` / `ErrInvalid`;
  `server/handlers.go` maps them to 404 / 409 / 400 and everything else to a logged 500.
- **Soft delete:** every table has `deleted_at`; GORM hides deleted rows automatically.
  Unique indexes on emails/names ignore deleted rows so values can be reused.
- **Enums** are `VARCHAR` + `CHECK` constraints (easier to evolve than Postgres enum types).
- **GORM gotcha:** a `default:` tag turns an explicit zero value (`false`, `0`, `""`) into the
  default on insert, so a field that must store `false`/`0` should not carry a `default:` tag.

## How it fits together

- `web/embed.go` embeds `web/dist` at compile time, so `go build` must run after the
  frontend build (the Taskfile and Dockerfile enforce that order).
- `server/spa.go` serves the files, falls back to `index.html` for client-side
  routes, returns real 404s for missing assets, and sets cache headers
  (`/assets/*` immutable for a year, `index.html` no-cache).
- Everything under `/api` is JSON, including its 404s. Add routes in `server/server.go`
  (versioned ones go in the `/v1` group).
- Version info: `./open-deploy -version` (set by `-ldflags` in the Taskfile).

## Notes

- Replace the placeholder module path `github.com/yourorg/opendeploy` in `go.mod` and the
  imports under `cmd/`, `server/`, `internal/`, `mocks/` with your real one.
- Taskfile uses explicit package paths (`GO_PKGS`), not `./...`, so Go
  doesn't walk `web/node_modules`.
- Only `/api/healthz` and `/api/version` are exposed so far. `Organization` and `User` have
  repositories ready for handlers (`server/handlers.go`) and mocks in `mocks/`.
- Needs Go 1.22+ and Node 20+ to build; the binary itself has no runtime dependencies.

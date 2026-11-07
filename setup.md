# Setup

## Prerequisites

- Go 1.22+
- Node.js 22+ with npm
- [Task](https://taskfile.dev/installation/)
- Docker for the local PostgreSQL setup
- [pre-commit](https://pre-commit.com/) to enable commit-time checks

## Install Dependencies

Run these commands from the repository root:

```bash
cp .env.example .env
go mod download
task web:install
task tools:install      # air, golangci-lint, migrate
pre-commit install
```

## Prepare the Database

For local API development, start PostgreSQL and load the schema and demo data:

```bash
task db:start
task migrate
task seed
```

## Start Development Servers

Run the API and frontend in separate terminals:

```bash
task run:http
task run:web
```

The API listens on port `8080`. Vite serves the frontend on port `5173` and proxies `/api` to
the API server.

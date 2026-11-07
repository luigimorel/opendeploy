# Contributing

Thanks for helping improve Open Deploy. Start with the [setup instructions](setup.md)
to install dependencies and prepare a local environment.

## Development

Run the API and frontend in separate terminals:

```bash
task run:http
task run:web
```

The frontend runs on `http://localhost:5173` and proxies `/api` to the Go server. For API-backed
flows, start PostgreSQL and apply migrations as described in [setup.md](setup.md).

## Checks

Before opening a change, run the checks relevant to the code you changed:

```bash
task test
task lint
npm --prefix web run format
npm --prefix web run lint
npm --prefix web run build
```

The web build generates the TanStack route tree and runs TypeScript checks. Add routes under
`web/src/routes`; do not edit the generated `web/src/routeTree.gen.ts` file directly. PostgreSQL
integration tests are available with `task test-all` when a migrated test database is available.

## Commit Hooks

Install [pre-commit](https://pre-commit.com/) and enable the repository hooks:

```bash
pre-commit install
```

The hooks format, lint, and build the web app when web files are staged. Go formatting, vet, and
lint hooks run when Go files are staged. Run every hook manually with:

```bash
pre-commit run --all-files
```

Formatting hooks may update files. Review and stage those changes before committing. Do not commit
local `.env` files or generated build output.

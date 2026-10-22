# Open Deploy dashboard

Vite + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (Radix, "new-york" style).

```bash
npm install
npm run dev
```

Already configured, so you do NOT need to run `npx shadcn@latest init`:

- `vite.config.ts`   React + @tailwindcss/vite plugins, `@/` alias, `/api` dev proxy
- `tsconfig*.json`   strict TS, `@/*` path alias
- `components.json`  lets `npx shadcn@latest add <component>` work later
- `src/index.css`    Tailwind v4 + theme tokens (teal `--primary`), Geist font
- `src/components/ui/*`  button, badge, card, input, textarea, label, separator,
  switch, progress, avatar, tabs, table, dropdown-menu, select

## Structure
- `components/app-shell.tsx`  left rail, organization switcher, header
- `components/stat-card.tsx`, `components/soft-badge.tsx`  small shared building blocks
- `views/overview.tsx`        placeholder landing view
- `lib/api.ts`                fetch wrapper for the Go API (`/api/...`)
- `lib/format.ts`, `lib/utils.ts`  formatting helpers and `cn()`

## Design system
- Flat by rule: no borders, no shadows. Surfaces separate by tone only:
  `background` (page) < `muted` (inputs, tracks, pills) < `card` (white).
- One accent, deep teal (`--primary`), plus a tinted neutral scale. Edit both in `src/index.css`.
- Font: Geist Variable (`@fontsource-variable/geist`).
- Radius scale from `--radius`; cards are `rounded-2xl`, controls `rounded-xl`.

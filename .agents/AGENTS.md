# Agent Guidance

## Design System

Read this section before making frontend changes. Treat the shared theme in `web/src/index.css` as the source of truth for visual design.

- The base palette is deep teal `#003b49` and white `#FFFFFF`.
- Use semantic theme utilities such as `bg-primary`, `text-foreground`, `bg-muted`, and `text-destructive` instead of hardcoded colors in components.
- Do not introduce colors outside the shared palette or semantic theme tokens. Add a shared token first when a new color role is genuinely needed.
- Derive surface, border, and focus colors from the base palette in the shared theme. Keep meaningful status colors behind semantic tokens.
- Avoid box shadows and drop shadows. Keep borders quiet and subtle with the shared `border-border` token; avoid decorative, heavy, or inconsistent border treatments.
- Favor a restrained, lean visual style over extra decoration.
- Extend or adjust shared tokens when a component needs a new role; do not introduce a separate palette in the component.
- Prefer existing shadcn-style primitives in `web/src/components/ui/` over raw controls or one-off styled elements. Compose existing primitives where possible; add a new primitive only when the UI kit has no suitable component.
- Reuse the existing component patterns and keep UI changes consistent with the established design system.

Example:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

<div className="space-y-2">
  <Label htmlFor="email">Email</Label>
  <Input id="email" name="email" type="email" autoComplete="email" required />
  <Button type="submit">Continue</Button>
</div>
```

## Go Tests

- Run `task test` for the standard Go unit-test suite. It uses the repository's explicit package list to avoid frontend dependencies.
- For a focused change, run `go test ./path/to/package` first, then `task test` when practical.
- Integration tests are opt-in: run `task test-all` only when the test PostgreSQL database is available and migrated; configure it with `TEST_DATABASE_URL`.
- Add tests beside the package behavior they cover. Write Go tests as table-driven tests with named subtests, including single-case tests where practical. Use `t.Helper()` in test helpers and register cleanup with `t.Cleanup()`.
- Keep unit tests independent of external services. Do not weaken or skip a failing test merely to make the suite pass.

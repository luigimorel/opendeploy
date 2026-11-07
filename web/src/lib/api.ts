/**
 * Tiny fetch wrapper for the Go API. In production the SPA and API share an
 * origin (one binary), so paths are relative. In `npm run dev`, Vite proxies
 * /api to http://localhost:8080 (see vite.config.ts).
 */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json() as Promise<T>;
}

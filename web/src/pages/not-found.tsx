import { Link } from '@tanstack/react-router';

export function NotFoundPage() {
  return (
    <main className="bg-background text-foreground flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <Link className="text-primary underline-offset-4 hover:underline" to="/">
        Return to overview
      </Link>
    </main>
  );
}

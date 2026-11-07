import { Link } from '@tanstack/react-router';
import { GitBranch, Github } from 'lucide-react';

import * as React from 'react';

import { Button } from '@/components/ui/button';

interface AuthLayoutProps {
  eyebrow: string;
  title: string;
  description: string;
  footer: React.ReactNode;
  children: React.ReactNode;
}

export function AuthLayout({ eyebrow, title, description, footer, children }: AuthLayoutProps) {
  return (
    <main className="bg-background min-h-screen lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
      <aside className="bg-primary text-primary-foreground relative flex min-h-56 flex-col overflow-hidden px-6 py-7 sm:min-h-64 sm:px-10 lg:min-h-screen lg:px-14 lg:py-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-15"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,.22) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.22) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <Link
          to="/"
          className="relative flex w-fit items-center gap-3 rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white">
          <span className="text-primary flex size-9 items-center justify-center rounded-lg bg-white text-sm font-bold">
            O
          </span>
          <span className="text-base font-semibold">Open Deploy</span>
        </Link>

        <div className="relative mt-10 max-w-md lg:my-auto lg:mt-0 lg:pb-10">
          <p className="text-sm font-medium text-white/70">Git-based hosting, self-hosted.</p>
          <h1 className="mt-4 max-w-sm text-3xl leading-tight font-semibold sm:text-4xl">
            Your code is ready for its next home.
          </h1>
          <p className="mt-4 max-w-sm text-sm leading-6 text-white/75">
            Connect your account and keep your deployments close to the work that created them.
          </p>
        </div>

        <div className="relative mt-8 hidden items-center gap-3 text-xs text-white/65 lg:flex">
          <span className="size-2 rounded-full bg-white" />
          <span>Open source deployment platform</span>
        </div>
      </aside>

      <section className="flex min-h-[calc(100vh-14rem)] items-center justify-center px-6 py-10 sm:px-10 lg:min-h-screen lg:px-12">
        <div className="w-full max-w-sm">
          <p className="text-primary text-sm font-medium">{eyebrow}</p>
          <h2 className="mt-2 text-3xl leading-tight font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">{description}</p>
          {children}
          <div className="text-muted-foreground mt-6 text-center text-sm">{footer}</div>
        </div>
      </section>
    </main>
  );
}

export function ProviderButtons({ onProvider }: { onProvider: (name: 'GitHub' | 'GitLab') => void }) {
  return (
    <>
      <div className="mt-7 grid gap-3 sm:grid-cols-2">
        <Button
          type="button"
          variant="outline"
          className="bg-card h-11 justify-start px-3.5"
          onClick={() => onProvider('GitHub')}>
          <Github className="size-4" aria-hidden="true" />
          Continue with GitHub
        </Button>
        <Button
          type="button"
          variant="outline"
          className="bg-card h-11 justify-start px-3.5"
          onClick={() => onProvider('GitLab')}>
          <GitBranch className="size-4" aria-hidden="true" />
          Continue with GitLab
        </Button>
      </div>
      <p className="text-muted-foreground mt-3 text-xs leading-5">
        Your GitHub or GitLab username will be your Open Deploy username.
      </p>
      <div className="my-7 flex items-center gap-3" aria-hidden="true">
        <div className="bg-border h-px flex-1" />
        <span className="text-muted-foreground text-xs">or use email</span>
        <div className="bg-border h-px flex-1" />
      </div>
    </>
  );
}

export function AuthFormMessage({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return (
    <p role="status" aria-live="polite" className="bg-accent text-accent-foreground rounded-lg px-3 py-2.5 text-sm">
      {children}
    </p>
  );
}

export function AuthFieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="text-destructive text-xs font-medium">
      {message}
    </p>
  );
}

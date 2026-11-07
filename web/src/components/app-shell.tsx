import { LayoutDashboard } from 'lucide-react';

import * as React from 'react';

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cn } from '@/lib/utils';

export type ViewId = 'overview';

const nav: { id: ViewId; label: string; icon: React.ElementType; badge?: number }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
];

interface AppShellProps {
  view: ViewId;
  onViewChange: (v: ViewId) => void;
  children: React.ReactNode;
}

export function AppShell({ view, onViewChange, children }: AppShellProps) {
  const current = nav.find((n) => n.id === view)!;

  return (
    <div className="bg-background text-foreground flex h-screen">
      {/* Left rail: sits on the page tone, no divider */}
      <aside className="hidden w-60 shrink-0 flex-col px-3 py-4 md:flex">
        <div className="flex h-10 items-center gap-2.5 px-3">
          <span className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-lg text-sm font-semibold">
            O
          </span>
          <span className="text-[17px] font-semibold tracking-tight">Open Deploy</span>
        </div>

        <div className="mt-5 px-0.5">
          <Select defaultValue="demo">
            <SelectTrigger className="bg-card w-full" aria-label="Organization">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demo">Demo Org</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <nav className="mt-5 flex-1 space-y-0.5" aria-label="Main">
          {nav.map(({ id, label, icon: Icon, badge }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  active ? 'bg-card text-foreground' : 'text-muted-foreground hover:bg-card/60 hover:text-foreground',
                )}>
                <Icon
                  className={cn('size-[18px]', active ? 'text-primary' : 'text-muted-foreground')}
                  strokeWidth={1.75}
                />
                <span className="flex-1 text-left">{label}</span>
                {badge !== undefined && (
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-[11px] font-semibold">
                    {badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 px-6 md:px-8">
          <h1 className="text-xl font-semibold tracking-tight">{current.label}</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

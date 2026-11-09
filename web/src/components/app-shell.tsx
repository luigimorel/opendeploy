import type { User } from '@/types';
import { FolderKanban, Globe2, KeyRound, Plug, Rocket, Settings } from 'lucide-react';

import * as React from 'react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import { cn } from '@/lib/utils';

export type ViewId =
  'projects' | 'deployments' | 'domains' | 'environment-variables' | 'integrations' | 'profile-settings';

const nav: { id: ViewId; label: string; icon: React.ElementType; separated?: boolean }[] = [
  { id: 'projects', label: 'Projects', icon: FolderKanban },
  { id: 'deployments', label: 'Deployments', icon: Rocket },
  { id: 'domains', label: 'Domains', icon: Globe2, separated: true },
  { id: 'environment-variables', label: 'Environment Variables', icon: KeyRound },
  { id: 'integrations', label: 'Integrations', icon: Plug },
];

interface AppShellProps {
  view: ViewId;
  onViewChange: (v: ViewId) => void;
  user?: User | null;
  children: React.ReactNode;
}

export function AppShell({ view, onViewChange, user, children }: AppShellProps) {
  const current = nav.find((n) => n.id === view);
  const initials = user?.fullName
    ?.split(/\s+/)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="bg-background text-foreground flex h-screen">
      {/* Left rail */}
      <aside className="border-border/70 bg-muted/40 text-foreground hidden w-60 shrink-0 flex-col border-r px-2 py-3 md:flex">
        <div className="flex h-10 items-center gap-2.5 px-2">
          <span className="flex size-7 items-center justify-center rounded-full bg-[#ff8a3d] text-sm font-semibold text-black">
            O
          </span>
          <span className="flex-1 truncate text-sm font-medium">Open Deploy</span>
        </div>

        <div className="mt-3">
          <Select defaultValue="demo">
            <SelectTrigger
              className="text-foreground focus-visible:ring-ring h-9 w-full border-0 bg-transparent px-2 text-sm shadow-none hover:bg-black/5"
              aria-label="Organization">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="demo">Demo Org</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <nav className="mt-4 flex-1 space-y-0.5" aria-label="Main">
          {nav.map(({ id, label, icon: Icon, separated }) => {
            const active = view === id;
            return (
              <button
                key={id}
                onClick={() => onViewChange(id)}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] font-medium transition-colors',
                  separated && 'border-border mt-2 border-t pt-3',
                  active
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/5',
                )}>
                <Icon className="size-4 shrink-0" strokeWidth={1.75} />
                <span className="truncate text-left">{label}</span>
              </button>
            );
          })}
        </nav>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex w-full items-center gap-2 rounded-md p-2 text-left transition-colors hover:bg-black/5"
              aria-label="Open profile settings">
              <Avatar className="border-border size-8 border">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                  {initials || 'A'}
                </AvatarFallback>
              </Avatar>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium">{user?.fullName || 'Account'}</span>
                <span className="text-muted-foreground block truncate text-xs">
                  {user?.email || 'Profile settings'}
                </span>
              </span>
              <Settings className="text-muted-foreground size-4 shrink-0" strokeWidth={1.75} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top" sideOffset={8} className="w-56">
            <div className="border-border border-b px-2.5 py-2">
              <p className="truncate text-sm font-medium">{user?.fullName || 'Account'}</p>
              {user?.email && <p className="text-muted-foreground truncate text-xs">{user.email}</p>}
            </div>
            <DropdownMenuItem onSelect={() => onViewChange('profile-settings')}>
              <Settings />
              Profile settings
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 px-6 md:px-8">
          <h1 className="text-xl font-semibold tracking-tight">{current?.label ?? 'Profile Settings'}</h1>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto px-6 pt-2 pb-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}

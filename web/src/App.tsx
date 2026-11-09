import { Overview } from '@/pages/auth/overview';

import * as React from 'react';

import { AppShell, type ViewId } from '@/components/app-shell';

import { useCurrentUser } from '@/hooks/useCurrentUser';

export function HomePage() {
  const [view, setView] = React.useState<ViewId>('projects');
  const { user } = useCurrentUser();
  const emptyStates: Record<Exclude<ViewId, 'projects'>, string> = {
    deployments: 'No deployments yet.',
    domains: 'No domains configured yet.',
    'environment-variables': 'No environment variables yet.',
    integrations: 'No integrations configured yet.',
    'profile-settings': 'Profile settings are not available yet.',
  };

  return (
    <AppShell view={view} onViewChange={setView} user={user}>
      {view === 'projects' ? (
        <Overview />
      ) : (
        <div className="text-muted-foreground rounded-lg border px-5 py-8 text-sm">{emptyStates[view]}</div>
      )}
    </AppShell>
  );
}

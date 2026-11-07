import { Overview } from '@/pages/auth/overview';

import * as React from 'react';

import { AppShell, type ViewId } from '@/components/app-shell';

export function HomePage() {
  const [view, setView] = React.useState<ViewId>('overview');

  return (
    <AppShell view={view} onViewChange={setView}>
      {view === 'overview' && <Overview />}
    </AppShell>
  );
}

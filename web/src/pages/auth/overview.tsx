import { Rocket } from 'lucide-react';

import { Card } from '@/components/ui/card';

export function Overview() {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="bg-accent text-primary flex size-12 items-center justify-center rounded-xl">
        <Rocket className="size-6" strokeWidth={1.75} />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">No projects yet</h2>
      <p className="text-muted-foreground max-w-md text-sm">Connect a Git repository to get started.</p>
    </Card>
  );
}

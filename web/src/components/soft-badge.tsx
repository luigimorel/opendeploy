import * as React from 'react';

import { Badge } from '@/components/ui/badge';

import { cn } from '@/lib/utils';

export type Tone = 'primary' | 'green' | 'amber' | 'red' | 'slate';

const tones: Record<Tone, string> = {
  primary: 'bg-accent text-accent-foreground',
  green: 'bg-accent text-accent-foreground',
  amber: 'bg-secondary text-secondary-foreground',
  red: 'bg-destructive/10 text-destructive',
  slate: 'bg-muted text-muted-foreground',
};

export function SoftBadge({
  tone = 'primary',
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { tone?: Tone }) {
  return <Badge className={cn('rounded-full px-2.5 py-1 text-xs font-medium', tones[tone], className)} {...props} />;
}

import * as React from 'react';

import { cn } from '@/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'bg-input placeholder:text-muted-foreground/70 focus-visible:bg-card focus-visible:ring-ring flex h-10 w-full min-w-0 rounded-xl px-3.5 py-2 text-sm transition-colors outline-none focus-visible:ring-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}

export { Input };

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type Tone = "primary" | "green" | "amber" | "red" | "slate"

const tones: Record<Tone, string> = {
  primary: "bg-accent text-accent-foreground",
  green: "bg-emerald-50 text-emerald-700",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
  slate: "bg-muted text-muted-foreground",
}

export function SoftBadge({
  tone = "primary",
  className,
  ...props
}: React.ComponentProps<typeof Badge> & { tone?: Tone }) {
  return (
    <Badge
      className={cn("rounded-full px-2.5 py-1 text-xs font-medium", tones[tone], className)}
      {...props}
    />
  )
}

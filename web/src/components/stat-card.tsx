import * as React from "react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  icon: React.ElementType
  /** e.g. "+12.4%"; a leading "-" renders as negative */
  delta?: string
}

export function StatCard({ label, value, icon: Icon, delta }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
        <span className="flex size-8 items-center justify-center rounded-lg bg-accent text-primary">
          <Icon className="size-4" strokeWidth={1.75} />
        </span>
        {label}
      </div>
      <div className="mt-5 text-[1.75rem] font-semibold leading-none tracking-tight tabular-nums">
        {value}
      </div>
      {delta && (
        <div className="mt-2 text-xs">
          <span className={cn("font-medium", delta.startsWith("-") ? "text-red-600" : "text-primary")}>
            {delta}
          </span>
          <span className="text-muted-foreground"> vs last 30 days</span>
        </div>
      )}
    </Card>
  )
}

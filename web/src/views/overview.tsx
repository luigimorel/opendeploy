import { Rocket } from "lucide-react"

import { Card } from "@/components/ui/card"

export function Overview() {
  return (
    <Card className="flex flex-col items-center gap-3 px-6 py-16 text-center">
      <span className="flex size-12 items-center justify-center rounded-xl bg-accent text-primary">
        <Rocket className="size-6" strokeWidth={1.75} />
      </span>
      <h2 className="text-lg font-semibold tracking-tight">Welcome to Open Deploy</h2>
      <p className="max-w-md text-sm text-muted-foreground">
        Git-based hosting, self-hosted. Nothing is deployed yet.
      </p>
    </Card>
  )
}

import * as React from "react"

import { AppShell, type ViewId } from "@/components/app-shell"
import { Overview } from "@/views/overview"

export default function App() {
  const [view, setView] = React.useState<ViewId>("overview")

  return (
    <AppShell view={view} onViewChange={setView}>
      {view === "overview" && <Overview />}
    </AppShell>
  )
}

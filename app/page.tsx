"use client"

import { JsonView } from "@/components/ui/json-view"
import { Button } from "@/components/ui/button"

const sampleData = {
  name: "John Doe",
  age: 32,
  email: "john@example.com",
  isActive: true,
  balance: 1250.75,
  address: {
    street: "123 Main St",
    city: "Springfield",
    state: "IL",
    zip: "62701",
    coordinates: {
      lat: 39.7817,
      lng: -89.6501,
    },
  },
  roles: ["admin", "editor", "viewer"],
  projects: [
    {
      id: 1,
      name: "Project Alpha",
      status: "active",
      tags: ["frontend", "react"],
    },
    {
      id: 2,
      name: "Project Beta",
      status: "archived",
      tags: [],
    },
  ],
  metadata: {
    createdAt: "2024-01-15T09:30:00Z",
    updatedAt: "2025-03-22T14:45:00Z",
    deletedAt: null,
  },
  settings: {},
  premium: false,
}

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <header className="sticky top-0 z-20 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between gap-4 px-6 py-4 md:px-12">
          <div>
            <p className="text-sm font-semibold">JSON Viewer</p>
            <p className="text-xs text-muted-foreground">
              Explore collapsible JSON with copy support
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              window.open(
                "https://github.com/placeholder/repo",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            GitHub repo
          </Button>
        </div>
      </header>

      <main className="w-full max-w-2xl space-y-4 px-6 py-6 md:px-12 md:py-12">
        <div>
          <h2 className="text-lg font-semibold">JSON Viewer</h2>
          <p className="text-sm text-muted-foreground">
            Collapsible, syntax-highlighted JSON with copy on hover.
          </p>
        </div>
        <JsonView data={sampleData} defaultExpanded={false} />
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </main>
    </div>
  )
}

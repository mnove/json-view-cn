"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

import { JsonView } from "@/components/ui/json-view"
import { Button } from "@/components/ui/button"

const installCommand = "npx shadcn@latest add json-view"

function CopyInput() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(installCommand).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }

  return (
    <div className="flex items-center gap-0 rounded-lg border bg-muted/30">
      <code className="flex-1 truncate px-3 py-2 text-sm">
        {installCommand}
      </code>
      <Button
        variant="ghost"
        size="icon"
        className="shrink-0 rounded-l-none border-l"
        onClick={handleCopy}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </Button>
    </div>
  )
}

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
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tighter md:text-5xl">
            JSON Viewer
          </h1>
          <p className="tracking-normal text-muted-foreground">
            A fully-customizable, collapsible, syntax-highlighted JSON tree
            viewer component.
            <span className="text-foreground">
              {" "}
              Ready to be copy-pasted into your project.
            </span>
          </p>
        </div>

        <div>
          <CopyInput />
        </div>
        <div className="overflow-auto rounded-sm border bg-muted/30 p-4">
          <JsonView data={sampleData} />
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          (Press <kbd>d</kbd> to toggle dark mode)
        </div>
      </main>
    </div>
  )
}

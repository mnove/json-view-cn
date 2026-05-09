"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Showcase } from "@/components/showcase"

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

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <main className="w-full max-w-5xl space-y-6 px-6 py-6 md:px-12 md:py-12">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tighter md:text-5xl">
            JSON Viewer
          </h1>

          <div>
            <p className="tracking-normal text-muted-foreground">
              A fully-customizable, collapsible, syntax-highlighted JSON tree
              viewer component.
            </p>
            <p>Ready to be copy-pasted into your project.</p>
          </div>
        </div>

        <div>
          <CopyInput />
        </div>

        <Separator />
        <Showcase />
      </main>
    </div>
  )
}

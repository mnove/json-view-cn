"use client"

import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"

export function Header() {
  return (
    <header className="sticky top-0 z-20 w-full border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 md:px-12">
        <div>
          <p className="text-sm font-semibold">JSON Viewer</p>
          <p className="text-xs text-muted-foreground">
            Explore collapsible JSON with copy support
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <span className="hidden text-xs text-muted-foreground md:inline">
            Press <kbd className="font-mono">d</kbd>
          </span>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

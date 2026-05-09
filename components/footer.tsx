"use client"

import { Button } from "@/components/ui/button"

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-border/80">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-4 md:px-12">
        <Button
          variant="link"
          className="h-auto p-0 text-xs text-muted-foreground"
          onClick={() =>
            window.open(
              "https://github.com/mnove",
              "_blank",
              "noopener,noreferrer"
            )
          }
        >
          Created by mnove
        </Button>
        <Button
          variant="link"
          className="h-auto p-0 text-xs text-muted-foreground"
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
    </footer>
  )
}

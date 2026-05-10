"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Showcase } from "@/components/showcase"
import { JsonView } from "@/registry/json-view/json-view"

const heroData = {
  name: "json-view-cn",
  createdBy: "mnove",
  features: [
    "copy-paste-install",
    "collapsible-nodes",
    "syntax-highlighting",
    "and-much-more!",
  ],
  shadcn: true,
  tailwind: "v4",
  darkMode: true,
}

const installCommand =
  "npx shadcn@latest add https://json-view-cn.vercel.app/r/json-view.json"

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
      <code className="flex-1 truncate px-3 py-3 text-sm">
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
      <main className="w-full max-w-5xl space-y-12 px-6 py-6 md:px-12 md:py-12">
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold tracking-tighter md:text-7xl">
                JSON Tree Viewer
              </h1>
              <p className="text-base tracking-normal text-muted-foreground">
                A fully-customizable, collapsible, syntax-highlighted JSON tree
                viewer component.{" "}
                <span className="text-foreground">
                  Ready to be copy-pasted into your project.
                </span>
              </p>
            </div>

            <CopyInput />

            <div className="flex items-center gap-3">
              <Separator className="shrink" />
              <span className="text-xs text-muted-foreground">OR</span>
              <Separator className="shrink" />
            </div>

            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={() =>
                window.open(
                  "https://github.com/mnove/json-view-cn",
                  "_blank",
                  "noopener,noreferrer"
                )
              }
            >
              <svg viewBox="0 0 128 128" className="size-4 fill-current">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M64 5.103c-33.347 0-60.388 27.035-60.388 60.388 0 26.682 17.303 49.317 41.297 57.303 3.017.56 4.125-1.31 4.125-2.905 0-1.44-.056-6.197-.082-11.243-16.8 3.653-20.345-7.125-20.345-7.125-2.747-6.98-6.705-8.836-6.705-8.836-5.48-3.748.413-3.67.413-3.67 6.063.425 9.257 6.223 9.257 6.223 5.386 9.23 14.127 6.562 17.573 5.02.542-3.903 2.107-6.568 3.834-8.076-13.413-1.525-27.514-6.704-27.514-29.843 0-6.593 2.36-11.98 6.223-16.21-.628-1.52-2.695-7.662.584-15.98 0 0 5.07-1.623 16.61 6.19C53.7 35 58.867 34.327 64 34.304c5.13.023 10.3.694 15.127 2.033 11.526-7.813 16.59-6.19 16.59-6.19 3.287 8.317 1.22 14.46.593 15.98 3.872 4.23 6.215 9.617 6.215 16.21 0 23.194-14.127 28.3-27.574 29.796 2.167 1.874 4.097 5.55 4.097 11.183 0 8.08-.07 14.583-.07 16.572 0 1.607 1.088 3.49 4.148 2.897 23.98-7.994 41.263-30.622 41.263-57.294C124.388 32.14 97.35 5.104 64 5.104z"
                />
              </svg>
              View on GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-2xl bg-linear-to-br from-blue-500/20 via-purple-500/10 to-pink-500/20 blur-2xl dark:from-blue-500/10 dark:via-purple-500/5 dark:to-pink-500/10" />
            <div className="relative rounded-xl border bg-background/80 p-4 backdrop-blur-sm">
              <JsonView data={heroData} />
            </div>
          </div>
        </div>

        <div className="flex w-full flex-row items-center gap-4">
          <Separator className="shrink" />
          <p className="text-sm tracking-wider text-muted-foreground uppercase">
            Showcase
          </p>
          <Separator className="shrink" />
        </div>

        <Showcase />
      </main>
    </div>
  )
}

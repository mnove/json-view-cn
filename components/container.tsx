import { cn } from "@/lib/utils"

export const Container = ({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) => {
  return (
    <div className={cn("rounded-xl border border-border/60 bg-background p-1")}>
      <div className={cn("rounded-xl border bg-card pb-4")}>
        <div className="border-l-none border-r-none border-t-none rounded-xl border-b bg-background/70 p-2">
          {children}
        </div>
        <div className="px-4 pt-2 text-sm text-muted-foreground">{title}</div>
      </div>
    </div>
  )
}

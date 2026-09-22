import { cn } from "@/lib/utils"

export function Logo({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("size-5", className)}
      {...props}
    >
      <g strokeWidth={2.2}>
        <path d="M12.5 6.5c-2.2 0-2.2 2.2-2.2 3.3v3.9c0 1.1-1.1 1.7-2.2 2.3 1.1.6 2.2 1.2 2.2 2.3v3.9c0 1.1 0 3.3 2.2 3.3" />
        <path d="M19.5 6.5c2.2 0 2.2 2.2 2.2 3.3v3.9c0 1.1 1.1 1.7 2.2 2.3-1.1.6-2.2 1.2-2.2 2.3v3.9c0 1.1 0 3.3-2.2 3.3" />
      </g>
      <g strokeWidth={2.4}>
        <path d="M13.4 12.8h5.2" />
        <path d="M15.6 19.2h3" />
      </g>
    </svg>
  )
}

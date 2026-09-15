"use client"

import {
  Check,
  ChevronRight,
  ChevronUp,
  Copy,
  MoreHorizontal,
} from "lucide-react"
import { useCallback, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"

type JsonPrimitive = string | number | boolean | null
type JsonValueType = JsonPrimitive | JsonObjectType | JsonArrayType
type JsonObjectType = { [key: string]: JsonValueType }
type JsonArrayType = JsonValueType[]

interface JsonViewTheme {
  key?: string
  string?: string
  number?: string
  boolean?: string
  null?: string
  bracket?: string
  lineHover?: string
}

const defaultTheme: Required<JsonViewTheme> = {
  key: "text-blue-700 dark:text-blue-400",
  string: "text-green-700 dark:text-green-400",
  number: "text-orange-700 dark:text-amber-400",
  boolean: "text-purple-700 dark:text-purple-400",
  null: "text-gray-500 dark:text-gray-400 italic",
  bracket: "text-gray-700 dark:text-gray-300",
  lineHover: "hover:bg-muted/50",
}

interface JsonViewProps {
  data: unknown
  className?: string
  defaultExpanded?: boolean
  initialDepth?: number
  indentGuide?: boolean
  theme?: JsonViewTheme
  rootName?: string
  stringTruncate?: number
}

interface InternalProps {
  indentGuide: boolean
  theme: Required<JsonViewTheme>
  initialDepth: number
  stringTruncate: number
}

function isObject(value: unknown): value is JsonObjectType {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isArray(value: unknown): value is JsonArrayType {
  return Array.isArray(value)
}

// Resolve values that are not plain JSON into the closest JSON-like shape,
// mirroring what JSON.stringify would do where it is defined: objects with
// toJSON (Date, custom classes) use it, Map becomes an object, Set an array.
function resolveValue(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value
  if (typeof (value as { toJSON?: unknown }).toJSON === "function") {
    return (value as { toJSON: () => unknown }).toJSON()
  }
  if (value instanceof Map) {
    return Object.fromEntries(Array.from(value, ([k, v]) => [String(k), v]))
  }
  if (value instanceof Set) return Array.from(value)
  return value
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value
  // Track the ancestor chain so circular references become "[Circular]"
  // instead of throwing. `this` inside the replacer is the parent object.
  const ancestors: unknown[] = []
  return JSON.stringify(
    value,
    function (this: unknown, _key, val) {
      while (ancestors.length > 0 && ancestors[ancestors.length - 1] !== this) {
        ancestors.pop()
      }
      const resolved = resolveValue(val)
      if (typeof resolved === "bigint") {
        const asNumber = Number(resolved)
        return Number.isSafeInteger(asNumber) ? asNumber : resolved.toString()
      }
      if (resolved !== null && typeof resolved === "object") {
        if (ancestors.includes(resolved)) return "[Circular]"
        ancestors.push(resolved)
      }
      return resolved
    },
    2
  )
}

function CopyButton({ value }: { value: unknown }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(() => {
    const text = stringifyValue(value)
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [value])

  return (
    <div className="inline-flex shrink-0" onClick={(e) => e.stopPropagation()}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            aria-label={copied ? "Copied" : "Copy value"}
            className="opacity-0 transition-opacity group-hover/line:opacity-100 group-has-[:focus-visible]/line:opacity-100 focus-visible:opacity-100"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="size-3 text-muted-foreground" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" sideOffset={4}>
          {copied ? "Copied!" : "Copy"}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

function JsonLine({
  depth,
  value,
  children,
  className,
  theme,
}: {
  depth: number
  value: unknown
  children: React.ReactNode
  className?: string
  theme: Required<JsonViewTheme>
}) {
  return (
    <div
      className={cn(
        "group/line flex items-center gap-1 rounded-sm rounded-l-none leading-6",
        theme.lineHover,
        className
      )}
      style={{ paddingLeft: depth * 24 }}
    >
      <span className="min-w-0 [overflow-wrap:anywhere]">{children}</span>
      <CopyButton value={value} />
    </div>
  )
}

function Bracket({
  children,
  theme,
}: {
  children: React.ReactNode
  theme: Required<JsonViewTheme>
}) {
  return <span className={cn("font-semibold", theme.bracket)}>{children}</span>
}

function Comma({ theme }: { theme: Required<JsonViewTheme> }) {
  return <span className={theme.bracket}>,</span>
}

// Escape a string the way JSON.stringify would, without the surrounding quotes,
// so embedded quotes, backslashes, and control characters display faithfully.
function escapeString(value: string): string {
  return JSON.stringify(value).slice(1, -1)
}

function KeyLabel({
  name,
  theme,
}: {
  name: string
  theme: Required<JsonViewTheme>
}) {
  return (
    <span className={cn("whitespace-pre-wrap", theme.key)}>
      &quot;{escapeString(name)}&quot;
      <span className={theme.bracket}>: </span>
    </span>
  )
}

function StringValue({
  value,
  theme,
}: {
  value: string
  theme: Required<JsonViewTheme>
}) {
  return (
    <span className={cn("whitespace-pre-wrap", theme.string)}>
      &quot;{escapeString(value)}&quot;
    </span>
  )
}

function TruncatedString({
  value,
  truncate,
  theme,
}: {
  value: string
  truncate: number
  theme: Required<JsonViewTheme>
}) {
  const [expanded, setExpanded] = useState(false)

  if (value.length <= truncate) {
    return <StringValue value={value} theme={theme} />
  }

  return (
    <span
      className={cn(
        "group/truncated cursor-pointer whitespace-pre-wrap",
        theme.string
      )}
      onClick={(e) => {
        e.stopPropagation()
        setExpanded((prev) => !prev)
      }}
    >
      &quot;
      {expanded ? (
        escapeString(value)
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span>{escapeString(value.substring(0, truncate))}&hellip;</span>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            sideOffset={4}
            className="max-w-xs break-words whitespace-pre-wrap"
          >
            {value}
          </TooltipContent>
        </Tooltip>
      )}
      &quot;
      <button
        type="button"
        aria-expanded={expanded}
        aria-label={expanded ? "Collapse string" : "Expand string"}
        className="ml-1 inline-flex cursor-pointer rounded-sm align-middle opacity-0 transition-opacity outline-none group-hover/truncated:opacity-100 focus-visible:opacity-100 focus-visible:ring-2 focus-visible:ring-ring/50"
        onClick={(e) => {
          e.stopPropagation()
          setExpanded((prev) => !prev)
        }}
      >
        {expanded ? (
          <ChevronUp className="size-3 text-muted-foreground" />
        ) : (
          <MoreHorizontal className="size-3 text-muted-foreground" />
        )}
      </button>
    </span>
  )
}

function JsonPrimitiveValue({
  value,
  theme,
  stringTruncate,
}: {
  value: unknown
  theme: Required<JsonViewTheme>
  stringTruncate: number
}) {
  if (value === null) {
    return <span className={theme.null}>null</span>
  }

  if (value === undefined) {
    return <span className={theme.null}>undefined</span>
  }

  if (typeof value === "boolean") {
    return <span className={theme.boolean}>{String(value)}</span>
  }

  if (typeof value === "number") {
    return <span className={theme.number}>{String(value)}</span>
  }

  if (typeof value === "string") {
    if (stringTruncate > 0) {
      return (
        <TruncatedString
          value={value}
          truncate={stringTruncate}
          theme={theme}
        />
      )
    }

    return <StringValue value={value} theme={theme} />
  }

  if (typeof value === "bigint") {
    return <span className={theme.number}>{value.toString()}</span>
  }

  if (typeof value === "function") {
    return (
      <span className={theme.null}>
        [Function{value.name ? `: ${value.name}` : ""}]
      </span>
    )
  }

  // Remaining non-JSON primitives (symbol): render without quotes so they
  // are not mistaken for strings.
  return <span className={theme.null}>{String(value)}</span>
}

function CollapsibleNode({
  value,
  keyName,
  depth,
  absoluteDepth,
  isLast,
  internal,
  ancestors,
}: {
  value: JsonObjectType | JsonArrayType
  keyName?: string
  depth: number
  absoluteDepth: number
  isLast: boolean
  internal: InternalProps
  ancestors: readonly object[]
}) {
  const shouldExpand =
    internal.initialDepth === Infinity
      ? true
      : absoluteDepth < internal.initialDepth

  const [expanded, setExpanded] = useState(shouldExpand)

  const { theme, indentGuide } = internal
  const isArr = isArray(value)
  const entries = isArr
    ? value.map((v, i) => [i, v] as const)
    : Object.entries(value)
  const openBracket = isArr ? "[" : "{"
  const closeBracket = isArr ? "]" : "}"
  const isEmpty = entries.length === 0
  const childAncestors = [...ancestors, value]

  // Empty containers render inline
  if (isEmpty) {
    return (
      <JsonLine depth={depth} value={value} theme={theme}>
        {keyName !== undefined && <KeyLabel name={keyName} theme={theme} />}
        <Bracket theme={theme}>
          {openBracket}
          {closeBracket}
        </Bracket>
        {!isLast && <Comma theme={theme} />}
      </JsonLine>
    )
  }

  return (
    <div>
      {/* Opening line */}
      <div
        className={cn(
          "group/line flex items-center gap-1 rounded-sm rounded-l-none leading-6",
          theme.lineHover
        )}
        style={{ paddingLeft: depth * 24 }}
      >
        <button
          type="button"
          aria-expanded={expanded}
          className="flex min-w-0 flex-1 cursor-pointer items-center rounded-sm text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          onClick={() => setExpanded((e) => !e)}
        >
          <span className="mr-1 inline-flex shrink-0 items-center justify-center p-0.5 text-muted-foreground">
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform duration-150",
                expanded && "rotate-90"
              )}
            />
          </span>
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {keyName !== undefined && <KeyLabel name={keyName} theme={theme} />}
            <Bracket theme={theme}>{openBracket}</Bracket>
            {!expanded && (
              <span className="ml-1 text-xs text-muted-foreground">
                {isArr
                  ? `\u2026${entries.length} items`
                  : `\u2026${entries.length} keys`}
              </span>
            )}
            {!expanded && (
              <>
                <Bracket theme={theme}>{closeBracket}</Bracket>
                {!isLast && <Comma theme={theme} />}
              </>
            )}
          </span>
        </button>
        <CopyButton value={value} />
      </div>

      {/* Children with indent guide */}
      {expanded && (
        <div
          className={cn(
            indentGuide &&
              "border-l border-muted-foreground/20 transition-colors hover:border-muted-foreground/40"
          )}
          style={{ marginLeft: depth * 24 + 10 }}
        >
          {entries.map(([key, childValue], idx) => (
            <JsonNode
              key={String(key)}
              value={childValue}
              keyName={isArr ? undefined : String(key)}
              depth={1}
              absoluteDepth={absoluteDepth + 1}
              isLast={idx === entries.length - 1}
              internal={internal}
              ancestors={childAncestors}
            />
          ))}
        </div>
      )}

      {/* Closing bracket */}
      {expanded && (
        <div className="leading-6" style={{ paddingLeft: depth * 24 }}>
          <span className="ml-5">
            <Bracket theme={theme}>{closeBracket}</Bracket>
            {!isLast && <Comma theme={theme} />}
          </span>
        </div>
      )}
    </div>
  )
}

function JsonNode({
  value: rawValue,
  keyName,
  depth,
  absoluteDepth,
  isLast,
  internal,
  ancestors,
}: {
  value: unknown
  keyName?: string
  depth: number
  absoluteDepth: number
  isLast: boolean
  internal: InternalProps
  ancestors: readonly object[]
}) {
  const value = resolveValue(rawValue)

  if (isObject(value) || isArray(value)) {
    if (ancestors.includes(value)) {
      return (
        <JsonLine depth={depth} value={value} theme={internal.theme}>
          {keyName !== undefined && (
            <KeyLabel name={keyName} theme={internal.theme} />
          )}
          <span className={internal.theme.null}>[Circular]</span>
          {!isLast && <Comma theme={internal.theme} />}
        </JsonLine>
      )
    }

    return (
      <CollapsibleNode
        value={value}
        keyName={keyName}
        depth={depth}
        absoluteDepth={absoluteDepth}
        isLast={isLast}
        internal={internal}
        ancestors={ancestors}
      />
    )
  }

  return (
    <JsonLine depth={depth} value={value} theme={internal.theme}>
      {keyName !== undefined && (
        <KeyLabel name={keyName} theme={internal.theme} />
      )}
      <JsonPrimitiveValue
        value={value}
        theme={internal.theme}
        stringTruncate={internal.stringTruncate}
      />
      {!isLast && <Comma theme={internal.theme} />}
    </JsonLine>
  )
}

function JsonView({
  data,
  className,
  defaultExpanded = true,
  initialDepth,
  indentGuide = true,
  theme: themeOverride,
  rootName,
  stringTruncate = 0,
}: JsonViewProps) {
  const theme: Required<JsonViewTheme> = { ...defaultTheme, ...themeOverride }

  const resolvedInitialDepth =
    initialDepth !== undefined ? initialDepth : defaultExpanded ? Infinity : 0

  const internal: InternalProps = {
    indentGuide,
    theme,
    initialDepth: resolvedInitialDepth,
    stringTruncate,
  }

  const content = (
    <JsonNode
      value={data}
      keyName={rootName}
      depth={0}
      absoluteDepth={0}
      isLast
      internal={internal}
      ancestors={[]}
    />
  )

  return (
    <TooltipProvider>
      <div className={cn("font-mono text-sm", className)}>{content}</div>
    </TooltipProvider>
  )
}

export { JsonView }
export type { JsonViewProps, JsonViewTheme }

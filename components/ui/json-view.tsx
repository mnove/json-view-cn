"use client"

import { useState, useCallback } from "react"
import { ChevronRight, Copy, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

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
  indentGuide?: boolean
  theme?: JsonViewTheme
}

function isObject(value: unknown): value is JsonObjectType {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isArray(value: unknown): value is JsonArrayType {
  return Array.isArray(value)
}

function stringifyValue(value: unknown): string {
  if (typeof value === "string") return value
  return JSON.stringify(value, null, 2)
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
        <TooltipTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="opacity-0 transition-opacity group-hover/line:opacity-100"
              onClick={handleCopy}
            />
          }
        >
          {copied ? (
            <Check className="size-3 text-green-600 dark:text-green-400" />
          ) : (
            <Copy className="size-3 text-muted-foreground" />
          )}
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
      <span className="min-w-0">{children}</span>
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

function KeyLabel({
  name,
  theme,
}: {
  name: string
  theme: Required<JsonViewTheme>
}) {
  return (
    <span className={theme.key}>
      &quot;{name}&quot;
      <span className={theme.bracket}>: </span>
    </span>
  )
}

function JsonPrimitiveValue({
  value,
  theme,
}: {
  value: JsonPrimitive
  theme: Required<JsonViewTheme>
}) {
  if (value === null) {
    return <span className={theme.null}>null</span>
  }

  if (typeof value === "boolean") {
    return <span className={theme.boolean}>{String(value)}</span>
  }

  if (typeof value === "number") {
    return <span className={theme.number}>{String(value)}</span>
  }

  return (
    <span className={theme.string}>
      &quot;{value}&quot;
    </span>
  )
}

function CollapsibleNode({
  value,
  keyName,
  depth,
  defaultExpanded,
  isLast,
  indentGuide,
  theme,
}: {
  value: JsonObjectType | JsonArrayType
  keyName?: string
  depth: number
  defaultExpanded: boolean
  isLast: boolean
  indentGuide: boolean
  theme: Required<JsonViewTheme>
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  const isArr = isArray(value)
  const entries = isArr
    ? value.map((v, i) => [i, v] as const)
    : Object.entries(value)
  const openBracket = isArr ? "[" : "{"
  const closeBracket = isArr ? "]" : "}"
  const isEmpty = entries.length === 0

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
          "group/line flex cursor-pointer items-center gap-1 rounded-sm rounded-l-none leading-6",
          theme.lineHover
        )}
        style={{ paddingLeft: depth * 24 }}
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
        <span>
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
              defaultExpanded={defaultExpanded}
              isLast={idx === entries.length - 1}
              indentGuide={indentGuide}
              theme={theme}
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
  value,
  keyName,
  depth,
  defaultExpanded,
  isLast,
  indentGuide,
  theme,
}: {
  value: unknown
  keyName?: string
  depth: number
  defaultExpanded: boolean
  isLast: boolean
  indentGuide: boolean
  theme: Required<JsonViewTheme>
}) {
  if (isObject(value) || isArray(value)) {
    return (
      <CollapsibleNode
        value={value}
        keyName={keyName}
        depth={depth}
        defaultExpanded={defaultExpanded}
        isLast={isLast}
        indentGuide={indentGuide}
        theme={theme}
      />
    )
  }

  return (
    <JsonLine depth={depth} value={value} theme={theme}>
      {keyName !== undefined && <KeyLabel name={keyName} theme={theme} />}
      <JsonPrimitiveValue value={value as JsonPrimitive} theme={theme} />
      {!isLast && <Comma theme={theme} />}
    </JsonLine>
  )
}

function JsonView({
  data,
  className,
  defaultExpanded = true,
  indentGuide = true,
  theme: themeOverride,
}: JsonViewProps) {
  const theme: Required<JsonViewTheme> = { ...defaultTheme, ...themeOverride }

  return (
    <TooltipProvider>
      <div className={cn("font-mono text-sm", className)}>
        <JsonNode
          value={data}
          depth={0}
          defaultExpanded={defaultExpanded}
          isLast
          indentGuide={indentGuide}
          theme={theme}
        />
      </div>
    </TooltipProvider>
  )
}

export { JsonView }
export type { JsonViewProps, JsonViewTheme }

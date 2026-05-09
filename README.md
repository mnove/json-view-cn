# json-view-cn

A fully-customizable, collapsible, syntax-highlighted JSON tree viewer component for React. Built with [shadcn/ui](https://ui.shadcn.com), [Base UI](https://base-ui.com), and [Tailwind CSS v4](https://tailwindcss.com). Ready to be copy-pasted into your project.

[Live demo](https://json-view-cn.vercel.app/)

## Installation

```bash
npx shadcn@latest add json-view
```

### Dependencies

The component relies on these shadcn/ui components:

- `button`
- `tooltip`

And the following packages:

- `lucide-react`
- `clsx` / `tailwind-merge` (via the `cn` utility)

## Usage

```tsx
import { JsonView } from "@/components/ui/json-view"

const data = {
  name: "John Doe",
  age: 32,
  isActive: true,
  address: {
    city: "Springfield",
    coordinates: { lat: 39.78, lng: -89.65 },
  },
  roles: ["admin", "editor"],
}

export default function Page() {
  return <JsonView data={data} />
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `unknown` | — | The JSON data to display. Required. |
| `className` | `string` | — | Additional classes for the outer wrapper. |
| `defaultExpanded` | `boolean` | `true` | Whether all nodes start expanded or collapsed. |
| `initialDepth` | `number` | — | Auto-expand nodes up to this depth. Overrides `defaultExpanded` when set. |
| `indentGuide` | `boolean` | `true` | Show vertical indent guide lines along nested levels. |
| `rootName` | `string` | — | Optional label displayed as the root node key. |
| `stringTruncate` | `number` | `0` | Truncate strings longer than this value. Hover to preview, click to expand. `0` disables truncation. |
| `theme` | `JsonViewTheme` | — | Override syntax highlight colors. All fields optional. |

## Theming

Pass a `theme` prop to customize the colors of each JSON element. All fields are optional and fall back to sensible defaults that work in both light and dark mode.

```tsx
interface JsonViewTheme {
  key?: string       // Key names — default: "text-blue-700 dark:text-blue-400"
  string?: string    // String values — default: "text-green-700 dark:text-green-400"
  number?: string    // Numbers — default: "text-orange-700 dark:text-amber-400"
  boolean?: string   // Booleans — default: "text-purple-700 dark:text-purple-400"
  null?: string      // Null — default: "text-gray-500 dark:text-gray-400 italic"
  bracket?: string   // Brackets, colons, commas — default: "text-gray-700 dark:text-gray-300"
  lineHover?: string // Row hover highlight — default: "hover:bg-muted/50"
}
```

### Example: custom theme

```tsx
<JsonView
  data={data}
  theme={{
    key: "text-rose-500 dark:text-rose-400",
    string: "text-yellow-600 dark:text-yellow-300",
    number: "text-violet-600 dark:text-violet-400",
    boolean: "text-cyan-600 dark:text-cyan-400",
    null: "text-pink-500 dark:text-pink-400 italic",
    bracket: "text-gray-500 dark:text-gray-400",
    lineHover: "hover:bg-rose-50 dark:hover:bg-rose-950/20",
  }}
/>
```

## Examples

### Collapsed by default

```tsx
<JsonView data={data} defaultExpanded={false} />
```

### Expand to depth 1 only

```tsx
<JsonView data={data} initialDepth={1} />
```

### With root name

```tsx
<JsonView data={data} rootName="response" />
```

### String truncation

```tsx
<JsonView data={data} stringTruncate={80} />
```

### No indent guides

```tsx
<JsonView data={data} indentGuide={false} />
```

### Combined

```tsx
<JsonView
  data={data}
  rootName="event"
  initialDepth={2}
  stringTruncate={60}
  indentGuide
/>
```

## Features

- **Collapsible nodes** — Click any object or array row to expand/collapse. Collapsed nodes show item/key count.
- **Syntax highlighting** — Color-coded keys, strings, numbers, booleans, and null values. Fully customizable via the `theme` prop.
- **Copy on hover** — A copy button appears next to each line on hover. Copies the value as formatted JSON.
- **Indent guide lines** — Vertical lines connecting nested levels, with hover highlight. Togglable.
- **String truncation** — Long strings are truncated with a tooltip preview. Click to expand inline.
- **Depth-based expansion** — Control how deep the tree auto-expands with `initialDepth`.
- **Dark mode** — Works out of the box with light and dark themes.
- **Self-contained** — No external JSON viewer libraries. Just shadcn/ui primitives and Tailwind.
- **Copy-paste ready** — No global CSS required. Drop the component file into your project and use it.

## Tech stack

- [Next.js 16](https://nextjs.org) with App Router
- [React 19](https://react.dev)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui v4](https://ui.shadcn.com) with [Base UI](https://base-ui.com) primitives
- [TypeScript](https://www.typescriptlang.org)

## Development

```bash
pnpm install
pnpm dev
```

## License

MIT

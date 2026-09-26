import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { JsonView } from "./json-view"

function renderText(ui: React.ReactElement) {
  const { container } = render(ui)
  return container.textContent
}

function toggles() {
  return screen
    .getAllByRole("button")
    .filter((el) => el.hasAttribute("aria-expanded") && !el.ariaLabel)
}

async function copyFirst(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getAllByRole("button", { name: "Copy value" })[0])
  return navigator.clipboard.readText()
}

describe("JsonView rendering", () => {
  it.each([
    [null, "null"],
    [undefined, "undefined"],
    [true, "true"],
    [42, "42"],
    ["hi", '"hi"'],
    [BigInt(10), "10"],
  ])("renders primitive %s", (data, expected) => {
    expect(renderText(<JsonView data={data} />)).toBe(expected)
  })

  it("renders objects and arrays with keys, brackets and commas", () => {
    expect(renderText(<JsonView data={{ a: 1, b: [true, null] }} />)).toBe(
      '{"a": 1,"b": [true,null]}'
    )
  })

  it("renders empty containers inline", () => {
    expect(renderText(<JsonView data={{ o: {}, a: [] }} />)).toBe(
      '{"o": {},"a": []}'
    )
  })

  it("renders rootName as a key", () => {
    expect(renderText(<JsonView data={1} rootName="root" />)).toBe('"root": 1')
  })

  it("escapes quotes, backslashes and control characters", () => {
    expect(renderText(<JsonView data={{ 'k"': 'a"b\\c\nd' }} />)).toBe(
      '{"k\\"": "a\\"b\\\\c\\nd"}'
    )
  })

  it("resolves toJSON, Map and Set", () => {
    const date = new Date("2024-01-02T03:04:05.000Z")
    expect(
      renderText(
        <JsonView data={{ d: date, m: new Map([[1, "x"]]), s: new Set([2]) }} />
      )
    ).toBe('{"d": "2024-01-02T03:04:05.000Z","m": {"1": "x"},"s": [2]}')
  })

  it("renders functions without quotes", () => {
    function namedFn() {}
    expect(renderText(<JsonView data={namedFn} />)).toBe("[Function: namedFn]")
  })

  it("marks circular references instead of recursing", () => {
    const data: Record<string, unknown> = { a: 1 }
    data.self = data
    expect(renderText(<JsonView data={data} />)).toBe(
      '{"a": 1,"self": [Circular]}'
    )
  })

  it("does not mark repeated non-circular references as circular", () => {
    const shared = { x: 1 }
    expect(renderText(<JsonView data={{ a: shared, b: shared }} />)).toBe(
      '{"a": {"x": 1},"b": {"x": 1}}'
    )
  })

  it("applies theme overrides", () => {
    render(<JsonView data={{ a: 1 }} theme={{ number: "my-number" }} />)
    expect(screen.getByText("1")).toHaveClass("my-number")
  })

  it("forwards className to the root element", () => {
    const { container } = render(<JsonView data={1} className="custom" />)
    expect(container.firstChild).toHaveClass("custom", "font-mono")
  })
})

describe("JsonView expand / collapse", () => {
  it("expands everything by default", () => {
    render(<JsonView data={{ a: { b: { c: 1 } } }} />)
    expect(toggles().map((el) => el.ariaExpanded)).toEqual([
      "true",
      "true",
      "true",
    ])
  })

  it("collapses the root when defaultExpanded is false", () => {
    expect(
      renderText(<JsonView data={{ a: 1, b: 2 }} defaultExpanded={false} />)
    ).toBe("{…2 keys}")
  })

  it("shows an item count for collapsed arrays", () => {
    expect(
      renderText(<JsonView data={[1, 2, 3]} defaultExpanded={false} />)
    ).toBe("[…3 items]")
  })

  it("expands only up to initialDepth", () => {
    expect(
      renderText(<JsonView data={{ a: { b: { c: 1 } } }} initialDepth={1} />)
    ).toBe('{"a": {…1 keys}}')
  })

  it("toggles a node on click", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <JsonView data={{ a: 1 }} defaultExpanded={false} />
    )
    await user.click(toggles()[0])
    expect(container.textContent).toBe('{"a": 1}')
    await user.click(toggles()[0])
    expect(container.textContent).toBe("{…1 keys}")
  })
})

describe("JsonView string truncation", () => {
  it("does not truncate by default", () => {
    expect(renderText(<JsonView data={"a".repeat(50)} />)).toBe(
      `"${"a".repeat(50)}"`
    )
  })

  it("leaves strings at or under the limit alone", () => {
    render(<JsonView data="abcde" stringTruncate={5} />)
    expect(
      screen.queryByRole("button", { name: "Expand string" })
    ).not.toBeInTheDocument()
  })

  it("truncates long strings and expands them on click", async () => {
    const user = userEvent.setup()
    const { container } = render(
      <JsonView data="abcdefghij" stringTruncate={3} />
    )
    expect(container.textContent).toBe('"abc…"')

    await user.click(screen.getByRole("button", { name: "Expand string" }))
    expect(container.textContent).toBe('"abcdefghij"')

    await user.click(screen.getByRole("button", { name: "Collapse string" }))
    expect(container.textContent).toBe('"abc…"')
  })
})

describe("JsonView copy", () => {
  it("copies strings raw, without quotes", async () => {
    const user = userEvent.setup()
    render(<JsonView data="hello" />)
    expect(await copyFirst(user)).toBe("hello")
  })

  it("copies objects as pretty-printed JSON", async () => {
    const user = userEvent.setup()
    render(<JsonView data={{ a: [1, 2] }} />)
    expect(await copyFirst(user)).toBe(JSON.stringify({ a: [1, 2] }, null, 2))
  })

  it("copies a nested node's own value", async () => {
    const user = userEvent.setup()
    render(<JsonView data={{ a: { b: 1 } }} />)
    await user.click(screen.getAllByRole("button", { name: "Copy value" })[1])
    expect(await navigator.clipboard.readText()).toBe(
      JSON.stringify({ b: 1 }, null, 2)
    )
  })

  it("replaces circular references with [Circular]", async () => {
    const user = userEvent.setup()
    const data: Record<string, unknown> = { a: 1 }
    data.self = data
    render(<JsonView data={data} />)
    expect(JSON.parse(await copyFirst(user))).toEqual({
      a: 1,
      self: "[Circular]",
    })
  })

  it("keeps shared non-circular references", async () => {
    const user = userEvent.setup()
    const shared = { x: 1 }
    render(<JsonView data={{ a: shared, b: shared }} />)
    expect(JSON.parse(await copyFirst(user))).toEqual({
      a: { x: 1 },
      b: { x: 1 },
    })
  })

  it("serializes BigInt, Map, Set and Date", async () => {
    const user = userEvent.setup()
    render(
      <JsonView
        data={{
          small: BigInt(5),
          big: BigInt("12345678901234567890"),
          m: new Map([["k", 1]]),
          s: new Set([1, 2]),
          d: new Date("2024-01-02T03:04:05.000Z"),
        }}
      />
    )
    expect(JSON.parse(await copyFirst(user))).toEqual({
      small: 5,
      big: "12345678901234567890",
      m: { k: 1 },
      s: [1, 2],
      d: "2024-01-02T03:04:05.000Z",
    })
  })

  it("shows copied state after clicking", async () => {
    const user = userEvent.setup()
    render(<JsonView data={1} />)
    await copyFirst(user)
    expect(screen.getByRole("button", { name: "Copied" })).toBeInTheDocument()
  })
})

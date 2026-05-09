import { JsonView } from "@/components/ui/json-view"
import { Container } from "@/components/container"

const userData = {
  name: "John Doe",
  age: 32,
  email: "john@example.com",
  isActive: true,
  balance: 1250.75,
  address: {
    street: "123 Main St",
    city: "Springfield",
    coordinates: {
      lat: 39.7817,
      lng: -89.6501,
    },
  },
  roles: ["admin", "editor", "viewer"],
}

const apiResponse = {
  status: 200,
  data: {
    users: [
      { id: 1, name: "Alice", online: true },
      { id: 2, name: "Bob", online: false },
    ],
    pagination: {
      page: 1,
      perPage: 10,
      total: 2,
    },
  },
  error: null,
}

const configData = {
  database: {
    host: "localhost",
    port: 5432,
    name: "myapp_production",
    ssl: true,
    pool: { min: 2, max: 10 },
  },
  redis: {
    host: "127.0.0.1",
    port: 6379,
    ttl: 3600,
  },
  features: {
    darkMode: true,
    betaAccess: false,
    maxUploadSize: 52428800,
  },
}

const packageData = {
  name: "@acme/ui",
  version: "2.4.1",
  private: false,
  dependencies: {
    react: "^19.0.0",
    next: "^16.0.0",
    tailwindcss: "^4.0.0",
  },
  scripts: {
    dev: "next dev",
    build: "next build",
    test: "vitest",
  },
}

const nestedData = {
  level1: {
    level2: {
      level3: {
        level4: {
          value: "deeply nested",
          items: [1, 2, 3],
        },
      },
    },
  },
}

export function Showcase() {
  return (
    <div className="columns-1 gap-6 space-y-6 md:columns-2">
      <div className="break-inside-avoid">
        <Container title="Default — expanded with indent guides">
          <JsonView data={userData} />
        </Container>
      </div>

      <div className="break-inside-avoid">
        <Container title="Collapsed by default">
          <JsonView data={apiResponse} defaultExpanded={false} />
        </Container>
      </div>

      <div className="break-inside-avoid">
        <Container title="No indent guides">
          <JsonView data={configData} indentGuide={false} />
        </Container>
      </div>

      <div className="break-inside-avoid">
        <Container title="Custom theme — Monokai-inspired">
          <JsonView
            data={packageData}
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
        </Container>
      </div>

      <div className="break-inside-avoid">
        <Container title="Custom theme — Ocean">
          <JsonView
            data={nestedData}
            theme={{
              key: "text-teal-700 dark:text-teal-300",
              string: "text-sky-700 dark:text-sky-300",
              number: "text-indigo-600 dark:text-indigo-400",
              boolean: "text-emerald-600 dark:text-emerald-400",
              null: "text-slate-400 dark:text-slate-500 italic",
              bracket: "text-slate-600 dark:text-slate-400",
              lineHover: "hover:bg-sky-50 dark:hover:bg-sky-950/20",
            }}
          />
        </Container>
      </div>

      <div className="break-inside-avoid">
        <Container title="Collapsed, no indent guides, custom theme">
          <JsonView
            data={apiResponse}
            defaultExpanded={false}
            indentGuide={false}
            theme={{
              key: "text-amber-700 dark:text-amber-300",
              string: "text-lime-700 dark:text-lime-300",
              number: "text-fuchsia-600 dark:text-fuchsia-400",
              boolean: "text-red-600 dark:text-red-400",
              null: "text-stone-400 italic",
              bracket: "text-stone-600 dark:text-stone-400",
              lineHover: "hover:bg-amber-50 dark:hover:bg-amber-950/20",
            }}
          />
        </Container>
      </div>
    </div>
  )
}

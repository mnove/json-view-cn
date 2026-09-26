# Contributing

Thanks for your interest in improving json-view-cn! Bug reports, ideas, and pull requests are all welcome.

## Getting started

You'll need a recent Node.js LTS and [pnpm](https://pnpm.io).

```bash
git clone https://github.com/mnove/json-view-cn.git
cd json-view-cn
pnpm install
pnpm dev
```

The demo site runs at http://localhost:3000.

## Project structure

- `registry/json-view/json-view.tsx` — the component itself (this is what users install)
- `registry.json` — the shadcn registry definition
- `public/r/` — generated registry files served to `npx shadcn add` (do not edit by hand)
- `components/showcase.tsx` — examples shown on the demo site
- `app/` — the demo site

## Making changes

1. Create a branch from `main`.
2. Make your change in `registry/json-view/json-view.tsx`.
3. If it adds or changes behavior, add or update an example in `components/showcase.tsx` and cover it in `registry/json-view/json-view.test.tsx`.
4. If it changes the public API (props, theme, supported values), update `README.md`.
5. Rebuild the registry and commit the generated files:

   ```bash
   pnpm registry:build
   ```

6. Make sure everything passes:

   ```bash
   pnpm lint
   pnpm typecheck
   pnpm test
   pnpm format
   ```

7. Open a pull request against `main` with a short description of what changed and why. Screenshots are appreciated for visual changes.

## Reporting bugs

Please [open an issue](https://github.com/mnove/json-view-cn/issues) with the data you passed to `JsonView`, the props you used, and what you expected to see.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

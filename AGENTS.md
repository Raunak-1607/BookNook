<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# booknook

Single Next.js 16 app (App Router, no monorepo). Package manager is npm (`package-lock.json`) — don't switch.

## Commands

- `npm run dev` — Turbopack dev server
- `npm run lint` — ESLint (flat config, `eslint.config.mjs`)
- `npm run build` — the only typecheck (there is no `typecheck` script and no test suite; run `npm run lint` + `npm run build` before considering work done)

## Stack quirks (verify against local docs, not training data)

- **Next 16.4 / React 19.3.** See the generated block above — consult `node_modules/next/dist/docs/` before writing code. `next.config.ts` enables `cacheComponents: true` and `partialPrefetching: true`; data-fetching and caching behavior differs from classic Next. Read the local caching docs before adding any data fetching.
- **Tailwind v4, CSS-first.** No `tailwind.config` file. Theme tokens live in `app/globals.css` (`@theme` block) — add custom colors/utilities there.
- **shadcn/ui "base-nova" style.** `components/ui/*` are generated shadcn components built on `@base-ui/react` primitives, **not** Radix. Add components via `npx shadcn add <component>`; don't copy-paste Radix-based examples from the web. `cn` comes from the standalone `cn` package, re-exported from `@/lib/utils` (not clsx + tailwind-merge).
- Path alias `@/*` maps to the repo root (`tsconfig.json`).
- `lib/highlighter.tsx` + `hooks/use-highlighted-code.ts` implement streaming syntax highlighting with a **fixed language allowlist** — extend the `languages` map in `lib/highlighter.tsx` to support more languages.

## Layout

- `app/` — routes only. `layout.tsx` composes the shell from `components/Navbar.tsx` and `components/Footer.tsx`.
- `components/` — `ui/` is generated shadcn code; app-specific components (`Navbar`, `Footer`, `Banner`) live at the top level.
- `hooks/`, `lib/` — shared hooks and helpers.

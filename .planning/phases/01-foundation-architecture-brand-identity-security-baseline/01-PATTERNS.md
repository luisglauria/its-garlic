# Phase 1: Foundation, Architecture, Brand Identity & Security Baseline - Pattern Map

**Mapped:** 2026-09-12
**Files analyzed:** 27 (files to be created — no files to modify, greenfield repo)
**Analogs found:** 0 / 27 — **no existing codebase to map analogs from**

## Greenfield Notice

This repository has **no `src/` directory and no Next.js project scaffolded**. Verified via
`git ls-files` — the only tracked files are `.claude/CLAUDE.md`, `.planning/**`,
`ask_questions/QA-LOG.md`, and `img/*` (brand source images). There is no prior controller,
component, service, model, middleware, or config code anywhere in the tracked tree to serve as
an analog.

Per the tracked-source gate: no gitignored mirrors were found either — nothing under `.gsd/` or
similar was present to mistakenly cite.

**Consequence for the planner:** every file in this phase is a **first-of-its-kind** file in this
repo. Instead of an in-repo analog, each file's template is the corresponding **Code
Example / Architecture Pattern already written out verbatim in
`01-RESEARCH.md`** (and cross-referenced against the project's canonical
`.planning/research/ARCHITECTURE.md`). Do not fabricate an analog — copy directly from the
excerpts below, which are reproduced from RESEARCH.md so the planner does not need to re-open
that file to get exact code.

## File Classification

| New File | Role | Data Flow | Template Source (RESEARCH.md) | Match Quality |
|----------|------|-----------|-------------------------------|---------------|
| `src/app/layout.tsx` | route (root layout) | request-response (SSR/RSC) | Pattern 4 (Fonts via `next/font`) | template-only |
| `src/app/page.tsx` | route (page) | request-response | Recommended Project Structure (placeholder home) | template-only |
| `src/app/icon.svg`, `apple-icon.png`, `favicon.ico` | config (static asset / file-convention) | file-I/O | Pitfall B (icon file-type rules) | template-only |
| `src/components/layout/{Header,Footer,SkipLink}.tsx` | component | request-response (static render) | Recommended Project Structure note; PERF-01 semantic landmarks | template-only |
| `src/components/ui/*` (empty scaffolding) | component | request-response | Recommended Project Structure | template-only |
| `src/data/menu.ts`, `promotions.ts`, `store.ts`, `links.ts` | model (seed data) | CRUD (read-only, file-based) | Pattern 1 (Zod Schema + Repository) — `data/store.ts` shape | template-only |
| `src/lib/schemas/*.schema.ts` | model (validation schema) | transform | Pattern 1 — `store.schema.ts` full example | template-only |
| `src/lib/repositories/*` | service (data access) | CRUD | Pattern 1 — `store-repository.ts` full example | template-only |
| `src/lib/integrations/allowlist.ts` | utility (security guard) | transform | Pattern 2 — `allowlist.ts` full example | template-only |
| `src/lib/integrations/{ifood,whatsapp,instagram,maps}.ts` | service (URL builder) | event-driven (click → URL build) | Pattern 2 — `whatsapp.ts` full example | template-only |
| `src/lib/integrations/allowlist.test.ts` | test | request-response (pure function) | Pattern 2 — Vitest test example | template-only |
| `src/lib/utils/*` | utility | transform | Don't Hand-Roll table (no direct example; keep minimal) | no analog — write directly per convention |
| `src/content/tone-of-voice.md` | config (content/doc) | file-I/O | D-04 content-skeleton scope in CONTEXT.md | no code analog — prose deliverable |
| `src/content/skeleton.ts` | model (typed content structure) | transform | Same pattern family as Pattern 1 (typed, no Zod required per D-04) | template-only |
| `src/styles/design-tokens.css` | config (design tokens) | transform | Architecture Patterns — Tailwind v4 `@theme` note | template-only |
| `src/styles/design-tokens.json` | config (data mirror) | transform | Same — "machine-readable mirror" note | template-only |
| `public/brand/*.svg` (6 logo variants) | asset | file-I/O | Pitfall A (multi-color trace pipeline) | template-only |
| `docs/brand-guidelines.md` | config (doc) | file-I/O | D-03 in CONTEXT.md | no code analog — prose deliverable |
| `SECURITY.md` | config (doc) | file-I/O | Security Domain — Security Baseline Checklist (D-06) | template-only |
| `next.config.ts` | config | request-response (headers middleware-equivalent) | Pattern 3 (Static, Non-Nonce CSP) — full example | template-only |
| `.gitignore` | config | file-I/O | Code Examples — `.gitignore` baseline | template-only |
| `vitest.config.mts` | config (test runner) | request-response (test execution) | Code Examples — Vitest config example | template-only |
| `.github/workflows/ci.yml` | config (CI) | event-driven (push/PR trigger) | Wave 0 Gaps — `npm ci` + test + audit + gitleaks | no direct excerpt — assemble per Pitfall E/Security Domain description |
| `package.json` (`engines.node`) | config | — | Standard Stack — Node `>=20.9` pin | no direct excerpt — single field |

## Pattern Assignments

### `src/lib/schemas/store.schema.ts` and sibling schemas (model, transform)

**Template:** RESEARCH.md Pattern 1

```typescript
// src/lib/schemas/store.schema.ts
import { z } from "zod";

export const storeInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  neighborhood: z.literal("Mercado da Torre"),
  city: z.literal("Recife"),
  state: z.literal("PE"),
  modalities: z.array(z.enum(["balcao", "delivery", "take-away"])),
  hours: z.object({
    provisional: z.literal(true), // ARQ-03 + CONT-03: cannot ship as `false` until confirmed
    schedule: z.array(
      z.object({ days: z.string(), open: z.string(), close: z.string() })
    ),
  }),
});

export type StoreInfo = z.infer<typeof storeInfoSchema>;
```

Apply the same shape (Zod object + `z.infer` export) to `menu.schema.ts`, `promotion.schema.ts`,
and `link.schema.ts` — one schema file per data domain, matching the `data/*.ts` file it
validates.

### `src/lib/repositories/store-repository.ts` and siblings (service, CRUD)

**Template:** RESEARCH.md Pattern 1

```typescript
// src/lib/repositories/store-repository.ts
import { storeInfoSchema } from "@/lib/schemas/store.schema";
import rawStore from "@/data/store";

export function getStoreInfo() {
  return storeInfoSchema.parse(rawStore); // build fails loudly on a malformed edit (ARQ-03)
}
```

Rule to enforce (Anti-Pattern list): components must never `import data/* ` directly — only
repository functions may.

### `src/lib/integrations/allowlist.ts` (utility, transform)

**Template:** RESEARCH.md Pattern 2

```typescript
// src/lib/integrations/allowlist.ts
export const ALLOWED_HOSTS = [
  "ifood.com.br",
  "www.ifood.com.br",
  "wa.me",
  "api.whatsapp.com",
  "instagram.com",
  "www.instagram.com",
  "google.com",
  "www.google.com",
  "maps.app.goo.gl",
] as const;

export function assertAllowedHost(url: string): string {
  const { hostname } = new URL(url);
  if (!ALLOWED_HOSTS.includes(hostname as (typeof ALLOWED_HOSTS)[number])) {
    throw new Error(`Blocked outbound host not on allowlist: ${hostname}`);
  }
  return url;
}
```

### `src/lib/integrations/whatsapp.ts` and siblings (service, event-driven)

**Template:** RESEARCH.md Pattern 2

```typescript
// src/lib/integrations/whatsapp.ts
import { assertAllowedHost } from "./allowlist";
import { WHATSAPP_NUMBER_PLACEHOLDER } from "@/data/links"; // flagged provisional

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`;
  const url = message ? `${base}?text=${encodeURIComponent(message)}` : base;
  return assertAllowedHost(url);
}
```

Apply the same shape to `ifood.ts`, `instagram.ts`, `maps.ts` — one host-specific URL builder
per integration, all funneled through `assertAllowedHost`.

### `src/lib/integrations/allowlist.test.ts` (test, request-response/pure-function)

**Template:** RESEARCH.md Pattern 2

```typescript
import { describe, expect, test } from "vitest";
import { assertAllowedHost } from "./allowlist";

describe("assertAllowedHost", () => {
  test("accepts an official WhatsApp destination", () => {
    expect(assertAllowedHost("https://wa.me/5581900000000")).toBeTruthy();
  });
  test("rejects a fraudulent look-alike host", () => {
    expect(() => assertAllowedHost("https://wa.me.evil.example/x")).toThrow();
  });
});
```

### `next.config.ts` (config, request-response headers)

**Template:** RESEARCH.md Pattern 3 — this is the official Next.js "Without Nonces" CSP example,
extended only for `next/image`'s `blob:`/`data:` usage. Copy verbatim:

```typescript
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
```

Do NOT switch to a nonce-based CSP (Anti-Pattern — forces dynamic rendering, no benefit here).

### `src/app/layout.tsx` (route, request-response/SSR)

**Template:** RESEARCH.md Pattern 4

```typescript
import { Anton, Manrope } from "next/font/google";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```

Extend with semantic landmarks (header/main/footer) and a skip-link component for PERF-01/WCAG
— no existing analog for the skip-link; use standard pattern:
`<a href="#main-content" className="sr-only focus:not-sr-only">Pular para o conteúdo</a>`.

### Icon files (asset, file-I/O)

**Template:** RESEARCH.md Pitfall B — strict file-type rules, no code excerpt needed but the
rule is load-bearing:
- `app/favicon.ico` — `.ico` only, top-level `app/` only
- `app/icon.svg` — SVG allowed here (modern browsers)
- `app/apple-icon.png` — PNG/JPG only, 180×180, **not SVG**

### `vitest.config.mts` (config, test runner)

**Template:** RESEARCH.md Code Examples

```typescript
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node",
  },
});
```

### `.gitignore` (config, file-I/O)

**Template:** RESEARCH.md Code Examples

```gitignore
node_modules/
.next/
.env
.env.local
.env.*.local
!.env.example
```

## Shared Patterns

### Data validation boundary (ARQ-02, ARQ-03)
**Source:** RESEARCH.md Pattern 1
**Apply to:** every `lib/repositories/*` file — always wrap raw `data/*` import in the matching
Zod schema's `.parse()`. Components never import `data/*` directly (enforce via
`no-restricted-imports` ESLint rule for `@/data/*` outside `lib/repositories/`).

### Outbound link allowlisting (INTEGRA-04, SEC-03)
**Source:** RESEARCH.md Pattern 2
**Apply to:** every `lib/integrations/*.ts` file — always call `assertAllowedHost()` before
returning a built URL. Never hardcode an iFood/WhatsApp/Instagram/Maps URL string in a
component.

### Security headers (SEC-07)
**Source:** RESEARCH.md Pattern 3
**Apply to:** `next.config.ts` only (single file, not per-route) — static non-nonce CSP.

### Provisional/pending-data flag convention (CONT-03, D-05)
**Source:** RESEARCH.md Pattern 1 (`hours.provisional: true` field) + CONTEXT.md D-05
**Apply to:** any `data/*.ts` file carrying unconfirmed commercial data (hours, links) — the
flag belongs in the Zod schema/data layer, never as a UI-only comment.

### `server-only` guard (SEC-04/05)
**Source:** RESEARCH.md Pitfall C
**Apply to:** any future server-only module (none strictly needed yet in Phase 1, but install
`server-only` now per the pitfall's recommendation).

## No Analog Found

All 27 files have no in-repo analog (greenfield). Files with **no direct code excerpt in
RESEARCH.md either** (planner/executor must write from convention description, not a template):

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/lib/utils/*` (cn/formatPrice/slugify) | utility | transform | RESEARCH.md only lists these in the project-structure tree, no code example given — write minimal, standard implementations |
| `src/content/tone-of-voice.md` | config/doc | file-I/O | Prose deliverable per D-04; no code pattern applies |
| `docs/brand-guidelines.md` | config/doc | file-I/O | Prose deliverable per D-03; no code pattern applies |
| `.github/workflows/ci.yml` | config (CI) | event-driven | RESEARCH.md describes required steps (`npm ci`, `npm run test`, `npm audit`, `gitleaks`) in prose (Wave 0 Gaps / Security Baseline Checklist) but gives no full YAML — assemble from that description |
| `public/brand/*.svg` (6 logo variants) | asset | file-I/O | Generated via the `sharp`+`potrace`+`svgo` pipeline described in Pitfall A — no single code excerpt, follow the described technique (per-color mask → trace → combine → clean) |

## Metadata

**Analog search scope:** Full tracked-file listing via `git ls-files` (root of repo) — confirmed
empty of application code.
**Files scanned:** All tracked files (27 total tracked paths, none are app/source code).
**Pattern extraction date:** 2026-09-12
**Extraction source:** `01-RESEARCH.md` (Code Examples, Architecture Patterns, Common Pitfalls
sections) — verbatim reproduction, no invention.

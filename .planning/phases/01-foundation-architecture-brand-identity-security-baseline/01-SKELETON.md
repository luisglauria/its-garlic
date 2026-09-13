# Walking Skeleton — It's Garlic

**Phase:** 1
**Generated:** 2026-09-12

## Capability Proven End-to-End

> One sentence: the smallest user-visible capability that exercises the full stack.

A visitor loading the deployed home page sees It's Garlic's real store name, street address, and
neighbourhood — read from a hand-authored data file, validated by a Zod schema, and returned by a
repository function — and can click one "Pedir no iFood" button whose destination was built by the
centralized integrations module and cleared by the outbound-host allowlist.

That single path crosses every layer this project will ever have: hand-authored data, schema
validation, the repository seam, the integrations seam, the outbound-link guard, the presentation
layer, and the build/serve pipeline. Nothing else in Phase 1 introduces a layer this path does not
already touch — which is precisely why proving it first turns an architectural dead end into a
one-commit correction instead of a Phase-4 rewrite.

**Where it is built:** plan `01-02`, Task 1 (`type="tracer"`). The scaffold it runs on is plan
`01-01`.

**How it is verified end-to-end:** `npm run build` prerenders the home route, which executes the
page component at build time — so `getStoreInfo()` parses, `storeInfoSchema.parse()` runs, and
`buildIFoodUrl()` passes `assertAllowedHost()` — and the emitted HTML is then asserted to contain
the real neighbourhood and the allowlisted iFood href. A malformed data edit or a non-allowlisted
hostname fails the build rather than shipping.

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Framework | Next.js 16, App Router, `src/` directory, TypeScript | Client-stated preference, confirmed by research as the current correct fit. Server Components are the default, which is right for a content site whose only interactive islands are the Phase-3 menu filter and the Phase-4 time-aware banner. The `headers()` hook covers the CSP/HSTS requirement with no middleware, and the built-in image optimizer directly serves the LCP budget that food photography puts at risk. |
| Rendering mode | Hybrid default — **no** static export | Research: `output: "export"` would lose the server-assisted image pipeline (AVIF/WebP conversion, responsive resizing) and the `headers()` configuration, forcing a hand-rolled image build script and CDN-level header config. Given the explicit LCP target and photography-first content, that trade is wrong for this project. |
| Data layer | Hand-authored typed files under `src/data/`, read only through `src/lib/repositories/*` | ARQ-01 forbids a database in the MVP. The repository function is the seam a real API, database, or CMS replaces in v2 without touching a single presentation component (ARQ-02). Components never import `src/data/*` — enforced by an ESLint `no-restricted-imports` rule, not by convention alone. |
| Validation | Zod v4, `.parse()` inside the repository function | The content is hand-edited and will be edited by non-developers over time. `.parse()` (never `.safeParse()`) turns a malformed price or a deleted address into a build failure instead of a silently broken production page (ARQ-03). `z.infer` derives the TypeScript types, so schema and type cannot drift. |
| Outbound integrations | One module, `src/lib/integrations/*`, every URL cleared by `assertAllowedHost()` | This project's own threat model names link-swap to a fraudulent destination as the top real risk. Exactly one chokepoint, compared by exact hostname equality against an `as const` allowlist, unit-tested against suffix and substring look-alikes (INTEGRA-04, SEC-03). No component ever holds a URL literal. |
| Auth | **None** — no accounts, no sessions, no login | Explicitly out of scope for the MVP. Removes ASVS V2/V3/V4/V6 from the threat model by construction. SEC-17 makes adding login a gated decision requiring a fresh threat-model review first. |
| Security headers | Static, non-nonce policy in `next.config.ts` via an extracted, unit-tested `src/lib/security/headers.ts` | A nonce-based policy would force every route into per-request dynamic rendering, killing static generation for a site with no per-user state. Because the MVP embeds no iframe and no live feed, the policy needs **no** third-party host allowance at all — every external destination is a plain outbound anchor (SEC-07). |
| Styling / design tokens | Tailwind v4 CSS-first `@theme`, tokens in `src/styles/design-tokens.css` mirrored in `.json` | v4 removes the JS config file and the content-glob footgun. The token file is the single home for the seven official brand hex values; components reference token custom properties, never hex literals (MARCA-02). |
| Fonts | Self-hosted via the framework font module, bound to the `--font-` token variables | Zero runtime requests to a font CDN (no visitor IP disclosed to a third party), automatic subsetting, and `size-adjust` layout-shift protection — which the CLS budget needs (MARCA-03). |
| Brand assets | Provisional SVG traced from `img/logo.png` at stable `public/brand/*` paths | D-01/D-02: the traced vector is an explicitly provisional approximation, not the official logo. Stable paths plus a re-runnable generation script mean a professional vector later is an overwrite, not a refactor. |
| Testing | Vitest, `node` environment, `vitest run` (never watch) | Framework-recommended for this project shape. Phase 1 tests pure logic only — schemas, the allowlist, the header policy, token parity — so no jsdom and no React Testing Library are installed. Async Server Components are not unit-testable under Vitest; end-to-end assertions run against prerendered build output instead. |
| Deployment target | Vercel (decided); local `npm run dev` / `npm run build` is the Phase-1 full-stack run | Native `next/image` support with no extra configuration, and `headers()` served at the edge. Phase 1 does not deploy: the production-domain verification of HTTPS, CSP enforcement, and Core Web Vitals is Phase 5 (SEC-11, SEC-08) by design, because those criteria are explicitly "produção real, não apenas local". |
| Directory layout | `src/{app,components,data,lib,content,styles}`, `public/brand`, `docs`, `scripts` | `lib/` splits into `schemas/`, `repositories/`, `integrations/`, `security/`, `brand/`, `utils/`. `content/` is deliberately separate from `data/`: content is what the client reviews as copy, data is what the client edits as prices and hours. Keeping them apart from day one avoids a Phase-3 refactor. |
| CI | GitHub Actions: `npm ci`, lint, test, high-severity-gated audit, `gitleaks` | `npm ci` installs strictly from the committed lockfile and fails on drift. No `continue-on-error` anywhere — a gate that cannot fail measures nothing (SEC-09, SEC-14). |

## Stack Touched in Phase 1

- [ ] Project scaffold (framework, build, lint, test runner) — plan `01-01`
- [ ] Routing — at least one real route (`src/app/page.tsx` home route) — plan `01-02` Task 1
- [ ] Data layer — one real validated read (`src/data/store.ts` → `storeInfoSchema` → `getStoreInfo()` → rendered page). **No write path exists and none is planned**: ARQ-01 makes this MVP read-only by design, so the canonical "one real read AND one real write" is satisfied here by one real read plus one real outbound integration call, which is this project's equivalent second direction — plan `01-02` Task 1
- [ ] Integrations — one real outbound destination built and allowlist-cleared end-to-end (`buildIFoodUrl()` → `assertAllowedHost()` → rendered anchor) — plan `01-02` Task 1
- [ ] UI — a real brand shell wired to the data and integration seams (header logo, footer store identity via `getStoreInfo()`) — plan `01-06`
- [ ] Deployment — documented local full-stack run: `npm run dev` serves the real page; `npm run build` prerenders and is the end-to-end assertion surface. Production deployment and its verification are Phase 5

## Out of Scope (Deferred to Later Slices)

> Anything that is *not* in the skeleton. Explicit, so later phases do not re-litigate Phase 1's
> minimalism — and so nobody mistakes an intentional omission for an oversight.

**Deferred to later phases of this milestone:**

- Hero section, its copy, and its three CTAs (Phase 2 — HERO-01/02/03)
- Location section, the "Como chegar" flow, and the labelled provisional operating hours (Phase 2 — LOCAL-01..04)
- The iFood-unavailable notice (Phase 2 — INTEGRA-03)
- The full 10-category cardápio, product cards, category filter, and product search (Phase 3 — CARD-01..05)
- Product photography and its responsive/lazy-loading pipeline (Phase 3 — PERF-02)
- XSS-safe rendering of search and URL-parameter input (Phase 3 built, Phase 5 tested — SEC-01, SEC-02)
- Almoço section and the "monte o seu prato" flow (Phase 4 — ALMO-01/02)
- Promotions, happy hour, and the time-aware journey priority computed in the `America/Recife` timezone (Phase 4 — PROMO-01..03)
- JSON-LD structured data, `sitemap.xml`, `robots.txt`, and local SEO (Phase 5 — SEO-01..03)
- Production Lighthouse and Core Web Vitals verification (Phase 5)
- Production-domain HTTPS redirect, enforced CSP verification, and the `unsafe-*` audit (Phase 5 — SEC-08, SEC-11)
- Domain registrar lock and DNSSEC evaluation (Phase 5 — SEC-15)
- Documented and tested rollback procedure (Phase 5 — SEC-16)

**Deferred to v2 (outside this milestone entirely):**

- WhatsApp AI ordering bot and WhatsApp as the primary CTA (INTEGRA-V2-01/02) — SEC-17 requires a fresh threat-model review first
- Marking sold-out products on the site (CARD-V2-01) — client decision deferred
- Conversion-event analytics (ANALYTICS-V2-01) — explicit client decision: none in the MVP

**Never in scope:**

- Own checkout or payment processing — every order path ends at iFood or WhatsApp (INTEGRA-05)
- Database, ORM, customer login, admin panel, or CMS (ARQ-01) — absence is machine-asserted against `package.json` in plan `01-01`
- Embedded Google Maps iframe (LOCAL-01) and live Instagram feed embed (MARCA-05 note) — both excluded so the performance budget does not depend on a third-party script, which is also why the CSP needs no third-party host allowance

**Known-unconfirmed, deliberately shipped as flagged placeholders rather than guesses:**

- The exact iFood store URL and the official WhatsApp number. Plan `01-02` seeds both with an
  obviously-invalid placeholder path token, `confirmed: false`, and a required explanation — three
  independent signals that must all be removed before a guess could ship (REQUIREMENTS.md bloco 5).
- Current operating hours. Plan `01-02` ships an empty schedule with `provisional` locked to the
  literal `true`. The two schedules visible in `img/` are 2.5-4.8 years old and contradict each
  other; they are format references only and are never copied into data.

## Subsequent Slice Plan

Each later phase adds one vertical slice on top of this skeleton without altering its architectural
decisions above:

- **Phase 2 — Hero, CTAs & Location:** a visitor lands, instantly reads "Mais que um pão de alho!", and acts on the iFood / WhatsApp / Maps CTAs or finds the store. Adds sections and copy on top of the existing shell; consumes `getStoreInfo()` and the existing integration builders unchanged.
- **Phase 3 — Menu & Product Catalog:** a visitor browses, filters, and searches the real cardápio. Adds `menu.schema.ts`, `menu-repository.ts`, and the first client-side interactive island, following the same schema-then-repository pattern the skeleton established.
- **Phase 4 — Promotions, Almoço & Time-Aware Journey:** the right journey surfaces for the time of day. Adds `promotion.schema.ts` and a deliberately small client island that renders a safe static default first and computes the real answer after mount using an explicit `America/Recife` timezone — never a build-time-fixed "now".
- **Phase 5 — SEO, Performance & Security Verification:** the production site meets every numeric and pass/fail acceptance criterion. Adds route-convention files and JSON-LD rendered from Server Components, and verifies against the live domain what Phase 1 could only configure.

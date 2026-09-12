# Stack Research

**Domain:** Mobile-first restaurant/digital-menu marketing site (no backend, no DB, no auth, no checkout) — drives orders to iFood and WhatsApp
**Researched:** 2026-09-12
**Confidence:** HIGH (core framework/versions verified against official docs and changelogs); MEDIUM (architecture patterns, synthesized from current best-practice sources, no single canonical doc for this exact combination)

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| Next.js | `^16.0.0` (App Router) | React framework, routing, build, image pipeline, headers | Client-stated preference and confirmed correct fit: App Router gives file-based routing, Server Components (zero client JS for static menu content), a first-party image optimizer with AVIF/WebP that directly targets the LCP budget, and a `headers()` API in `next.config.ts` that satisfies the CSP/HSTS requirement without middleware. Next.js 16 is current (16.3.x shipping through Aug/Sep 2026); React 19 is the recommended pairing and React 18 support is deprecated as of 16. Use the latest 16.x patch at project start — Next.js has shipped security patches in 2026 (e.g. May 2026 security release, 13 advisories patched in 15.5.18/16.2.6) so pin to the newest patch, not an old minor. **[HIGH — nextjs.org/docs, vercel.com/changelog]** |
| React | `^19.0.0` + `react-dom@^19.0.0` | UI library | Required pairing for Next.js 16; Server Components are the default in App Router, which is exactly right for a content site with almost no interactivity (menu filter/search and the time-based promo banner are the only client-side islands). **[HIGH — nextjs.org/docs/messages/react-version]** |
| TypeScript | `^5.7` (latest 5.x at install time) | Type safety across data layer, components, integration links | Client-stated preference; also directly supports the "arquitetura orientada a dados" constraint — typed menu/promotion schemas make the future backend swap a type-compatible operation, not a rewrite. **[HIGH]** |
| Tailwind CSS | `v4` (CSS-first config, `@import "tailwindcss";`) | Styling, design tokens, mobile-first responsive utilities | Client-stated preference; v4 (GA since Jan 2025, current major throughout 2026) replaces `tailwind.config.js` with `@theme` CSS variables — this is the natural home for the brand's design tokens (`#B8FF00`, `#202526`, etc. already defined in `src/styles/design-tokens.css`/`.json`) and Tailwind's `@theme` can consume CSS custom properties directly, avoiding a duplicate JS config. Automatic content detection removes the `content: []` glob-maintenance footgun from v3. **[HIGH — tailwindcss.com/docs/guides/nextjs]** |
| Node.js | `20.9+` LTS (use current LTS, e.g. 22.x, at build/deploy time) | Runtime for build and (if not fully static) server functions | Next.js 16 requires Node ≥20.9. Pin via `"engines": { "node": ">=20.9" }` in `package.json` and match the same major in the hosting platform's Node setting to avoid build/runtime drift. **[HIGH — nextjs.org/docs/app/getting-started/installation]** |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| Zod | `^4` (latest stable) | Runtime validation of the local menu/promotion/hours JSON | Non-negotiable here: the content is hand-authored/Claude-written and will be edited by non-developers over time (price/hours updates). A Zod schema per data shape (`MenuItem`, `MenuCategory`, `Promotion`, `BusinessHours`) validated once at build time turns a malformed edit into a build failure instead of a silently broken production page. `z.infer<>` also derives the TypeScript types the components consume, so schema and types never drift. **[HIGH — zod.dev]** |
| schema-dts | latest | Type-safe JSON-LD objects (`Restaurant`/`LocalBusiness`, `Menu`, `FAQPage`) | Use for the SEO-local requirement (Recife/Mercado da Torre, NAP data, opening hours). Gives compile-time checking of the structured-data shape before it's serialized into a `<script type="application/ld+json">` tag rendered from a Server Component (must NOT be a Client Component, or it won't appear in the initial HTML that crawlers read). |
| next-sitemap or Next.js native `sitemap.ts`/`robots.ts` (App Router file conventions) | current | `sitemap.xml` / `robots.txt` generation | Prefer the native App Router file conventions (`app/sitemap.ts`, `app/robots.ts`) over the `next-sitemap` package — one less dependency, same output, officially supported and simpler to keep accurate as pages are added. |
| clsx or tailwind-merge | latest | Conditional/merged Tailwind class strings | Only if component variants get non-trivial (e.g. active-category filter state, highlighted/"destaque" product cards). Skip if the component set stays simple — don't add it speculatively. |
| ESLint 9 (flat config) + `eslint-config-next` | matching Next.js 16 | Linting | Next.js 16's `create-next-app` scaffolds flat-config ESLint 9 by default; keep it, it's the current standard, not the legacy `.eslintrc`. |
| Prettier | latest 3.x | Formatting | Standard; pair with `prettier-plugin-tailwindcss` to auto-sort Tailwind classes — removes a whole class of bikeshedding/diff noise in review. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| `create-next-app` (latest) | Project scaffold | Run with `--typescript --tailwind --eslint --app --src-dir` to get the exact stack above wired correctly on day one — this is the officially supported fast path, don't hand-roll the config. |
| Lighthouse CI (or PageSpeed Insights run in CI) | Enforce Lighthouse ≥90 / CWV budget | Wire into the deploy pipeline so a regression fails CI instead of being caught after client review. Test against the **production** deployment URL, not `next dev` — the project's own acceptance criteria require production verification, and dev-mode is unrepresentative (no minification, no image optimization cache warm-up). |
| securityheaders.com + Google CSP Evaluator | Verify CSP/HSTS/header posture post-deploy | Manual/CI-adjacent check against the live URL after every header change; catches misconfigurations (missing `Strict-Transport-Security`, overly permissive `script-src`) that unit tests won't. |

## Installation

```bash
npx create-next-app@latest its-garlic --typescript --tailwind --eslint --app --src-dir

cd its-garlic

# Data validation
npm install zod

# SEO structured data
npm install schema-dts

# Dev formatting
npm install -D prettier prettier-plugin-tailwindcss
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|--------------------------|
| Next.js App Router, hybrid rendering (default, no `output: 'export'`) | Next.js `output: 'export'` (fully static HTML) to a plain static host (GitHub Pages, S3+CloudFront) | Only if hosting must be a zero-server static bucket. Costs: loses server-side `next/image` optimization (AVIF/WebP conversion, on-demand resizing) — you'd have to pre-generate every image size with a build-time `sharp` script and set `images: { unoptimized: true }`, and loses the simple `headers()` config (a static host needs headers set at the CDN/edge layer instead, e.g. Cloudflare Pages `_headers` file or S3+CloudFront response-headers policy). Given the project's explicit LCP target and food photography being the primary content, keep the server-assisted image pipeline — don't take on a manual image pipeline for a marketing site of this size. |
| Vercel (recommended hosting, see rationale below) | Cloudflare Pages via `@opennextjs/cloudflare` adapter | Choose if the client already manages DNS/CDN on Cloudflare and wants everything under one vendor, or wants Cloudflare's free-tier bandwidth ceiling. Works with Next.js 16 App Router including `next/image`, but needs the OpenNext adapter layer and Cloudflare's own image resizing (Cloudflare Images or `next/image` with a custom loader) — more moving parts than Vercel's native support. Security headers are set the same way (`next.config.ts` `headers()`) so CSP/HSTS parity is achievable either way. |
| Local typed JSON/TS files as the data layer | Headless CMS (Sanity, Contentful, Payload, etc.) | Explicitly ruled out by PROJECT.md ("MVP é site estático orientado a dados, sem CMS") — a CMS adds an account, an API dependency, and a new class of secrets/auth surface that contradicts the minimal-attack-surface decision. Revisit only if/when a real backend (e.g. WhatsApp AI bot) is built in v2, at which point the existing typed data-access functions (see Architecture note below) are the seam where a CMS or API could be swapped in without touching presentation components. |
| Zod for schema validation | JSON Schema + `ajv` | Only if the data needs to be validated from *outside* the TypeScript codebase (e.g. a non-technical editor submitting raw JSON through some future tool). For an MVP where the client's data changes go through a PR reviewed by a developer, Zod's TS-native ergonomics (schema doubles as the type source) are the better fit. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|--------------|
| Pages Router (`pages/`) | Legacy Next.js routing model; new features (Server Components, the `headers()`/`sitemap.ts`/`robots.ts` conventions used above) target App Router. Starting a greenfield 2026 project on Pages Router means missing the current image/SEO/metadata APIs this stack relies on. | App Router (`app/`) — already the client's stated preference. |
| Tailwind CSS v3 config (`tailwind.config.js` + `content: []`) | Superseded by v4's CSS-first `@theme` config; mixing v3 patterns into a v4 install causes confusion (some tutorials online are still v3-era — check the date/version on any Tailwind guide before following it). | Tailwind v4 CSS-first `@theme` block, importing the existing `design-tokens.css` custom properties. |
| Middleware-based nonce CSP as a default | Adds real complexity: forces affected routes to render dynamically per-request (defeats static generation/ISR for a content site that has no per-user state), and on non-Vercel platforms with ISR, a documented issue exists where a re-render can inherit a requester's CSP header in-process — a correctness/security footgun. | A static, allow-listed CSP set via `next.config.ts` `headers()` (no nonces needed) — `script-src 'self'`, explicit allow-list for iFood/WhatsApp/Instagram/Google Maps embed domains, no inline scripts. This matches the project's actual threat model (no user-generated content, no auth) and the SEC-01–17 requirement of "HTTPS + headers de segurança + CSP verificados em produção" without the operational cost of forcing dynamic rendering. Revisit only if a future phase adds a truly dynamic, request-specific script. |
| `<img>` tags or unmanaged `background-image` CSS for product photos | Bypasses `next/image` entirely — no automatic AVIF/WebP, no responsive `srcset`, no lazy-loading, no built-in layout-shift prevention. Given food photography is the primary content and LCP ≤2.5s is a hard acceptance criterion, this is the single highest-risk shortcut for this project. | `next/image` everywhere, with the hero/first-visible product photo marked `priority` (equivalent of preload + `fetchPriority="high"`) and `sizes` set correctly for the mobile-first breakpoints; explicit `width`/`height` (or `fill` with a sized container) on every image to protect CLS. |
| Client-computed "current promotion/hours" logic without SSR-safe fallback | Naively reading `new Date()` in a component that renders on both server and client causes a hydration mismatch (server pre-renders at build time in one timezone/instant, client renders in the visitor's browser) — React will warn or, worse, flash incorrect content (CLS/UX issue, and undermines trust in the "happy hour agora" messaging). | Isolate the time-based promotion/journey-priority logic in a small Client Component that: (1) renders a safe static default on first paint (e.g., last-known-good promotion or no promo banner), (2) computes the actual answer in `useEffect` using `Intl.DateTimeFormat` with an explicit `timeZone: 'America/Recife'` (never rely on server or visitor local time, since the server may run in UTC and a visitor may be traveling), and (3) swaps in the real value after mount. Keep this component as small and isolated as possible — it's the one part of the page that cannot be pure Server Component. |
| Analytics/tracking libraries (GA, Meta Pixel, etc.) | Explicitly out of scope per PROJECT.md ("Analytics / rastreamento — decisão explícita do usuário: não no MVP"). Adding any of these also complicates the CSP `connect-src`/`script-src` allow-list for no benefit in this milestone. | Nothing — if/when analytics is approved in a later milestone, add it then with its own CSP review, per SEC-17's requirement that new integrations get a threat-model update first. |

## Stack Patterns by Variant

**If the client confirms iFood/WhatsApp links only (current scope):**
- Keep the CSP `connect-src`/`frame-src` allow-list minimal: the iFood domain, `wa.me`/`api.whatsapp.com`, Google Maps (if embedding a map iframe) and Instagram (if embedding posts). Every additional third-party embed is a CSP change and a new link-integrity risk per the project's own threat model ("maior risco real é troca de um desses links por um destino fraudulento") — validate each external link against an explicit allow-list in code (a typed `EXTERNAL_LINKS` constant), not free-form strings scattered through components.

**If a future phase adds the WhatsApp AI bot (v2, backend required):**
- The current local-JSON data layer should be accessed only through small typed functions (e.g. `getMenu(): MenuCategory[]`, `getActivePromotion(now: Date): Promotion | null`) rather than components importing JSON files directly. That function boundary is the intended seam for swapping in an API/database later without touching presentation components — this directly satisfies the "arquitetura orientada a dados... pronta para receber um backend no futuro sem reescrita total" constraint. Do not let components `import menuData from '@/data/menu.json'` directly; always go through the accessor functions.

## Version Compatibility

| Package A | Compatible With | Notes |
|-----------|-----------------|-------|
| `next@^16.0.0` | `react@^19.0.0`, `react-dom@^19.0.0` | React 18 is deprecated (not removed) under Next 16; don't install it fresh — start on React 19. |
| `next@^16.0.0` | Node `>=20.9` | Set `engines.node` in `package.json` and match the hosting platform's Node version setting; older Node causes obscure runtime errors (e.g. missing global `Request`). |
| `tailwindcss@^4` | `@tailwindcss/postcss` (not the old `tailwindcss` PostCSS plugin entry) | v4's PostCSS integration package changed name/shape from v3 — using a v3-era `postcss.config.js` snippet will not work. Use `create-next-app --tailwind`'s generated config as the source of truth. |
| `next/image` | Vercel hosting (zero extra config) or Cloudflare (`@opennextjs/cloudflare` + image loader config) | If choosing Cloudflare over Vercel, confirm the image loader story before committing — it is not zero-config there the way it is on Vercel. |

## Sources

- [Next.js docs — Guides: JSON-LD](https://nextjs.org/docs/app/guides/json-ld) — HIGH, official
- [Next.js docs — Upgrading: Version 16](https://nextjs.org/docs/app/guides/upgrading/version-16) — HIGH, official
- [Next.js docs — Getting Started: Installation](https://nextjs.org/docs/app/getting-started/installation) — HIGH, official (Node ≥20.9 requirement)
- [Next.js docs — React Version Support](https://nextjs.org/docs/messages/react-version) — HIGH, official
- [Next.js docs — Guides: Static Exports](https://nextjs.org/docs/app/guides/static-exports) — HIGH, official (confirms `output: export` loses SSR/ISR/API routes, informs the "what not to use" static-export guidance)
- [Vercel — Next.js on Vercel vs Cloudflare](https://vercel.com/kb/guide/next-js-on-vercel-vs-cloudflare) — HIGH, official/vendor, cross-checked against Cloudflare's own OpenNext adapter docs referenced in search results
- [Vercel Changelog — Next.js May 2026 security release](https://vercel.com/changelog/next-js-may-2026-security-release) — HIGH, official, confirms active 2026 security patch cadence
- [Tailwind CSS docs — Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs) — HIGH, official
- [Zod docs](https://zod.dev/) — HIGH, official
- [GitHub — vercel/next.js Discussion #80997, CSP headers / `headers()` timing in production](https://github.com/vercel/next.js/discussions/80997) — MEDIUM, primary-source discussion on the actual framework repo, informs the nonce-CSP caution
- [LogRocket — Using Next.js security headers to strengthen app security](https://blog.logrocket.com/using-next-js-security-headers/) — MEDIUM, third-party technical blog, cross-checked against Next.js official `headers()` docs pattern
- [DebugBear — Next.js Image Optimization: The next/image Component](https://www.debugbear.com/blog/nextjs-image-optimization) — MEDIUM, third-party, consistent with Next.js official image docs guidance (AVIF/WebP, `sizes`, `priority`)
- [Mike Bifulco — Add Structured Data to your Next.js site with JSON-LD for better SEO](https://mikebifulco.com/posts/structured-data-json-ld-for-next-js-sites) — MEDIUM, third-party, used for the schema-dts + Server Component (not Client Component) rendering caution

---
*Stack research for: Mobile-first restaurant/digital-menu marketing site (It's Garlic, Recife)*
*Researched: 2026-09-12*

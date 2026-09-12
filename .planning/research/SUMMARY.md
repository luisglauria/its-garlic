# Project Research Summary

**Project:** It's Garlic (Recife) - digital menu / marketing site
**Domain:** Mobile-first restaurant/digital-menu marketing site (no backend, no DB, no auth, no checkout) - marketplace-order-funnel model driving traffic to iFood and WhatsApp
**Researched:** 2026-09-12
**Confidence:** MEDIUM-HIGH

## Executive Summary

It's Garlic is a static, data-driven "vitrine" (showcase) site whose entire commercial job is converting mobile visitors into an iFood order or a WhatsApp chat - it explicitly has no cart, no checkout, no login, no CMS, and no analytics. Experts build this class of product as a Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 static/hybrid site with zero database: content lives in typed, Zod-validated local data files accessed exclusively through a small repository/adapter layer, and every outbound link (iFood, WhatsApp, Instagram, Maps) is built and validated through a single centralized integration module. This architecture is deliberately chosen so a v2 WhatsApp AI ordering bot can be added later by swapping repository/integration internals only - never rewriting the presentation layer.

The recommended approach prioritizes three things simultaneously: (1) a fast, typed content pipeline (Zod schemas + repository functions) that turns bad or unconfirmed data (hours, prices) into a loud build failure or a clearly-labeled "provisional" UI state rather than a silent wrong answer; (2) an aggressive image-optimization discipline (next/image, AVIF/WebP, correct sizes, lazy-loading below the fold) because food photography is both the primary content and the single biggest threat to the hard Lighthouse >=90 / LCP <=2.5s acceptance criteria; and (3) a security posture scoped to this project's actual threat model - no auth/DB means the realistic risks are reflected XSS in the menu search/filter, external link tampering (the project's own stated #1 risk), CSP misconfiguration breaking the Maps embed, and supply-chain/secret-leakage via NEXT_PUBLIC_* - not generic backend/auth vulnerabilities.

Key risks to mitigate: (a) the site's only "conversion" is three external links, so link integrity and centralization are non-negotiable, not nice-to-haves; (b) business hours and Google Business Profile status are currently unconfirmed/blocked pendencias that must not be silently treated as final data; (c) time-of-day promotion/CTA logic cannot be computed at build time on a static site - it must be client-computed with an explicit America/Recife timezone to avoid stale or hydration-mismatched output; and (d) performance/security acceptance criteria must be verified against the live production URL, not localhost, since dev-mode and static-export builds behave very differently from the deployed result.

## Key Findings

### Recommended Stack

Next.js 16 (App Router) paired with React 19 and TypeScript is the confirmed, client-preferred core - Server Components by default fit a content site with almost no interactivity, and the headers() API in next.config.ts covers the CSP/HSTS requirement without middleware complexity. Tailwind v4's CSS-first @theme config is the natural home for the brand's existing design tokens. Zod is non-negotiable for validating hand-authored/editable menu, promotion, and hours data at build time, with z.infer<> deriving the TypeScript types so schema and types never drift. schema-dts supports type-safe JSON-LD for local SEO. Avoid full static export (output: 'export') unless hosting truly requires it - it loses next/image's server-side optimization pipeline, which is load-bearing given the LCP budget.

**Core technologies:**
- Next.js 16 (App Router): routing, rendering, image pipeline, security headers - best fit for a content-heavy, low-interactivity site
- React 19 + TypeScript 5.7: required Next.js 16 pairing; typed data layer supports the "backend-ready, no rewrite" architecture goal
- Tailwind CSS v4: mobile-first styling, CSS-first @theme tokens matching existing brand design tokens
- Zod: runtime validation of local menu/promotion/hours data, turning bad edits into build failures instead of silent breakage

### Expected Features

**Must have (table stakes):**
- Category-organized menu across the 10 fixed categories, with photo/name/description/price product cards
- Primary iFood order CTA + WhatsApp CTA, side-by-side, prominent and repeated (link correctness is the top threat-model asset)
- Location & hours section - ship "provisional/a confirmar" until client confirms current hours
- Mobile-first responsive layout, strong hero communicating brand identity, category filter + product search
- Security/performance/local-SEO baseline (Lighthouse >=90, LCP <=2.5s, CSP/HSTS verified in production)

**Should have (competitive differentiators):**
- Time-of-day adaptive CTA/journey priority (lunch vs. happy hour) - genuine differentiator vs. generic "cardapio digital" template vendors, but the real version is blocked on confirmed hours; ship a placeholder first
- Configurable promotions data model (combo do dia, happy hour, day-of-week rules) - most architecturally interesting piece, still fully static-rendered
- Custom illustrated brand identity carried through the whole site (not a generic template look)
- Per-item WhatsApp pre-filled deep-links, dedicated "almoco" showcase section

**Defer (v2+):**
- Any cart/checkout/payment, login/accounts/loyalty, table reservations, real-time "sold out" sync, CMS/admin panel, analytics/tracking, AI WhatsApp ordering bot - all explicitly out of scope per PROJECT.md and would reintroduce auth/DB/attack-surface the MVP deliberately avoids

### Architecture Approach

The architecture centers on two seams designed for future extension without rewriting the presentation layer: a lib/repositories/ data-access layer that components call instead of importing data/* files directly (so a v2 backend/CMS swap touches only repository internals), and a lib/integrations/ module that centralizes and allowlist-validates every outbound URL (iFood, WhatsApp, Instagram, Maps) - the exact place a future WhatsApp AI bot backend would plug in. Time-window logic (happy hour, combo do dia, CTA priority) lives in pure, testable functions in lib/scheduling/, computed client-side with an explicit timezone since a static build cannot reliably know "now." All content is Zod-validated at build time.

**Major components:**
1. data/ + lib/schemas/ - typed, Zod-validated source of truth for menu, promotions, store info, and external link destinations
2. lib/repositories/ - the sanctioned, sole path from UI to data; the v2 backend swap point
3. lib/integrations/ - centralized, allowlist-validated outbound URL builders for iFood/WhatsApp/Instagram/Maps; the v2 WhatsApp bot swap point
4. lib/scheduling/ - pure time-window functions (happy hour, CTA priority) called from a small client component, never baked into static build output
5. components/{menu,promotions,store-info} + components/ui/ - Server Components by default, Client Components only for filter/search and time-aware CTA swap

### Critical Pitfalls

1. **External link swap / phishing risk (project's own stated #1 risk)** - centralize all iFood/WhatsApp/Instagram/Maps URLs in one typed config, validate hostnames against an allowlist at build time, never hardcode duplicated link strings across components
2. **Reflected XSS via search/filter query params** - never use dangerouslySetInnerHTML; treat all useSearchParams() values as untrusted, allowlist category values, manually test injection payloads
3. **Food photography tanking mobile LCP/Lighthouse** - build-time image pipeline (next/image, AVIF/WebP, correct sizes, lazy-load below fold), decide the image strategy during stack/architecture phase before 60+ photos are in the repo
4. **CSP misconfigured, breaking Maps embed or defeating XSS protection** - enumerate third-party origins first, use Content-Security-Policy-Report-Only in staging before enforcing, verify every page with an embed
5. **NAP/hours inconsistency and stale data treated as final** - mark hours "provisional" until client-confirmed (per already-documented divergent old sources), reconcile NAP across site/iFood/Google/Instagram before launch, never silently ship guessed data

## Implications for Roadmap

Based on research, suggested phase structure:

### Phase 1: Foundation - Stack, Data Layer & Security Baseline
**Rationale:** Everything else depends on the typed data schema, repository/integration seams, and security header baseline being right from day one - retrofitting the data-access boundary or CSP after content exists is expensive (per Pitfalls #1, #4, #5, #8 warnings about deciding early).
**Delivers:** Next.js 16 + React 19 + TS + Tailwind v4 scaffold; lib/schemas/, lib/repositories/, lib/integrations/ (with allowlist), data/ typed files for menu/promotions/store/links; next.config.ts headers (CSP Report-Only, HSTS); lockfile + npm ci CI enforcement.
**Addresses:** Architecture's repository/integration pattern; data-driven, backend-ready constraint.
**Avoids:** Pitfall 2 (link swap), Pitfall 3 (secret leakage), Pitfall 5 (supply-chain), Pitfall 4 (CSP set up wrong from the start).

### Phase 2: Core Menu & Product Catalog
**Rationale:** The menu is the actual product catalog and the largest content surface; it should land before promotions/CTA-priority logic since those features consume menu data.
**Delivers:** Category-organized menu (10 categories), product cards, category filter + search, next/image pipeline with responsive sizes/lazy-loading.
**Uses:** Zod-validated data/menu.ts, menu-repository.ts, next/image.
**Implements:** components/menu/*; lib/repositories/menu-repository.ts.

### Phase 3: Hero, CTAs & Location/Store Info
**Rationale:** Depends on Phase 1's integration layer (iFood/WhatsApp/Maps link builders) and needs the confirmed/provisional hours decision resolved for correct UI treatment.
**Delivers:** Hero with brand identity + 3 CTAs, iFood+WhatsApp CTA pairing (sticky/repeated), location & hours section with explicit provisional-data labeling.
**Addresses:** Table-stakes CTA and location features from FEATURES.md.
**Avoids:** Pitfall 7 (NAP/hours inconsistency), Pitfall 9 (no fallback if a link fails - ensure WhatsApp fallback always present).

### Phase 4: Promotions & Time-Aware Journey Logic
**Rationale:** The most architecturally interesting and highest-differentiation feature, but explicitly dependent on confirmed business hours (a blocked pendencia) - sequenced after the static core so a placeholder can ship first and the real logic fast-follows.
**Delivers:** lib/scheduling/time-windows.ts, client-computed happy-hour/combo-do-dia logic with America/Recife timezone, promotions data model, almoco showcase section.
**Implements:** Architecture Pattern 3 (client-computed time windows, no build-time "now").
**Avoids:** Anti-Pattern 3 (build-time-only "now" going stale).

### Phase 5: SEO, Performance & Security Verification
**Rationale:** Verification-type work belongs after content/features exist and must run against production, not localhost - this phase closes the loop on the project's hard acceptance criteria.
**Delivers:** JSON-LD (Restaurant/LocalBusiness/Menu via schema-dts), sitemap/robots, production Lighthouse runs (>=90, LCP<=2.5s, CLS<=0.1, INP<=200ms), CSP enforced (post Report-Only period), manual XSS injection testing, bundle/secret scan, real-device iFood/WhatsApp link click-testing.
**Addresses:** All non-negotiable project acceptance criteria (SEC-01-17, performance, local SEO).
**Avoids:** Pitfall 1 (XSS), 3 (secret leakage), 4 (CSP breakage), 6 (SEO ignoring discovery intent), 8 (production-only Lighthouse verification).

### Phase Ordering Rationale

- Data/architecture foundation must come first because the repository and integration seams are the mechanism that satisfies the "backend-ready, no rewrite" constraint - every later phase's components depend on calling through these seams correctly from the start.
- Menu catalog precedes promotions/CTA-priority because promotions and time-aware logic consume menu/product data and depend on the same repository pattern already being proven.
- Time-aware promotions logic is deliberately sequenced to allow a placeholder now / real logic later, since it's blocked on an external pendencia (confirmed hours) outside the team's control.
- Verification (SEO/performance/security) is placed last as a dedicated phase because the project's acceptance criteria explicitly require production-verified results, not local dev-mode checks - bundling verification into feature phases risks false confidence (Pitfalls' "looks done but isn't" checklist).

### Research Flags

Phases likely needing deeper research during planning:
- **Phase 1 (Foundation):** CSP directive specifics for the exact third-party origins (iFood, WhatsApp, Maps, Instagram) and hosting-platform header mechanics (Vercel vs. Cloudflare) may need re-verification at implementation time.
- **Phase 3 (Hero/CTAs/Location):** iFood's exact current merchant-link format and WhatsApp wa.me URL-encoding edge cases were flagged as LOW-MEDIUM confidence in FEATURES.md - confirm against live sources before building.
- **Phase 4 (Promotions):** Blocked on external pendencias (confirmed hours, GBP status) - planning should explicitly branch on whether these are resolved by the time this phase starts.

Phases with standard patterns (skip research-phase):
- **Phase 2 (Menu/Catalog):** Well-documented Next.js next/image + Zod + repository patterns, all HIGH-confidence official-docs-backed.
- **Phase 5 (SEO/Performance/Security verification):** Standard Lighthouse/CSP/JSON-LD verification patterns, well-documented.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | HIGH | Core framework/versions verified against official Next.js/Tailwind/Zod docs and 2026 changelogs |
| Features | MEDIUM | Cross-verified general restaurant/digital-menu patterns; no direct competitor audit performed, iFood/WhatsApp link mechanics need re-verification at implementation |
| Architecture | MEDIUM-HIGH | Next.js data-fetching/App Router conventions are official-docs-backed; the specific repository/adapter composition for this project is a synthesis, not a single canonical source |
| Pitfalls | MEDIUM-HIGH | Security/performance findings grounded in current Next.js/OWASP guidance; local-SEO/conversion findings are industry-consensus but unverifiable in production without analytics (explicitly out of MVP scope) |

**Overall confidence:** MEDIUM-HIGH

### Gaps to Address

- Confirmed business hours (currently blocked pendencia, divergent 2.5-4.8-year-old sources) - must ship provisional UI until resolved; blocks the "real" version of time-aware CTA priority and promotions.
- Google Business Profile existence/status (unknown pendencia) - blocks full local SEO/schema.org NAP strategy; flag to client as an out-of-codebase dependency.
- Exact current iFood merchant store URL and WhatsApp number format - must be confirmed directly from live sources before implementing CTAs, not assumed from research.
- No direct competitive audit of named Recife competitors was performed - acceptable for MVP, but a follow-up pass could sharpen differentiation claims later.
- Hosting platform choice (Vercel vs. Cloudflare Pages) not finalized - affects next/image and CSP header mechanics; should be settled early in Phase 1.

## Sources

### Primary (HIGH confidence)
- nextjs.org/docs - App Router, image optimization, JSON-LD, version 16 upgrade guide, Node/React version requirements
- tailwindcss.com/docs - Tailwind v4 install/config with Next.js
- zod.dev - schema/type validation patterns
- vercel.com/changelog - Next.js 2026 security release cadence
- .planning/PROJECT.md - primary source for all project-specific constraints, threat model, and pendencias

### Secondary (MEDIUM confidence)
- Restaurant/digital-menu design and SEO guidance (FedEx Office, MarketMan, Lightspeed, WAND Digital, RestaurantTimes, Yext, LocalBrandHub, Amigo Studios)
- WhatsApp wa.me deep-link mechanics (Freshworks/Freshchat, WhatsForm, AppsFlyer)
- Next.js security/architecture community sources (Arcjet security checklist, DEV Community XSS/secrets articles, Feature-Sliced Design blog)
- CSP + Google Maps embed reference (content-security-policy.com)

### Tertiary (LOW confidence)
- iFood merchant link format and 2024 embeddable-menu discontinuation (secondary Brazilian sources) - needs re-verification against live iFood para Parceiros account
- Brazilian "cardapio digital" market scan (Techd, Neryx, Cardapio Inteligente, Nossomenu) - used for competitive landscape characterization only

---
*Research completed: 2026-09-12*
*Ready for roadmap: yes*

# Roadmap: It's Garlic

## Overview

It's Garlic ships as five vertical slices, each landing a functional, visually-complete piece of
the site rather than a horizontal technical layer. Phase 1 lays the architecture, brand system,
approved copy, and account/repo security baseline every later phase builds on. Phases 2 and 3
deliver the client's own stated launch gate — "versão mínima navegável" — by shipping the Hero
(with CTAs and location/store info) and then the full Cardápio; once both are live the site is
launchable, even though the roadmap continues. Phase 4 adds the highest-differentiation feature
(time-aware Almoço/Promoções/Happy Hour) on top of the menu data model proven in Phase 3. Phase 5
closes the loop with SEO, Lighthouse/Core Web Vitals, and the production-only security
verification (CSP enforcement, XSS testing, DNS/rollback readiness) the client's acceptance
criteria require. Two pendências are flagged as **[BLOQUEADOR de fase]** in REQUIREMENTS.md
(confirmed operating hours; confirmed iFood store URL + WhatsApp number) — per client direction,
Phases 2 and 4 ship with clearly-labeled provisional/placeholder data instead of blocking, with an
explicit follow-up once the client confirms.

## Phases

**Phase Numbering:**

- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Foundation, Architecture, Brand Identity & Security Baseline** - Data layer, centralized/allowlisted integrations module, brand SVGs + design tokens + style guide, approved first-draft copy, and repo/account security setup (branch protection, MFA, secret scanning)
- [ ] **Phase 2: Hero, CTAs & Location** - Homepage hero with the "Mais que um pão de alho!" identity, iFood/WhatsApp CTAs, and the location/store-info section — first half of the client's launch gate
- [ ] **Phase 3: Menu & Product Catalog** - Full 10-category cardápio with product cards, category filter, search, and optimized product photography — second half of the client's launch gate
- [ ] **Phase 4: Promotions, Almoço & Time-Aware Journey** - Combo do dia, day-of-week promotions, happy hour, and the almoço showcase, all driven by configurable time-window data
- [ ] **Phase 5: SEO, Performance & Security Verification** - Production-verified Lighthouse/Core Web Vitals, JSON-LD/sitemap/robots, enforced CSP, manual XSS testing, and launch-readiness checks (DNS lock, rollback)

## Phase Details

### Phase 1: Foundation, Architecture, Brand Identity & Security Baseline

**Goal**: The technical, visual, and content foundation exists so every later phase can build UI safely, on-brand, with client-approved copy, without re-architecting later.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: ARQ-01, ARQ-02, ARQ-03, MARCA-01, MARCA-02, MARCA-03, MARCA-04, MARCA-05, INTEGRA-04, CONT-01, CONT-02, CONT-03, PERF-01, PERF-03, SEC-03, SEC-04, SEC-05, SEC-06, SEC-07, SEC-09, SEC-10, SEC-12, SEC-13, SEC-14, SEC-17
**Success Criteria** (what must be TRUE):

  1. Any page in the running site displays the official It's Garlic brand identity — vetor logo, official color palette, defined typography — consistently in a base layout (header/footer), not the source PNG.
  2. All product/promotion/hours/store data lives in typed, Zod-validated data files accessed only through a repository layer; a malformed data edit fails the build instead of shipping broken data (backend-ready separation: presentation / data / integrations).
  3. Every outbound link (iFood, WhatsApp, Instagram, Maps) is built from one centralized, allowlisted integration module — no link string is hardcoded twice across components.
  4. The client has reviewed and approved first-draft Portuguese copy (tom jovem/descontraído/urbano) for hero, brand story, categories, CTAs, FAQs, SEO metadata, and contact/location before any page ships it.
  5. The production deployment serves over HTTPS with baseline security headers active and zero secrets in the repo/bundle, dependencies are locked and audited, and the GitHub repo enforces branch protection, required PR review, secret scanning, and MFA on GitHub/Vercel/domain-registrar — with SEC-17's rule (new threat-model review required before adding login/CMS/DB/checkout/AI features) documented as a standing constraint.

**Plans**: 5/6 plans executed in 3 waves

Plans:
**Wave 1**

- [x] 01-01-PLAN.md — Project scaffold, toolchain & secret hygiene (Next.js 16 + TS + Tailwind v4, audited dependency set, Vitest, `.env*` excluded)

**Wave 2** *(blocked on Wave 1 completion)*

- [x] 01-02-PLAN.md — Walking Skeleton tracer: data → Zod schema → repository → page, plus the allowlisted outbound iFood CTA
- [x] 01-03-PLAN.md — PT-BR tone-of-voice guide and the typed, confirmed/pending content skeleton
- [x] 01-04-PLAN.md — Security baseline: header set + CSP, CI gate (npm ci/test/audit/secret scan), and the D-06 operational checklist
- [x] 01-05-PLAN.md — Brand identity: provisional logo vectorization (6 variants), Next.js icon conventions, design tokens

**Wave 3** *(blocked on Wave 2 completion)*

- [ ] 01-06-PLAN.md — Accessible on-brand shell (landmarks, skip link, mobile-first) and `docs/brand-guidelines.md`

**UI hint**: yes
**Walking Skeleton**: see `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-SKELETON.md` — records the architectural decisions Phases 2-5 build on.

### Phase 2: Hero, CTAs & Location

**Goal**: A visitor lands on the homepage, instantly understands "Mais que um pão de alho!", and can act on iFood/WhatsApp/Maps CTAs or find the store's location and hours — with hours/links clearly marked provisional until the client confirms the two blocked pendências.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: HERO-01, HERO-02, HERO-03, LOCAL-01, LOCAL-02, LOCAL-03, LOCAL-04, INTEGRA-01, INTEGRA-02, INTEGRA-03, INTEGRA-05
**Success Criteria** (what must be TRUE):

  1. The homepage hero shows real product photography (not stock/generic burger imagery), the brand concept "Mais que um pão de alho!", and three working CTAs: "Ver cardápio", "Pedir no iFood", "Como chegar".
  2. "Pedir no iFood" and the WhatsApp CTA are visible side by side on mobile without scrolling past the fold; if the iFood link is unavailable, the site shows a clear notice instead of silently failing or swapping the primary CTA.
  3. The location section shows the full address with a working "Como chegar" link to Google Maps (no embedded iframe), the service modalities (balcão/delivery/take away), and operating hours — hours are visibly labeled "provisório" pending client confirmation.
  4. No page offers its own checkout — every order path ends at iFood or WhatsApp.

**Plans**: TBD
**UI hint**: yes

**Blocked pendências carried into this phase**: (1) exact iFood store URL and official WhatsApp number unconfirmed — ships with a clearly-labeled placeholder destination through the Phase 1 integrations module, never a guessed link; (2) current operating hours unconfirmed (only divergent 2.5–4.8-year-old Instagram stories found) — LOCAL-03 ships with provisional hours, labeled, pending client confirmation. Both are follow-up passes once the client responds, not launch blockers.

### Phase 3: Menu & Product Catalog

**Goal**: A visitor can browse the full, real cardápio — organized the way It's Garlic actually organizes it, not like a generic hamburgueria — filter and search it, and see fast-loading product photography. Combined with Phase 2, this satisfies the client's "versão mínima navegável" launch gate.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: CARD-01, CARD-02, CARD-03, CARD-04, CARD-05, PERF-02, SEC-01
**Success Criteria** (what must be TRUE):

  1. The cardápio lists products across all 10 official categories, each shown as a card with photo, name, short description, category, editable price, and optional highlight badges (mais pedido, promoção, premium, vegano, combo).
  2. Sanduíches no pão de alho (tradicionais and premium) are presented as a distinct, prominent category — the catalog visibly reads as It's Garlic's signature, not a generic hamburgueria menu.
  3. A visitor can filter products by category and search by product name; typing an XSS-style payload into the search box or URL parameter renders as inert plain text, never executed HTML/JS.
  4. Product photos load responsively and lazily below the fold using modern formats, without visibly hurting page load.

**Plans**: TBD
**UI hint**: yes

### Phase 4: Promotions, Almoço & Time-Aware Journey

**Goal**: The homepage/menu surfaces the right journey (almoço, pão de alho, happy hour) for the time of day, and the lunch offering and promotions read as real and current — all computed from configurable data, not hardcoded, and clearly provisional until the client confirms real hours.
**Mode:** mvp
**Depends on**: Phase 1, Phase 3
**Requirements**: ALMO-01, ALMO-02, PROMO-01, PROMO-02, PROMO-03
**Success Criteria** (what must be TRUE):

  1. A dedicated almoço section shows real researched lunch dishes (Salada Chicão, Salada It's Garlic, Parmegiana de frango, Picadinho carioca) and a working "monte o seu prato" flow (1 protein + 3 sides from the known list), labeled provisional pending client confirmation.
  2. The promotions section shows combo do dia, day-of-week promotions, and happy hour, all driven by a configurable data file — changing a time/day rule in data changes what's shown, with no component code edit required.
  3. Visiting the homepage at different times of day changes which journey (almoço / pão de alho / happy hour) is visually prioritized, computed client-side in the `America/Recife` timezone (never a build-time-fixed "now") — using the provisional hours dataset until the client confirms real hours.

**Plans**: TBD
**UI hint**: yes

**Blocked pendência carried into this phase**: current operating hours unconfirmed — the "real" version of PROMO-02/03's time-window logic ships against the provisional hours dataset from Phase 2, and gets a follow-up pass once the client confirms actual hours.

### Phase 5: SEO, Performance & Security Verification

**Goal**: The production site (not localhost) meets every hard numeric/pass-fail acceptance criterion from REQUIREMENTS.md bloco 4 — Lighthouse, Core Web Vitals, JSON-LD/sitemap, enforced security headers, XSS testing, DNS/rollback readiness — and is genuinely ready to go live.
**Mode:** mvp
**Depends on**: Phase 1, Phase 2, Phase 3, Phase 4
**Requirements**: SEO-01, SEO-02, SEO-03, SEC-02, SEC-08, SEC-11, SEC-15, SEC-16
**Success Criteria** (what must be TRUE):

  1. The production site returns valid schema.org LocalBusiness/Restaurant/Menu JSON-LD, a working `sitemap.xml` and `robots.txt`, and its meta tags/content target "Recife" and "Mercado da Torre".
  2. Production Lighthouse mobile scores ≥ 90 on Performance, Accessibility, Best Practices, and SEO, with LCP ≤ 2.5s, CLS ≤ 0.1, and INP ≤ 200ms.
  3. On the live production domain, HTTPS is enforced with an HTTP→HTTPS redirect, security headers (CSP — enforced, not report-only, and free of unnecessary `unsafe-inline`/`unsafe-eval` — plus HSTS, anti-clickjacking, X-Content-Type-Options, Referrer-Policy) are present and correct, and manually-tested XSS payloads in search/URL params still don't execute.
  4. The domain registrar has registrar-lock + MFA enabled (DNSSEC evaluated), and a documented rollback procedure has been tested at least once before launch.

**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation, Architecture, Brand Identity & Security Baseline | 5/6 | In Progress|  |
| 2. Hero, CTAs & Location | 0/TBD | Not started | - |
| 3. Menu & Product Catalog | 0/TBD | Not started | - |
| 4. Promotions, Almoço & Time-Aware Journey | 0/TBD | Not started | - |
| 5. SEO, Performance & Security Verification | 0/TBD | Not started | - |

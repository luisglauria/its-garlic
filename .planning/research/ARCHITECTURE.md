# Architecture Research

**Domain:** Static, data-driven restaurant/menu marketing site (Next.js, no DB/CMS in v1) designed for a future backend (WhatsApp AI ordering bot in v2)
**Researched:** 2026-09-12
**Confidence:** MEDIUM-HIGH (Next.js data-fetching/App Router conventions are official-docs-backed = HIGH; the repository/adapter composition for "static now, backend later" and the domain-specific application to a restaurant menu site is a synthesis from general web sources and established frontend architecture practice = MEDIUM)

## Standard Architecture

### System Overview

```
┌───────────────────────────────────────────────────────────────────────┐
│                          PRESENTATION LAYER                           │
│  app/ (routes, layouts) + components/ (ui/, menu/, promotions/,       │
│  store-info/, layout/) — React Server Components by default,          │
│  Client Components only where interactivity is required               │
│  (filter/search, time-window CTA swap)                                │
└───────────────────────────┬─────────────────────────────────────────┘
                             │ imports ONLY repository interfaces,
                             │ never raw data files directly
┌───────────────────────────▼─────────────────────────────────────────┐
│                     DATA-ACCESS LAYER (lib/repositories/)             │
│  MenuRepository · PromotionsRepository · StoreRepository              │
│  — v1 implementation reads from data/ at build time                   │
│  — v2 implementation can fetch from a real API/CMS/backend            │
│  — component code never changes when the implementation swaps         │
└───────┬───────────────────────────┬───────────────────────┬──────────┘
        │                           │                       │
┌───────▼────────┐        ┌─────────▼────────┐    ┌─────────▼─────────┐
│  DATA LAYER     │        │  SCHEMA/VALIDATION│    │  SCHEDULING LOGIC │
│  data/menu.ts   │        │  lib/schemas/      │    │  lib/scheduling/  │
│  data/promotions│        │  (Zod schemas +    │    │  time-windows.ts  │
│  data/store.ts  │        │   inferred types)   │    │  (happy hour,      │
│  data/links.ts  │        │  validates data/    │    │  combo do dia,     │
│                 │        │  at build time      │    │  journey priority) │
└─────────────────┘        └─────────────────────┘    └────────────────────┘

┌───────────────────────────────────────────────────────────────────────┐
│               INTEGRATION LAYER (lib/integrations/)                    │
│  ifood.ts · whatsapp.ts · instagram.ts · maps.ts                       │
│  — single source of truth for every outbound URL                       │
│  — allowlist-validated (SEC-0x link-integrity requirement)             │
│  — v2 swap point: whatsapp.ts can start returning a bot-backend URL    │
│    instead of a static wa.me link, with zero change to CTA components  │
└───────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| `app/` (routes/layouts) | Route composition, metadata, RSC data orchestration | Next.js App Router server components calling repositories |
| `components/ui/` | Design-system primitives (Button, Badge, Card, Section) | Presentational, no data fetching, styled with Tailwind + design tokens |
| `components/menu/`, `components/promotions/`, `components/store-info/` | Feature-composed UI, consumes typed data via props | Server components for display; client components only for filter/search/time-swap interactivity |
| `lib/repositories/` | Data-access abstraction; the ONE seam the future backend plugs into | Small interface + one concrete implementation per entity (file-based in v1) |
| `data/` | Raw content: menu items, promotions rules, store info, external link destinations | Typed `.ts` (or `.json` imported and validated) modules, source of truth in v1 |
| `lib/schemas/` | Runtime validation + compile-time types for all content | Zod schemas, `z.infer<>` types shared across data/, repositories/, components |
| `lib/scheduling/` | Pure functions: is it happy hour now? which combo applies today? which CTA (iFood/WhatsApp) has priority right now? | Pure, testable functions taking a `Date`/timezone and promotion rules, no side effects |
| `lib/integrations/` | Builds and validates every outbound URL (iFood, WhatsApp, Instagram, Maps) | Small pure functions + an allowlist check; the only place `href`s to third parties are constructed |
| `content/` (optional) | Long-form editorial copy (hero, FAQ, SEO meta) written in PT-BR | Plain typed objects/markdown, separated from structured product/promo data so copy review doesn't touch data schemas |

## Recommended Project Structure

```
src/
├── app/                          # Next.js App Router — routes & layouts only
│   ├── layout.tsx                 # Root layout, fonts, design tokens, security headers
│   ├── page.tsx                   # Home: hero + time-aware CTA priority
│   ├── cardapio/
│   │   └── page.tsx               # Full menu: category filter + search
│   ├── promocoes/                 # (if a dedicated page is needed; may instead be a home section)
│   │   └── page.tsx
│   └── localizacao/
│       └── page.tsx               # Address, hours, modalities, social/review links
│
├── components/
│   ├── ui/                        # Design-system primitives (Button, Badge, Tag, Card, Section)
│   ├── layout/                    # Header, Footer, MobileNav, SkipLink
│   ├── menu/                      # ProductCard, CategoryFilter, MenuSearch, MenuGrid
│   ├── promotions/                # PromoBanner, ComboDoDiaCard, HappyHourBadge
│   └── store-info/                # AddressBlock, HoursTable, ModalityBadges, SocialLinks
│
├── data/                          # v1 source of truth — no DB, no CMS
│   ├── menu.ts                    # 10 official categories, products (photo, name, desc, price, highlights)
│   ├── promotions.ts              # Combo do dia, happy hour, day-of-week rules (raw rule data)
│   ├── store.ts                   # Address, modalities, hours (marked provisional per PROJECT.md), social handles
│   └── links.ts                   # Raw destination values (iFood restaurant URL, WhatsApp number, Instagram handle, Maps place)
│
├── lib/
│   ├── repositories/               # THE SWAP POINT for a future backend
│   │   ├── menu-repository.ts       # getMenu(), getCategory(id), searchProducts(query)
│   │   ├── promotions-repository.ts # getActivePromotions(), getPromotionRules()
│   │   └── store-repository.ts      # getStoreInfo()
│   ├── integrations/                # THE SWAP POINT for the v2 WhatsApp AI bot
│   │   ├── ifood.ts                  # buildIfoodUrl()
│   │   ├── whatsapp.ts               # buildWhatsAppUrl(message?) — v2 replaces internals only
│   │   ├── instagram.ts              # buildInstagramUrl()
│   │   ├── maps.ts                   # buildMapsUrl()
│   │   └── allowlist.ts              # validated destination hosts, enforced at build/test time
│   ├── scheduling/
│   │   └── time-windows.ts           # isHappyHour(now), getTodaysCombo(now), getCtaPriority(now)
│   ├── schemas/
│   │   ├── menu.schema.ts
│   │   ├── promotion.schema.ts
│   │   └── store.schema.ts
│   └── utils/                        # formatPrice(), slugify(), cn() (Tailwind class merge), etc.
│
├── content/                        # PT-BR editorial copy, separated from structured data
│   ├── hero.ts
│   ├── faq.ts
│   └── seo.ts
│
└── styles/                         # design-tokens.css / .json (already exists per PROJECT.md)
```

### Structure Rationale

- **`data/` vs `lib/repositories/`:** This is the single most important boundary in the whole project. Components and pages never import `data/*` directly — they only call repository functions. In v1 the repository implementation is a thin wrapper that reads/validates the local `data/*` files. In v2, when the WhatsApp AI bot needs a real backend (order status, live menu updates, etc.), only the repository implementation changes — the component tree, routes, and props contracts stay identical. This is the concrete mechanism that satisfies the PROJECT.md constraint "arquitetura pronta para receber um backend no futuro sem reescrita total."
- **`lib/integrations/` isolated from everything else:** PROJECT.md's threat model names link integrity (iFood/WhatsApp/Instagram/Maps) as the top real risk. Centralizing every outbound URL in one small, testable module makes the SEC-0x "links externos validados contra lista de destinos oficiais" requirement trivially enforceable (one file to audit, one allowlist, one set of unit tests) instead of scattered `href="https://..."` strings across JSX.
- **`lib/scheduling/` as pure functions:** Time-window logic (happy hour, combo do dia, CTA priority by hour) is business logic, not UI logic and not data. Keeping it pure and separate from both `data/` (the rules) and `components/` (the rendering) makes it unit-testable without a browser, and reusable later by a backend/bot that needs the same "is it happy hour" answer.
- **`lib/schemas/` shared between data, repositories, and components:** Zod schemas give both compile-time types (via `z.infer`) and a runtime guard at build time — if `data/menu.ts` has a malformed entry (missing price, wrong category), the build fails loudly instead of shipping bad content. This directly serves the "nunca inventar produtos/preços/horários" constraint by making omissions or malformed provisional data visible immediately.
- **`content/` separate from `data/`:** Editorial PT-BR copy (hero headline, FAQ, SEO meta) changes on a different cadence and needs a different review process (client sign-off) than structured product/price data. Keeping them apart means a copy edit never risks touching a Zod-validated data file.

## Architectural Patterns

### Pattern 1: Repository/Adapter for Data Access

**What:** Every feature area (menu, promotions, store info) is accessed through a small function-based interface (`getMenu()`, `getActivePromotions()`, `getStoreInfo()`), never through direct file imports in components.
**When to use:** Any time a v1 static implementation is a deliberate placeholder for a v2 dynamic one — exactly this project's stated goal.
**Trade-offs:** Slightly more boilerplate than importing `data/menu.ts` directly in a page; pays for itself the moment a backend is introduced, because zero UI code needs to change, only the repository's internals.

**Example:**
```typescript
// lib/repositories/menu-repository.ts
import { menuSchema } from "@/lib/schemas/menu.schema";
import rawMenu from "@/data/menu";

export function getMenu() {
  return menuSchema.parse(rawMenu); // v1: static, validated at build time
  // v2 swap: return fetchMenuFromBackend(); — same return shape, nothing else changes
}
```

### Pattern 2: Centralized Integration Link Builder + Allowlist

**What:** All outbound links to iFood, WhatsApp, Instagram, and Google Maps are constructed and validated in `lib/integrations/`, never inlined as raw strings in components.
**When to use:** Whenever a site's core conversion action is "leave the site to a third party" — this is this project's entire conversion funnel (order via iFood/WhatsApp).
**Trade-offs:** One extra layer of indirection for what could be a plain `<a href>`; buys centralized security review, testability, and the exact seam v2 needs to swap the WhatsApp static link for a bot-backend endpoint.

**Example:**
```typescript
// lib/integrations/whatsapp.ts
import { ALLOWED_WHATSAPP_NUMBER } from "./allowlist";

export function buildWhatsAppUrl(message?: string) {
  const base = `https://wa.me/${ALLOWED_WHATSAPP_NUMBER}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
  // v2 swap: could instead call a backend that returns a bot-session deep link
}
```

### Pattern 3: Client-Computed Time Windows (Static Site, No Server-Request-Time Rendering)

**What:** Because the site ships as a static build (no per-request server rendering assumed), "is it happy hour right now" cannot be reliably computed at build time — it would go stale the moment the build is more than a few minutes old. Render a neutral/default state on the server, then compute the actual time window in a small client component on mount (and optionally on an interval), using an explicit IANA timezone (`America/Recife`) rather than the visitor's local clock.
**When to use:** Any promotion/CTA-priority feature whose correctness depends on "now," on a statically generated site.
**Trade-offs:** A brief flash of the default state before hydration (mitigate with a skeleton or CSS that hides the CTA-priority swap until mounted); avoids the alternative of ISR revalidation, which would add build/hosting complexity this project doesn't otherwise need.

**Example:**
```typescript
// components/promotions/HappyHourBadge.tsx ("use client")
import { useEffect, useState } from "react";
import { isHappyHour } from "@/lib/scheduling/time-windows";

export function HappyHourBadge() {
  const [active, setActive] = useState<boolean | null>(null);
  useEffect(() => {
    setActive(isHappyHour(new Date(), "America/Recife"));
  }, []);
  if (active === null) return null; // neutral until client confirms
  return active ? <Badge>Happy Hour agora!</Badge> : null;
}
```

## Data Flow

### Build-Time / Request Flow (v1, static)

```
data/*.ts (raw content, marked "provisional" where unconfirmed)
    ↓ (imported at build time)
lib/schemas/*.schema.ts  (Zod .parse — build FAILS on malformed/missing required fields)
    ↓
lib/repositories/*  (typed, validated data exposed via small functions)
    ↓
app/*/page.tsx (Server Components call repositories directly, no client fetch)
    ↓
components/{menu,promotions,store-info}/*  (receive typed props, render)
    ↓
components/ui/* (presentational primitives)
    ↓
Static HTML/CSS/JS shipped to CDN
```

### Client-Side Interactivity Flow

```
[User types in search / clicks category filter]
    ↓
Client Component (menu/MenuSearch.tsx, menu/CategoryFilter.tsx)
    ↓ (filters an already-loaded, already-validated in-memory product list —
    ↓  no network round-trip, no new data source)
Re-render of components/menu/MenuGrid.tsx

[Page mounts]
    ↓
components/promotions/HappyHourBadge, CTA priority logic (client)
    ↓
lib/scheduling/time-windows.ts (pure function, given Date + timezone)
    ↓
Re-render: swap iFood/WhatsApp CTA order or show/hide promo badge
```

### Key Data Flows

1. **Content → screen:** `data/` → Zod validation → repository → Server Component props → presentational component. One direction only; components never write back to `data/`.
2. **Time-aware UI:** `lib/scheduling/time-windows.ts` is called client-side (per Pattern 3) to decide CTA order and promo visibility; it depends on `promotions-repository` output but not on user input.
3. **Outbound conversion:** CTA click → `lib/integrations/{ifood,whatsapp}.ts` builds/validates a URL → `<a target="_blank" rel="noopener noreferrer">`. This is the only place data flows *out* of the site.
4. **v2 seam (future, not built in v1):** A WhatsApp AI bot backend would sit behind `lib/integrations/whatsapp.ts` (URL/session building) and possibly a new `lib/repositories/*` implementation (live menu/order state) — both already-isolated seams, so the swap does not touch `app/` or `components/`.

## Scaling Considerations

| Scale | Architecture Adjustments |
|-------|--------------------------|
| Launch / 0–1k visits/day | Fully static export or default Next.js static rendering on any CDN host (Vercel/Netlify/Cloudflare Pages). No changes needed. |
| 1k–100k visits/day | Still static; if `data/*` needs to change without a redeploy (e.g., client wants same-day price/hours edits), add ISR with a short `revalidate` window instead of rebuilding the whole repository/schema boundary — the seam already supports this without touching components. |
| 100k+ visits/day | CDN caching handles this trivially for a marketing site; the real future bottleneck is if/when the v2 WhatsApp bot backend is added — that backend scales independently of this static frontend and should not be co-located in the same deploy target. |

### Scaling Priorities

1. **First "bottleneck" is data freshness, not traffic:** the constraint that most affects this architecture is how fast menu/price/hours edits reach production (rebuild-and-redeploy vs. ISR), not visitor volume, which a static site absorbs by default.
2. **Second consideration is the v2 backend boundary:** when the WhatsApp AI bot is built, it should be a separate service the site's `lib/integrations/whatsapp.ts` and/or a new repository implementation call out to — not a rewrite of the presentation layer, per the explicit non-negotiable in PROJECT.md.

## Anti-Patterns

### Anti-Pattern 1: Data Imported Directly in Page/Components

**What people do:** `import menu from "@/data/menu"` inside `app/cardapio/page.tsx` or inside a `ProductCard` component.
**Why it's wrong:** Couples the UI directly to the static file shape. The day a backend is introduced (v2), every file that imported `data/menu.ts` directly needs to change — exactly the "full frontend rewrite" the project explicitly wants to avoid.
**Do this instead:** Always go through `lib/repositories/menu-repository.ts`. Enforce with a lint rule or code-review checklist item ("no `@/data/*` imports outside `lib/repositories/`").

### Anti-Pattern 2: Inline/Scattered External Links

**What people do:** Hardcode `<a href="https://wa.me/5581...">` or the iFood URL directly in multiple components (hero CTA, footer, menu page, sticky mobile bar).
**Why it's wrong:** Violates the project's own threat model finding (link integrity is the top real risk) — a single typo'd or later-compromised link can't be centrally audited or tested, and duplicated literals drift out of sync when the client changes their iFood store page or WhatsApp number.
**Do this instead:** Every outbound href goes through `lib/integrations/*`, which is unit-tested against the allowlist (SEC-0x requirement) and is the single edit point when the number/URL changes.

### Anti-Pattern 3: Build-Time-Only "Now" for Promotions

**What people do:** Compute `isHappyHour()` once at build time (in a Server Component with no client re-check) and bake the result into the static HTML.
**Why it's wrong:** On a statically generated site, "build time" and "the moment a visitor loads the page" can be hours or days apart — happy-hour badges and CTA priority would silently be wrong most of the time.
**Do this instead:** Use Pattern 3 (client-computed time windows with explicit timezone) or, if the client needs true server-fresh time without a bot backend, add ISR revalidation — but do not assume build time equals request time.

### Anti-Pattern 4: No Runtime Validation on Static Data

**What people do:** Trust `data/menu.ts` TypeScript types alone and skip a runtime schema check, reasoning "it's static data I wrote myself, it can't be wrong."
**Why it's wrong:** TypeScript types disappear at runtime and don't catch copy-paste errors (missing price, duplicate slug, malformed provisional-flag) — exactly the kind of mistake the project's "never invent/never ship unconfirmed data as final" constraint is meant to prevent.
**Do this instead:** Zod-parse every `data/*` file in the repository layer so a bad entry fails the build loudly, before it ships.

## Integration Points

### External Services

| Service | Integration Pattern | Notes |
|---------|---------------------|-------|
| iFood | Static outbound link (deep link to restaurant/menu page), built and validated in `lib/integrations/ifood.ts` | No order data flows back into the site; iFood is the actual order/payment processor (per PROJECT.md, out of scope to replicate). Confirm the exact restaurant URL with the client before launch — do not guess. |
| WhatsApp | `wa.me` link with optional pre-filled, URL-encoded message text, built in `lib/integrations/whatsapp.ts` | This is the exact seam v2's AI bot plugs into: same function signature, different internals (e.g., call a backend that returns a session-specific bot link) — see Pattern 2. |
| Instagram | Static profile link (`@itsgarlicrecife`), built in `lib/integrations/instagram.ts` | v1 scope is a link only, not an embedded feed; an embedded feed (oEmbed/Graph API) would be a v2+ addition requiring its own review (rate limits, token storage — out of scope for a no-backend site). |
| Google Maps | Static "open in Maps" link (preferred) built in `lib/integrations/maps.ts`; an embedded iframe map is optional and should be weighed against the project's Core Web Vitals/performance budget (LCP ≤ 2.5s) | Prefer a static link + address text over a heavy iframe embed unless the client specifically wants an inline map; if embedded, lazy-load it below the fold. |

### Internal Boundaries

| Boundary | Communication | Notes |
|----------|---------------|-------|
| `components/*` ↔ `lib/repositories/*` | Direct function calls (Server Components), typed by `lib/schemas/*` | This is the ONLY sanctioned path from UI to data. No component imports `data/*` directly (Anti-Pattern 1). |
| `components/*` ↔ `lib/integrations/*` | Direct function calls returning validated URL strings | No component constructs a third-party URL itself (Anti-Pattern 2). |
| `components/*` ↔ `lib/scheduling/*` | Direct function calls, given a `Date`/timezone, from a client component (Pattern 3) | Scheduling logic has no knowledge of React; it's pure and reusable by a future backend. |
| `data/*` ↔ `lib/schemas/*` | One-way validation at build time inside the repository layer | `data/*` never validates itself; validation lives in `lib/repositories/*` so the seam that will later be replaced by a real API is exactly where validation already happens (APIs need input validation too). |

## Sources

- [Next.js official docs — Data Fetching Patterns and Best Practices](https://nextjs.org/docs/14/app/building-your-application/data-fetching/patterns) — HIGH confidence (official framework docs)
- [Next.js official docs — Backend for Frontend guide](https://nextjs.org/docs/app/guides/backend-for-frontend) — HIGH confidence (official framework docs)
- [Next.js official docs — getStaticProps / getStaticPaths](https://nextjs.org/docs/pages/building-your-application/data-fetching/get-static-props) — HIGH confidence (official framework docs, relevant to static/ISR trade-off discussed in Scaling section)
- [Static Sites With YAML Data in Next.js 15 App Router — DEV Community](https://dev.to/83304a733942623daf/static-sites-with-yaml-data-in-nextjs-15-app-router-1p8a) — MEDIUM confidence (community article, corroborates file-based `data/` + `lib/` separation pattern)
- [The Ultimate Next.js App Router Architecture — Feature-Sliced Design blog](https://feature-sliced.design/blog/nextjs-app-router-guide) — MEDIUM confidence (community/framework-adjacent, corroborates layered/boundary-driven organization over purely technical folders)
- [js-frontend-repository (GitHub)](https://github.com/blazerroadg/js-frontend-repository) — LOW-MEDIUM confidence (illustrative example only, corroborates repository pattern as a standard swap-point technique for frontend data access)
- [Zod official docs](https://zod.dev/) — HIGH confidence (official library docs), supports the runtime-validation recommendation in Pattern/Anti-Pattern sections
- Project-specific constraints synthesized from `.planning/PROJECT.md` (threat model, MVP scope, v2 WhatsApp bot vision, no-DB/no-CMS constraint) — HIGH confidence (primary source, this project's own decisions)

---
*Architecture research for: Static, data-driven restaurant/menu marketing site (Next.js), designed for future backend extension*
*Researched: 2026-09-12*

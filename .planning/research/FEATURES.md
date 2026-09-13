# Feature Research

**Domain:** Restaurant / digital-menu marketing site — marketplace-order-funnel model (no in-house checkout)
**Researched:** 2026-09-12
**Confidence:** MEDIUM (cross-verified across multiple independent web sources for general patterns; iFood-specific link mechanics and WhatsApp click-to-chat specifics should be re-verified against official docs at implementation time — see Gaps)

## Context Note

This is not generic "restaurant website" research — It's Garlic is a **street-food-adjacent specialty brand** (pão de alho as signature product, plus sandwiches, petiscos, espetinhos, almoço, happy hour) whose site is explicitly a **vitrine** (showcase), not a transaction platform. Per PROJECT.md, the site has no backend, no cart, no payment — its entire commercial job is to get the visitor to tap "Pedir no iFood" or open a pre-filled WhatsApp chat. This reframes the whole feature landscape: many things that are "table stakes" for a generic restaurant-tech vendor (online ordering system, reservations, loyalty accounts) are **explicitly out of scope** here, while things that are usually an afterthought (CTA placement, link integrity, time-of-day merchandising) become the actual product.

## Feature Landscape

### Table Stakes (Users Expect These)

Features users assume exist on any credible restaurant site. Missing these = product feels incomplete or untrustworthy, especially on mobile where the visitor is standing outside Mercado da Torre deciding whether to walk in.

| Feature | Why Expected | Complexity | Notes |
|---------|--------------|------------|-------|
| Category-organized menu (10 official categories: pães de alho, sanduíches no pão de alho, sanduíches tradicionais, sanduíches premium, petiscos, espetinhos, almoço, bebidas, happy hour, combo do dia) | Every credible menu — physical or digital — is scannable by category; flat/unsorted lists feel amateurish and are unusable past ~15 items | LOW–MEDIUM | Category taxonomy is already fixed by the client; this is primarily a data-modeling + layout task, not a design-exploration one |
| Product cards (photo, name, description, price, category, optional highlight badge) | Minimum unit of "can I picture what I'm ordering" — food sites without photos convert worse and feel untrustworthy for delivery | LOW | Photos are the actual bottleneck (client must supply real photos per PROJECT.md — no stock); card component itself is simple |
| Primary order CTA to the delivery marketplace ("Pedir no iFood"), prominent and repeated | Visitors on marketplace-funnel sites expect one unambiguous next action; burying it forces them to hunt or bounce to search "restaurant name ifood" themselves, losing the referral | LOW (component) / HIGH stakes (link correctness is the #1 threat-model asset per PROJECT.md) | Should appear in hero, sticky/persistent on scroll, and per-section; must be spot-checked against the live iFood store link, not hardcoded from memory |
| WhatsApp contact/order CTA alongside the iFood CTA | Segment of users prefer human contact for custom orders, pickup coordination, or when iFood is closed/unavailable; WhatsApp is the de-facto customer-service channel in Brazil | LOW | Standard `wa.me/<number>?text=<encoded message>` click-to-chat link; opens a chat with a pre-typed message the user can edit before sending |
| Location & hours section (address, map, service modalities, hours) | Visitors need to answer "is it open, is it close, can I walk in" in seconds; absence of this is the single biggest source of lost/frustrated foot traffic for a physical food stall | LOW–MEDIUM | Currently blocked on confirmed hours (PROJECT.md flags divergent 2.5–4.8-year-old sources) — must ship with an explicit "horário provisório" label until the client confirms, never silently publish stale hours |
| Mobile-first responsive layout | PROJECT.md states the audience is "majoritariamente acessando via celular"; this is not optional polish, it is the primary rendering target | MEDIUM (foundational — touches every component) | Design and build mobile-first, not "desktop then adapt down" |
| Hero section communicating brand identity + core value prop ("Mais que um pão de alho!") in seconds | First 3 seconds decide bounce vs. scroll on a food site; visitors need to instantly get "what is this place" before committing attention | LOW–MEDIUM | Needs strong art direction (logo, palette, tone) more than engineering complexity |
| Fast load / good Core Web Vitals | Mobile users on variable connections abandon slow sites before the menu even renders; this is also an explicit project requirement (Lighthouse ≥ 90, LCP ≤ 2.5s) | MEDIUM | Directly threatened by unoptimized food photography — image pipeline (responsive sizes, modern formats, lazy-load) is load-bearing here |
| Social proof / social links (Instagram) | Visitors cross-reference Instagram for recent photos, stories, and vibe-check before deciding; absence looks evasive for a brand that already has an active account (@itsgarlicrecife) | LOW | Simple link/icon; do not fabricate follower counts or reviews (explicit constraint) |
| Basic on-page SEO (title, meta description, structured data for LocalBusiness/Restaurant, local keywords) | "Pão de alho Recife" / "Mercado da Torre" type searches are a real discovery channel with zero ad spend; competing generic delivery-app listings otherwise win by default | LOW–MEDIUM | This is explicitly a project requirement (SEO local); pairs with NAP consistency once Google Business Profile status is confirmed (currently a pendência) |
| Search/filter within the menu (by category, by product name) | Once a menu has 10 categories and dozens of items, users expect to jump straight to "espetinhos" or search "pão de alho" rather than scroll everything | LOW–MEDIUM | Explicit project requirement; can be a simple client-side filter over the static menu data — no server/search-index needed at this scale |

### Differentiators (Competitive Advantage)

Features that set It's Garlic apart from both generic templated "cardápio digital" vendors (Cardápio Inteligente, Nossomenu, Neryx-style products found in market research) and from other informal-food Instagram-only competitors in Recife. These should align tightly with "Mais que um pão de alho" and the brand's playful, urban identity.

| Feature | Value Proposition | Complexity | Notes |
|---------|-------------------|------------|-------|
| Time-of-day adaptive CTA/journey priority (lunch-mode vs. happy-hour-mode changes which section/CTA leads) | Reflects real consumption patterns — a visitor at 12:30pm wants "almoço," one at 6pm wants "happy hour"; generic template sites show a static homepage regardless of hour, wasting the moment of highest intent | MEDIUM | Requires confirmed business hours + a simple time-window rule (client-side, based on device local time is acceptable for a showcase site — no need for a backend clock); ship with provisional/clearly-labeled hours if not yet confirmed |
| Strong illustrated brand identity carried through the whole site (garlic mascot, hand-lettered "Happy Hour" script, line-art illustrations, dark carvão/roxo palette) | This is the actual moat — the brand already has a distinctive, screenshot-worthy Instagram-story aesthetic; a site that looks like every other "cardápio digital" template throws that away | MEDIUM (design-heavy, not engineering-heavy) | Directly sourced from real brand materials already collected (`img/`, `docs/brand-guidelines.md`, design tokens) — this is asset/design work more than novel feature-building |
| Configurable promotions rules (combo do dia, happy hour, day-of-week specials) driven by structured data, not hardcoded copy | Lets the "promotions feel current" without a CMS — a data file the client (or dev) edits produces different homepage state per day/hour; most competitor template sites either don't do this or require a paid CMS seat | MEDIUM–HIGH | This is the most architecturally interesting piece of the whole site: a small rules engine over a data file (day-of-week + time-window + category), still fully static-rendered |
| Dedicated "almoço" showcase reflecting real variety (saladas, parmegiana, picadinho, "monte o seu prato") rather than one generic menu row | Lunch is a distinct occasion from the garlic-bread/happy-hour identity; treating it as a first-class section (not just another category chip) matches how the client actually described the offering | LOW–MEDIUM | Mostly a content/layout decision — visually distinguish this section rather than build new mechanics |
| Per-item WhatsApp deep-link with pre-filled message (e.g., tapping "Perguntar" on a product opens WhatsApp with that product's name pre-typed) | Removes the friction of "which item did you mean" in manual WhatsApp ordering; small touch that reads as thoughtful, costs almost nothing to build | LOW | `wa.me` URL-encodes the `text` param; purely client-side, no backend needed |
| Local SEO tuned specifically to "pão de alho," "Mercado da Torre," and Recife neighborhood queries, with Restaurant/Menu schema.org markup | Most local competitors under-invest in SEO, relying entirely on Instagram/iFood discovery; a well-structured, fast, schema-marked site is a real edge for organic + Maps visibility at zero ongoing cost | MEDIUM | Depends on confirmed NAP and Google Business Profile existence (currently a pendência) — can ship with what's confirmed and backfill schema once GBP is resolved |

### Anti-Features (Commonly Requested, Often Problematic)

Features that look obviously good for "a restaurant website" in general, but are wrong for this specific project given its explicit no-backend, marketplace-funnel, static-MVP constraints.

| Feature | Why Requested | Why Problematic | Alternative |
|---------|---------------|------------------|-------------|
| In-house cart / checkout / online payment | "Every food delivery site has an order button that actually orders" | Explicitly out of scope; duplicates what iFood already does well (payment, logistics, dispute handling), massively increases attack surface (PCI-adjacent concerns, payment secrets) for a static-site project that deliberately has no backend | Keep the single funnel: iFood for transaction, WhatsApp for human-assisted edge cases |
| Login / customer accounts / order history / loyalty program | "Repeat customers expect to save favorites or earn points" | Requires auth, a database, and session management — directly contradicts the MVP constraint (no login, no DB, no admin panel) and multiplies the threat model (SEC-01–17 was scoped assuming no auth) | If loyalty is ever wanted, run it inside iFood's own loyalty tools or a WhatsApp-based manual program, not the marketing site |
| Real-time inventory / "sold out" badges synced live from the kitchen | "Users get frustrated ordering something unavailable" | No backend exists to source live stock from; a manually-maintained sold-out flag risks going stale and misleading someone standing in the food hall — worse than no flag at all. This is explicitly listed as an undecided pendência in PROJECT.md, not a confirmed feature | Let iFood's own app (which iFood can update live) be the source of truth for real-time availability; the marketing site describes the general menu, not live stock |
| Table reservation system | "Restaurants site have reservation forms" | It's Garlic is a counter-service/food-hall style operation (balcão, delivery, take away per PROJECT.md), not a reservations-driven sit-down restaurant; building a booking flow solves a problem the business doesn't have | If reservations are ever needed for events, route through WhatsApp like everything else |
| AI chatbot for automated WhatsApp ordering | "Automate the WhatsApp channel so staff doesn't have to answer manually" | Explicitly deferred to v2 in PROJECT.md, conditioned on a new threat-model review before implementation — building it now would violate the project's own security governance and introduce a whole new backend/LLM attack surface prematurely | MVP WhatsApp stays human-answered; revisit only after a dedicated v2 threat-model pass |
| Embedding a third-party "digital cardápio" widget (e.g., the kind iFood itself used to offer) | "Why build a menu UI when a plug-and-play widget exists" | Research found iFood discontinued its own embeddable digital-menu product around April 2024 — betting the menu UI on a third-party embed is a fragile, deprecatable dependency; it also conflicts with the project's "architecture ready for a future backend, no rewrite" goal, since an embed can't be gradually evolved | Build the menu natively from the project's own structured data, matching brand identity exactly and staying fully under the team's control |
| Full CMS / admin panel for self-service menu editing at MVP | "Non-technical staff should be able to update prices without a developer" | Explicitly out of scope for MVP (no CMS, no DB, no login); adding one now reintroduces the auth/DB/attack-surface problem the MVP was designed to avoid, before the actual update-cadence need (currently an open pendência: "quem atualiza o cardápio pós-lançamento") is even established | Ship data-driven static files (JSON/TS) that a developer edits and redeploys; revisit a lightweight CMS only if update frequency in practice proves painful |
| Analytics / conversion-event tracking | "You can't improve what you don't measure" | Explicit, deliberate decision already made in PROJECT.md: no analytics in v1, aligned with a minimal-data-collection security posture | If measurement becomes a priority later, treat it as a scoped addition with its own privacy/consent review, not a default inclusion |
| Building a proprietary delivery/logistics layer | "Full control over the ordering experience" | iFood already solves delivery logistics, driver dispatch, and payment at a scale and reliability this project cannot match; duplicating it is pure wasted effort for a brand whose stated goal is showcasing identity, not becoming a delivery operator | Stay a vitrine; invest saved effort into brand identity, photography, and copy quality instead |

## Feature Dependencies

```
Category taxonomy (10 official categories, data model)
    └──requires──> nothing (fixed input from client)
    └──enables───> Category-organized menu
                       └──enables───> Search/filter within menu
                       └──enables───> Product cards rendering

Confirmed business hours (currently BLOCKED — pendência)
    └──requires──> Location & hours section (final, non-provisional version)
    └──requires──> Time-of-day adaptive CTA/journey priority (real logic)
    └──requires──> Local SEO NAP consistency / schema.org markup (trustworthy version)

Confirmed iFood store link
    └──requires──> Primary order CTA (correct target — SEC-critical, #1 threat-model asset)

Promotions data model (day-of-week + time-window rules)
    └──requires──> Confirmed business hours (to avoid contradictory happy-hour windows)
    └──enables───> Promotions/happy-hour section
    └──enables───> Time-of-day adaptive CTA/journey priority

Product cards (photo, name, description, price)
    └──requires──> Real product photos (client-supplied, not stock)
    └──enhances─> Hero section (can feature "destaques"/highlighted items)

WhatsApp per-item pre-filled deep-link
    └──requires──> Product cards (needs product name/id to build the message)
    └──enhances─> WhatsApp contact/order CTA (adds specificity, not required for it to work)

Google Business Profile existence (currently a pendência — unknown)
    └──enables───> Full local SEO / NAP schema.org strategy
    └──conflicts──> Publishing schema.org NAP data before GBP status is confirmed (risk of inconsistency, which actively hurts local SEO ranking)

CMS/admin panel (anti-feature at MVP)
    └──conflicts──> "No login, no DB, no admin panel" MVP constraint
```

### Dependency Notes

- **Category-organized menu requires the category taxonomy first:** the 10 categories are already fixed by the client, so this is a data-modeling task, not a design-exploration one — get the data shape right early since search/filter and product cards both build on it.
- **Time-of-day adaptive CTA priority requires confirmed business hours:** shipping this logic against the stale/divergent hours currently on file (2.5–4.8 years old, per PROJECT.md) risks showing "happy hour is live" when it isn't. Ship with a provisional, clearly-labeled placeholder if hours remain unconfirmed at launch, and treat the real adaptive logic as a fast-follow once the client confirms hours.
- **Primary order CTA requires the confirmed iFood store link, not an assumed one:** this is the single highest-stakes dependency in the whole feature set per the project's own threat model (link integrity to iFood/WhatsApp/Instagram/Maps is the top asset at risk). Never hardcode a guessed or copy-pasted-from-memory iFood URL — verify against the live, current merchant page before each deploy that touches it.
- **Local SEO / schema.org NAP data conflicts with an unconfirmed Google Business Profile:** publishing structured NAP data that later needs correcting (once GBP is confirmed) creates exactly the kind of inconsistency that damages local search ranking. Safer to ship a minimal, verifiably-correct version now (address and phone the client has already confirmed) and layer in richer schema once GBP status is resolved.
- **CMS/admin panel conflicts with the MVP's explicit no-backend constraint:** flagging this so it isn't accidentally reintroduced mid-build in the name of "just a small admin form" — any login/DB/CMS addition requires a new threat-model pass per PROJECT.md's own governance (SEC-17).

## MVP Definition

### Launch With (v1)

Minimum viable product — mirrors the Active requirements already validated in PROJECT.md; nothing here is aspirational.

- [ ] Hero with strong brand identity, "Mais que um pão de alho!" concept, and 3 CTAs (Ver cardápio / Pedir no iFood / Como chegar) — the first-impression job
- [ ] Full digital menu across the 10 official categories — the actual product catalog
- [ ] Dedicated almoço section reflecting real variety (saladas, parmegiana, picadinho, monte o seu prato) — distinct occasion, distinct treatment
- [ ] Promotions area with configurable time/day rules (combo do dia, happy hour, day-of-week specials) — the merchandising differentiator
- [ ] Product cards (photo, name, description, category, editable price, optional highlight) — the menu's atomic unit
- [ ] Location & atendimento section (address, map, modalidades, hours, social/review links) — marked provisional if hours unconfirmed at launch
- [ ] iFood + WhatsApp CTAs side-by-side, with journey priority varying by time of day — the core conversion mechanism
- [ ] Category filter + product search in the menu — required for usability once the catalog is fully populated
- [ ] Security baseline (SEC-01–17), performance baseline (Lighthouse ≥ 90, Core Web Vitals), and local SEO baseline — non-negotiable project constraints, not optional polish

### Add After Validation (v1.x)

Features to add once the core is live and real usage/feedback exists.

- [ ] Real time-of-day adaptive CTA logic (once business hours are confirmed by the client) — trigger: hours pendência resolved
- [ ] Fuller local SEO / schema.org markup (once Google Business Profile status is known) — trigger: GBP pendência resolved
- [ ] Per-item WhatsApp pre-filled deep-links on product cards — trigger: after core menu ships and there's bandwidth for the polish pass
- [ ] Refined promotions rule granularity (e.g., more nuanced day-of-week combos) — trigger: owner feedback that current rules feel too coarse

### Future Consideration (v2+)

Features to defer until the business's actual operating cadence and constraints (menu update ownership, backend appetite) are established.

- [ ] AI chatbot for WhatsApp ordering — defer: explicitly requires a new threat-model review and backend before implementation (PROJECT.md constraint)
- [ ] Lightweight CMS/admin for self-service menu edits — defer: only justified once the "who updates the menu post-launch" pendência surfaces real pain from developer-mediated updates
- [ ] Sold-out / live availability marking — defer: undecided pendência; revisit once it's clear whether iFood alone can be trusted as the single source of stock truth
- [ ] Multi-location support — defer: single physical location today, no signal this is imminent

## Feature Prioritization Matrix

| Feature | User Value | Implementation Cost | Priority |
|---------|------------|----------------------|----------|
| Category-organized menu + product cards | HIGH | MEDIUM | P1 |
| iFood + WhatsApp CTAs (correct, prominent) | HIGH | LOW | P1 |
| Hero with brand identity + CTAs | HIGH | MEDIUM | P1 |
| Location & hours section | HIGH | LOW | P1 |
| Category filter + search | MEDIUM | LOW | P1 |
| Promotions area (combo do dia, happy hour rules) | HIGH | MEDIUM–HIGH | P1 |
| Almoço showcase section | MEDIUM | LOW | P1 |
| Security/performance/SEO baseline | HIGH (non-negotiable) | MEDIUM | P1 |
| Time-of-day adaptive CTA priority (full version) | MEDIUM–HIGH | MEDIUM | P2 (P1 with placeholder logic, P2 for the real version pending confirmed hours) |
| Per-item WhatsApp pre-filled deep-links | LOW–MEDIUM | LOW | P2 |
| Rich local SEO / schema.org (full NAP) | MEDIUM | MEDIUM | P2 (pending GBP confirmation) |
| CMS/admin panel | LOW at this stage | HIGH | P3 (anti-feature until proven necessary) |
| Sold-out live marking | LOW at this stage (unresolved need) | HIGH (no data source without backend) | P3 |
| AI WhatsApp ordering bot | Unproven | HIGH | P3 (v2, gated on new threat model) |

**Priority key:**
- P1: Must have for launch
- P2: Should have, add when possible (often blocked on external confirmation, not effort)
- P3: Nice to have, future consideration — several of these are anti-features at this stage, not just "later"

## Competitor Feature Analysis

Direct audits of specific named Recife competitors were not performed in this research pass (see Gaps below); findings instead reflect the general pattern set observed across Brazilian "cardápio digital" website vendors and restaurant-website best-practice sources.

| Feature | Generic "cardápio digital" template vendors (e.g., Cardápio Inteligente, Nossomenu, Neryx-style products) | Generic international restaurant-site guidance | Our Approach |
|---------|---|---|---|
| Menu categorization | Standard, often with a paid-tier CMS to edit categories/prices live | Standard, usually paired with an in-house online-ordering module | Standard, but data-driven static files instead of a paid CMS — fits the no-backend MVP constraint |
| Online ordering | Frequently push their own checkout/ordering module as the differentiator (their business model) | Strongly recommended as "must have," assuming the business wants to own the transaction | Deliberately NOT built — iFood is the transaction layer by design; this is the single biggest divergence from generic guidance |
| Promotions/happy hour | Usually just another menu category, rarely time/day-aware | Rarely addressed with real scheduling logic | Time/day-aware promotions rules — genuine differentiator vs. both reference sets |
| Brand identity/design | Often templated, generic look shared across many restaurant clients | Emphasizes photography and typography but within a generic template mindset | Custom-built from real brand assets (logo, palette, illustration style) — avoids the "looks like every other cardápio digital site" problem |
| WhatsApp integration | Sometimes offered as a "share menu via WhatsApp" bolt-on | Increasingly recommended, especially in markets without unified delivery platforms | Native click-to-chat with pre-filled messages, positioned as a first-class second channel alongside iFood, not an afterthought |

## Sources

- General restaurant-website and digital-menu design guidance (menu design, layout, mobile optimization, SEO page structure) — cross-referenced across multiple vendor/industry sources (FedEx Office, MarketMan, Lightspeed, WAND Digital, RestaurantTimes); MEDIUM confidence (cross-verified pattern, generic web sources)
- Direct-ordering vs. third-party marketplace CTA placement guidance (Owner.com, SpotOn, Restaurant Business Online) — MEDIUM confidence; note this guidance generally assumes the business *wants* to own the checkout, which is the inverse of this project's model, so it was read for CTA-placement patterns only, not adopted wholesale
- WhatsApp click-to-chat / `wa.me` pre-filled message mechanics (Freshworks/Freshchat blog, WhatsForm, U2L AI blog, Ressto) — MEDIUM confidence; re-verify exact URL-encoding behavior against Meta's official WhatsApp Business documentation before implementation
- iFood merchant link format and social "pedir comida" button, and the April 2024 discontinuation of iFood's own embeddable digital-menu product (institucional.ifood.com.br, blog-parceiros.ifood.com.br, Saipos, TI Inside) — LOW–MEDIUM confidence; the exact current link format should be confirmed directly from the live iFood para Parceiros app for this specific merchant rather than assumed from these secondary sources
- Menu search/filter UX patterns for mobile (NNGroup, UXPin, Restolabs, UX Collective) — MEDIUM confidence, general UX-pattern literature
- Google Business Profile / local SEO / NAP consistency guidance (ChowNow, DoorDash Merchants, Malou) — MEDIUM confidence, general local-SEO literature; specific applicability depends on resolving the open pendência of whether It's Garlic has a Google Business Profile
- Brazilian "site institucional para restaurante" market scan (Techd, Neryx, Cardápio Inteligente, Nossomenu) — MEDIUM confidence, used to characterize the competitive/template landscape rather than as authoritative how-to guidance
- `.planning/PROJECT.md` (this project) — HIGH confidence, primary source for all project-specific constraints, requirements, and pendências referenced throughout

## Gaps / Open Questions for Later Research

- No direct competitive audit of specific named Recife food-hall or pão-de-alho competitors was performed — if a differentiation review becomes important, a follow-up pass should visit actual competitor Instagram/iFood/website presences rather than relying on generic vendor-market patterns.
- iFood's exact current merchant-link format and whether a Recife-specific store slug/code is already known should be confirmed directly against the live iFood para Parceiros account before the Primary Order CTA is implemented (SEC-critical dependency).
- WhatsApp Business API/`wa.me` link encoding rules (character limits, emoji handling, line breaks in pre-filled text) should be verified against Meta's current official documentation at implementation time, not assumed from secondary blog sources.
- Business hours and Google Business Profile existence remain open pendências in PROJECT.md that block the "final" versions of two P2 features (adaptive CTA logic, full local SEO); both are documented as dependencies above rather than treated as resolved.

---
*Feature research for: Restaurant / digital-menu marketing site (marketplace-order-funnel model) — It's Garlic, Recife*
*Researched: 2026-09-12*

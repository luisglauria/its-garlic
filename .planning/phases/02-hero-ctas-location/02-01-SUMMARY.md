---
phase: 02-hero-ctas-location
plan: 01
subsystem: ui
tags: [nextjs, react-server-components, next-image, tailwind-v4, vitest, accessibility]

requires:
  - phase: 01-foundation-architecture-brand-identity-security-baseline
    provides: >
      getStoreInfo()/build*Url() seams, IntegrationLink { url, confirmed, pendingConfirmation }
      contract, design-tokens.css, ARQ-02 ESLint data-import boundary, Header.tsx/Footer.tsx
      precedent, layout.test.ts static-source-inspection test convention
provides:
  - "src/content/home-copy.ts — heroCopy/ctaCopy/provisionalBadgeLabel typed final copy"
  - "public/brand/hero-illustration.svg — provisional illustrated hero composition (square viewBox)"
  - "src/components/home/{Hero,ProvisionalBadge,OrderCta,CtaGroup}.tsx — the above-the-fold slice"
  - "OrderCta/PendingCta shared CTA primitive — confirmed/disabled gate, D-06 parity"
  - "src/components/home/{OrderCta,home}.test.ts — rendered-output + structural guard suites"
  - "src/app/page.tsx rewritten to compose Hero + CtaGroup"
affects: [02-02-location, 02-03-brand-story-faq, phase-03-cardapio]

actuals:
  tokens: 8935
  tasks: 3
  commits: 4
  plan_head_before: 2a9904b5ee264667df7bddf3626bf6d8f05a38e7

tech-stack:
  added: []
  patterns:
    - "renderToStaticMarkup(createElement(...)) from react-dom/server for fixture-prop tests over Server Components in the node test environment — no jsdom/RTL added"
    - "OrderCta/PendingCta shared primitive: one component both confirmed and pending CTAs render through, so D-06 visual parity is structural, not copy-paste"
    - "Directory-sweep guard test (readdirSync over src/components/home/) so a later-added section is covered by home.test.ts the day it lands, with no hardcoded filename list"

key-files:
  created:
    - src/content/home-copy.ts
    - public/brand/hero-illustration.svg
    - src/components/home/ProvisionalBadge.tsx
    - src/components/home/Hero.tsx
    - src/components/home/OrderCta.tsx
    - src/components/home/OrderCta.test.ts
    - src/components/home/CtaGroup.tsx
    - src/components/home/home.test.ts
  modified:
    - src/app/page.tsx
    - next.config.ts

key-decisions:
  - "heroCopy.headline = \"O pão de alho é só o começo.\" — restates only PROJECT.md-confirmed facts, fits the 360px two-line rule"
  - "provisionalBadgeLabel (\"Provisório\") kept separate from heroCopy.imageDisclosure (\"Imagem ilustrativa — foto real em breve\") — the badge is a short reusable marker (also used by plan 02-02's hours notice), the disclosure is the hero-specific explanation rendered as its own adjacent line"
  - "ctaCopy.whatsappLabel = \"Chamar no WhatsApp\"; pendingSuffix = \"(em breve)\"; ifoodUnavailableNotice uses UI-SPEC's suggested Copywriting Contract wording verbatim"
  - "OrderCta/PendingCta signature extended with an optional describedBy?: string prop beyond the plan's locked artifact table — needed to associate the coral unavailability notice with the pending iFood button (aria-describedby) per the task's own <action> text; additive/optional, does not break the documented { link, label, tier } shape"
  - "Task 2's page.tsx rewrite removed the walking-skeleton's store-name/address block entirely (not just the CTA ternary) — Location (LOCAL-01..04) is plan 02-02's scope, and getStoreInfo() had no remaining caller once the CTA ternary was replaced by CtaGroup"
  - "home.test.ts's fixed-pixel guard strips next/image's sizes=\"...\" attribute value before matching — a (max-width: 640px)-style media condition is the correct responsive breakpoint pattern this same suite requires, not a PERF-03 violation, and was a false positive against the raw regex"

requirements-completed: [HERO-01, HERO-02, HERO-03, INTEGRA-01, INTEGRA-02, INTEGRA-03, INTEGRA-05]

coverage:
  - id: D1
    description: "Brand concept line + headline render as real document text on the brand's dark surface, referencing design tokens only"
    requirement: "HERO-01"
    verification:
      - kind: unit
        ref: "src/components/home/home.test.ts#Hero (HERO-01, HERO-03)"
        status: pass
      - kind: manual_procedural
        ref: "375x667/390x844 mobile viewport brand-fidelity + two-line-fit check (deferred to phase-end per human_verify_mode: end-of-phase)"
        status: unknown
    human_judgment: true
    rationale: "Brand fidelity and the two-line mobile-fit rule are visual judgments no automated check in this project's DOM-less test stack can make — human_verify_mode is end-of-phase, so this check is deferred to the phase's end-of-phase UAT pass, not skipped."
  - id: D2
    description: "Three locked CTA labels (Ver cardápio / Pedir no iFood / Como chegar) appear verbatim in one row below the hero"
    requirement: "HERO-02"
    verification:
      - kind: unit
        ref: "src/components/home/home.test.ts#CTA labels (HERO-02)"
        status: pass
      - kind: integration
        ref: "src/components/home/OrderCta.test.ts#CtaGroup — real builder results"
        status: pass
    human_judgment: false
  - id: D3
    description: "Hero image slot is a fixed 1:1 next/image container pointing at the provisional illustrated asset, with a visible provisional disclosure"
    requirement: "HERO-03"
    verification:
      - kind: unit
        ref: "src/components/home/home.test.ts#Hero (HERO-01, HERO-03)"
        status: pass
      - kind: manual_procedural
        ref: "mobile-viewport check: illustration reads as It's Garlic, disclosure legible, no CLS jump (deferred, end-of-phase)"
        status: unknown
    human_judgment: true
    rationale: "\"Would a reader mistake this for a photo\" and CLS-on-load are visual judgments; deferred to end-of-phase per human_verify_mode."
  - id: D4
    description: "Pedir no iFood is the visually primary CTA and reachable without scrolling on mobile"
    requirement: "INTEGRA-01"
    verification:
      - kind: unit
        ref: "src/components/home/OrderCta.test.ts#OrderCta — confirmed branch / unconfirmed branch"
        status: pass
      - kind: manual_procedural
        ref: "02-VALIDATION.md Manual-Only table: mobile-fold visibility at ~375x667/390x844 (deferred, end-of-phase)"
        status: unknown
    human_judgment: true
    rationale: "Viewport-relative fold visibility cannot be measured by this project's DOM-less static-source-inspection test stack — explicitly recorded as manual-only in 02-VALIDATION.md."
  - id: D5
    description: "WhatsApp CTA renders beside iFood with identical visual weight and identical pending treatment"
    requirement: "INTEGRA-02"
    verification:
      - kind: unit
        ref: "src/components/home/home.test.ts#the confirmed gate (INTEGRA-01, INTEGRA-02, INTEGRA-03)"
        status: pass
      - kind: integration
        ref: "src/components/home/OrderCta.test.ts#PendingCta"
        status: pass
    human_judgment: false
  - id: D6
    description: "Both order CTAs render as disabled buttons labelled (em breve) while unconfirmed; coral notice explains without swapping the primary CTA"
    requirement: "INTEGRA-03"
    verification:
      - kind: integration
        ref: "src/components/home/OrderCta.test.ts#OrderCta — unconfirmed branch / CR-01 regression guard / CtaGroup — real builder results"
        status: pass
      - kind: integration
        ref: "prerendered-HTML assertion (02-01-PLAN.md Task 2 verify) — no ifood.com.br/wa.me/sentinel leak, no aria-disabled"
        status: pass
    human_judgment: false
  - id: D7
    description: "No home/ component or page offers an on-site ordering path — no form, no cart/checkout affordance"
    requirement: "INTEGRA-05"
    verification:
      - kind: unit
        ref: "src/components/home/home.test.ts#no on-site ordering (INTEGRA-05)"
        status: pass
    human_judgment: false

duration: ~20min
completed: 2026-09-13
status: complete
---

# Phase 2 Plan 1: Hero, CTAs & Location — Hero tracer + CTA row Summary

**Above-the-fold homepage slice: brand concept as real text on a CLS-safe illustrated hero, plus a gated CTA row where the two unconfirmed order destinations (iFood, WhatsApp) render as honest disabled buttons instead of live links to a placeholder URL.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-09-13
- **Tasks:** 3/3 completed
- **Files modified:** 10 (8 created, 2 modified)

## Accomplishments

- Hero section renders the locked concept line "Mais que um pão de alho!" and a fact-only headline as real document text (h1) on the brand's deep surface, with a CLS-safe 1:1 `next/image` slot pointing at a hand-authored provisional illustration — a file-replacement-only swap once the client supplies real product photography.
- CTA row renders all three locked labels (HERO-02) through a shared `OrderCta`/`PendingCta` primitive: iFood and WhatsApp render as native disabled buttons with a coral unavailability notice while `confirmed: false`, "Ver cardápio" renders inert pending Phase 3's route (assumption A-01), and "Como chegar" is a live, confirmed Google Maps anchor.
- Proved the whole chain end-to-end on one thin path (this phase's tracer): typed copy module → section component → page composition → prerendered static HTML → the Phase 1 repository/integration seams.
- Extended the project's test conventions with a working `renderToStaticMarkup` fixture-prop pattern for Server Components (no jsdom/RTL added) and a directory-sweep structural guard suite (`home.test.ts`) that will cover files added by plans 02-02/02-03 without a hardcoded filename list.

## Task Commits

Each task was committed atomically:

1. **Task 1: Tracer — the brand concept and its illustrated hero slot reach the rendered homepage** - `ae2a2c9` (feat)
2. **Task 2: The CTA row — gated order buttons, the live directions link, and the unavailability notice**
   - `1cda54b` (test — RED: OrderCta/CtaGroup rendered-output tests, watched failing before the components existed)
   - `f0e3e39` (feat — GREEN: ctaCopy, OrderCta/PendingCta, CtaGroup, page.tsx rewrite; no REFACTOR commit needed)
3. **Task 3: The structural guard suite over the above-the-fold slice** - `9699888` (test)

**Plan metadata:** _(recorded by the final docs commit, hash captured after this summary is written)_

_Note: Task 2 is TDD (`tdd="true"`) — two commits (test → feat) per the project's established commit-scope contract (see STATE.md's note on Phase 01 plan 03's identical pattern); no refactor step was needed._

## Files Created/Modified

- `src/content/home-copy.ts` - `HeroCopy`/`CtaCopy` interfaces, `heroCopy`/`ctaCopy`/`provisionalBadgeLabel` final Portuguese copy
- `public/brand/hero-illustration.svg` - hand-authored provisional hero illustration, square `viewBox="0 0 400 400"`, reuses `logo-icone.svg`'s garlic path
- `src/components/home/ProvisionalBadge.tsx` - `ProvisionalBadge({ label = provisionalBadgeLabel })` — olive text, own deep-surface background
- `src/components/home/Hero.tsx` - `Hero()` — kicker/headline/subhead as text + `next/image` `fill`/`aspect-square`/`sizes`/`preload` slot
- `src/components/home/OrderCta.tsx` - `OrderCta({ link, label, tier, describedBy })` / `PendingCta({ label, tier, describedBy })` — confirmed/disabled gate
- `src/components/home/OrderCta.test.ts` - 13 rendered-output tests over both branches + CtaGroup with real builder results
- `src/components/home/CtaGroup.tsx` - `CtaGroup({ ifood, whatsapp, maps })` — the CTA row, HERO-02 + INTEGRA-01/02/03
- `src/components/home/home.test.ts` - 26 structural guard tests, directory-swept over `src/components/home/` + `src/app/page.tsx`
- `src/app/page.tsx` - rewritten to compose `<Hero /><CtaGroup ifood={} whatsapp={} maps={} />`, calling all three `build*Url()` once each
- `next.config.ts` - added `images: { formats: ["image/avif", "image/webp"] }`, security headers untouched

## Decisions Made

See `key-decisions` in frontmatter for the full list. Two are load-bearing for downstream plans:

- **`OrderCta`/`PendingCta` shipped signature:** `OrderCta({ link: IntegrationLink; label: string; tier?: "primary" | "secondary"; describedBy?: string })` and `PendingCta({ label: string; tier?: "primary" | "secondary"; describedBy?: string })` — the plan's artifact table locked `{ link, label, tier }`/`{ label, tier }`; `describedBy` was added as an additive optional prop (Rule 2: the task's own `<action>` text required associating the coral notice with the pending iFood button via `aria-describedby`, which the locked signature had no slot for).
- **Pending suffix / unavailability notice wording (reused by plan 02-02's hours notice, per the plan's `<output>` spec):**
  - `pendingSuffix`: `"(em breve)"`
  - `ifoodUnavailableNotice`: `"Pedido pelo iFood chegando em breve — enquanto isso, dá uma olhada em como chegar até a loja."`
  - `provisionalBadgeLabel` (the shared badge default): `"Provisório"`
  - Hero asset `viewBox`: `"0 0 400 400"` (square, matches `logo-icone.svg`'s square-viewBox convention)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Duplicate `<h1>` after adding Hero to the walking-skeleton page**
- **Found during:** Task 1
- **Issue:** The plan's Task 1 instructed leaving the Phase 1 walking-skeleton CTA block (which rendered `store.name` as an `<h1>`) below the new `Hero` (which also renders an `<h1>`) — two level-one headings would have violated the plan's own acceptance criterion ("the prerendered HTML contains ... one level-one heading").
- **Fix:** Demoted the walking-skeleton's store-name heading from `<h1>` to `<h2>`; it was fully removed in Task 2 anyway.
- **Files modified:** `src/app/page.tsx`
- **Verification:** `node -e ...` prerendered-HTML check (`/<h1[ >]/.test(html)` + single-`<h1>` intent) passed; `npm run build` exits 0.
- **Committed in:** `ae2a2c9` (part of Task 1 commit)

**2. [Rule 1 - Bug] Fixed-pixel guard false-positive on `next/image`'s `sizes` attribute**
- **Found during:** Task 3
- **Issue:** `home.test.ts`'s PERF-03 fixed-pixel regex (copied from `layout.test.ts`) matched the *correct* responsive `sizes="(max-width: 640px) 90vw, 400px"` media-condition string on `Hero.tsx`, because the substring `"width: 640px"` happens to match the same regex meant to catch a fixed CSS/Tailwind pixel dimension.
- **Fix:** Strip the `sizes="..."` attribute's own value before running the fixed-pixel guard in that one describe block, with a comment explaining why (a `sizes` breakpoint is the correct mobile-first pattern this same suite requires elsewhere, not a violation).
- **Files modified:** `src/components/home/home.test.ts`
- **Verification:** `npx vitest run src/components/home/home.test.ts` — 26/26 passed.
- **Committed in:** `9699888` (part of Task 3 commit)

**3. [Rule 1 - Bug] `react-dom/server`'s HTML-entity-escaping broke a raw-URL string match**
- **Found during:** Task 2 (GREEN step)
- **Issue:** `OrderCta.test.ts`'s "renders the confirmed directions url" assertion compared the rendered markup against the raw Maps URL (containing an unescaped `&`), but `renderToStaticMarkup` correctly HTML-entity-escapes `&` to `&amp;` inside attribute values — a test bug, not a component bug.
- **Fix:** Compare against `url.replace(/&/g, "&amp;")` instead, with a comment explaining the escaping is expected/correct.
- **Files modified:** `src/components/home/OrderCta.test.ts`
- **Verification:** `npx vitest run src/components/home/OrderCta.test.ts` — 13/13 passed.
- **Committed in:** `f0e3e39` (part of Task 2 GREEN commit)

**4. [Rule 1 - Bug] Verify-script literal-substring checks required un-escaping two of my own guard regexes**
- **Found during:** Task 3
- **Issue:** The plan's own Task 3 verify script checks for the literal substrings `"@/data"` and `"px]"` inside `home.test.ts`'s source text. My first draft wrote those guards as `/@\/data\//` and `[0-9]+px\]` (conventionally-escaped regex literals), whose raw source text contains `"@\/data\/"` and `"px\]"` — not the un-escaped substrings the verify script greps for.
- **Fix:** Changed the data-import guard to `.not.toContain("@/data")` (a plain string check, arguably clearer) and removed the unnecessary escape before `]` in the fixed-pixel regex (`[0-9]+px]` — functionally identical matching, since `]` outside a character class needs no escaping in JS regex.
- **Files modified:** `src/components/home/home.test.ts`
- **Verification:** Re-ran the plan's own Task 3 verify script — `guard suite covers every declared group`; `npx vitest run` still 26/26.
- **Committed in:** `9699888` (part of Task 3 commit)

---

**Total deviations:** 4 auto-fixed (all Rule 1 — bug fixes). **Impact on plan:** All four were necessary for correctness against the plan's own stated acceptance criteria and verify scripts; none expanded scope beyond what Tasks 1–3 already specified.

## Issues Encountered

None beyond the four auto-fixed items above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 02-02 (Location) can build `Location.tsx` reusing `ProvisionalBadge` (imported from `src/components/home/ProvisionalBadge`, default label `"Provisório"`) for the hours notice, and can reuse `pendingSuffix`/the notice wording shape from `ctaCopy` as vocabulary precedent, per the plan's own `<output>` instruction.
- Plan 02-03 (Brand Story, FAQ) composes into `src/app/page.tsx` alongside the existing `<Hero /><CtaGroup .../>` — the page's fragment shape (`<>...</>`) already accommodates additional sibling sections with no restructuring.
- Phase 3 flips `ctaCopy.menuLabel`'s `PendingCta` call site in `CtaGroup.tsx` to an `OrderCta`-style live anchor once the `/cardapio` route ships (assumption A-01) — a one-call-site change, no component API change.
- **Deferred to end-of-phase UAT** (per `human_verify_mode: end-of-phase`, not skipped): the 375×667/390×844 mobile-viewport checks for brand fidelity, the two-line headline/kicker fit, illustration CLS-safety, and the INTEGRA-01 mobile-fold visibility criterion — none of these are automatable by this project's DOM-less test stack (02-VALIDATION.md Manual-Only table).
- No blockers for plan 02-02 or 02-03.

---
*Phase: 02-hero-ctas-location*
*Completed: 2026-09-13*

## Self-Check: PASSED

All 8 created files and 4 task commits (`ae2a2c9`, `1cda54b`, `f0e3e39`, `9699888`) verified present.

---
phase: 02-hero-ctas-location
plan: 05
subsystem: ui
tags: [nextjs, tailwindcss-v4, grid-layout, accessibility, gap-closure, regression-guard]

# Dependency graph
requires:
  - phase: 02-hero-ctas-location
    provides: "02-04's restored Anton/Manrope + brand palette (real line counts, needed to measure the hero's vertical/horizontal budget accurately)"
provides:
  - "Both order CTAs (iFood, WhatsApp) rendering inside Hero, above the illustration, fitting two-up at 343px/358px of mobile content width"
  - "D-01a and an amended UI-SPEC hero focal-point statement authorising the new composition"
  - "hero-fold.test.ts — a persistent fold-contract guard covering co-visibility mechanics, not source adjacency"
affects: [02-06-section-separators]

actuals:
  tokens: 8715
  tasks: 3
  commits: 3
  plan_head_before: ca880d4ce9e2dd49f946e570fabcfe69e788556a

tech-stack:
  added: []
  patterns:
    - "CSS Grid two-column track (`grid-cols-2`, no responsive prefix) for CTA pairs that must sit side by side at the mobile base — replaces the flex-col/sm:flex-row pattern, which gates the row direction behind a breakpoint wider than the mobile target"
    - "Two-line button label (label + suffix as separate <span> children inside one <button>) to keep a control's accessible name intact while shrinking its rendered horizontal footprint"
    - "Fold-contract test measures co-visibility mechanics (index of a row's class string relative to the media block that pushed it below the fold) computed from the real exported class strings and design tokens, not a hardcoded pixel conclusion"

key-files:
  created:
    - src/components/home/OrderCtaRow.tsx
    - src/components/home/hero-fold.test.ts
  modified:
    - .planning/phases/02-hero-ctas-location/02-CONTEXT.md
    - .planning/phases/02-hero-ctas-location/02-UI-SPEC.md
    - src/components/home/OrderCta.tsx
    - src/components/home/Hero.tsx
    - src/components/home/CtaGroup.tsx
    - src/app/page.tsx
    - src/components/home/home.test.ts
    - src/components/home/OrderCta.test.ts

key-decisions:
  - "D-01a amends D-01: the order-CTA row moves inside Hero, between the subhead and the illustration, instead of a separate section after it — home's five-section order is otherwise unchanged"
  - "UI-SPEC hero focal-point paragraph amended: headline/subhead, order actions, illustration, disclosure — the illustration stays the primary visual anchor, only the stated ordering changes"
  - "TIER_CLASS moved from the Body (16px) to the Label (14px) type-size token and one spacing-scale step down on horizontal padding (px-6 -> px-4), bringing the two-button row's horizontal cost under 343px without shrinking below the UI-SPEC Typography table's own Label role"
  - "PendingCta renders the label and the '(em breve)' suffix as two lines inside one button (not one inline string) so the accessible name stays intact while the rendered width drops"
  - "hero-fold.test.ts strips everything before the rendered <section> (discarding the next/image preload <link>, which repeats the illustration's asset path outside the hero content) before running index comparisons — otherwise the resource hint's earlier occurrence of the same substring would falsely fail the ordering assertion"

patterns-established:
  - "Fold-contract regression guards must assert co-visibility mechanics (what precedes what, real computed widths), never source-order adjacency — the exact class of gap this plan closes (DEBUG-cta-row-stacked-below-fold.md `why_not_caught`)"

requirements-completed: [INTEGRA-01, INTEGRA-02, INTEGRA-03, HERO-02, PERF-03]

coverage:
  - id: D1
    description: "D-01a and the amended UI-SPEC hero focal-point statement authorise the order-CTA-row-inside-Hero composition the code change needs, with the original D-01 text preserved alongside the amendment"
    verification:
      - kind: other
        ref: "node -e ... (Task 1 automated verify — asserts D-01a/G-02-2 present in CONTEXT.md, original D-01 text intact, UI-SPEC no longer mandates CTAs below the illustration, aspect-ratio contract intact)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Both order CTAs render inside Hero, above the illustration, in a two-column grid with no responsive prefix, still natively disabled with coral notices attached"
    requirement: "INTEGRA-01"
    verification:
      - kind: unit
        ref: "src/components/home/OrderCta.test.ts > OrderCtaRow — real builder results (G-02-2) (3 tests)"
        status: pass
      - kind: unit
        ref: "src/components/home/home.test.ts > the confirmed gate (INTEGRA-01, INTEGRA-02, INTEGRA-03) (4 tests)"
        status: pass
      - kind: other
        ref: "node -e ... (Task 2 automated verify — order row precedes the illustration inside Hero, page.tsx never renders OrderCtaRow directly)"
        status: pass
    human_judgment: false
  - id: D3
    description: "A committed test (hero-fold.test.ts) fails if the order row ever moves back out of the hero, falls behind a media block, or is gated behind a breakpoint wider than the mobile target"
    verification:
      - kind: unit
        ref: "src/components/home/hero-fold.test.ts (5 tests: ordering, reaches-document-only-through-hero, no-breakpoint-gate, wrapping-allowed, two-buttons-fit-one-track-each)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Both order buttons are visible side by side without scrolling past the hero at 375x667 and 390x844, no overflow, still inert, with a visible focus ring — the actual paint, not just the arithmetic"
    requirement: "INTEGRA-01"
    verification: []
    human_judgment: true
    rationale: "Fold co-visibility and text overflow are viewport rendering facts; hero-fold.test.ts's horizontal-budget test proves the arithmetic (real padding/type-size/copy values fit each track with wide margin), not the paint. No browser is available to this executor. Human-check steps are reproduced verbatim below."

duration: ~20min
completed: 2026-09-14
status: complete
---

# Phase 02 Plan 05: Move the order CTAs inside the hero and fit them two-up at 375px Summary

**Both order CTAs (iFood, WhatsApp) now render inside Hero, above the illustration, as a two-column CSS Grid row that fits 343px/358px of mobile content width — replacing the sibling-section-after-a-full-width-illustration composition and the `sm:flex-row` breakpoint (640px) that jointly kept them below the fold, per D-01a's amendment and a new persistent `hero-fold.test.ts` guard.**

## Performance

- **Duration:** ~20 min
- **Completed:** 2026-09-14T02:25:49Z
- **Tasks:** 3/3
- **Files modified:** 10 (2 created, 8 modified)

## Accomplishments

- Amended `.planning/phases/02-hero-ctas-location/02-CONTEXT.md` (D-01a, beneath the original D-01, preserved verbatim) and `02-UI-SPEC.md` (hero focal-point paragraph + the pending/disabled CTA Copywriting Contract row) to authorise the composition the fix requires — the two governing documents no longer contradict INTEGRA-01's fold criterion.
- Created `src/components/home/OrderCtaRow.tsx`: owns both order CTAs and their coral unavailability notices, laid out as a `grid grid-cols-2` row with no responsive prefix (the previous `sm:flex-row` only applied at 640px, 250px wider than the wider of the two mobile targets). Exports `ORDER_ROW_CLASS` so the fold guard measures the real string.
- `OrderCta.tsx`: exported `TIER_CLASS`; moved the CTA label from the Body (16px) to the Label (14px) type-size token (UI-SPEC Typography table); reduced horizontal padding one spacing-scale step (`px-6` -> `px-4`); added `w-full` + `text-center` so a button fills its grid track and centres a wrapped label; kept the 44px touch-target floor, pill radius, and tier fills unchanged. `PendingCta` now renders the label and the "(em breve)" suffix as two lines inside one button (not one inline string), keeping the accessible name intact while shrinking the rendered width.
- `Hero.tsx` now accepts `ifood`/`whatsapp` props and composes `OrderCtaRow` between the subhead and the illustration; kicker, headline, subhead, illustration container and provisional disclosure are byte-for-byte unchanged from the layout UAT Test 1 already passed.
- `CtaGroup.tsx` reduced to the secondary ("Ver cardápio") and tertiary ("Como chegar") CTAs, now taking only the `maps` link.
- `src/app/page.tsx` passes the iFood/WhatsApp links to `Hero` and only the maps link to `CtaGroup`; never imports or renders `OrderCtaRow` directly, which is what makes the fold contract enforceable.
- Migrated the two pre-existing guards that pointed at the old location: `home.test.ts`'s CTA-label and D-06 parity tests, and `OrderCta.test.ts`'s `CtaGroup` describe block, split into `CtaGroup` (menu/maps only) and a new `OrderCtaRow` describe block (both order labels, both notice strings, both unconfirmed-host absence checks).
- Created `src/components/home/hero-fold.test.ts` — 5 tests asserting co-visibility mechanics (not source adjacency, the mistake that let this defect ship undetected): the order row precedes the illustration inside the rendered hero; the row reaches the document only through Hero; the row is a two-column grid with no breakpoint gate; no tier class suppresses wrapping; and a real, computed horizontal-fit budget (padding + type-size token resolved through `design-tokens.css`, real copy strings) at both 375px and 390px.

## Task Commits

Each task was committed atomically:

1. **Task 1: Amend the two governing documents that currently require the failing layout** - `baf0286` (docs)
2. **Task 2: Move the order row into the hero and make it fit two-up at 375px** - `eebb37a` (fix)
3. **Task 3: Commit the fold contract as a test, since no gate existed for this class** - `c6ed3d4` (test)

**Plan metadata:** _pending — see final commit below_

## Files Created/Modified

- `.planning/phases/02-hero-ctas-location/02-CONTEXT.md` - D-01a amendment added beneath D-01 (preserved), citing G-02-2 and the debug session
- `.planning/phases/02-hero-ctas-location/02-UI-SPEC.md` - Hero focal-point paragraph reordered (order actions before the illustration); pending/disabled CTA Copywriting row amended for the two-line rendering
- `src/components/home/OrderCtaRow.tsx` - New: both order CTAs + coral notices, two-column grid, `ORDER_ROW_CLASS` exported
- `src/components/home/OrderCta.tsx` - `TIER_CLASS` exported and resized (Label size, one padding step down, full width, centred, wrap-safe); `PendingCta` renders label + suffix as two lines
- `src/components/home/Hero.tsx` - Accepts `ifood`/`whatsapp` props, composes `OrderCtaRow` before the illustration
- `src/components/home/CtaGroup.tsx` - Reduced to secondary/tertiary CTAs, `maps`-only prop
- `src/app/page.tsx` - Passes order links to `Hero`, maps link to `CtaGroup`; never renders `OrderCtaRow` directly
- `src/components/home/home.test.ts` - CTA-label and D-06 parity tests migrated to the new component split
- `src/components/home/OrderCta.test.ts` - `CtaGroup` describe block split; new `OrderCtaRow` describe block added
- `src/components/home/hero-fold.test.ts` - New: 5-test persistent fold-contract guard

## Decisions Made

See `key-decisions` in frontmatter. Summarized: D-01a and the UI-SPEC amendment make the shipped layout the documented one; the Label-size + one-padding-step-down resize is what makes two 44px-tall buttons fit 343px without shrinking below the UI-SPEC's own Typography contract; the two-line pending-suffix rendering keeps D-05's accessible-name contract intact while cutting rendered width; and `hero-fold.test.ts` deliberately strips the next/image preload `<link>` (which duplicates the illustration asset-path substring outside the hero's own markup) before running its ordering assertions, to avoid a false failure against a resource hint rather than real DOM structure.

## Deviations from Plan

None - plan executed exactly as written. The `PendingCta` two-line change also affects the "Ver cardápio" secondary CTA in `CtaGroup.tsx` (it shares the `PendingCta` primitive) — this is the plan's own stated design (the tier class map and `PendingCta` are explicitly shared across both order and secondary CTAs, D-06's parity point), not an unplanned side effect requiring a deviation rule.

## Issues Encountered

None. A throwaway probe test (rendering the pre-change `Hero` via `renderToStaticMarkup`) was run before writing `hero-fold.test.ts`, to confirm this environment's `node`-environment renderer actually resolves `next/image`'s `src` to a literal path (it does — proven working per 02-01-PLAN.md assumption A-03) and to surface the preload-`<link>` duplicate-substring issue ahead of time rather than as a flaky test discovered later. The probe file was deleted before any task commit; it is not part of this plan's shipped output.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- G-02-2 is closed at the automated level: `npm test` (196/196), `npm run lint` (0 errors), `npm run build` all pass; the Task 2 composition assertion (order row precedes the illustration inside Hero, page.tsx never renders it directly) passes; `hero-fold.test.ts`'s 5 tests pass, including the real-value horizontal-fit budget at both 375px and 390px.
- 02-06 (section separators) can now proceed — it depends on this plan's `src/app/page.tsx` edits having landed (both plans touch that file and cannot run concurrently, per the plan's wave sequencing).
- **Outstanding — human verification required before G-02-2 can be marked fully closed in UAT:** the plan's Task 3 `<human-check>` step was NOT run in this session (no browser available to this executor). Run it before proceeding:
  1. `npm run dev`, open `http://localhost:3000` on a mobile viewport at 375x667, then again at 390x844.
  2. Without scrolling, look at the hero. Then Tab through both order buttons and click each one.
  3. **Expected:** Both order buttons are fully visible side by side before any scrolling, at both sizes. Neither button's text overflows its rounded shape or the screen edge. Each button still reads as deliberately unavailable — greyed, not pressable — with its coral explanation legible just below the pair. Each button shows a clear lime focus ring when tabbed to, and clicking either one does nothing at all.
  4. **Why human:** Fold co-visibility and text overflow are viewport rendering facts; the automated budget check proves the arithmetic, not the paint.
- Also still outstanding from 02-04's summary (unrelated to this plan, carried forward): the G-02-5 focus-ring/palette human-check on `npm run dev` at 390x844.

---
*Phase: 02-hero-ctas-location*
*Completed: 2026-09-14*

## Self-Check: PASSED

All created files verified present on disk (`OrderCtaRow.tsx`, `hero-fold.test.ts`,
`02-05-SUMMARY.md`); all three task commits (`baf0286`, `eebb37a`, `c6ed3d4`) verified present in
`git log`.

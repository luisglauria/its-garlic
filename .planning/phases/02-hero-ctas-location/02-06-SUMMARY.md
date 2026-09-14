---
phase: 02-hero-ctas-location
plan: 06
subsystem: ui
tags: [nextjs, tailwindcss-v4, accessibility, gap-closure, regression-guard, contrast]

# Dependency graph
requires:
  - phase: 02-hero-ctas-location
    provides: "02-05's landed src/app/page.tsx composition (order-CTA row inside Hero) — both plans edit page.tsx and could not run concurrently"
provides:
  - "SectionSeparator.tsx — the one shared, token-only, olive-ruled, diagonally-clipped boundary device for adjacent same-surface sections"
  - "The separator wired at all three charcoal-to-charcoal seams: BrandStory->Location, Location->Faq, Faq->Footer (the last one never reported)"
  - "section-boundaries.test.ts — a persistent guard that derives each section's surface from its own source and fails on any unseparated same-surface seam, a second hand-rolled boundary device, or an unsalient rule"
  - "02-UI-SPEC.md amended: Color table Secondary row records the deliberate shared-surface decision instead of a never-implemented alternation rule; Spacing Scale 2xl row records that 48px is now the separator band's height"
affects: []

actuals:
  tokens: 5983
  tasks: 3
  commits: 3
  plan_head_before: 74daf8de5d14e54b243158d1c6046b2192ef4116

tech-stack:
  added: []
  patterns:
    - "One shared decorative boundary component (SectionSeparator) reused at every same-surface seam, instead of a local one-off divider owned by whichever section happens to sit first — the exact anti-pattern that let G-02-4 ship (one wedge, three unseparated seams)"
    - "Salience measured, not asserted: the guard computes the WCAG relative-luminance contrast ratio of the boundary rule's colour against the section surface from the real design-tokens.json hex values, in the test itself, rather than trusting a visual impression"
    - "Guard derives structural facts (a component's surface classification) from that component's own source file via readFileSync + regex, never a hardcoded map of 'these five sections are charcoal' — the same self-verifying-from-source style as home.test.ts's sweep"

key-files:
  created:
    - src/components/layout/SectionSeparator.tsx
    - src/components/home/section-boundaries.test.ts
  modified:
    - src/app/page.tsx
    - src/components/home/BrandStory.tsx
    - src/components/layout/Footer.tsx
    - .planning/phases/02-hero-ctas-location/02-UI-SPEC.md

key-decisions:
  - "The boundary rule's salience comes from an olive top/bottom rule (3.74:1 against Carvão), not from the taper alone — the two dark surfaces only differ by 1.35:1 and cannot carry a boundary between themselves, per the debug session's measured arithmetic"
  - "The separator band's height IS the UI-SPEC Spacing Scale's 2xl value (48px at mobile base, stepping to 3xl/64px at sm) rather than an extra element added on top of an already-declared-but-unimplemented inter-section gap"
  - "The boundary guard (section-boundaries.test.ts) only requires a separator between two ADJACENT CHARCOAL (bg-surface-primary) sections, not between any two same-surface sections generically — Hero and CtaGroup are both bg-surface-deep and directly adjacent with no separator, which is a distinct, pre-existing, out-of-scope design decision (the hero reads as one continuous above-the-fold block) that G-02-4 never reported and this plan's files_modified never touches. Scoping the generic derivation to the charcoal surface specifically is grounded in the plan's own Task 3 action text (\"a later phase that adds a charcoal section... fails this test\") and in the debug session's root cause, which is specific to the four bg-surface-primary blocks."
  - "02-UI-SPEC.md's Color table Secondary row and Spacing Scale 2xl row amended in place (dated, gap-id-cited) rather than left contradicting the shipped code — the upstream spec error (citing an alternation rule while never assigning a second surface) was one of the debug session's confirmed contributing causes"

patterns-established:
  - "A single shared, token-only, aria-hidden decorative component for every recurring same-surface seam, guarded by a source-derived test so a later phase cannot add a fourth charcoal block without also adding the separator or a second hand-rolled device"

requirements-completed: [MARCA-02, MARCA-05, PERF-03]

coverage:
  - id: D1
    description: "SectionSeparator.tsx exists: one exported, token-only, aria-hidden, decorative component with an olive rule on both edges and a diagonally-clipped charcoal inner shape, sized to the UI-SPEC Spacing Scale's 2xl value at mobile base"
    requirement: "MARCA-05"
    verification:
      - kind: other
        ref: "node -e ... (Task 1 automated verify — export present, SEPARATOR_CLASS present, aria-hidden present, no hex literal, all three expected token utilities present)"
        status: pass
      - kind: unit
        ref: "src/components/home/section-boundaries.test.ts > the separator is decorative and sized to the spacing scale (3 tests)"
        status: pass
    human_judgment: false
  - id: D2
    description: "The separator is wired at all three same-surface seams: BrandStory->Location and Location->Faq inside page.tsx, and Faq->Footer inside Footer.tsx's own top edge (the seam the user never reported)"
    requirement: "MARCA-05"
    verification:
      - kind: other
        ref: "node -e ... (Task 2 automated verify — exactly 2 SectionSeparator renders in page.tsx, 1 in Footer.tsx, UI-SPEC cites G-02-4)"
        status: pass
      - kind: unit
        ref: "src/components/home/section-boundaries.test.ts > adjacent same-surface seams carry the shared separator (4 tests); the FAQ-to-footer seam, asserted explicitly (3 tests)"
        status: pass
    human_judgment: false
  - id: D3
    description: "The one-off diagonal wedge is retired from BrandStory.tsx along with the utilities that only existed to host it; exactly one boundary device (SectionSeparator) exists anywhere under src/"
    verification:
      - kind: unit
        ref: "src/components/home/section-boundaries.test.ts > exactly one boundary device exists in the codebase (2 tests)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Salience is measured, not asserted: olive against Carvão clears 3:1 (computed from design-tokens.json's real hex values), and the two dark surfaces against each other fall below 3:1, recorded as why a taper alone was never sufficient"
    requirement: "PERF-03"
    verification:
      - kind: unit
        ref: "src/components/home/section-boundaries.test.ts > the separator's salience is measured against the real brand values (3 tests)"
        status: pass
    human_judgment: false
  - id: D5
    description: "The brand story, Location and FAQ read as four distinct blocks (with the footer) rather than one undifferentiated charcoal field, when actually painted in a browser — the exact perceptual truth G-02-4 records as failed"
    requirement: "MARCA-05"
    verification: []
    human_judgment: true
    rationale: "\"Reads as distinct blocks\" is a perceptual judgment; the automated checks prove the device is present, measured (>=3:1), and wired at every seam, not that a reader perceives the separation. No browser is available to this executor. Human-check steps are reproduced verbatim below."

duration: ~15min
completed: 2026-09-13
status: complete
---

# Phase 02 Plan 06: Section separators (G-02-4 gap closure) Summary

**One shared, olive-ruled, diagonally-clipped `SectionSeparator` component now closes all three charcoal-to-charcoal seams on the homepage (brand story→Location, Location→FAQ, FAQ→footer), replacing the single unsalient one-off wedge that only ever sat at the first of three boundaries — backed by a source-derived guard that fails on any unseparated same-surface seam or a second hand-rolled divider.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-09-13T23:36:03-03:00
- **Tasks:** 3/3
- **Files modified:** 6 (2 created, 4 modified)

## Accomplishments

- Created `src/components/layout/SectionSeparator.tsx`: the ONE section-boundary device in the codebase — a decorative band (`aria-hidden`, no text, no tab stop) with an olive rule (`border-accent-olive`) on its top and bottom edges over a deep-surface (`bg-surface-deep`) background, and an absolutely-positioned inner element painted in the charcoal surface (`bg-surface-primary`), clipped to a diagonal triangle so the brand's diagonal visual language (MARCA-05) survives the fix. Height is `h-12` (48px, the UI-SPEC's declared 2xl spacing-scale value) at the mobile base, stepping to `h-16` (64px, 3xl) at `sm`. Exports `SEPARATOR_CLASS` so the guard measures the real string, not a copy.
- Wired the separator at all three same-surface seams: `src/app/page.tsx` renders it between `BrandStory`/`Location` and between `Location`/`Faq`; `src/components/layout/Footer.tsx` renders it as the first child inside its outer element, closing the FAQ→footer seam — the one the user never reported but which has the identical defect (confirmed by the debug session's full surface map).
- Retired the one-off diagonal wedge from `src/components/home/BrandStory.tsx` along with the `relative overflow-hidden` utilities that only existed to host it; rewrote the section's header comment to state that boundaries are now owned by the shared component (G-02-4).
- Amended `.planning/phases/02-hero-ctas-location/02-UI-SPEC.md`: the Color table's Secondary row now records the deliberate shared-charcoal-surface decision (rather than citing an alternation rule that was never actually implemented for any of the four blocks), and the Spacing Scale's 2xl row now records that its 48px value is delivered as the separator band's height. Both amendments dated and cite G-02-4.
- Created `src/components/home/section-boundaries.test.ts` (14 tests): derives each home section's surface (deep/charcoal) from that section's own source file — never a hardcoded list — and asserts a `SectionSeparator` sits between every adjacent charcoal-to-charcoal pair in the page's real render order, including the footer seam explicitly. Sweeps all of `src/` for a second `clip-path` boundary shape and asserts none exists outside `SectionSeparator.tsx`. Computes the WCAG contrast of olive against charcoal (≥3:1) and of the two dark surfaces against each other (<3:1) from `design-tokens.json`'s real hex values — not an opinion. Asserts the band is `aria-hidden`, renders no text, and its base height matches the UI-SPEC Spacing Scale's 2xl row read live from the spec file itself (not a duplicated literal).

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the one shared section-boundary device** - `5ca5229` (feat)
2. **Task 2: Apply it at all three same-surface seams and retire the one-off wedge** - `99d4234` (fix)
3. **Task 3: Guard the boundary rule so a later charcoal section cannot ship unseparated** - `7ef3d32` (test)

**Plan metadata:** _pending — see final commit below_

## Files Created/Modified

- `src/components/layout/SectionSeparator.tsx` - New: the one shared boundary device (`SectionSeparator`, `SEPARATOR_CLASS`)
- `src/app/page.tsx` - Renders `SectionSeparator` between BrandStory/Location and Location/Faq; composition comment updated
- `src/components/home/BrandStory.tsx` - One-off wedge and its hosting utilities removed; header comment rewritten
- `src/components/layout/Footer.tsx` - Renders `SectionSeparator` as the first child, closing the FAQ→footer seam
- `.planning/phases/02-hero-ctas-location/02-UI-SPEC.md` - Color table Secondary row and Spacing Scale 2xl row amended (dated, G-02-4)
- `src/components/home/section-boundaries.test.ts` - New: 14-test persistent boundary guard

## Decisions Made

See `key-decisions` in frontmatter. Summarized: the olive rule (not the taper) carries salience because it's the only brand value that clears 3:1 against Carvão; the band's height IS the previously-unimplemented 48px inter-section spacing-scale value rather than an addition on top of it; and the boundary guard is deliberately scoped to charcoal-to-charcoal seams specifically (not "any two same-surface sections" generically), which is why it does not — and should not — demand a separator between Hero and CtaGroup (both `bg-surface-deep`, a distinct and out-of-scope design decision that reads as one continuous above-the-fold block, never reported by G-02-4, and outside this plan's `files_modified`).

## Deviations from Plan

None - plan executed exactly as written. One authoring correction during Task 1: the header comment's first draft literally spelled out the brand hex values (`#000000` on `#202526`) to explain the contrast arithmetic, which tripped the plan's own "no hex literal" automated check (a regex over the whole file, not just the class strings) — reworded to name the colours (Preto, Carvão) instead of their hex codes. This is a same-task authoring fix caught by the task's own `<verify>` step before commit, not a deviation from the plan's design.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- G-02-4 is closed at the automated level: `npm test` (210/210), `npm run lint` (0 errors, 1 pre-existing unrelated warning in `scripts/vectorize-logo.mjs`), `npm run build`, and `npm run verify:css` all pass. All three same-surface seams are wired, the one-off wedge is gone, exactly one boundary device exists, and the olive rule's 3.74:1 contrast is proven from the real token values.
- This is the final wave (6 of 6) of the gap-closure chain (02-04 → 02-05 → 02-06). Per the objective, the orchestrator should now re-run `/gsd-verify-work 02` to reconcile gaps G-02-2, G-02-4 and G-02-5 to resolved and close out phase 02.
- **Outstanding — human verification required, reproduced verbatim from this plan's Task 2 `<human-check>` (no browser available to this executor):**
  1. Run `npm run dev`, load `http://localhost:3000` at 390x844, and scroll slowly from the brand story down through Location, the FAQ and into the footer.
  2. **Expected:** Four distinct blocks, not one continuous charcoal field: a visible olive-ruled band with a diagonal taper marks the end of the brand story, the end of Location, and the end of the FAQ. Each band reads as a deliberate divider at a glance without having to look for it, and nothing in it is selectable, focusable or announced when tabbing past.
  3. **Why human:** "Reads as distinct blocks" is a perceptual judgment; the automated checks prove the device is present, measured and wired at every seam, not that a reader perceives the separation.
- Also still outstanding from prior waves in this chain (carried forward, not this plan's scope):
  - 02-05's Task 3 human-check (order-CTA fold/overflow/focus at 375x667 and 390x844) — see `02-05-SUMMARY.md`.
  - 02-04's G-02-5 focus-ring/palette human-check on `npm run dev` at 390x844 — see `02-04-SUMMARY.md`.
  - All three of these human-checks can reasonably be run together in one `npm run dev` session before UAT is re-run.

---
*Phase: 02-hero-ctas-location*
*Completed: 2026-09-13*

## Self-Check: PASSED

All created files verified present on disk (`SectionSeparator.tsx`, `section-boundaries.test.ts`,
`02-06-SUMMARY.md`); all three task commits (`5ca5229`, `99d4234`, `7ef3d32`) verified present in
`git log`.

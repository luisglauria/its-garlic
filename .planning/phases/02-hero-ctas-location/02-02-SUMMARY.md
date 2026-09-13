---
phase: 02-hero-ctas-location
plan: 02
subsystem: ui
tags: [nextjs, react-server-components, vitest, accessibility, content-integrity]

requires:
  - phase: 02-hero-ctas-location
    provides: >
      plan 02-01's ProvisionalBadge component, home-copy.ts's confirmed/pendingConfirmation
      vocabulary and pendingSuffix/provisionalBadgeLabel precedent, renderToStaticMarkup fixture-
      test convention, and the home.test.ts directory-sweep guard suite this plan extends
  - phase: 01-foundation-architecture-brand-identity-security-baseline
    provides: >
      getStoreInfo()/buildMapsUrl() seams, StoreInfo/IntegrationLink schema contracts,
      Footer.tsx's address/anchor shape precedent, ARQ-02 ESLint data-import boundary
provides:
  - "src/content/home-copy.ts — locationCopy (heading/addressHeading/modalitiesHeading/hoursHeading/hoursPendingBody), final honest-hours copy"
  - "src/components/home/Location.tsx — LOCAL-01..04 location section: address, modality chip row, two-branch hours block, live directions anchor"
  - "MODALITY_LABEL — module constant typed against the schema's modality enum"
  - "src/components/home/Location.test.ts — rendered-output tests over zero/one/many modalities and empty/populated hours"
  - "src/components/home/home.test.ts extended — Location seam guards, repository-wide no-iframe sweep, named CLOCK_TIME content-integrity guard"
  - "src/app/page.tsx — Location composed in D-01's fixed order after CtaGroup"
affects: [02-03-brand-story-faq, phase-04-promotions-almoco]

actuals:
  tokens: 5060
  tasks: 2
  commits: 3
  plan_head_before: a3cff4b0dbd9978eeab1a74e7361d405f8fb20dd

tech-stack:
  added: []
  patterns:
    - "Location extends plan 02-01's props-based Server Component pattern (RESEARCH Pattern 1: store/maps arrive as props, never self-fetched) to a second component, so the hours/modalities branches stay fixture-testable"
    - "Fixture-spread pattern: every Location.test.ts fixture spreads the real getStoreInfo() record and overrides only the field under test, so a fixture can never drift from the schema's actual shape"
    - "Repository-wide structural sweep (no-iframe, LOCAL-01) walks all of src/ via recursive readdirSync, excluding *.test.* files — a guard's own regex/description text containing the swept literal is a false positive against real markup, not something to sweep as markup"

key-files:
  created:
    - src/components/home/Location.tsx
    - src/components/home/Location.test.ts
  modified:
    - src/content/home-copy.ts
    - src/app/page.tsx
    - src/components/home/home.test.ts

key-decisions:
  - "locationCopy.hoursPendingBody = \"Em atualização — confirme no iFood ou no WhatsApp antes de vir.\" — 02-UI-SPEC.md's Copywriting Contract empty-state wording verbatim, chosen over tone-of-voice.md's own approved-example rewrite because it also names the concrete iFood/WhatsApp channels the plan's <action> text required as the reader's next step"
  - "Location's directions anchor reuses ctaCopy.mapsLabel (\"Como chegar\") instead of adding a duplicate mapsLabel field to LocationCopy — that label is already locked vocabulary from plan 02-01's CTA row"
  - "Populated-schedule row shape: one <li> per schedule entry rendering \"{row.days}: {row.open} – {row.close}\" — this is the shape Phase 4's time-aware journey and the eventual client hours confirmation apply against, per this plan's <output> instruction"
  - "The repository-wide no-iframe sweep and the CLOCK_TIME content-integrity guard both exclude *.test.* files — home.test.ts's own guard code legitimately contains the literal strings \"<iframe\" and \"maps.url\" inside its own regex/description text, which would otherwise false-positive against itself"

requirements-completed: [LOCAL-01, LOCAL-02, LOCAL-03, LOCAL-04]

coverage:
  - id: D1
    description: "Location section renders the store's full address (street/number, neighbourhood, city, state) from the validated store record reached through getStoreInfo(), with no address literal in Location.tsx and no embedded map iframe anywhere in the repository"
    requirement: "LOCAL-01"
    verification:
      - kind: unit
        ref: "src/components/home/Location.test.ts#Location — address (LOCAL-01)"
        status: pass
      - kind: unit
        ref: "src/components/home/home.test.ts#Location seams (LOCAL-01, LOCAL-04) / no embedded map, repository-wide (LOCAL-01)"
        status: pass
      - kind: integration
        ref: "02-02-PLAN.md Task 1 verify — prerendered-HTML assertion (address facts present, no iframe)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Service modalities render as a wrapping chip row mapped over store.modalities; a one-item and a three-item array both render the matching number of chips with no code edit, and a zero-item array renders no chip row and no empty-state message"
    requirement: "LOCAL-02"
    verification:
      - kind: unit
        ref: "src/components/home/Location.test.ts#Location — modalities (LOCAL-02)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Operating hours render under the provisional marker for as long as store.hours.provisional is true (bound to the flag, not to schedule emptiness); the empty-schedule branch renders the heading plus the honest pending body and never a time, and a populated-schedule fixture renders day/open/close rows instead and omits the pending body"
    requirement: "LOCAL-03"
    verification:
      - kind: unit
        ref: "src/components/home/Location.test.ts#Location — hours (LOCAL-03, D-07)"
        status: pass
      - kind: unit
        ref: "src/components/home/home.test.ts#no invented clock time (LOCAL-03, D-07)"
        status: pass
      - kind: integration
        ref: "02-02-PLAN.md Task 1 verify — prerendered-HTML assertion (hours block present, no clock time)"
        status: pass
    human_judgment: false
  - id: D4
    description: "The \"Como chegar\" directions action is a live anchor whose href is exactly buildMapsUrl().url, opening in a new tab with the safe rel value and destination-naming link text"
    requirement: "LOCAL-04"
    verification:
      - kind: unit
        ref: "src/components/home/Location.test.ts#Location — directions link (LOCAL-04)"
        status: pass
      - kind: integration
        ref: "02-02-PLAN.md Task 1 verify — prerendered-HTML assertion (confirmed directions destination present)"
        status: pass
    human_judgment: false
  - id: D5
    description: "Mobile-viewport (390x844) visual/functional check: the hours block reads as honestly unconfirmed rather than broken or evasive, the provisional marker is legible olive-on-black inside the charcoal section, modality chips wrap rather than overflow, the directions link is reachable by Tab with a visible focus ring and opens the real store location in Google Maps in a new tab, and nothing in the section reads as a promise that the store is open right now"
    verification: []
    human_judgment: true
    rationale: "Whether the hours copy lands as honest rather than evasive, chip-wrap behavior at 390px, and focus-ring legibility/keyboard reachability are visual/tone judgments this project's DOM-less static-source-inspection test stack cannot make — human_verify_mode is end-of-phase, so this check is deferred to the phase's end-of-phase UAT pass, matching 02-01-SUMMARY.md's identical deferral pattern for its own mobile-viewport checks."

duration: ~5min
completed: 2026-09-13
status: complete
---

# Phase 2 Plan 2: Hero, CTAs & Location — Location Summary

**Location section reading the validated store record end-to-end: full address, a schema-typed modality chip row, an honest two-branch hours block that never invents a clock time, and the one confirmed live directions link in this phase.**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-09-13T21:21:10Z
- **Completed:** 2026-09-13T21:26:27Z
- **Tasks:** 2/2 completed
- **Files modified:** 5 (2 created, 3 modified)

## Accomplishments

- `Location.tsx` renders the store's full address, service modalities and directions link entirely from the validated `StoreInfo`/`IntegrationLink` props (RESEARCH.md Pattern 1) — no address, URL or hex-colour literal anywhere in the file, and the modality chip row is a genuine `.map()` over the schema's enum-typed array rather than three fixed slots.
- The hours block ships both branches from day one: while `store.hours.schedule` is empty it renders the honest pending body naming iFood/WhatsApp as the concrete next step (never a guessed hour), and a populated-schedule fixture proves the day/open/close row shape Phase 4 and the client's eventual hours confirmation will apply against. The `ProvisionalBadge` marker is bound to `store.hours.provisional`, not to the schedule's emptiness, so it cannot silently vanish the day a schedule arrives still unconfirmed.
- Extended `home.test.ts`'s guard suite with three new groups: the Location-specific seam guards (typed prop, modality map, prop-sourced href, no literals), a repository-wide no-iframe sweep across every `.ts`/`.tsx`/`.css` file under `src/` (not just `home/`), and a named `CLOCK_TIME` constant asserting no invented clock-time literal exists in any non-test component or in the copy module — the mechanical backstop behind this phase's content-integrity rule.
- `page.tsx` now calls `getStoreInfo()` once and composes `Location` after `CtaGroup`, in D-01's fixed section order, leaving the brand-story and FAQ slots for plan 02-03 to fill without reordering anything.

## Task Commits

Each task was committed atomically:

1. **Task 1: The location section — address, modalities, honest hours, and the live directions link**
   - `7265e88` (test — RED: Location.test.ts rendered-output tests, watched failing before the component existed)
   - `7f3d21e` (feat — GREEN: locationCopy, Location.tsx, page.tsx wiring; no REFACTOR commit needed)
2. **Task 2: Extend the phase guard suite with the location and content-integrity guards** - `b30d4e1` (test)

**Plan metadata:** _(recorded by the final docs commit, hash captured after this summary is written)_

_Note: Task 1 is TDD (`tdd="true"`) — two commits (test → feat) per the project's established commit-scope contract (see 02-01-SUMMARY.md's identical pattern); no refactor step was needed._

## Files Created/Modified

- `src/content/home-copy.ts` - added `LocationCopy` interface and `locationCopy` export (heading/addressHeading/modalitiesHeading/hoursHeading/hoursPendingBody)
- `src/components/home/Location.tsx` - `Location({ store, maps })` — address, `MODALITY_LABEL`-mapped chip row, two-branch hours block, live directions anchor
- `src/components/home/Location.test.ts` - 8 rendered-output tests over the zero/one/many modalities and empty/populated hours branches
- `src/components/home/home.test.ts` - 3 new describe groups: Location seams, repository-wide no-iframe sweep, `CLOCK_TIME` content-integrity guard (37 tests total, up from 26)
- `src/app/page.tsx` - calls `getStoreInfo()`, composes `<Location store={store} maps={maps} />` after `<CtaGroup />`

## Decisions Made

See `key-decisions` in frontmatter for the full list. Two are load-bearing for downstream plans:

- **`hoursPendingBody` shipped wording:** "Em atualização — confirme no iFood ou no WhatsApp antes de vir." — states the unconfirmed state plainly and names the two concrete ways to check, with no time of day, no day range and no suggestion the store is probably open.
- **Populated-schedule row shape:** one `<li>` per `store.hours.schedule` entry rendering `{row.days}: {row.open} – {row.close}` — Phase 4's time-aware journey and the client's eventual real-hours delivery apply against this exact shape (a data edit, not a component rewrite).
- **`MODALITY_LABEL` shipped labels:** `balcao` → "Balcão", `delivery` → "Delivery", `take-away` → "Take away".

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Repository-wide no-iframe sweep false-positived against its own guard file**
- **Found during:** Task 2
- **Issue:** The new no-iframe sweep walked every `.ts`/`.tsx`/`.css` file under `src/` including `home.test.ts` itself, whose own test descriptions and regex literals legitimately contain the string `<iframe` — the guard failed against itself, not against any real markup.
- **Fix:** Excluded `*.test.*` files from the sweep's `collectFiles()` walk, with a comment explaining why (a guard's own literal text is a false positive, not embedded markup) — the same reasoning `home.test.ts`'s existing sweep already applies to test files elsewhere in the suite.
- **Files modified:** `src/components/home/home.test.ts`
- **Verification:** `npx vitest run src/components/home/home.test.ts` — 37/37 passed.
- **Committed in:** `b30d4e1` (Task 2 commit)

**2. [Rule 1 - Bug] Verify-script literal-substring check required un-escaping a guard regex**
- **Found during:** Task 2
- **Issue:** The plan's own Task 2 verify script checks for the literal substring `"maps.url"` inside `home.test.ts`'s source text. The first draft wrote that guard as `.toMatch(/maps\.url/)` (a conventionally-escaped regex literal), whose raw source text contains `maps\.url` (with a literal backslash) — not the un-escaped substring the verify script greps for. This is the same defect class 02-01-SUMMARY.md's Deviation #4 already documented once for a different pair of guards.
- **Fix:** Changed the guard to `.toContain("maps.url")` — a plain string check, functionally identical and arguably clearer.
- **Files modified:** `src/components/home/home.test.ts`
- **Verification:** Re-ran the plan's own Task 2 verify script — `location guards present`; `npx vitest run` still 37/37.
- **Committed in:** `b30d4e1` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (both Rule 1 — bug fixes). **Impact on plan:** Both were necessary for correctness against the plan's own stated acceptance criteria and verify scripts; neither expanded scope beyond what Tasks 1–2 already specified.

## Issues Encountered

None beyond the two auto-fixed items above.

## User Setup Required

None — no external service configuration required.

## Next Phase Readiness

- Plan 02-03 (Brand Story, FAQ) composes into `src/app/page.tsx` alongside the existing `<Hero /><CtaGroup /><Location />` — insert `BrandStory` between `CtaGroup` and `Location`, and `Faq` after `Location`, per D-01's fixed order; no reordering of the sections this plan added.
- Phase 4's time-aware journey work reads the same `store.hours` shape this plan renders — the day/open/close row shape shipped here (`{row.days}: {row.open} – {row.close}`) is the shape to read consistently, and the client's eventual real-hours confirmation is a `src/data/store.ts` edit against it, not a component rewrite.
- **Deferred to end-of-phase UAT** (per `human_verify_mode: end-of-phase`, not skipped): the 390×844 mobile-viewport checks for hours-copy honesty, provisional-marker legibility, modality-chip wrap, and directions-link keyboard/focus-ring behaviour (coverage D5) — none of these are automatable by this project's DOM-less test stack.
- No blockers for plan 02-03.

---
*Phase: 02-hero-ctas-location*
*Completed: 2026-09-13*

## Self-Check: PASSED

All 5 created/modified files and 3 task commits (`7265e88`, `7f3d21e`, `b30d4e1`) verified present.

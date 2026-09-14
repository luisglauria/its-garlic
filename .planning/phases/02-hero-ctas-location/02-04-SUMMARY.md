---
phase: 02-hero-ctas-location
plan: 04
subsystem: ui
tags: [css, tailwindcss-v4, next-font, design-tokens, accessibility, regression-guard]

# Dependency graph
requires:
  - phase: 01-foundation-architecture-brand-identity-security-baseline
    provides: design-tokens.css/.json (MARCA-02/03), globals.css :focus-visible rule (PERF-01), next/font Anton/Manrope binding in layout.tsx
provides:
  - "A compiled stylesheet where all seven brand colours and both font families resolve to their official values"
  - "A visible focus ring on every focusable element (FAQ summaries, both directions links, skip link)"
  - "A fast source-level guard (src/styles/design-tokens.test.ts) covering both root-cause conditions"
  - "A compiled-artifact checker (scripts/check-brand-css.mjs, npm run verify:css) proving the built CSS, not just the source, is correct"
affects: [02-04-gap-closure-token-cycle, 02-05-cta-layout, 02-06-section-separators]

actuals:
  tokens: 5900
  tasks: 2
  commits: 2
  plan_head_before: a926dd7314f0b62f782f4c2b286cf6869fb9f13f

tech-stack:
  added: []
  patterns:
    - "Tailwind v4 static @theme block for literal design tokens that no utility scan can see (hand-written CSS var reads, currently-unused colour tokens)"
    - "Tailwind v4 inline @theme block for next/font-backed values, with the theme key deliberately named DIFFERENTLY from the next/font `variable` it reads, to make same-name self-reference structurally impossible to reintroduce silently"

key-files:
  created:
    - src/styles/design-tokens.test.ts
    - scripts/check-brand-css.mjs
  modified:
    - src/styles/design-tokens.css
    - src/app/globals.css
    - src/app/layout.tsx
    - src/components/layout/layout.test.ts
    - package.json

key-decisions:
  - "Colours + script font moved into a `static` @theme block as literals; Anton/Manrope moved into an `inline` @theme block keyed by distinct --font-display-anton / --font-body-manrope variable names, never the theme key's own name"
  - "globals.css import order swapped (tailwindcss first, design-tokens.css second) so the theme block lands inside @layer theme, ahead of any unlayered literal"
  - "check-brand-css.mjs asserts the LAST (cascade-winning) declaration of each colour token, not mere presence — a presence-only check would have passed on the original outage, since the correct literal was present and simply lost the cascade"

patterns-established:
  - "Compiled-artifact checker convention: read the official values from the JSON source of truth, never a literal typed into the checker script itself"

requirements-completed: [MARCA-02, MARCA-03, PERF-01]

coverage:
  - id: D1
    description: "All seven brand colours resolve to their official literal values in the compiled stylesheet (no self-referential custom property, no unlayered-literal cascade loss)"
    requirement: MARCA-02
    verification:
      - kind: unit
        ref: "src/lib/brand/brand-assets.test.ts (MARCA-02/03 mirror guard, 15 tests)"
        status: pass
      - kind: unit
        ref: "src/styles/design-tokens.test.ts (28 tests, source-level AND-gate guard)"
        status: pass
      - kind: other
        ref: "npm run build && npm run verify:css (scripts/check-brand-css.mjs — compiled-artifact literal-wins-cascade check)"
        status: pass
    human_judgment: false
  - id: D2
    description: "Anton (display) and Manrope (body) font families resolve in the compiled stylesheet through the next/font-backed theme keys, instead of falling back to the guaranteed-invalid self-reference"
    requirement: MARCA-03
    verification:
      - kind: unit
        ref: "src/styles/design-tokens.test.ts > the two font theme keys resolve through distinct next/font variable names (3 tests)"
        status: pass
      - kind: other
        ref: "npm run verify:css (display-font-wired-through-next/font check)"
        status: pass
    human_judgment: false
  - id: D3
    description: "A visible focus ring paints on every focusable element (FAQ summaries, both 'Como chegar' directions links, skip link) because --color-accent now resolves"
    requirement: PERF-01
    verification:
      - kind: unit
        ref: "src/styles/design-tokens.test.ts > the global focus rule references a colour declared as a literal"
        status: pass
      - kind: other
        ref: "npm run verify:css (:focus-visible outline rule survives-into-compiled-CSS check)"
        status: pass
    human_judgment: true
    rationale: "Computed colour and a painted focus outline are browser rendering facts — the automated checks prove the tokens resolve in the stylesheet, not that the ring is visually painted on every real tab stop. Human-check steps below (from the plan's Task 1 verify block) must still be run against `npm run dev` on a 390x844 viewport."

duration: ~9min
completed: 2026-09-14
status: complete
---

# Phase 02 Plan 04: Break the token cycle and restore the brand palette Summary

**Fixed a self-referential CSS custom-property cycle plus an import-order bug in Tailwind v4's `@theme` handling that was silently killing all seven brand colours and both font families site-wide (and, as a side effect, every focus ring) — restored via a `static`/`inline` @theme split with distinct next/font variable names, and locked down with a 28-test source guard plus a compiled-artifact checker.**

## Performance

- **Duration:** ~9 min
- **Completed:** 2026-09-14T02:09:20Z
- **Tasks:** 2/2
- **Files modified:** 7 (3 created, 4 modified across the two tasks)

## Accomplishments

- Rewrote `src/styles/design-tokens.css`: seven brand colours + script font now live in a Tailwind v4 `static` `@theme` block as literal hex values (no variable is ever defined in terms of itself); Anton/Manrope now live in an `inline` `@theme` block whose theme keys (`--font-display`, `--font-body`) read *differently-named* next/font variables (`--font-display-anton`, `--font-body-manrope`) with the original literal stack as the `var()` fallback.
- Swapped the import order in `src/app/globals.css` (`tailwindcss` first, `design-tokens.css` second) so the project's `@theme` block is emitted inside `@layer theme`, ahead of any unlayered declaration — the second, independently-necessary condition of the outage's AND-gate.
- Renamed the two `next/font` `variable` bindings in `src/app/layout.tsx` to `--font-display-anton` / `--font-body-manrope`, matching the new theme-key references.
- Verified in the actual compiled `.next` stylesheet (not just source): zero self-referential custom properties, a populated `@layer theme`, every brand colour's cascade-winning declaration equal to its official hex, and the `:focus-visible` outline rule intact.
- Added `src/styles/design-tokens.test.ts` — 28 fast, source-level tests covering both AND-gate conditions independently, plus the literal/theme-block/distinct-variable invariants that must hold for the fix to stay fixed.
- Added `scripts/check-brand-css.mjs` (`npm run verify:css`) — reads `design-tokens.json` as the sole source of truth and asserts the compiled CSS's LAST (cascade-winning) declaration of each colour token matches it exactly; a presence-only check would have passed on the original defect, so this deliberately checks cascade order.
- Fixed a now-stale assertion in the pre-existing `src/components/layout/layout.test.ts` that encoded the pre-fix (buggy) same-name variable invariant.

## Task Commits

Each task was committed atomically:

1. **Task 1: Break the token cycle at both of its causes and restore the brand palette** - `5d56934` (fix)
2. **Task 2: Install the two regression guards that would have caught this at build time** - `329c935` (test)

**Plan metadata:** _pending — see final commit below_

## Files Created/Modified

- `src/styles/design-tokens.css` - Static `@theme` block (literal colours + script font) and inline `@theme` block (distinctly-named font variables) replace the self-referential mirror
- `src/app/globals.css` - Import order swapped (tailwindcss before design-tokens.css); documented why
- `src/app/layout.tsx` - next/font `variable` names renamed to `--font-display-anton` / `--font-body-manrope`
- `src/styles/design-tokens.test.ts` - New: 28-test source-level regression guard over both AND-gate conditions
- `scripts/check-brand-css.mjs` - New: compiled-artifact checker, wired as `npm run verify:css`
- `package.json` - Added `verify:css` script
- `src/components/layout/layout.test.ts` - Updated one stale assertion to the new (correct) distinct-variable-name invariant

## Decisions Made

- Used Tailwind v4's `static` option (not the default lazy-emission behaviour) for the colour/script-font theme block, because `--color-accent-purple` has no utility consumer yet and `globals.css`'s hand-written `:focus-visible` rule reads `--color-accent` outside of Tailwind's utility-usage scanner — both would otherwise risk the variable being tree-shaken out of the compiled CSS even after the self-reference is fixed.
- Kept the original literal font stacks (`"Anton", "Archivo Black", sans-serif` / `"Manrope", "Inter", sans-serif`) as the `var()` fallback in the inline theme block, so a build without next/font still degrades gracefully rather than to nothing.
- Extended the plan's own regression-guard scope by one file (`layout.test.ts`) beyond its declared `files_modified` list — see Deviations below.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Updated a stale assertion in `src/components/layout/layout.test.ts`**
- **Found during:** Task 2, running `npm test` to verify the full suite stays green
- **Issue:** A pre-existing test (`binds both font instances to the design-token --font- variable names`) asserted `layout.tsx` bound its next/font `variable` props to the literal strings `--font-display` / `--font-body` — exactly the same-name invariant Task 1 intentionally broke, because that invariant *was* the bug (MARCA-02/03/PERF-01 outage). Left unfixed, this pre-existing test would fail forever after a correct implementation of the plan.
- **Fix:** Updated the assertion to check for the new, intentionally-distinct variable names `--font-display-anton` / `--font-body-manrope`, with a comment pointing at the DEBUG file and at `design-tokens.test.ts` for the full guard.
- **Files modified:** `src/components/layout/layout.test.ts`
- **Verification:** `npm test` — 186/186 tests pass (was 185/186 before this fix)
- **Committed in:** `329c935` (Task 2 commit)

**2. [Rule 3 - Blocking] Normalized 3-digit hex shorthand in `check-brand-css.mjs`'s literal comparison**
- **Found during:** Task 2, first run of `npm run verify:css` against the real build
- **Issue:** Next.js/Lightning CSS minifies `#000000` to `#000` in the compiled output. The checker's first-pass literal regex (`^#[0-9a-fA-F]{6}$`) rejected the minified 3-digit form as "not a literal", which would have made the checker fail on a correct build.
- **Fix:** Added a `normalizeHex()` helper that expands a 3-digit hex shorthand to 6-digit before the equality comparison, and widened the literal-detection regex to accept both 3- and 6-digit hex forms.
- **Files modified:** `scripts/check-brand-css.mjs`
- **Verification:** `npm run verify:css` passes against the real build (all 7 tokens, including `surface-deep`/`#000000`)
- **Committed in:** `329c935` (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 bug fix in a pre-existing test, 1 blocking issue in the new checker script)
**Impact on plan:** Both fixes were necessary for the plan's own stated success criteria ("no self-referential custom properties... two guards committed") to actually hold true against the real codebase and real build output. No scope creep — both are direct, in-scope consequences of Task 1's intentional variable-renaming fix and Task 2's own new script.

## Issues Encountered

None beyond the two auto-fixed deviations above.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- G-02-5 is closed at the source and compiled-artifact level: all automated verification in the plan's `<verification>` block passes (`npm test` 186/186, `npm run build && npm run verify:css` clean, `npm run lint` 0 errors).
- G-02-4 (section separators) is now observable, since every background renders its correct brand colour instead of browser-default white — unblocking 02-05/02-06, which depend on the restored palette/fonts for their own layout tuning.
- **Outstanding — human verification required before G-02-5 can be marked fully closed in UAT:** the plan's Task 1 `<human-check>` step was NOT run in this session (no browser available to this executor). Run it before proceeding:
  1. `npm run dev`, open `http://localhost:3000` on a 390x844 mobile viewport.
  2. Press Tab repeatedly from the top of the page through the skip link, the CTA buttons, both "Como chegar" links, and all four FAQ questions.
  3. **Expected:** the page renders on the brand's dark surfaces (black hero/CTA band, charcoal brand-story/location/FAQ/footer) with white body copy and lime accents — not a white page with black text. Headings render in the condensed display face (Anton) and body copy in Manrope. Every single tab stop paints a visible lime ring around the focused element, including the skip link when it appears.
  4. **Why human:** computed colour and painted focus outlines are browser rendering facts; the automated checks in this plan prove the tokens *resolve in the stylesheet*, not that the page *looks right* to a person.

---
*Phase: 02-hero-ctas-location*
*Completed: 2026-09-14*

## Self-Check: PASSED

All created/modified files verified present on disk; both task commits (`5d56934`, `329c935`) verified present in `git log`.

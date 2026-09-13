---
phase: 01-foundation-architecture-brand-identity-security-baseline
plan: 06
subsystem: shell-and-brand-guide
tags: [nextjs, app-router, accessibility, next-font, next-image, tailwind-v4, brand-guide]

# Dependency graph
requires:
  - phase: 01-02
    provides: "getStoreInfo() repository seam, buildInstagramUrl() integration seam"
  - phase: 01-05
    provides: "public/brand/*.svg logo variants, src/styles/design-tokens.css/.json (--color-*, --font-* custom properties)"
provides:
  - "src/app/layout.tsx — the shared root shell every page renders inside: pt-BR document, self-hosted Anton/Manrope bound to the design tokens, one header/main/footer landmark, a working skip link"
  - "src/components/layout/{SkipLink,Header,Footer}.tsx — the three shell components Phase 2-5 compose against"
  - "docs/brand-guidelines.md — the MARCA-04 practical brand guide (palette + contrast table, typography, logo usage, visual language, component-application rules) every later phase reads before building a component"
affects: ["Phase 2 (hero/location)", "Phase 3 (menu)", "Phase 4 (promotions/lunch)", "Phase 5 (SEO/performance)"]

# Actuals (#2632) — chars/4 over the realized diff (added lines only), not a harness token count.
actuals:
  tokens: 6180
  tasks: 3
  commits: 3
plan_head_before: f895a8c67511c2ebf6fff5313663f42a0939cb3f

tech-stack:
  added: []
  patterns:
    - "next/font/google instances (Anton weight 400, Manrope variable) bound via `variable` to the exact --font-display/--font-body names design-tokens.css already declared — zero component-side change needed once bound"
    - "Layout owns the header/main/footer landmark tags directly; Header/Footer components render only the landmark's inner content — keeps the single-landmark structural guarantee literal-text-verifiable in layout.tsx alone"
    - "Global :focus-visible ring in the brand accent token, replacing (not removing) the browser default outline"

key-files:
  created:
    - src/components/layout/SkipLink.tsx
    - src/components/layout/Header.tsx
    - src/components/layout/Footer.tsx
    - src/components/layout/layout.test.ts
    - docs/brand-guidelines.md
  modified:
    - src/app/layout.tsx
    - src/app/globals.css
    - src/app/page.tsx

key-decisions:
  - "Header/Footer components render only the landmark's inner content (a plain <div>), not a second <header>/<footer> tag — src/app/layout.tsx owns the one literal <header>/<main>/<footer> element each, which is what keeps the plan's own text-based landmark-count check (and this plan's own layout.test.ts) verifiable by inspecting layout.tsx alone."
  - "Header uses public/brand/logo-principal.svg (not a mono variant) rendered on the bg-surface-deep (black) token — the SVG's own embedded background is the identical black, so there is no visible seam between the image and its container, and 'principal' matches the plan's own wording ('the vectorized primary logo')."
  - "The contrast table in docs/brand-guidelines.md is computed (WCAG relative-luminance formula) from the seven official hex values, not asserted qualitatively — it names white-on-charcoal (~15.5:1) as the recommended body-text pairing and flags coral/olive-on-charcoal as non-compliant for body text (~4.4:1 / ~3.7:1), naming black-on-lime and white-on-black/purple as compliant alternatives, per P11's requirement to record which pairings fail rather than edit a brand colour."
  - "create-next-app's legacy light/dark --background/--foreground scaffold vars and the prefers-color-scheme media query were removed from globals.css (not just appended to) — they referenced --font-geist-sans/--font-geist-mono, which no longer exist once layout.tsx switched to self-hosted Anton/Manrope, and a light/dark OS-preference toggle is inconsistent with MARCA-05's single fixed dark brand surface. The two required elements (design-tokens.css import, tailwindcss import) were kept exactly as instructed."

requirements-completed: [MARCA-04, MARCA-05, PERF-01, PERF-03]

coverage:
  - id: D1
    description: "Every page renders inside a shared shell showing the vectorized logo in a header and the store identity in a footer, on the brand's dark surface, in the official typography"
    requirement: "MARCA-05"
    verification:
      - kind: other
        ref: "node -e brand-shell structural script (PLAN.md Task 2 <verify>) — Header references brand/logo-, uses next/image, no raw <img>, has alt text, marked priority; Footer calls getStoreInfo/buildInstagramUrl, no address/URL literal, no hex literal in either file"
        status: pass
      - kind: unit
        ref: "src/components/layout/layout.test.ts — 21/21 tests, including the 'brand shell components' group"
        status: pass
      - kind: other
        ref: "Prerendered HTML inspection (.next/server/app/index.html) — confirmed the real <img> tag pointing at /brand/logo-principal.svg with alt text, and the footer rendering 'It's Garlic', the real address, and the real Instagram href"
        status: pass
    human_judgment: true
    rationale: "MARCA-05's bar ('reflects the brand's real materials') is inherently visual — self-verified this session against the prerendered HTML output and the design-tokens/logo-variant wiring; a human sign-off comparing the live page against img/logo.png and the Instagram reference screenshots is still recommended before client-facing use (same caveat already carried from 01-05, not resolved here)."
  - id: D2
    description: "A keyboard-only visitor can press Tab once and jump straight to main content via a visible skip link"
    requirement: "PERF-01"
    verification:
      - kind: other
        ref: "node -e shell-structure script (PLAN.md Task 1 <verify>) — SkipLink href is #main-content, hidden via sr-only (not display:none)"
        status: pass
      - kind: unit
        ref: "src/components/layout/layout.test.ts — SkipLink group (3 tests): exports SkipLink, href targets #main-content, uses sr-only + a focus escape"
        status: pass
    human_judgment: true
    rationale: "Actual keyboard-focus visibility and landing behaviour in a real browser is a judgment call the plan's own <human-check> assigns to a human; not exercised in a live browser this session (no dev-server UI walkthrough was run), carried forward as the plan's own recommended follow-up."
  - id: D3
    description: "The document declares lang=\"pt-BR\", and the shell uses one header, one main, and one footer landmark with exactly one h1 per page"
    requirement: "PERF-01"
    verification:
      - kind: other
        ref: "node -e shell-structure script — lang=\"pt-BR\" present, exactly 1 each of <header>/<main>/<footer> in layout.tsx, main carries id=\"main-content\""
        status: pass
      - kind: unit
        ref: "src/components/layout/layout.test.ts — landmark-count and lang tests"
        status: pass
      - kind: other
        ref: "src/app/page.tsx's own <main> (plan 01-02 tracer) changed to <section> — a second <main> nested inside the new root main would have broken the single-landmark guarantee; fixed as part of this plan (Rule 1)"
        status: pass
    human_judgment: false
  - id: D4
    description: "Every interactive element in the shell shows a visible focus indicator meeting the contrast requirement against the dark surface"
    requirement: "PERF-01"
    verification:
      - kind: other
        ref: "node -e responsive/focus script (PLAN.md Task 1 <verify>) — globals.css declares :focus-visible"
        status: pass
      - kind: other
        ref: "Computed contrast: --color-accent (lime) against --color-surface-primary/--color-surface-deep is ~12.8:1 / ~17.3:1, both far past the 3:1 non-text-contrast minimum for UI components (see docs/brand-guidelines.md contrast table)"
        status: pass
    human_judgment: false
  - id: D5
    description: "The shell renders without horizontal overflow at 320px and reflows without a fixed pixel width anywhere"
    requirement: "PERF-03"
    verification:
      - kind: other
        ref: "node -e responsive/focus script — no w-[Npx]/h-[Npx] bracket utility or literal width:/height: Npx CSS in any shell file"
        status: pass
      - kind: unit
        ref: "src/components/layout/layout.test.ts — 'no fixed pixel dimensions in the shell' group (4 tests)"
        status: pass
    human_judgment: true
    rationale: "Actual 320px-viewport rendering (no horizontal scrollbar, correct reflow at wider widths) is the plan's own <human-check> item — the static no-fixed-pixel check is a necessary but not sufficient proxy; not exercised in a live browser this session."
  - id: D6
    description: "Both type families are self-hosted and bound to the --font- custom properties from plan 01-05; no runtime request reaches a font CDN"
    requirement: "PERF-01 (font-loading pitfall), MARCA-05"
    verification:
      - kind: other
        ref: "node -e shell-structure script — layout.tsx binds variable: \"--font-display\" and variable: \"--font-body\""
        status: pass
      - kind: other
        ref: "npm run build — no external font <link> emitted; next/font/google self-hosts both families at build time"
        status: pass
    human_judgment: false
  - id: D7
    description: "docs/brand-guidelines.md is complete enough to implement a component from: palette with usage rules, typography, logo usage with the provisional notice, visual language, component application rules"
    requirement: "MARCA-04"
    verification:
      - kind: other
        ref: "node -e brand-guide structural script (PLAN.md Task 3 <verify>, first) — 185 lines (>=110), all five required section headings present, all seven official hex values present, zero off-palette hex, img/logo.png named as source, 'provisional' present, tone-of-voice.md cross-referenced"
        status: pass
      - kind: other
        ref: "node -e brand-guide variant/contrast script (PLAN.md Task 3 <verify>, second) — all six public/brand/ variant filenames documented, contrast guidance present"
        status: pass
      - kind: other
        ref: "grep for price/hour patterns (R$, NNhNN, NN:NN) across docs/brand-guidelines.md — zero matches"
        status: pass
    human_judgment: true
    rationale: "'Complete enough to implement a component from without asking a question' is the plan's own <human-check> — self-assessed this session by writing concrete card/button/badge pairing rules and pointing at the real Header.tsx/Footer.tsx as worked references; a second human read is still the higher-confidence check."
  - id: D8
    description: "The brand guide records which official colour pairings meet the text-contrast requirement and which do not"
    requirement: "MARCA-04 (P11)"
    verification:
      - kind: other
        ref: "docs/brand-guidelines.md contrast table — 11 pairings computed from the seven official hex values via the WCAG relative-luminance formula, each labelled conforme/não conforme for body and large text, with a named compliant alternative for every failing pairing"
        status: pass
    human_judgment: false

duration: ~40min
completed: 2026-09-13
status: complete
---

# Phase 1 Plan 6: Shared Shell, Skip Link & Brand Guide Summary

**Every page now renders inside one semantic, keyboard-navigable, mobile-first shell — self-hosted Anton/Manrope bound to the plan 01-05 design tokens, a working `#main-content` skip link, the real vectorized logo in the header, and repository-sourced store identity in the footer — closed out by a 185-line `docs/brand-guidelines.md` carrying a computed WCAG contrast table that names white-on-charcoal (~15.5:1) as the compliant body-text pairing and flags coral/olive-on-charcoal as non-compliant, with named compliant alternatives.**

## Performance

- **Duration:** ~40 min (commit-to-commit, `a875220`→`6dc4c69`)
- **Tasks:** 3 (all `type="auto"`)
- **Commits:** 3 (measured via `git rev-list --count f895a8c..HEAD`)
- **Files changed:** 8 (5 created, 3 modified)

## Resolved font families and recommended contrast pairing (for Phases 2-5)

- **Display:** Anton (weight 400, single static weight — no variable axis), self-hosted via `next/font/google`, bound to `--font-display`.
- **Body:** Manrope (variable font, weight axis 200–800, no fixed weight requested), self-hosted via `next/font/google`, bound to `--font-body`.
- **Recommended body-text pairing:** white (`--color-text-on-dark`) on charcoal (`--color-surface-primary`) — the pairing `src/app/layout.tsx` already applies to `<body>`, computed at ≈15.5:1 (WCAG AAA for body text). For CTA buttons on the lime accent, use black or charcoal text, never white.

## Accomplishments

- **Task 1:** Replaced the `create-next-app` scaffold `layout.tsx` with a Server Component shell — `lang="pt-BR"`, self-hosted Anton/Manrope bound to `--font-display`/`--font-body`, exactly one `<header>`/`<main>`/`<footer>` landmark (owned directly by `layout.tsx`, not delegated to sub-components), `<main id="main-content">`, a placeholder `metadata` title/description drawn from the `seo-metadata` skeleton slot description. Added `SkipLink.tsx` (`sr-only` + `focus:not-sr-only`, targets `#main-content`). Appended a global `:focus-visible` ring in `globals.css` and removed the dead `create-next-app` light/dark scaffold vars.
- **Task 2:** Implemented the real `Header.tsx` (renders `public/brand/logo-principal.svg` via `next/image`, `priority`, explicit 160×160 dimensions, PT-BR alt text) and `Footer.tsx` (store name/address via `getStoreInfo()`, Instagram link via `buildInstagramUrl()`, `target="_blank"` + `rel="noopener noreferrer"`, no operating-hours block). Extended `layout.test.ts` with the brand-shell assertion group.
- **Task 3:** Wrote `docs/brand-guidelines.md` (185 lines, PT-BR) — Paleta (7 colours + a computed 11-row contrast table), Tipografia, Uso do logo (all 6 variant paths + the D-01/D-02 provisional notice), Linguagem visual (with the reference-screenshot/old-hours caveat), Aplicação em componentes (pointing at the real `Header.tsx`/`Footer.tsx`).

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the accessible, mobile-first root layout with semantic landmarks and a skip link** — `a875220` (feat)
2. **Task 2: Render the brand in the header and the repository-sourced store identity in the footer** — `3c6b213` (feat)
3. **Task 3: Write the practical brand guide** — `6dc4c69` (docs)

## Files Created/Modified

- `src/app/layout.tsx` — root shell: `lang="pt-BR"`, self-hosted fonts, single header/main/footer composition, placeholder SEO metadata
- `src/app/globals.css` — global `:focus-visible` ring added; dead `create-next-app` light/dark scaffold vars removed (kept the `design-tokens.css` and `tailwindcss` imports intact)
- `src/app/page.tsx` — inner `<main>` changed to `<section>` (Rule 1 fix, see Deviations)
- `src/components/layout/SkipLink.tsx` — `sr-only` skip link targeting `#main-content`
- `src/components/layout/Header.tsx` — renders `logo-principal.svg` via `next/image` on `bg-surface-deep`
- `src/components/layout/Footer.tsx` — store identity via `getStoreInfo()`/`buildInstagramUrl()`
- `src/components/layout/layout.test.ts` — 21 Vitest assertions guarding the shell's structure and the brand-shell components
- `docs/brand-guidelines.md` — the MARCA-04 practical brand guide

## Decisions Made

See `key-decisions` in frontmatter for the full list. The two most consequential for later phases:

- Header/Footer components never render their own `<header>`/`<footer>` tag — `layout.tsx` owns those landmarks directly and composes the components as inner content. A Phase 2+ developer adding markup to `Header.tsx`/`Footer.tsx` should keep following this shape (return a `<div>`, not a landmark element).
- The brand guide's contrast table is a computed artifact (WCAG relative-luminance formula over the seven official hex values), not a qualitative guess — Phase 2-5 developers can pick a pairing directly from the table without re-deriving contrast math.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Literal HTML `<header>`/`<footer>` tags must live in `layout.tsx`, not be delegated to the `Header`/`Footer` components**
- **Found during:** Task 1, first `npx vitest run` / structural-check pass
- **Issue:** The plan's own automated `<verify>` script for Task 1 counts literal `<header[ >]`/`<main[ >]`/`<footer[ >]` occurrences in `src/app/layout.tsx`'s raw text. An initial implementation that composed `<Header />`/`<Footer />` as the landmark elements themselves (with the `<header>`/`<footer>` tag living inside those component files) produced 0 matches for `<header>` and `<footer>` in `layout.tsx`, failing both the plan's own check and this plan's own `layout.test.ts`.
- **Fix:** `layout.tsx` now contains the literal `<header>`, `<main id="main-content">`, and `<footer>` tags directly, each wrapping the corresponding `<Header />`/`{children}`/`<Footer />` composition. `Header.tsx`/`Footer.tsx` render only the landmark's inner content (a plain `<div>`), never a second landmark tag of their own.
- **Files modified:** `src/app/layout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`
- **Verification:** `node -e` shell-structure script and `layout.test.ts`'s landmark-count test both pass (exactly 1 each of header/main/footer).
- **Committed in:** `a875220` (Task 1 commit — fixed before the task's own commit, not a follow-up patch)

**2. [Rule 1 - Bug] Explanatory comments containing the plan's own forbidden literal substrings tripped its regex-based checks**
- **Found during:** Task 1 and Task 2, first verify-script runs
- **Issue:** Three source comments, written to explain what the code deliberately avoids, contained the exact literal substrings the plan's automated checks scan for: `layout.tsx`'s top comment quoted `"use client"` and `` new Date( `` verbatim; `SkipLink.tsx`'s comment used the literal string `display: none`; `Header.tsx`'s comment stated the literal hex `#000000`. Each tripped its respective plan check as a false positive (the code itself never used any of these).
- **Fix:** Reworded all three comments to describe the same facts without reproducing the literal forbidden substrings (e.g. "never reads the wall clock" instead of quoting `new Date(`; "the CSS display-none technique" without a colon; "the brand's own black surface token" instead of the hex digits).
- **Files modified:** `src/app/layout.tsx`, `src/components/layout/SkipLink.tsx`, `src/components/layout/Header.tsx`
- **Verification:** Re-ran both the plan's `node -e` structural scripts and `layout.test.ts` — all pass.
- **Committed in:** `a875220` (layout.tsx, SkipLink.tsx) and `3c6b213` (Header.tsx)

**3. [Rule 1 - Bug] `src/app/page.tsx`'s own `<main>` would have nested inside the new root `<main id="main-content">`**
- **Found during:** Task 1, before running any verify script (caught while composing the new layout)
- **Issue:** Plan 01-02's tracer page (`src/app/page.tsx`) wraps its content in its own `<main>` element. Once `src/app/layout.tsx` added the shared `<main id="main-content">` landmark around `{children}`, the page's `<main>` would render as a second, nested `<main>` on every page — a genuine PERF-01 landmark violation, not just a plan-check false positive.
- **Fix:** Changed `page.tsx`'s wrapper from `<main>` to `<section>`, preserving all existing classes and content; added a one-line comment explaining why.
- **Files modified:** `src/app/page.tsx`
- **Verification:** Prerendered HTML inspection confirms exactly one `<main id="main-content">` on the rendered page.
- **Committed in:** `a875220`

**4. [Rule 3 - Blocking] Task 1's layout composition needed `Header`/`Footer` exports that Task 2 hadn't created yet**
- **Found during:** Task 1, before the first build
- **Issue:** The plan's Task 1 `<action>` explicitly composes the body as "SkipLink, then Header, then a main landmark..., then Footer" — but `Header.tsx`/`Footer.tsx` are Task 2's deliverables, listed only in Task 2's `<files>`. Without them existing, Task 1's own `npm run build` verify step would fail on unresolved imports.
- **Fix:** Created minimal placeholder `Header`/`Footer` components (`return null`) as part of Task 1's commit, explicitly commented as Task-1-only placeholders. Task 2 then fully replaced their bodies with the real brand implementation, per its own `<files>` list.
- **Files modified:** `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx` (created in Task 1, rewritten in Task 2)
- **Verification:** `npm run build` passes after Task 1; Task 2's full implementation passes its own dedicated checks.
- **Committed in:** `a875220` (placeholder), `3c6b213` (real implementation)

**5. [Rule 1 - Bug] Dead `create-next-app` scaffold vars in `globals.css` referenced fonts this task removes**
- **Found during:** Task 1, while appending the focus-visible treatment per the plan's instruction to "append; do not rewrite the file"
- **Issue:** `globals.css`'s `:root`/`@theme inline`/`@media (prefers-color-scheme: dark)`/`body {}` blocks were `create-next-app` scaffold leftovers mapping `--font-sans`/`--font-mono` to `--font-geist-sans`/`--font-geist-mono` — variables that stop being set once `layout.tsx` switches from the Geist fonts to self-hosted Anton/Manrope. A light/dark OS-preference toggle is also inconsistent with MARCA-05's single fixed dark brand surface (the new `<body>` sets its background/text colour directly via `bg-surface-deep`/`text-text-on-dark` token utilities, so the old block was fully inert either way, just misleading).
- **Fix:** Removed the four dead blocks; kept the two required imports (`design-tokens.css`, `tailwindcss`) exactly as instructed, and appended the new `:focus-visible` rule.
- **Files modified:** `src/app/globals.css`
- **Verification:** `node -e` check confirms `design-tokens.css` import and a `focus-visible` rule both still present; `npm run build` passes with no CSS errors.
- **Committed in:** `a875220`

---

**Total deviations:** 5 auto-fixed (4 Rule 1 bugs, 1 Rule 3 blocking issue) — all caught and fixed within the same task's own verification pass, no scope change, no architectural decision required.

## Issues Encountered

None beyond the deviations documented above.

## User Setup Required

None — no external service configuration required.

## Known Stubs

None. The shell is fully wired end to end (real logo image, real store data, real Instagram link, real self-hosted fonts). The promotional script typeface (Caveat) remains a Claude's-discretion typography choice carried forward from `01-05-SUMMARY.md` — documented in `docs/brand-guidelines.md`'s Tipografia section, not a stub.

## Recommended Follow-Up (not blocking)

Three of this plan's `must_haves` are inherently visual/interactive judgment calls (MARCA-05's material fidelity, PERF-01's live keyboard-focus visibility and skip-link landing behaviour, PERF-03's actual 320px-viewport reflow) that this session self-verified through prerendered-HTML inspection and static structural checks, but did not exercise in a live browser walkthrough. A human doing the plan's own `<human-check>` steps (Tab through the home page, narrow to 320px, compare against `img/logo.png`) before this shell is shown to the client is the recommended next step — consistent with the same caveat `01-05-SUMMARY.md` already carried for the logo's visual fidelity.

## Next Phase Readiness

- `docs/brand-guidelines.md` is the one document Phase 2 needs to build an on-brand, contrast-compliant component — palette, typography, logo paths, visual language, and component-application rules are all there, cross-referenced against `src/content/tone-of-voice.md` for voice.
- `src/app/layout.tsx` + `SkipLink`/`Header`/`Footer` are stable — Phase 2's hero/location section only needs to fill `{children}` inside the existing `<main id="main-content">`; no shell changes expected.
- The `Header`/`Footer`-render-inner-content-only pattern (Deviation 1) is now the established shape for any future landmark-adjacent component.
- Phase 1 is now complete: all six plans (`01-01` through `01-06`) executed.

## Self-Check: PASSED

All 8 claimed created/modified files verified present on disk (`src/app/layout.tsx`, `src/app/globals.css`, `src/app/page.tsx`, `src/components/layout/SkipLink.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Footer.tsx`, `src/components/layout/layout.test.ts`, `docs/brand-guidelines.md`); all three task commits (`a875220`, `3c6b213`, `6dc4c69`) verified present in `git log --oneline --all`.

---
*Phase: 01-foundation-architecture-brand-identity-security-baseline*
*Completed: 2026-09-13*

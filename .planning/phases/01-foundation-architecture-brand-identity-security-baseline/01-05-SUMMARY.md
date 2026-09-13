---
phase: 01-foundation-architecture-brand-identity-security-baseline
plan: 05
subsystem: brand
tags: [brand-identity, svg, potrace, sharp, svgo, design-tokens, vitest, tdd]

# Dependency graph
requires:
  - phase: 01-01
    provides: "potrace/sharp/svgo devDependencies, vitest.config.mts runner, src/app scaffold"
provides:
  - "public/brand/*.svg — six provisional-marked logo variants (principal, invertido, mono-preto, mono-branco, icone, favicon-source), regenerable in one command from img/logo.png"
  - "scripts/vectorize-logo.mjs — reproducible per-colour-mask trace pipeline (sharp masks -> potrace per layer -> svgo) plus the Next.js icon-convention rasterisation stage"
  - "src/app/icon.svg, apple-icon.png, favicon.ico — the three Next.js icon-convention files, generated (not hand-written)"
  - "src/styles/design-tokens.css + .json — the seven official brand colours and the display/body/script type scale as paired, test-enforced tokens"
  - "src/lib/brand/brand-assets.test.ts — guards MARCA-01 variant completeness and MARCA-02/03 token parity for every future phase"
affects: ["01-06 (brand-guidelines.md will document these exact paths)", "all Phase 2-5 UI plans (consume design-tokens.css via Tailwind v4 @theme and public/brand/* via next/image)"]

# Actuals (#2632) — chars/4 over the realized diff (added lines only), not a harness token count.
actuals:
  tokens: 19363
  tasks: 3
  commits: 4
plan_head_before: b378a2a11555dab29d1ae2a6ff3a53d1f0b4ff9

tech-stack:
  added: [] # potrace/sharp/svgo already installed in plan 01-01; no new dependency added here
  patterns:
    - "Per-colour-mask trace pipeline: sharp builds a bilevel PNG mask per colour region from raw pixel thresholds, potrace traces each mask once, and the same traced path geometry is re-rendered with different fill colours (getPathTag(color)) to produce every palette variant without re-tracing"
    - "Minimal hand-rolled ICO container (header + directory entries + embedded PNG frames) instead of a dedicated ico-encoding dependency, per the plan's explicit 'do not substitute a renamed PNG' instruction"
    - "Design tokens as paired CSS custom properties + JSON mirror, cross-validated by a single Vitest suite so a token added to one file and not the other fails the suite"

key-files:
  created:
    - scripts/vectorize-logo.mjs
    - public/brand/logo-principal.svg
    - public/brand/logo-invertido.svg
    - public/brand/logo-mono-preto.svg
    - public/brand/logo-mono-branco.svg
    - public/brand/logo-icone.svg
    - public/brand/favicon-source.svg
    - src/app/icon.svg
    - src/app/apple-icon.png
    - src/styles/design-tokens.css
    - src/styles/design-tokens.json
    - src/lib/brand/brand-assets.test.ts
  modified:
    - src/app/favicon.ico
    - src/app/globals.css

key-decisions:
  - "Extraction thresholds tuned against the real pixel values in img/logo.png (1254x1254, 3-channel RGB, no alpha), sampled via a raw-pixel dominant-colour scan this session: lettering mask = r>190 && g>190 && b>190; icon mask = g>150 && 100<r<230 && b<100. Both are logged by the script on every run so a later re-tune starts from these exact numbers, not a guess."
  - "The lettering traced cleanly on the first pass (rounded letterforms and counters intact, no broken paths) — the CONTEXT.md-sanctioned hand-authored-fallback was not needed."
  - "Both traced layers (lettering, icon) are re-rendered with different fill colours from a single Potrace instance per layer (getPathTag(color) called multiple times) rather than re-tracing per variant — halves the tracing work and guarantees every variant's geometry is pixel-identical across colours."
  - "favicon-source.svg and logo-icone.svg are both transparent (icon path only, no background rect) — the charcoal brand field is composited at raster time (apple-icon.png, favicon.ico) via sharp's .flatten(), not baked into the SVG source, so the same source SVG stays reusable on any background."
  - "src/app/icon.svg is a byte-identical copy of favicon-source.svg's final (svgo-optimised, provisional-notice-annotated) content, not a second independent generation pass — guarantees the modern-browser tab icon and the raster sources trace back to the exact same geometry."
  - "favicon.ico is assembled directly by a ~25-line hand-rolled ICO container (header + directory entries + embedded PNG frames at 16/32/48px) inside the script, per the plan's explicit instruction to avoid substituting a renamed PNG when sharp cannot emit .ico natively — no ico-encoding dependency added."
  - "design-tokens.json colour keys are named semantically (accent, surfacePrimary, surfaceDeep, textOnDark, accentPurple, accentCoral, accentOlive) rather than by appearance, per the plan's own guidance — lets a future component ask for 'accent' rather than a hex."
  - "The promotional-script typeface is named Caveat (a widely available handwritten Google Font) — PROJECT.md specifies only 'script só em frases promocionais' with no font name, so this is a Claude's-Discretion typography selection (consistent with the Instagram reference screenshots' handwritten 'Happy Hour' treatment cited in 01-CONTEXT.md), not a commercial claim. Flagged here for the human aesthetic check plan 01-05's own must_haves assigns to MARCA-03 (font selection is a judgment call no grep can make)."
  - "src/lib/brand/brand-assets.test.ts followed the plan's TDD RED->GREEN cycle: RED committed with 9/15 assertions failing (design-tokens.json/.css did not exist yet; the 6 brand-variant checks already passed against Task 1's output), GREEN committed after design-tokens.css/.json + the globals.css import landed, 15/15 passing. No REFACTOR commit — the GREEN implementation needed no cleanup."

patterns-established:
  - "Re-run scripts/vectorize-logo.mjs any time img/logo.png changes or the trace needs improving — it is idempotent (a clean re-run with no source change produces byte-identical output, verified this session) and is the only sanctioned way to touch public/brand/*.svg or the three src/app icon files."
  - "Any future brand colour or font addition must land in both design-tokens.json and design-tokens.css in the same change — brand-assets.test.ts fails the build otherwise."

requirements-completed: [MARCA-01, MARCA-02, MARCA-03]

coverage:
  - id: D1
    description: "Six provisional-marked logo variants exist at the exact public/brand/ paths this plan and future plans depend on, each carrying the img/logo.png provisional-source notice and no script/event markup, with the icon layer's lime-green fill intact (not collapsed into a silhouette)"
    requirement: MARCA-01
    verification:
      - kind: other
        ref: "node scripts/vectorize-logo.mjs — exits 0, writes 6 SVG + 3 icon files, fails loudly on any missing/zero-length output"
        status: pass
      - kind: other
        ref: "node -e variant-integrity script from PLAN.md Task 1 <verify> (existence, size >200 bytes, <svg> root, viewBox, provisional notice, no script/event markup)"
        status: pass
      - kind: other
        ref: "node -e palette-fidelity script from PLAN.md Task 1 <verify> (logo-principal.svg contains #B8FF00, no off-palette hex)"
        status: pass
      - kind: unit
        ref: "src/lib/brand/brand-assets.test.ts — 6 per-variant existence/content assertions"
        status: pass
      - kind: other
        ref: "git diff --exit-code -- img/logo.png (source untouched)"
        status: pass
      - kind: human
        ref: "Visual side-by-side render (logo-principal, logo-icone, logo-invertido, logo-mono-branco, favicon-source) against img/logo.png — self-verified this session via rendered PNG previews, since this task carries no checkpoint and runs autonomously"
        status: pass
    human_judgment: true
    rationale: "D-01's 'aproximação fiel' bar is inherently visual. Self-verified by rendering every variant to PNG and inspecting side by side with img/logo.png this session (letters read 'it's garlic' with intact rounded counters; the garlic bulb keeps its lime-green fill, top 'root' sprigs, and the separate leaf/petal shape). A final human sign-off before client-facing use is still recommended, matching this plan's own must_haves note."
  - id: D2
    description: "The three Next.js icon-convention files (icon.svg, apple-icon.png, favicon.ico) exist with the exact required file types and dimensions, generated from the icon variant, with no hand-written <link rel=\"icon\"> tag competing with the framework's own head generation"
    requirement: MARCA-01
    verification:
      - kind: other
        ref: "node -e icon-convention script from PLAN.md Task 2 <verify> (existence, min sizes, no apple-icon.svg)"
        status: pass
      - kind: other
        ref: "sharp metadata check — apple-icon.png is exactly 180x180"
        status: pass
      - kind: other
        ref: "favicon.ico header inspection — reserved=0, type=1 (icon), count=3, valid ICO container (not a renamed PNG)"
        status: pass
      - kind: other
        ref: "npm run build — exits 0; Next.js generates /icon.svg and /apple-icon.png routes"
        status: pass
      - kind: other
        ref: "grep for rel=\"icon\"|apple-touch-icon under src/ — no matches"
        status: pass
    human_judgment: false
  - id: D3
    description: "The seven official brand colours and the display/body/script type scale exist once, in two agreeing forms (design-tokens.css, design-tokens.json), reachable by the browser through globals.css, with a token added to one file and not the other failing the suite"
    requirement: "MARCA-02, MARCA-03"
    verification:
      - kind: unit
        ref: "src/lib/brand/brand-assets.test.ts — 9 token-parity assertions (JSON colour count, official-palette membership, CSS/JSON set equality, off-palette scan, font vars, type-scale vars, typography family names)"
        status: pass
      - kind: other
        ref: "node -e token-parity script from PLAN.md Task 3 <verify> (7-colour count both files, off-palette scan, --font- presence)"
        status: pass
      - kind: other
        ref: "node -e token-wiring script from PLAN.md Task 3 <verify> (globals.css imports design-tokens.css, no tailwind.config.js/.ts)"
        status: pass
      - kind: other
        ref: "npm run build && npm test — both exit 0 (58/58 tests, 6 files)"
        status: pass
    human_judgment: false
duration: ~35min
completed: 2026-09-13
status: complete
---

# Phase 1 Plan 5: Brand Identity — Logo Vectorization, Icon Conventions & Design Tokens Summary

**A per-colour-mask trace pipeline (sharp → potrace → svgo) reconstructed the It's Garlic logo from `img/logo.png` into six provisional-marked SVG variants and the three Next.js icon-convention files, and the seven official brand colours plus the display/body/script type scale now exist as a test-enforced CSS/JSON token pair.**

## Performance

- **Duration:** ~35 min (commit-to-commit: `e7a0b78` at 14:09 to `11014a9` at 14:15, America/Recife)
- **Started:** 2026-09-13T17:09:00Z (approx, first Task 1 commit)
- **Completed:** 2026-09-13T17:15:00Z
- **Tasks:** 3 (2 auto, 1 auto/TDD)
- **Files modified:** 14 (12 created, 2 modified)

## Accomplishments

- Built `scripts/vectorize-logo.mjs`: extracts two independent binary masks from `img/logo.png` (lettering, icon) using pixel thresholds tuned against the real file, traces each once with `potrace`, and re-renders the same traced geometry with different fill colours to compose all six `public/brand/*.svg` variants without a second trace pass per colour.
- The lettering traced cleanly on the first attempt — rounded letterforms and counters intact — so the CONTEXT.md hand-authored fallback was never needed.
- Extended the same script to rasterise the icon layer into the three Next.js icon-convention files (`icon.svg`, `apple-icon.png` at exactly 180×180 composited over the opaque charcoal field, and `favicon.ico` assembled via a hand-rolled ICO container from 16/32/48px PNG frames) — replacing the plan 01-01 scaffold placeholder.
- Verified the script is idempotent: a clean re-run with no source change reproduces byte-identical output, confirmed via `git status --short` showing zero diff.
- Followed the plan's TDD flow for Task 3: wrote `src/lib/brand/brand-assets.test.ts` first (RED — 9/15 assertions failed because the token files didn't exist yet), then created `design-tokens.json`/`design-tokens.css` and wired `globals.css` (GREEN — 15/15 passing).
- Published the seven official brand colours as paired, semantically-named CSS custom properties and a JSON mirror, plus `--font-display`/`--font-body`/`--font-script` and a mobile-first heading/body type scale, wired into a Tailwind v4 `@theme inline` block.
- Self-verified visual fidelity this session (task carries no checkpoint, runs autonomously): rendered every SVG variant to PNG and inspected side by side with `img/logo.png` — see `## Extraction Thresholds & Fidelity Notes` below.

## Task Commits

Each task was committed atomically:

1. **Task 1: Build the per-colour-mask trace pipeline and generate the six logo variants** — `e7a0b78` (feat)
2. **Task 2: Generate the three Next.js icon-convention files from the icon variant** — `095e48e` (feat)
3. **Task 3: Publish the palette and type scale as paired CSS and JSON design tokens** — `d286c59` (test, RED) + `11014a9` (feat, GREEN)

_Note: Task 3 was TDD (`tdd="true"`) — RED commit `d286c59` then GREEN commit `11014a9`; no separate REFACTOR commit was needed._

**Plan metadata:** commit pending as part of this final step (`docs(01-05): complete...`).

## Extraction Thresholds & Fidelity Notes

- **Source:** `img/logo.png`, 1254×1254px, 3-channel RGB, no alpha.
- **Lettering mask threshold:** `r > 190 && g > 190 && b > 190` (near-white against the black field).
- **Icon mask threshold:** `g > 150 && 100 < r < 230 && b < 100` (lime-green against both the black field and the white lettering).
- Both thresholds were derived from a raw-pixel dominant-colour scan this session (top clusters at `(0,0,0)` black, `(255,255,255)` white, `(184,248,24)` green — close to the official `#B8FF00`) and are logged by the script on every run.
- **Icon bounding box** (used to derive the isolated-icon and favicon-source viewBoxes): x `[765, 1010]`, y `[292, 621]` — 246×330px, computed programmatically each run (not hardcoded), so a future `img/logo.png` replacement re-derives the crop automatically.
- **Lettering:** traced on the first attempt with intact rounded counters (the "o" and "a" loops, the "i" dots, the apostrophe) — no broken paths, no fallback to hand-authored letters needed.
- **Icon:** the traced bulb keeps the lime-green fill, the three "root sprig" marks at the top, the crescent eye/highlight negative-space detail, and the separate lower-right leaf/petal shape — recognisable as the same mark as `img/logo.png`, though the exact eye/mouth "face" detail traced as a slightly different negative-space shape than the original's two-eyes-and-smile illustration (an expected artefact of binary-threshold tracing, not a lost feature — the bulb + leaf + root-sprig composition that makes the icon identifiable is fully intact).

## Files Created/Modified

- `scripts/vectorize-logo.mjs` — the reproducible trace pipeline (Task 1) extended with the icon-convention rasterisation stage (Task 2); single source of truth for regenerating every brand asset
- `public/brand/logo-principal.svg` — full colour on the dark brand field (black bg, white lettering, lime-green icon)
- `public/brand/logo-invertido.svg` — white bg, charcoal lettering, lime-green icon — for light backgrounds
- `public/brand/logo-mono-preto.svg` — single black fill, transparent background
- `public/brand/logo-mono-branco.svg` — single white fill, transparent background — for use on dark surfaces
- `public/brand/logo-icone.svg` — isolated garlic-bulb icon, tight viewBox, transparent background
- `public/brand/favicon-source.svg` — icon on a square, evenly-padded transparent canvas — the raster source for Task 2
- `src/app/icon.svg` — byte-identical copy of favicon-source.svg's final content (modern-browser convention)
- `src/app/apple-icon.png` — 180×180 PNG, icon composited over the opaque charcoal field
- `src/app/favicon.ico` — legacy ICO container (16/32/48px PNG frames), replaces the plan 01-01 scaffold placeholder
- `src/styles/design-tokens.css` — `--color-*`, `--font-*`, `--text-*` custom properties + Tailwind v4 `@theme inline` block
- `src/styles/design-tokens.json` — machine-readable mirror: 7 colours + typography (display/body/script) sections
- `src/app/globals.css` — added `@import "../styles/design-tokens.css";` above the Tailwind import
- `src/lib/brand/brand-assets.test.ts` — 15 Vitest assertions guarding MARCA-01 variant completeness and MARCA-02/03 token parity

## Decisions Made

See `key-decisions` in frontmatter for the full list. The two most consequential for later phases:

- **Font loading is deliberately out of scope here.** `--font-display`/`--font-body`/`--font-script` are declared with fallback stacks now; plan 01-06 binds actual `next/font` instances to these same variable names in `src/app/layout.tsx`. Any component written against `var(--font-display)` today will pick up the real self-hosted font automatically once 01-06 lands, with no component-side change.
- **The promotional script typeface (Caveat) is a Claude's-Discretion typography choice**, not a locked brand decision — PROJECT.md only specifies "script só em frases promocionais" with no font name. Flagged explicitly for a human aesthetic pass alongside the logo fidelity check.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] svgo v4's `preset-default` does not include `removeViewBox`, and overriding it printed a warning on every run**
- **Found during:** Task 1, first script run
- **Issue:** The initial SVGO config explicitly disabled `removeViewBox` inside `preset-default`'s `overrides`, following the pattern used in svgo v2/v3. In svgo v4 (the version installed by plan 01-01), `removeViewBox` was moved out of `preset-default` entirely, so the override target doesn't exist — svgo printed a "you are trying to configure removeViewBox which is not part of preset-default" warning twice per SVG (12 times per run) without affecting output.
- **Fix:** Removed the override; `plugins: ["preset-default"]` alone is sufficient in v4, and the viewBox is never at risk of removal since v4's default preset doesn't touch it.
- **Files modified:** `scripts/vectorize-logo.mjs`
- **Verification:** Re-ran the script — zero warnings, all six variants still carry a `viewBox` (confirmed by the Task 1 `<verify>` script).
- **Committed in:** `e7a0b78` (Task 1 commit — fixed before the first commit, not a follow-up patch)

---

**Total deviations:** 1 auto-fixed (1 bug, cosmetic/noise-only — no functional impact, fixed before the first commit)
**Impact on plan:** None on scope or output; purely a config-correctness fix caught during the same task's own verification pass.

## Issues Encountered

None beyond the svgo config warning documented above.

## User Setup Required

None — this plan is fully self-contained (no external service, account, or manual dashboard action required).

## Known Stubs

None. All six logo variants and all three icon-convention files are fully generated, non-empty, and pass every automated acceptance criterion. The promotional-script font choice (Caveat) is a design decision flagged for human review, not a stub or placeholder.

## Next Phase Readiness

- `public/brand/*.svg` and `src/styles/design-tokens.{css,json}` are now the stable, documented paths plan 01-06's `docs/brand-guidelines.md` will reference — no path renegotiation needed.
- `--font-display`/`--font-body`/`--font-script` custom property names are locked; plan 01-06 only needs to bind `next/font` instances to them in `layout.tsx`.
- A professional vector delivery later is a pure overwrite at the six `public/brand/*.svg` paths (or a `scripts/vectorize-logo.mjs` re-run with retuned thresholds if `img/logo.png` itself is replaced) — no component import path changes required, per D-01.
- Recommended (not blocking): a human sign-off on the logo's visual fidelity and the Caveat script-font choice before either is shown to the client, since both are judgment calls this session self-verified but did not have a dedicated checkpoint to route through a second reviewer.

## Self-Check: PASSED

All 12 claimed created files verified present on disk (`scripts/vectorize-logo.mjs`, six `public/brand/*.svg` files, `src/app/icon.svg`, `src/app/apple-icon.png`, `src/styles/design-tokens.css`, `src/styles/design-tokens.json`, `src/lib/brand/brand-assets.test.ts`); `src/app/favicon.ico` and `src/app/globals.css` verified modified; all four plan commits (`e7a0b78`, `095e48e`, `d286c59`, `11014a9`) verified present in `git log --oneline --all`.

---
*Phase: 01-foundation-architecture-brand-identity-security-baseline*
*Completed: 2026-09-13*

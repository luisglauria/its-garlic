---
phase: "02"
slug: "hero-ctas-location"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: validated
nyquist_compliant: true
wave_0_complete: true
created: "2026-09-13"
---

# Phase 02 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest `5.0.0` `[VERIFIED: package.json]`, `environment: "node"` (no DOM) — unchanged from Phase 1 |
| **Config file** | `vitest.config.ts` (repo root) — unchanged this phase |
| **Quick run command** | `npx vitest run src/components/home` (once the new test files exist) |
| **Full suite command** | `npm test` (== `vitest run`) |
| **Estimated runtime** | ~10 seconds (small unit suite, no browser/jsdom) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run <new-file>.test.ts`
- **After every plan wave:** Run `npm test`
- **Before `/gsd-verify-work`:** Full suite must be green, **plus** a manual mobile-viewport check
  (~375–390px height) for the "CTAs visible without scrolling" fold criterion — not automatable by
  this project's static-source-inspection test stack
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

*Plan/Wave/Task ID columns filled by the planner on 2026-09-13. Status is filled from real runs
during execution; `/gsd-validate-phase` (or plan 02-03 Task 3) confirms sign-off afterwards.*

**Planner note — test style upgraded, with no new dependency.** The draft assumed no DOM renderer
was available (RESEARCH.md Alternatives Considered) and proposed source-regex for the branch rows.
Probed during planning: a Vitest test in this repo's `node` environment imports a `.tsx` Server
Component and renders it with `react-dom/server`'s `renderToStaticMarkup` — including a component
using `next/image` — with only the already-installed `react-dom`. Both probes passed. So the
"fixture-prop unit test" rows below assert **rendered markup**, not source text. The RTL/jsdom
stack stays not-adopted and no package is installed.

**File Exists** — there is no separate Wave 0: each test file is created in the same task as the
component it guards, matching the Phase 1 precedent (`layout.test.ts` landed with `Header`/`Footer`).

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| T1, T3 | 02-01 | 1 | HERO-01 | — | The concept line reaches the prerendered HTML as document text, not lettering in the image; no hex literal in any `home/` component | prerendered-HTML assertion + static source inspection | `npx vitest run src/components/home/home.test.ts` | created in T1/T3 | ✅ green |
| T2, T3 | 02-01 | 1 | HERO-02 | — | All three locked CTA labels appear verbatim in the copy module and in the rendered page | prerendered-HTML assertion + static source inspection | same file | created in T3 | ✅ green |
| T1, T3 | 02-01 | 1 | HERO-03 | T-02-03 | Hero uses `next/image` with `fill`, an aspect-ratio container, `sizes` and `preload`, points at `brand/hero-illustration`, and renders a visible provisional disclosure | prerendered-HTML assertion + static source inspection | same file | created in T1/T3 | ✅ green |
| T1, T2 | 02-02 | 2 | LOCAL-01 | T-02-11, T-02-14 | `Location` renders address fields from a `StoreInfo` prop (no literal) and its anchor href comes from the maps prop; no iframe in any `.ts`/`.tsx`/`.css` under `src/` | rendered-output fixture test + repository-wide sweep | `npx vitest run src/components/home/Location.test.ts` | created in T1/T2 | ✅ green |
| T1 | 02-02 | 2 | LOCAL-02 | T-02-13 | `Location` maps over `store.modalities`; 3-item, 1-item and 0-item fixtures each render the matching chip count (0 renders nothing at all) | rendered-output fixture test | same file | created in T1 | ✅ green |
| T1, T2 | 02-02 | 2 | LOCAL-03 | T-02-10 | The provisional marker is driven by `hours.provisional`; the pending body renders only for an empty schedule, and a populated fixture renders day/open/close rows instead. No clock time in any non-test `home/` source or in the copy module | rendered-output fixture test + comment-stripped source sweep | same file, plus `npx vitest run src/components/home/home.test.ts` | created in T1/T2 | ✅ green |
| T1 | 02-02 | 2 | LOCAL-04 | T-02-12 | The directions anchor's rendered href equals the maps `IntegrationLink` url exactly, with the new-tab target and safe rel | rendered-output fixture test | `npx vitest run src/components/home/Location.test.ts` | created in T1 | ✅ green |
| T2 | 02-01 | 1 | INTEGRA-01 | T-02-02 | `OrderCta` renders a live anchor for a `{confirmed: true}` fixture and a natively disabled button with the pending suffix (and no href at all) for a `{confirmed: false}` fixture | rendered-output fixture test | `npx vitest run src/components/home/OrderCta.test.ts` | created in T2 | ✅ green |
| T2 (human-check) | 02-01 | 1 | INTEGRA-01 (mobile-fold) | — | Both order CTAs visible side by side without scrolling past the hero at ~375x667 and ~390x844 | manual/visual only — not automatable by this stack | n/a | n/a | ⬜ pending (manual) |
| T2 | 02-01 | 1 | INTEGRA-02 | T-02-02 | Same confirmed/pending contract for the WhatsApp CTA, rendered through the same shared primitive (D-06 parity is structural) | rendered-output fixture test | same file | created in T2 | ✅ green |
| T2 | 02-01 | 1 | INTEGRA-03 | T-02-02 | The unavailability notice renders only while the iFood link is unconfirmed and points at the confirmed directions action, never swapping in another live order channel; no iFood/WhatsApp host and no unconfirmed-destination sentinel reaches the rendered document | rendered-output fixture test + prerendered-HTML assertion | same file | created in T2 | ✅ green |
| T3 | 02-01 | 1 | INTEGRA-05 | T-02-06 | No form element and no cart/checkout affordance in the comment-stripped source of any non-test `home/` component or of `src/app/page.tsx` — asserted by directory sweep, so later-added sections are covered | comment-stripped directory sweep | `npx vitest run src/components/home/home.test.ts` | created in T3 | ✅ green |
| T3 | 02-03 | 3 | INTEGRA-05 (copy) | T-02-18 | The same cart/checkout guard extended to `src/content/home-copy.ts`; the FAQ's ordering answer routes to iFood or WhatsApp | comment-stripped source sweep + rendered-output assertion | `npx vitest run src/components/home/sections.test.ts src/components/home/home.test.ts` | created in T3 | ✅ green |
| T3 | 02-01 | 1 | SEC-03 (carried) | T-02-01 | No `home/` component contains a URL literal or imports `@/data/*`; the page calls all three `build*Url()` functions | comment-stripped directory sweep | `npx vitest run src/components/home/home.test.ts` | created in T3 | ✅ green |
| T1, T2, T3 | 02-03 | 3 | CONT-02 (final copy, `writtenInPhase: 2`) | T-02-16, T-02-17 | The brand story covers its three skeleton points and the FAQ its four; the FAQ's address and modality answers agree with the record read through `getStoreInfo()`; the copy module carries no currency amount, award, rating, star count, named superlative/guilt construction, or clock time | rendered-output test + named-test content-integrity gate | `npx vitest run src/components/home/sections.test.ts src/components/home/home.test.ts` | created in T3 | ✅ green |
| T2 | 02-03 | 3 | CONT-02 (zero-JS disclosure) | T-02-19, T-02-20 | Each FAQ entry is a native disclosure element — no client directive, no state/effect hook, no click handler, no hand-wired expanded/controls attributes — asserted in source and in the rendered document | prerendered-HTML assertion + static source inspection | same file | created in T2/T3 | ✅ green |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Gap-closure waves (audited 2026-09-14 — plans 02-04/02-05/02-06, post-UAT fixes for G-02-5/G-02-2/G-02-4):**

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| T1 | 02-04 | 4 | MARCA-02, MARCA-03 | T-02-04-01 | Zero self-referential custom properties in compiled CSS; all 7 brand colours + both font families resolve to their official literal | source regression test + compiled-artifact checker | `npx vitest run src/lib/brand/brand-assets.test.ts && npm run build && npm run verify:css` | created/extended in T1 | ✅ green |
| T2 | 02-04 | 4 | MARCA-02, MARCA-03, PERF-01 (WCAG 2.4.7) | T-02-04-01 | Neither cause of the token-cycle outage (self-mirrored var, wrong `@import` order) can reappear undetected; focus rule survives into compiled CSS | source-level guard (28 tests) + compiled-artifact checker | `npx vitest run src/styles/design-tokens.test.ts && npm run build && npm run verify:css && npm test && npm run lint` | created in T2 | ✅ green |
| T2 (human-check) | 02-04 | 4 | PERF-01 (focus ring paint) | — | Every tab stop paints a visible lime ring; palette/fonts render on brand-dark surfaces, not white-page-black-text | manual/visual only — not automatable by this stack | n/a | n/a | ⬜ pending (manual) |
| T1 | 02-05 | 5 | D-01a (doc amendment) | — | 02-CONTEXT.md/02-UI-SPEC.md amendment text present, gap id cited, original decision preserved | node text-presence assertion | inline `node -e` check in plan verify | n/a (docs) | ✅ green |
| T2 | 02-05 | 5 | INTEGRA-01, INTEGRA-02, INTEGRA-03, HERO-02 | T-02-05-01, T-02-05-02 | Order row reaches the document only through Hero, precedes the illustration; no URL literal escapes the row; disabled/coral-notice contract unchanged | rendered-output fixture test + composition assertion | `npx vitest run src/components/home/OrderCta.test.ts src/components/home/home.test.ts && npm test && npm run lint && npm run build` | migrated/extended in T2 | ✅ green |
| T3 | 02-05 | 5 | INTEGRA-01 (mobile-fold), PERF-03 | — | Order row precedes illustration; two-column grid with no responsive gate; both labels fit one track at 375px (word-length budget computed from real tokens) | persistent fold-contract guard (5 named tests) | `npx vitest run src/components/home/hero-fold.test.ts && npm test` | created in T3 | ✅ green |
| T3 (human-check) | 02-05 | 5 | INTEGRA-01 (mobile-fold, visual) | — | Both order CTAs visible side by side pre-scroll at 375x667/390x844, no overflow, visible focus ring, inert on click | manual/visual only — not automatable by this stack | n/a | n/a | ⬜ pending (manual) |
| T1 | 02-06 | 6 | MARCA-05 | T-02-06-01 | `SectionSeparator` exports the component + class string, `aria-hidden`, no hex literal, uses the olive/deep/charcoal token utilities | node source-assertion | inline `node -e` check in plan verify + `npm run lint` | created in T1 | ✅ green |
| T2 | 02-06 | 6 | MARCA-02, MARCA-05, PERF-03 (48px spacing) | T-02-06-02 | Exactly 2 separators in `page.tsx` (brand-story→Location, Location→FAQ) + 1 in `Footer.tsx` (FAQ→footer, previously unreported); one-off wedge retired | rendered-output regression + node composition-count assertion | `npm run lint && npm run build && npx vitest run src/components/home/sections.test.ts src/components/layout/layout.test.ts src/components/home/home.test.ts` | migrated/retired in T2 | ✅ green |
| T2 (human-check) | 02-06 | 6 | MARCA-05 (visual) | — | Four distinct blocks reading as deliberate dividers at a glance, scrolling brand-story→Location→FAQ→footer | manual/visual only — not automatable by this stack | n/a | n/a | ⬜ pending (manual) |
| T3 | 02-06 | 6 | MARCA-05 | T-02-06-02 | Derives each section's surface from its own source (not hardcoded); exactly one clip-path device exists in `src/`; olive-vs-charcoal contrast ≥3:1 computed from real token values | source-derived boundary guard (14 tests) + WCAG contrast computation | `npx vitest run src/components/home/section-boundaries.test.ts && npm test && npm run lint && npm run build && npm run verify:css` | created in T3 | ✅ green |

**Full-suite confirmation (measured, not narrated):** `npm test` 186/186 after 02-04, 196/196 after 02-05, 210/210 after 02-06 — each SUMMARY.md's own reported run, cross-checked against the commit ledger (no `commits:`/`plan_head_before:` mismatch on any of the three).

**Sampling continuity check (planner):** no three consecutive tasks lack an automated verify — all
eight tasks across the three plans carry at least one runnable `<automated>` command with a stated
failing direction, and every command is either a script proven in Phase 1 (`npm --prefix . run
build`, `npm --prefix . run lint`, `npm --prefix . test`, the prerendered-HTML assertion pattern) or
a `npx vitest run <path>` against a file the same task creates.

---

## Wave 0 Requirements

**Planner resolution: this phase has no separate Wave 0.** Each test file is created in the same
task as the component it guards, which is this project's established precedent
(`src/components/layout/layout.test.ts` was written and extended inside the same tasks that built
`Header`/`Footer` in plan 01-06). Every task therefore carries a real `<automated>` verify from its
first commit — no task ships with a `MISSING — Wave 0` placeholder.

- [ ] `src/components/home/home.test.ts` — the phase's cumulative guard suite. Created in plan
  02-01 Task 3 (HERO-01/02/03 source facts, INTEGRA-05 no-checkout sweep, SEC-03 no-raw-URL /
  no-direct-data-import / no-hex sweep, PERF-03 no-fixed-pixel sweep), extended in plan 02-02 Task 2
  (LOCAL-01/04 seams, repository-wide no-iframe, the `CLOCK_TIME` guard) and in plan 02-03 Task 3
  (the content-integrity gate over `src/content/home-copy.ts`).
- [ ] `src/components/home/OrderCta.test.ts` — created in plan 02-01 Task 2; covers
  INTEGRA-01/02/03's confirmed and pending branches against rendered markup.
- [ ] `src/components/home/Location.test.ts` — created in plan 02-02 Task 1; covers LOCAL-01/02/03/04,
  including the zero/one/many modality cardinalities and the populated-schedule branch real data
  never produces today.
- [ ] `src/components/home/sections.test.ts` — created in plan 02-03 Task 3; covers the brand story's
  required points and every FAQ entry, asserted against the copy arrays' own lengths and against the
  store record read through `getStoreInfo()`.
- No new test *framework* or config gap — `vitest.config.mts`'s `node` environment already covers
  this phase's testing style. The RTL/jsdom path stays not-adopted (RESEARCH.md Alternatives
  Considered); the rendered-output assertions use the already-installed `react-dom/server`, verified
  working in this repo during planning.

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| "Pedir no iFood" and WhatsApp CTA visible side by side without scrolling past the fold | INTEGRA-01 (mobile-fold) | Viewport-relative visual layout; the arithmetic budget is now guarded by `hero-fold.test.ts` (02-05 T3), but the actual paint/overflow is still a rendering fact, not observable from source in this project's DOM-less test stack | Load the page in a mobile viewport (~375×667–390×844), confirm both CTAs are visible pre-scroll |
| Brand palette + both font families render on brand-dark surfaces; visible lime focus ring on every tab stop | MARCA-02, MARCA-03, PERF-01 | Computed colour and painted focus outlines are browser rendering facts (02-04 T1 human-check) | `npm run dev`, load at 390x844, Tab through skip link → CTAs → directions links → all FAQ questions |
| Brand story, Location and FAQ read as four visually distinct blocks (incl. footer seam) | MARCA-05 | "Reads as distinct blocks" is a perceptual judgment the automated boundary/contrast guard cannot make (02-06 T2 human-check) | `npm run dev`, load at 390x844, scroll slowly brand-story → Location → FAQ → footer |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references (no separate Wave 0 needed — see above)
- [x] No watch-mode flags
- [x] Feedback latency < 10s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** confirmed by execution — every row above either ran its `<automated>` command
against the real codebase (all green, `npm test` — 158/158 passing across all 11 suites at
original phase completion) or is listed in the Manual-Only table (the INTEGRA-01 mobile-fold
check, deferred to end-of-phase UAT per `human_verify_mode: end-of-phase`, not skipped).

## Validation Audit 2026-09-14

Post-UAT gap-closure audit (plans 02-04/02-05/02-06, closing G-02-5/G-02-2/G-02-4 respectively).

| Metric | Count |
|--------|-------|
| Gaps found | 0 |
| Resolved | 0 |
| Escalated | 0 |

Every task in the three gap-closure plans carries a real `<automated>` command that ran green
against the codebase per its own SUMMARY.md (`npm test` 186/186 → 196/196 → 210/210 across the
three waves, in order). No Nyquist gap exists — `gsd-nyquist-auditor` was not spawned. Three new
Manual-Only entries were added for the plans' own `<human-check>` blocks (perceptual/visual facts
this project's DOM-less test stack cannot assert), consistent with the existing INTEGRA-01
mobile-fold precedent. `status: validated` set by this audit.

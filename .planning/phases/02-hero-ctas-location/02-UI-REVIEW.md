# Phase 02 — UI Review

**Audited:** 2026-09-13
**Baseline:** `.planning/phases/02-hero-ctas-location/02-UI-SPEC.md` (post-amendment, current state — includes D-01a hero focal-point reorder and the Color/Spacing amendments from plan 02-06)
**Screenshots:** not captured — no dev server was running in this session (code-only audit, per the task's context notes: no browser/Playwright MCP available). All findings below are static-analysis findings from source files, not paint-verified.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 4/4 | Every CTA label, empty-state, and error-notice string matches the UI-SPEC Copywriting Contract verbatim; no generic labels, no invented facts. |
| 2. Visuals | 4/4 | Hero focal-point ordering matches the D-01a amendment exactly (headline → subhead → order CTAs → illustration → disclosure); one unverifiable risk noted below (`preload` prop). |
| 3. Color | 4/4 | 60/30/10 split honored; accent used only on the declared roles (16 occurrences, all CTA/focus/kicker/badge uses); zero hardcoded hex literals in any component. |
| 4. Typography | 4/4 | Exactly the 5 declared size roles and exactly 2 weights (`font-semibold`, `font-normal`) used anywhere in `src/components/home` and `src/components/layout` — no drift. |
| 5. Spacing | 3/4 | The order-CTA row's own gap ships as `gap-3` (12px) in `OrderCtaRow.tsx`, but the UI-SPEC Spacing Scale table explicitly assigns the 8px (`sm`) token to "CTA row gap" — a direct, named contract mismatch. |
| 6. Experience Design | 3/4 | State coverage (empty hours, pending/disabled CTAs, zero-modality backstop) is genuinely thorough, but the app has no `error.tsx`/`not-found.tsx` — an unhandled runtime error falls through to Next.js's unbranded default screen. |

**Overall: 22/24**

---

## Top 3 Priority Fixes

1. **CTA row gap doesn't match the spec's own named token** — `src/components/home/OrderCtaRow.tsx` sets both the outer wrapper (`gap-3`) and `ORDER_ROW_CLASS` (`grid w-full grid-cols-2 gap-3`) to 12px, while `02-UI-SPEC.md`'s Spacing Scale table names the 8px `sm` token specifically for "CTA row gap." User impact: minor visual inconsistency with the documented spacing rhythm, and a contract the phase's own `hero-fold.test.ts` horizontal-budget math was tuned against without noticing the gap value itself drifted from spec. Fix: change both `gap-3` occurrences to `gap-2`, then re-run `hero-fold.test.ts`'s two-buttons-fit-one-track-each assertion to confirm 8px still clears the 343px/358px budget (it will — 12px→8px only recovers 4px of track width).

2. **No branded error/not-found boundary** — `src/app/` has no `error.tsx` or `not-found.tsx`. User impact: any runtime exception (even one unrelated to this phase, e.g. a future data-layer throw) drops the visitor onto Next.js's default white/black-on-white error page, breaking the "mobile-first, on-brand, never lose the visitor" Core Value stated in `.claude/CLAUDE.md` at the exact moment they'd need reassurance most. Fix: add a minimal `src/app/error.tsx` (Client Component, required by the App Router convention) and `src/app/not-found.tsx` (Server Component) that reuse the dark-surface/accent tokens and point the visitor at "Como chegar" or the WhatsApp/iFood CTAs, mirroring the tone-of-voice "problem + working next step" shape already used for INTEGRA-03.

3. **Unverified `next/image` `preload` prop on the hero's LCP-critical image** — `Hero.tsx` passes `preload` (not the conventional `priority`) to `next/image` for the hero illustration, justified in a code comment as confirmed against this project's installed Next.js 16 type definitions (`get-img-props.d.ts`), since `AGENTS.md` warns this Next.js version has breaking API changes from training-data expectations. User impact: if that prop name is wrong for the actually-installed version, the single largest above-the-fold image silently lazy-loads instead of preloading, which is exactly the failure mode that blows the project's own LCP ≤2.5s acceptance criterion with no visible error anywhere. Fix: before shipping, run `npm run build` and inspect the emitted HTML `<head>` for a `<link rel="preload" as="image">` pointing at `/brand/hero-illustration.svg`, or grep the installed `node_modules/next/dist/shared/lib/get-img-props.d.ts` directly to reconfirm the prop name against the exact patch version in `package-lock.json` — this is a one-command check that closes an otherwise-invisible LCP risk.

---

## Detailed Findings

### Pillar 1: Copywriting (4/4)
- `src/content/home-copy.ts` — all three locked HERO-02 labels (`ctaCopy.menuLabel`/`ifoodLabel`/`mapsLabel`) match the UI-SPEC Copywriting Contract table verbatim.
- Pending-suffix rendering (`OrderCta.tsx:52-55`, `PendingCta`) implements the amended two-line "(em breve)" shape exactly as the G-02-2 amendment specifies, preserving the accessible name.
- `ctaCopy.ifoodUnavailableNotice`/`whatsappUnavailableNotice` (`home-copy.ts:64-73`) both follow the problem+working-next-step shape and point at "Como chegar" — matches the spec's INTEGRA-03 row and its stated rationale not to link the not-yet-built cardápio route.
- `locationCopy.hoursPendingBody` (`home-copy.ts:98`) matches the spec's Empty-state body string character for character.
- `provisionalBadgeLabel` = "Provisório" (spec doesn't lock this exact word but it is consistent, reused identically for both the hours badge and the hero image disclosure per D-03/D-07).
- No generic "Submit"/"Click Here"/"OK" patterns found anywhere in `src/components/home` or `src/components/layout`.

### Pillar 2: Visuals (4/4)
- `Hero.tsx:23-67` renders kicker → headline → subhead → `OrderCtaRow` → illustration → disclosure, matching the amended UI-SPEC focal-point paragraph exactly (order actions before the illustration, illustration still the visual anchor).
- FAQ's decorative chevron (`Faq.tsx:22`) is `aria-hidden="true"`; the accessible name is carried entirely by the visible `<span>{entry.question}</span>` text, not the glyph — correct per the spec's "no icon library" / "meaning never depends on a decorative mark alone" rule.
- `SectionSeparator.tsx` is genuinely decorative (`aria-hidden`, no text, no tab stop) and its salience is derived from a real measured contrast ratio (documented 3.74:1 olive-on-Carvão) rather than an eyeballed taper — this is unusually rigorous for a boundary device and a clear pillar strength.
- Risk (not scored down, flagged for verification): `Hero.tsx:55` passes `preload` to `next/image`, a nonstandard prop name relative to widely-documented `next/image` usage; the comment claims this was checked against the installed package's own `.d.ts`, which is plausible given this repo's Next.js 16 pre-release/breaking-changes posture (`AGENTS.md`), but this auditor cannot independently confirm it without running a build. See Top Fix #3.

### Pillar 3: Color (4/4)
- 16 total `text-accent`/`bg-accent`/`border-accent` occurrences across `src/components/home` + `src/components/layout` — spread across the CTA fills/outlines (`OrderCta.tsx`), the kicker (`Hero.tsx:30`), FAQ chevron, focus ring (`globals.css`, not grepped here but referenced/tested in `design-tokens.test.ts`), and the "Como chegar" link underline — all are on the spec's declared accent role list, none is a full section background.
- Zero hardcoded hex literals (`#...`) found anywhere under `src/components` — all colors route through `design-tokens.css`'s `@theme static` block, exactly as the "never hex literals" rule requires.
- `ProvisionalBadge.tsx` deliberately sets its own `bg-surface-deep` regardless of caller context specifically to avoid the Oliva/Carvão contrast failure the spec's contrast table documents — a correct, load-bearing detail, not an accident.
- Coral (`text-accent-coral`) is used only for the two INTEGRA-03 notices (`OrderCtaRow.tsx:57,65`) — matches the spec's "exactly one use" reservation exactly (two instances, both are the one authorized use case: iFood and WhatsApp unavailability, both explicitly parity-matched per D-06/WR-01).

### Pillar 4: Typography (4/4)
- Size-role grep across `src/components/home` + `src/components/layout` returns exactly the five UI-SPEC-declared tokens (`--text-body`, `--text-body-sm`, `--text-heading-1`, `--text-heading-2`, `--text-heading-3`) and no others.
- Weight grep returns exactly `font-semibold` (600) and `font-normal` (used only for the pending-suffix span, `OrderCta.tsx:54`) — matches the spec's "two weights only" rule; body text relies on Manrope's 400 default rather than an explicit class, which is consistent with the contract's "400 regular for all body copy" (no override needed).
- `--text-heading-3` is correctly reserved for FAQ question text only (`Faq.tsx:20`), matching the spec's sub-role note.

### Pillar 5: Spacing (3/4)
- `OrderCtaRow.tsx:20,30` — both `ORDER_ROW_CLASS` and its wrapper use `gap-3` (12px). The UI-SPEC Spacing Scale table (`02-UI-SPEC.md` line 64) names the `sm` (8px) token specifically for "Compact element spacing (CTA row gap, chip padding)" — this is the one row in the whole scale that names this exact UI element, and the shipped value doesn't match it.
- `Faq.tsx:12` and `BrandStory.tsx:21` both use `sm:py-10` (40px) — not one of the seven named scale steps (4/8/16/24/32/48/64), though it is still a multiple of 4 per the scale's general convention. Minor, lower-severity than the CTA-row gap finding since the scale's own wording ("multiples of 4... no phase override") technically permits any 4-multiple, but it is untokenized where a named step (`xl`/32px or `2xl`/48px) was available and presumably intended.
- Everywhere else — `px-4`/`px-6` (16/24px), `py-8`/`py-12`/`py-16` (32/48/64px), `gap-1`/`gap-2`/`gap-4`/`gap-6` (4/8/16/24px) — maps cleanly onto the declared scale.
- The 44px (`min-h-11`) touch-target floor is applied consistently on every tappable control checked (`OrderCta.tsx` `TIER_CLASS`, `Faq.tsx` summary, `CtaGroup.tsx`/`Location.tsx` maps anchors).

### Pillar 6: Experience Design (3/4)
- Empty state: `Location.tsx:67-70` correctly branches on `store.hours.schedule.length === 0` to render the fixed pending body rather than an invented hour — matches the spec's resolved "Empty" row.
- Zero-item backstop: `Location.tsx:42` renders nothing (no chip row, no message) for an empty modalities array, matching the spec's explicit backstop resolution.
- Disabled/pending state: `OrderCta.tsx`'s `PendingCta` uses a native `disabled` button (not `aria-disabled` on a live anchor) — the stronger, more defensible accessibility pattern, and the code comments show this was a previously-fixed regression (CR-01) that hasn't recurred.
- Confirmed-link gating: every external URL (`OrderCta.tsx:71`, `CtaGroup.tsx:22-29`, `Location.tsx:90-97`) branches on `link.confirmed` before rendering a live `href`, consistent with D-05.
- Gap: no `src/app/error.tsx` or `src/app/not-found.tsx` exists (confirmed via file search) — an uncaught render/data error or an unmatched route falls through to the framework's unbranded default page, which is a real (if currently low-probability, given this phase has no dynamic routes) gap in state coverage for a project whose Core Value is explicitly "sem fricção" from first paint to conversion.
- No `loading.tsx` exists either, but this is appropriate, not a gap — every component reads local static data with no async boundary (correctly noted in the UI-SPEC's own UI Considerations table for several elements).

---

## Registry Safety

Not applicable — `components.json` does not exist (`shadcn_initialized: false` per the UI-SPEC frontmatter, confirmed no `components.json` file present in the repo root). Registry audit skipped entirely per the audit instructions.

---

## Files Audited

- `src/app/page.tsx`
- `src/app/layout.tsx` (referenced, not re-read this session — audited via design-tokens.css/test summaries)
- `src/components/home/Hero.tsx`
- `src/components/home/OrderCta.tsx`
- `src/components/home/OrderCtaRow.tsx`
- `src/components/home/CtaGroup.tsx`
- `src/components/home/BrandStory.tsx`
- `src/components/home/Location.tsx`
- `src/components/home/Faq.tsx`
- `src/components/home/ProvisionalBadge.tsx`
- `src/components/layout/SectionSeparator.tsx`
- `src/components/layout/Header.tsx` (spacing grep only)
- `src/components/layout/SkipLink.tsx` (spacing grep only)
- `src/content/home-copy.ts`
- `src/styles/design-tokens.css`
- `.planning/phases/02-hero-ctas-location/02-UI-SPEC.md` (current, post-amendment)
- `.planning/phases/02-hero-ctas-location/02-CONTEXT.md`
- `.planning/phases/02-hero-ctas-location/02-04-SUMMARY.md`, `02-05-SUMMARY.md`, `02-06-SUMMARY.md`
</content>

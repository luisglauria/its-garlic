---
phase: 02-hero-ctas-location
verified: 2026-09-13T22:20:00Z
status: human_needed
score: 14/14 must-haves verified
covered_files: [".planning/REQUIREMENTS.md", ".planning/phases/02-hero-ctas-location/02-01-PLAN.md", ".planning/phases/02-hero-ctas-location/02-01-SUMMARY.md", ".planning/phases/02-hero-ctas-location/02-02-PLAN.md", ".planning/phases/02-hero-ctas-location/02-02-SUMMARY.md", ".planning/phases/02-hero-ctas-location/02-03-PLAN.md", ".planning/phases/02-hero-ctas-location/02-03-SUMMARY.md", ".planning/phases/02-hero-ctas-location/02-REVIEW.md", "next.config.ts", "public/brand/hero-illustration.svg", "src/app/page.tsx", "src/components/home/BrandStory.tsx", "src/components/home/CtaGroup.tsx", "src/components/home/Faq.tsx", "src/components/home/Hero.tsx", "src/components/home/Location.test.ts", "src/components/home/Location.tsx", "src/components/home/OrderCta.test.ts", "src/components/home/OrderCta.tsx", "src/components/home/ProvisionalBadge.tsx", "src/components/home/home.test.ts", "src/components/home/sections.test.ts", "src/content/home-copy.ts"]
covered_digest: "v1:sha256:70cd35638e4ee9d805c011248507adeebedd3aefb914a5fc7cf09db1b84bc8b2"
behavior_unverified: 0
overrides_applied: 0
re_verification:
  previous_status: gaps_found
  previous_score: 13/14
  gaps_closed:
    - "REQUIREMENTS.md accurately reflects that HERO-03 (real client product photography) has not been delivered"
  gaps_remaining: []
  regressions: []
human_verification:
  - test: "On a 375x667 and 390x844 mobile viewport, load the homepage and look at the hero (kicker, headline, illustration)."
    expected: "The concept line, headline and illustration read as It's Garlic rather than a generic burger site (compare against img/logo.png and the Instagram reference screenshots); the 'Imagem ilustrativa — foto real em breve' disclosure is legible and unmistakably attached to the illustration; the kicker/headline do not wrap past two lines; the illustration does not jump or reflow as it loads."
    why_human: "Brand fidelity, 'would a reader mistake this for a photo', and CLS-on-load are visual judgments the project's DOM-less static-source-inspection test stack cannot make (02-01-PLAN.md Task 1 human-check, deferred per human_verify_mode: end-of-phase)."
  - test: "On the same two mobile viewports, confirm both order CTAs (iFood, WhatsApp) are visible side by side without scrolling past the hero; Tab through the CTA row; click each pending button."
    expected: "INTEGRA-01's fold criterion holds (both order CTAs visible pre-scroll); the two pending buttons read as deliberately unavailable rather than broken; Tab reaches the directions link with a clear visible focus ring against the dark surface; the coral unavailability notices are legible; clicking each pending button does nothing at all."
    why_human: "Viewport-relative fold visibility and focus-ring legibility cannot be measured by this stack — recorded as Manual-Only in 02-VALIDATION.md (02-01-PLAN.md Task 2 human-check, deferred)."
  - test: "On a 390x844 mobile viewport, read the Location section (hours, modality chips, directions link) and activate the directions link."
    expected: "The hours block reads as honestly unconfirmed rather than broken or empty; the provisional marker is legible olive-on-black inside the charcoal section; modality chips wrap rather than overflow; the directions link is obviously a link, Tab reaches it with a visible focus ring, and activating it opens the real store location in Google Maps in a new tab; nothing in the section reads as a promise that the store is open right now."
    why_human: "Whether the hours copy lands as honest rather than evasive, chip-wrap behavior at 390px, and focus-ring legibility/keyboard reachability are visual/tone judgments this stack cannot make (02-02-PLAN.md Task 1 human-check, deferred)."
  - test: "Read the brand story out loud as if you were the person behind the counter; then look at the brand-story/Location/FAQ sections together."
    expected: "It sounds like someone who works there and likes the food, not an agency trying to sound young; it makes the garlic bread read as the starting point rather than the ceiling; every sentence is defensible from PROJECT.md alone; the three adjacent charcoal sections read as distinct blocks (via the diagonal-wedge separator) rather than one undifferentiated field."
    why_human: "Voice authenticity and honesty are judgment calls no structural gate can make (02-03-PLAN.md Task 1 human-check, deferred)."
  - test: "Use the FAQ with keyboard only (Tab to each question, Enter/Space to open/close); read all four answers; open the browser network panel and reload."
    expected: "Focus ring is clearly visible against the section background on each summary; Enter and Space both open and close each entry; the four answers are ones the brand owner could stand behind word for word, especially the ordering answer (honest about channels, no working-link promise); the FAQ adds no JavaScript request of its own on reload."
    why_human: "Real keyboard behavior in a browser and the copy's judgment-of-honesty are not verifiable by renderToStaticMarkup/source-text checks (02-03-PLAN.md Task 2 human-check, deferred)."
---

# Phase 2: Hero, CTAs & Location Verification Report

**Phase Goal:** A visitor lands on the homepage, instantly understands "Mais que um pão de alho!",
and can act on iFood/WhatsApp/Maps CTAs or find the store's location and hours — with hours/links
clearly marked provisional until the client confirms the two blocked pendências.

**Verified:** 2026-09-13
**Status:** human_needed
**Re-verification:** Yes — after gap closure (previous run: `gaps_found`, 13/14)

## Re-Verification Summary

The previous run (this session) found a single blocking gap: `.planning/REQUIREMENTS.md` marked
HERO-03 "Complete" (checkbox + Traceability row) despite `02-01-PLAN.md`'s own
`flagged_assumptions` stating explicitly that HERO-03 must stay "Pending" until the client
supplies real product photography — the shipped hero image is a disclosed provisional
illustration, not real photography.

Commit `60b8a05` ("docs(02): correct HERO-03 to Pending — real photo still outstanding") is the
only change since that verification. Confirmed via `git show --stat 60b8a05` (touches exactly one
file, `.planning/REQUIREMENTS.md`, 3 insertions / 2 deletions) and `git status --porcelain`
(working tree otherwise clean apart from untracked verification/research-cache files). The fix:

1. **Checkbox** (line 24): `- [x] **HERO-03**` → `- [ ] **HERO-03**`, with an inline Pendente
   note explaining the disclosed-illustration situation and citing D-03/D-04 and this
   VERIFICATION.md as the source of the decision.
2. **Traceability table** (line 202): `| HERO-03 | Phase 2 | Complete |` →
   `| HERO-03 | Phase 2 | Pending (provisional illustration shipped, disclosed; real client photo outstanding) |`.
3. **New pendência line** (line 177, block "5. Informações Pendentes de Confirmação"): names the
   outstanding real product photography explicitly, notes the shipped provisional illustration is
   disclosed as such, and notes the eventual fix is a single-file swap — matching the actual
   deployed state and the plan's own documentation contract.

All three edits verified directly via `git show 60b8a05 -- .planning/REQUIREMENTS.md` and by
grepping the current file content (`grep -n "HERO-03"` / `grep -n "Informações Pendentes"`) — not
from SUMMARY.md or commit-message claims. The wording is honest: it does not claim the requirement
is fulfilled, it explains why an illustration shipped instead, and it points at the concrete
follow-up (client photo swap). No other line in REQUIREMENTS.md was touched by this commit —
confirmed by the diff being exactly the three hunks above.

**Gap closed.** No regressions: `npm test` re-run after the fix still passes 158/158 across 11
suites, and no source/component/test file changed alongside the REQUIREMENTS.md edit (`git show
--stat` confirms single-file diff), so the 13 previously-verified truths are unaffected by this
change — re-confirmed below at the same evidence level as the initial run (Levels 1–3 inspected
directly, not re-derived from SUMMARY.md).

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Hero renders "Mais que um pão de alho!" as real document text plus a CLS-safe 1:1 illustrated image slot with a visible "provisional" disclosure (HERO-01/03, D-03/D-04) | ✓ VERIFIED | `src/components/home/Hero.tsx` — `h1`/kicker as text, `next/image fill` in `aspect-square` container, `preload` (not deprecated `priority`); prerendered `.next/server/app/index.html` contains the concept line, the illustration path and the disclosure text; `home.test.ts` (158/158 passing) asserts image-pipeline props and disclosure presence |
| 2 | The three locked CTA labels ("Ver cardápio", "Pedir no iFood", "Como chegar") appear verbatim in one row below the hero (HERO-02) | ✓ VERIFIED | Prerendered HTML contains all three labels; `CtaGroup.tsx` reads them from `ctaCopy`; `OrderCta.test.ts`/`home.test.ts` assert this structurally |
| 3 | "Pedir no iFood" is the visually primary CTA, WhatsApp renders beside it with identical treatment, and both are reachable without scrolling past the hero on mobile (INTEGRA-01/02) | ✓ VERIFIED (structural); fold-visibility is a viewport-relative visual fact — see Human Verification #2 | `CtaGroup.tsx` renders both `OrderCta` calls at `tier="primary"` through the same shared primitive (D-06 parity is structural, not copy-paste); `home.test.ts` asserts both go through `OrderCta` |
| 4 | While unconfirmed, both order CTAs render as native disabled buttons labelled "(em breve)" with an adjacent coral notice explaining the unavailability and pointing at "Como chegar"; the primary CTA is never swapped (INTEGRA-03, D-05/D-06) | ✓ VERIFIED | Prerendered HTML: `disabled` present, no `aria-disabled`, no `ifood.com.br`/`wa.me` host leak, no sentinel leak; `CtaGroup.tsx` renders both `ifoodUnavailableNotice` and `whatsappUnavailableNotice`, each associated via matching `aria-describedby`/`id` pairs |
| 5 | No `home/` component or page offers an on-site ordering path (INTEGRA-05) | ✓ VERIFIED | `home.test.ts`'s directory-sweep guard asserts no `<form>` and no cart/checkout affordance across every non-test file under `src/components/home/` plus `src/app/page.tsx`; content-integrity gate extends this to `home-copy.ts` |
| 6 | Location section renders the store's full address from the validated record, with no embedded map iframe anywhere in the repository (LOCAL-01) | ✓ VERIFIED | `Location.tsx` reads `store.address`/`neighborhood`/`city`/`state` as props (`StoreInfo`), no literal; prerendered HTML contains "Bonif[á]cio", "747", "Mercado da Torre", "Recife"; repository-wide `home.test.ts` sweep asserts no `<iframe>` in any `.ts`/`.tsx`/`.css` under `src/` |
| 7 | Service modalities render as a chip row mapped over `store.modalities`, correctly handling zero/one/many items (LOCAL-02) | ✓ VERIFIED | `Location.tsx`'s `MODALITY_LABEL` typed against the schema enum, `.map()` over the array, zero-length guard renders nothing; `Location.test.ts` exercises all three cardinalities |
| 8 | Hours render under a provisional marker driven by `store.hours.provisional`; empty schedule renders the honest pending body (never a time), populated schedule renders editable day/open/close rows (LOCAL-03, D-07) | ✓ VERIFIED | `Location.tsx` branches on `hours.schedule.length`; `home.test.ts`'s `CLOCK_TIME` guard asserts no invented clock time in any non-test component or in `home-copy.ts`; prerendered HTML has no clock-time pattern; `Location.test.ts` exercises both branches |
| 9 | "Como chegar" is a live anchor whose href is exactly `buildMapsUrl().url`, new tab, safe rel (LOCAL-04) | ✓ VERIFIED | `Location.tsx`/`CtaGroup.tsx` both render `href={maps.url}` `target="_blank" rel="noopener noreferrer"`; prerendered HTML contains the confirmed `google.com/maps` destination |
| 10 | The hero illustration (the page's `preload`-marked LCP element) actually loads (HTTP 200), not a broken image (CR-01 fix) | ✓ VERIFIED (behaviorally, not just source-text) | Confirmed in prior verification run via `next dev` + `curl` against the exact optimizer URL; not re-run this pass since `next.config.ts`, `Hero.tsx`, and the SVG asset are unchanged by the REQUIREMENTS.md-only diff |
| 11 | No `home/` component contains a hex-colour literal, a URL literal, or a direct `@/data/*` import (ARQ-02/SEC-03 carried) | ✓ VERIFIED | `grep -rnE "#[0-9a-fA-F]{6}" src/components/home/*.tsx` → no matches; `home.test.ts`'s sweep asserts the same over all non-test files; `npm run lint` passes (ARQ-02 ESLint boundary active) |
| 12 | `src/content/home-copy.ts` contains no price, award, rating, superlative, urgency/guilt construction, cart/checkout phrase, or clock time (CONT-01/03 carried) | ✓ VERIFIED | `home.test.ts`'s five named content-integrity tests pass (part of the 158/158 re-run this pass) |
| 13 | Each FAQ entry is a native `<details>/<summary>` disclosure, zero client JavaScript, no hand-wired ARIA | ✓ VERIFIED | `Faq.tsx` uses `<details>`/`<summary>`, no `"use client"`, no `useState`/`onClick`; prerendered HTML: 4 `<details>`, matching `<summary>` count, no `aria-expanded`/`aria-controls` |
| 14 | REQUIREMENTS.md accurately reflects that HERO-03 (real client product photography) has not been delivered | ✓ VERIFIED | `git show 60b8a05 -- .planning/REQUIREMENTS.md` and direct file inspection: checkbox reverted to `[ ]`, Traceability row reads "Pending (provisional illustration shipped, disclosed; real client photo outstanding)", new pendência line added under block 5 naming the outstanding real photography — all three edits present, honest, and consistent with each other; commit touches only this one file |

**Score:** 14/14 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `.planning/REQUIREMENTS.md` | HERO-03 accurately tracked as Pending pending real client photography | ✓ VERIFIED | Checkbox, pendência block, and Traceability row all consistent (see Truth #14) |
| `src/content/home-copy.ts` | Typed final copy for hero/CTA/location/brand-story/FAQ | ✓ VERIFIED | All exports present (`heroCopy`, `ctaCopy` incl. `whatsappUnavailableNotice`, `locationCopy`, `brandStoryCopy`, `faqs`), no `@/data/*` import |
| `public/brand/hero-illustration.svg` | Provisional illustrated hero composition | ✓ VERIFIED | Square viewBox, provisional header comment, official palette, no script/event attrs |
| `src/components/home/ProvisionalBadge.tsx` | Shared provisional marker | ✓ VERIFIED | Exports `ProvisionalBadge`, olive-on-deep-surface, reused by `Location.tsx` |
| `src/components/home/Hero.tsx` | Hero section | ✓ VERIFIED | Server Component, no client directive, `next/image` with `fill`/`aspect-square`/`sizes`/`preload` |
| `src/components/home/OrderCta.tsx` | Shared confirmed/pending CTA primitive | ✓ VERIFIED | `OrderCta`/`PendingCta` exported, typed `IntegrationLink`, branches on `confirmed`, native `disabled` button in pending branch |
| `src/components/home/CtaGroup.tsx` | CTA row | ✓ VERIFIED | Renders both order CTAs through `OrderCta`, `PendingCta` for "Ver cardápio", live anchor for "Como chegar", both unavailability notices |
| `src/components/home/Location.tsx` | Location section | ✓ VERIFIED | Address/modalities/hours/directions all prop-sourced |
| `src/components/home/BrandStory.tsx` | Brand-story section | ✓ VERIFIED | Renders `brandStoryCopy.paragraphs`, covers the three skeleton points |
| `src/components/home/Faq.tsx` | FAQ section | ✓ VERIFIED | Native disclosure, maps over `faqs`, zero client JS |
| `src/components/home/{OrderCta,home,Location,sections}.test.ts` | Test suites | ✓ VERIFIED | 158/158 tests pass across 11 suites (`npm test`, re-run this pass) |
| `src/app/page.tsx` | Five-section home composition | ✓ VERIFIED | `Hero`, `CtaGroup`, `BrandStory`, `Location`, `Faq` in D-01's fixed order; builders called once each |
| `next.config.ts` | Image config + security headers | ✓ VERIFIED | `dangerouslyAllowSVG`/`contentDispositionType`/`contentSecurityPolicy` present, `securityHeaders` still applied |

### Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `src/app/page.tsx` | `src/lib/integrations/ifood.ts` / `whatsapp.ts` / `maps.ts` | `build*Url()` calls, once each | ✓ WIRED | All three called; `IntegrationLink` values passed as props |
| `src/app/page.tsx` | `src/lib/repositories/store-repository.ts` | `getStoreInfo()` | ✓ WIRED | Called once, `store` prop passed to `Location` |
| `src/components/home/Hero.tsx` | `public/brand/hero-illustration.svg` | `next/image src` | ✓ WIRED, confirmed loading (HTTP 200, prior run) | Unchanged this pass |
| `src/components/home/CtaGroup.tsx` | `src/components/home/OrderCta.tsx` | both order CTAs share the primitive | ✓ WIRED | D-06 parity structural |
| `src/components/home/Location.tsx` | `src/lib/integrations/maps.ts` | `maps.url` prop | ✓ WIRED | href fidelity confirmed in prerendered HTML |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| Full test suite (re-run post-fix) | `npm test` | 158/158 tests passed, 11 suites | ✓ PASS |
| REQUIREMENTS.md fix is isolated (no source drift alongside doc fix) | `git show --stat 60b8a05` | 1 file changed (`.planning/REQUIREMENTS.md`), 3 insertions, 2 deletions | ✓ PASS |
| HERO-03 tri-location consistency (checkbox / pendência block / Traceability row) | `grep -n "HERO-03" .planning/REQUIREMENTS.md` | all three locations read "Pending", mutually consistent wording | ✓ PASS |

### Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| — | — | No `TBD`/`FIXME`/`XXX`/`HACK` markers found in any phase-modified file | — | none |
| — | — | No hex-colour literal found in any `src/components/home/*.tsx` | — | none |

No blockers found.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|---|---|---|---|---|
| HERO-01 | 02-01 | Hero communicates brand + concept line | ✓ SATISFIED | Truth #1 |
| HERO-02 | 02-01 | Three locked CTAs present | ✓ SATISFIED | Truth #2 |
| HERO-03 | 02-01 | Hero visual focus is real product photography | ⏳ HONESTLY PENDING — disclosed provisional illustration shipped (D-03/D-04), real client photo not yet supplied; REQUIREMENTS.md now accurately reflects this | Truth #1, Truth #14 |
| LOCAL-01 | 02-02 | Full address + no iframe | ✓ SATISFIED | Truth #6 |
| LOCAL-02 | 02-02 | Modalities chip row, zero/one/many | ✓ SATISFIED | Truth #7 |
| LOCAL-03 | 02-02 | Hours editable format, provisional | ✓ SATISFIED | Truth #8 |
| LOCAL-04 | 02-02 | "Como chegar" live Maps link | ✓ SATISFIED | Truth #9 |
| INTEGRA-01 | 02-01 | iFood CTA prominent/mobile-first | ✓ SATISFIED (structural); fold-visibility deferred to human check | Truth #3, Human #2 |
| INTEGRA-02 | 02-01 | WhatsApp CTA available as alt channel | ✓ SATISFIED | Truth #3, #4 |
| INTEGRA-03 | 02-01 | iFood unavailable → notice, no CTA swap | ✓ SATISFIED | Truth #4 |
| INTEGRA-05 | 02-01/02-03 | No on-site checkout | ✓ SATISFIED | Truth #5 |

HERO-03 is intentionally NOT marked "SATISFIED" here — the phase's own decision (D-03/D-04) was to
ship a disclosed provisional substitute while keeping the underlying requirement honestly open
until real photography arrives. That is the correct, expected state, not a gap: the phase goal
never required real photography to exist, only that the hero avoid reading as a generic
hamburgueria and that any substitution be clearly disclosed and tracked — both true.

No orphaned requirements found — every ID in the phase's plans (HERO-01/02/03, LOCAL-01..04,
INTEGRA-01/02/03/05) matches REQUIREMENTS.md's Phase 2 traceability rows exactly. `CONT-02`
(brand-story/FAQ copy, written this phase per `writtenInPhase: 2`) is intentionally out of Phase
2's requirement list per REQUIREMENTS.md (assigned to Phase 1) — this is an explicitly flagged,
non-orphan assumption in `02-03-PLAN.md`'s frontmatter, not a gap.

### Human Verification Required

5 items deferred to end-of-phase UAT per this project's `human_verify_mode: end-of-phase` (see
frontmatter `human_verification` for full detail) — harvested from the three plans' `<human-check>`
blocks, not skipped:

1. **Hero brand-fidelity + two-line fit + CLS-safe load** (mobile 375x667/390x844)
2. **CTA-row mobile-fold visibility + keyboard/focus/pending-click behavior** (mobile viewports)
3. **Location section honesty/legibility/chip-wrap/directions-link behavior** (mobile 390x844)
4. **Brand-story voice authenticity + visual section separation**
5. **FAQ keyboard-only walk + zero-JS network-panel confirmation**

None of these are automatable by this project's DOM-less (`renderToStaticMarkup`/static-source)
test stack; all were explicitly recorded as deferred, not skipped, across all three SUMMARY.md
files. None of them changed as a result of the HERO-03 documentation fix.

### Gaps Summary

None. The previous run's single gap — REQUIREMENTS.md misrepresenting HERO-03's delivery state —
is closed by commit `60b8a05`, verified directly against the file content and the commit diff (not
inferred from any SUMMARY.md claim). All 14 must-have truths are now verified, all artifacts and
key links hold, the full test suite passes (158/158), and no regressions were introduced (the fix
touched exactly one file, `.planning/REQUIREMENTS.md`).

Status is `human_needed` rather than `passed` only because of the five pre-existing, unrelated
human-verification items deferred to end-of-phase UAT per this project's workflow configuration —
these were present in the initial verification too and are unaffected by the HERO-03 fix.

---

_Verified: 2026-09-13_
_Verifier: Claude (gsd-verifier)_

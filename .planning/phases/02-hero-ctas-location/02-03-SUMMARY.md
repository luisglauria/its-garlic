---
phase: 02-hero-ctas-location
plan: 03
subsystem: ui
tags: [nextjs, react-server-components, vitest, accessibility, content-integrity, native-disclosure]

requires:
  - phase: 02-hero-ctas-location
    provides: >
      plan 02-01's home-copy.ts typed-export convention and renderToStaticMarkup fixture-test
      convention; plan 02-02's Location.tsx (charcoal surface neighbour), getStoreInfo() record
      this plan's FAQ agrees with, and home.test.ts's CLOCK_TIME/stripComments/sweep helpers this
      plan's content-integrity gate reuses rather than redefines
  - phase: 01-foundation-architecture-brand-identity-security-baseline
    provides: >
      src/content/skeleton.ts's brand-story/faqs entries (writtenInPhase: 2), tone-of-voice.md §5's
      hard never-do list, ARQ-02 ESLint data-import boundary
provides:
  - "src/content/home-copy.ts — brandStoryCopy/faqs final Portuguese copy, the last two sections the Phase 1 content skeleton assigns to this phase"
  - "src/components/home/BrandStory.tsx — the brand-story section, D-01/D-02, CONT-02"
  - "src/components/home/Faq.tsx — the FAQ as four native <details>/<summary> disclosures, zero client JavaScript"
  - "src/components/home/sections.test.ts — rendered-output tests over both new sections, counts asserted against the copy arrays' own lengths"
  - "src/components/home/home.test.ts extended — named-test content-integrity gate over home-copy.ts (T-02-16)"
  - "src/app/page.tsx — all five sections composed in D-01's fixed order (Hero, CtaGroup, BrandStory, Location, Faq)"
affects: [phase-03-cardapio, phase-05-seo-production-verification]

actuals:
  tokens: 7286
  tasks: 3
  commits: 3
  plan_head_before: d7a6ee45596e0c0fe91a7e1c2d90d73d85105265

tech-stack:
  added: []
  patterns:
    - "Native <details>/<summary> for the FAQ — the project's first accordion-shaped UI, zero client JavaScript, no state hook, no hand-wired aria-expanded/aria-controls (RESEARCH.md Don't Hand-Roll)"
    - "Decorative diagonal-wedge separator (CSS clip-path + aria-hidden, revealing the page's black <body> background) as the visual-rhythm device between three adjacent same-surface (charcoal) sections, achieved entirely from within the bordering section's own box rather than by editing the neighbouring section"
    - "Content-integrity gate as one named Vitest test per tone-of-voice.md §5 rule, over the whole copy module — the mechanical half of that guide's hard never-do list, with the judgement half recorded as a human-review prohibition rather than pretended into a test"

key-files:
  created:
    - src/components/home/BrandStory.tsx
    - src/components/home/Faq.tsx
    - src/components/home/sections.test.ts
  modified:
    - src/content/home-copy.ts
    - src/app/page.tsx
    - src/components/home/home.test.ts
    - .planning/phases/02-hero-ctas-location/02-VALIDATION.md

key-decisions:
  - "brandStoryCopy: heading \"Mais que um pão de alho\" + two tight paragraphs — paragraph 1 covers what the house is (relaxed restaurant, not a generic burger joint) and where (Mercado da Torre, Recife); paragraph 2 covers why the stuffed garlic bread is the signature and names the wider range (sandwiches on garlic bread, petiscos, espetinhos, almoço, happy hour) — all three skeleton.ts carry-points in two paragraphs, per tone-of-voice.md §3's short-sentence preference over an institutional manifesto"
  - "faqs: exactly four entries — location (address/neighbourhood/city/state literal text, cross-checked against getStoreInfo() by sections.test.ts rather than imported at runtime, since home-copy.ts cannot import src/data/* under ARQ-02), ordering (names iFood as principal and WhatsApp as alternate channel, explicitly states both direct links are still \"em confirmação\", never promises a working link, implies no on-site ordering), modalities (balcão/delivery/take away, reusing tone-of-voice.md §7 example 7's \"do jeito que for melhor pra você\" phrasing), and delivery (confirms delivery is one of the three modalities, routes to iFood/WhatsApp to confirm coverage)"
  - "Visual separation for the three adjacent charcoal sections (brand-story/Location/FAQ, per UI-SPEC's Color table): a small aria-hidden div with a CSS clip-path diagonal wedge at BrandStory's bottom edge and (implicitly, by not needing one — Faq is the last section, bordered only by the footer) no equivalent needed at Faq's edges. The wedge reveals the page's black <body> background (already set in layout.tsx) rather than substituting a colour the UI-SPEC did not assign to this phase — achieved entirely inside BrandStory.tsx's own box, since Location.tsx is plan 02-02's scope and not in this plan's files_modified list."
  - "Content-integrity gate (home.test.ts) asserts, as five separate named tests: no currency marker/price-shaped decimal, no award/rating/star-count claim, no forbidden superlative (\"imperdível\"/\"garantido\") or guilt/urgency construction (\"você vai se arrepender\"/\"última chance\"), no cart/checkout affordance phrase (carrinho/cart/checkout), no clock-time literal — reusing the existing read/stripComments helpers and CLOCK_TIME constant rather than redefining them. A later phase extending this gate should add named tests to this same describe block, not duplicate the helpers."

requirements-completed: []

coverage:
  - id: D8
    description: "Brand story states what It's Garlic is (relaxed restaurant, not generic burger joint), where it is (Mercado da Torre, Recife), and why the stuffed garlic bread is the signature with the wider range named, using only PROJECT.md-confirmed facts"
    requirement: "CONT-02"
    verification:
      - kind: unit
        ref: "src/components/home/sections.test.ts#BrandStory (CONT-02)"
        status: pass
      - kind: integration
        ref: "02-03-PLAN.md Task 1 verify — prerendered-HTML assertion (Mercado da Torre, Recife, pão de alho present; exactly one h1, at least one h2)"
        status: pass
      - kind: manual_procedural
        ref: "line-by-line human read confirming every sentence is defensible from PROJECT.md alone and the voice sounds like someone who works there, not an agency (deferred to end-of-phase per human_verify_mode)"
        status: unknown
    human_judgment: true
    rationale: "Whether the voice sounds authentic and whether the three adjacent charcoal sections read as distinct blocks are judgment calls this project's DOM-less test stack cannot make — human_verify_mode is end-of-phase, so deferred to the phase's end-of-phase UAT pass, matching 02-01/02-02-SUMMARY.md's identical deferral pattern."
  - id: D9
    description: "FAQ answers the four skeleton-assigned questions (location, ordering, modalities, delivery) from confirmed facts only; the address/modality answers agree with the record read through getStoreInfo(); the ordering answer routes to iFood/WhatsApp without implying on-site ordering or promising a working link"
    requirement: "CONT-02, LOCAL-01, LOCAL-02, INTEGRA-05"
    verification:
      - kind: unit
        ref: "src/components/home/sections.test.ts#Faq (CONT-02)"
        status: pass
      - kind: integration
        ref: "02-03-PLAN.md Task 2 verify — prerendered-HTML assertion (4 native disclosures, matching summary count, all FAQ facts present, no clock time, no currency)"
        status: pass
    human_judgment: false
  - id: D10
    description: "Each FAQ entry is a native <details>/<summary> disclosure — no client directive, no state/effect hook, no click handler, no hand-wired expanded/controls ARIA — keyboard-operable (Enter/Space) with a visible focus ring by default, at least a 44px touch target on each summary"
    requirement: "CONT-02 (accessibility, RESEARCH Don't Hand-Roll)"
    verification:
      - kind: unit
        ref: "src/components/home/sections.test.ts#Faq (CONT-02) — no hand-wired expanded or controls attribute"
        status: pass
      - kind: manual_procedural
        ref: "keyboard-only walk (Tab/Enter/Space) + network-panel check confirming the FAQ adds no JS request (deferred to end-of-phase)"
        status: unknown
    human_judgment: true
    rationale: "Focus-ring legibility and actual keyboard behaviour in a real browser are visual/functional judgments no static-source-inspection or renderToStaticMarkup test can make — deferred to end-of-phase UAT, matching this phase's established deferral pattern."
  - id: D11
    description: "src/content/home-copy.ts carries no currency amount, award/rating/star-count claim, forbidden superlative or guilt/urgency construction, cart/checkout affordance phrase, or clock-time literal — the mechanical half of tone-of-voice.md §5, asserted as five separate named tests"
    requirement: "T-02-16 (threat register)"
    verification:
      - kind: unit
        ref: "src/components/home/home.test.ts#content-integrity gate over home-copy.ts (T-02-16)"
        status: pass
    human_judgment: false

duration: ~15min
completed: 2026-09-13
status: complete
---

# Phase 2 Plan 3: Hero, CTAs & Location — Brand Story & FAQ Summary

**Closes the phase's content skeleton: the brand-story section (what It's Garlic is, where it is, why the stuffed garlic bread carries the name) and a four-entry FAQ built on the browser's own zero-JavaScript disclosure element, both final Portuguese copy gated by a mechanical content-integrity test suite over the whole copy module.**

## Performance

- **Duration:** ~15 min
- **Completed:** 2026-09-13
- **Tasks:** 3/3 completed
- **Files modified:** 7 (3 created, 4 modified)

## Accomplishments

- `BrandStory.tsx` renders `brandStoryCopy`'s heading and two paragraphs as real document text on the charcoal surface, covering all three points the content skeleton assigns to this section — what the house is, where it is, and why the pão de alho recheado is the signature — with a decorative diagonal wedge (CSS `clip-path`, `aria-hidden`) at its bottom edge separating it visually from the adjacent Location section without substituting a colour the UI-SPEC did not assign to this phase.
- `Faq.tsx` answers the four practical questions (location, ordering, modalities, delivery) as native `<details>/<summary>` disclosures — zero client JavaScript, no state hook, no hand-wired `aria-expanded`/`aria-controls`, keyboard-operable via the browser's own default behaviour, each `<summary>` meeting the 44px touch-target floor.
- The homepage now renders all five sections CONTEXT.md's D-01 fixed order requires: Hero → CTA row → Brand story → Location → FAQ, completing this phase's scope.
- `sections.test.ts` proves both sections render what the copy module actually holds — paragraph/disclosure counts asserted against the copy arrays' own `.length`, not a hardcoded number — and cross-checks the FAQ's address/modality answers against the real record read through `getStoreInfo()`, the mechanical guard against the FAQ silently becoming a stale second source of the same facts.
- `home.test.ts` gained a five-test content-integrity gate over the entire `home-copy.ts` module (no currency, no award/rating, no forbidden superlative/urgency construction, no cart/checkout phrase, no clock time) — the mechanical half of `tone-of-voice.md` §5's hard never-do list, reusing the suite's existing helpers rather than redefining them.
- `02-VALIDATION.md` closed out: every automated row set to green from real `npm test`/`build`/`lint` runs (158/158 tests passing across 11 suites), `wave_0_complete`/`nyquist_compliant` set `true`, Validation Sign-Off checklist ticked.

## Task Commits

Each task was committed atomically:

1. **Task 1: The brand story** — `cc18b50` (feat)
2. **Task 2: The FAQ** — `afcb25a` (feat)
3. **Task 3: The content-integrity gate and section rendering tests** — `a86e90b` (test)

**Plan metadata:** _(recorded by the final docs commit, hash captured after this summary is written)_

_Note: none of this plan's three tasks carried `tdd="true"` — all three are `type="auto"`, so each is a single feat/test commit rather than a test→feat pair._

## Files Created/Modified

- `src/content/home-copy.ts` — added `BrandStoryCopy`/`brandStoryCopy` and `FaqEntry`/`faqs` final Portuguese copy
- `src/components/home/BrandStory.tsx` — `BrandStory()` — heading + paragraph map, decorative diagonal wedge
- `src/components/home/Faq.tsx` — `Faq()` — native `<details>/<summary>` mapped over `faqs`
- `src/components/home/sections.test.ts` — 8 rendered-output tests over `BrandStory`/`Faq`, including the `getStoreInfo()` agreement checks
- `src/components/home/home.test.ts` — 5 new named tests (content-integrity gate over `home-copy.ts`), 61 tests total in this file (56 + 5), 56 new/updated tests in `sections.test.ts` + `home.test.ts` combined verified passing
- `src/app/page.tsx` — composes `<BrandStory />` and `<Faq />` in D-01's fixed order, alongside the existing `<Hero /><CtaGroup /><Location />`
- `.planning/phases/02-hero-ctas-location/02-VALIDATION.md` — Status column set to green for every automated row, `wave_0_complete`/`nyquist_compliant` set `true`, Validation Sign-Off checklist ticked

## Decisions Made

See `key-decisions` in frontmatter for the full list. Two are load-bearing for downstream phases:

- **Diagonal-wedge separator device:** a small `aria-hidden` div at `BrandStory`'s bottom edge, styled with a Tailwind arbitrary-value `clip-path: polygon(...)` and `bg-surface-deep`, revealing the page's black `<body>` background at the seam between the brand-story and Location sections. No new component was added and `Location.tsx` was not touched (out of this plan's `files_modified` scope) — the separation is achieved entirely from `BrandStory.tsx`'s own box.
- **FAQ shipped questions/answers** (Phase 5's SEO work and any future FAQ structured-data markup build on this exact shape — `FaqEntry { question, answer }`):
  1. "Onde fica a It's Garlic?" → address, neighbourhood, city, state (agrees with `getStoreInfo()`)
  2. "Como eu peço?" → iFood (principal) / WhatsApp (alternate), no working-link promise
  3. "Quais são as formas de atendimento?" → balcão, delivery, take away
  4. "Tem entrega (delivery)?" → confirms delivery, routes to iFood/WhatsApp for coverage
- **Content-integrity gate phrase list** (a later phase extending it should add to this same `describe` block in `home.test.ts`, not duplicate the helpers): currency (`R\$` / price-shaped decimal), award/rating/star-count (`premiad`/`prêmio`/`avaliação`/`estrela`), forbidden superlative/urgency (`imperdível`/`garantido`, `você vai se arrepender`/`última chance`), cart/checkout (`cart`/`checkout`/`carrinho`), clock time (the existing `CLOCK_TIME` constant).

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Plan's own Task 1/2 prerendered-HTML verify script false-positived against Next.js's own default error/not-found pages**
- **Found during:** Task 1
- **Issue:** The plan's `<verify>` script does `readdirSync(root, {recursive:true})` over `.next/server/app` and joins **every** `.html` file before counting `<h1>` tags. In this build, that directory also contains Next.js's own framework-generated `_not-found.html` and `_global-error.html`, each of which independently carries its own `<h1>` (`"404"` and `"This page couldn't load"`) — unrelated to this phase's app code. Joining all three files reports "found 3" instead of the real homepage's actual count.
- **Fix:** Ran the intended check scoped to `.next/server/app/index.html` only (the real homepage route) — confirmed exactly one `<h1>` and the required facts present. Did not modify the plan's verify script text; documented here instead, matching the precedent set by 02-01/02-02-SUMMARY.md's "verify-script literal-substring" deviations.
- **Files modified:** none (verification-only finding)
- **Verification:** `node -e ...` scoped to `index.html` — passed (see Task 1 verify output).
- **Committed in:** n/a (no code change required)

**2. [Rule 1 - Bug] `react-dom/server`'s HTML-entity-escaping broke `sections.test.ts`'s raw-string FAQ content match**
- **Found during:** Task 3
- **Issue:** `sections.test.ts`'s "every question and answer string appears in the rendered output" test compared rendered markup against the raw copy strings (containing `'` in "It's Garlic" and `"` around the quoted app-search instruction), but `renderToStaticMarkup` correctly HTML-entity-escapes `'` → `&#x27;` and `"` → `&quot;` inside text content — the same defect class 02-01-SUMMARY.md's Deviation #3 already documented once for a raw-URL match.
- **Fix:** Added a local `htmlEscaped()` helper and compared against the escaped form, with a comment explaining the escaping is expected/correct.
- **Files modified:** `src/components/home/sections.test.ts`
- **Verification:** `npx vitest run src/components/home/sections.test.ts src/components/home/home.test.ts` — 56/56 passed.
- **Committed in:** `a86e90b` (Task 3 commit)

**3. [Rule 1 - Bug] Plan's own Task 2 verify script over-counted FAQ entries by including the `FaqEntry` interface's own field declaration**
- **Found during:** Task 2
- **Issue:** The plan's `<verify>` script counts `(copy.match(/question:/g) || []).length` and expects exactly 4, but the exported `FaqEntry` interface itself declares `readonly question: string;`, which also matches the literal substring `question:` — bringing the raw count to 5 for any correctly-typed interface + 4 real entries. Same defect class as 02-01-SUMMARY.md's Deviation #4 and 02-02-SUMMARY.md's Deviation #2 (a verify-script literal-substring check colliding with legitimate code).
- **Fix:** Independently confirmed the `faqs` array itself holds exactly 4 entries by scoping the count past the interface declaration (`src.slice(src.indexOf('export const faqs'))`) — 4 confirmed. Did not remove or rename the `question` field (the plan's own artifact table locks `FaqEntry { question, answer }`).
- **Files modified:** none (verification-only finding)
- **Verification:** scoped `node -e` count — 4 confirmed; `sections.test.ts`'s own `faqs.length`-based assertion independently proves the same fact against rendered output.
- **Committed in:** n/a (no code change required)

**4. [Rule 1 - Bug] Faq.tsx's own explanatory comment collided with the plan's literal-substring ARIA guard**
- **Found during:** Task 2
- **Issue:** The plan's Task 2 verify script checks `Faq.tsx`'s raw source text for the absence of the literal substrings `aria-expanded`/`aria-controls`. My first draft's file-header comment explained the native element makes "hand-wired `aria-expanded`/`aria-controls`" unnecessary — an honest code comment that nonetheless contains the exact forbidden substrings, tripping the guard against itself (not against any real hand-wired attribute).
- **Fix:** Reworded the comment to describe the concept ("no hand-wired accessibility attributes duplicating what the native element already provides") without using the literal attribute-name strings.
- **Files modified:** `src/components/home/Faq.tsx`
- **Verification:** `grep -n "aria-expanded\|aria-controls" src/components/home/Faq.tsx` — no matches; full verify script re-run clean.
- **Committed in:** `afcb25a` (Task 2 commit)

**5. [Process note, not a Rule 1-3 fix] `faqs` copy landed in Task 1's commit instead of Task 2's**
- **Found during:** Task 1
- **Issue:** `BrandStoryCopy`/`brandStoryCopy` and `FaqEntry`/`faqs` were both added to `src/content/home-copy.ts` in a single `Edit` call (both additions were straightforward and touched the same file), so the `faqs` export landed in Task 1's commit (`cc18b50`) rather than Task 2's (`afcb25a`) as the plan's per-task `<files>` lists implied.
- **Impact:** None on correctness — both tasks' acceptance criteria are satisfied by the time each task's own verify runs, and Task 2's commit message documents the split. Noted here for commit-archaeology clarity, not as a defect requiring a fix.

---

**Total deviations:** 5 (4 auto-fixed Rule 1 bug fixes — two required no code change, two required a one-line test/comment fix; 1 process note with no functional impact). **Impact on plan:** None of the four verify-script issues indicated an actual defect in the shipped code; each was independently re-confirmed correct by an alternate check. Neither expanded scope beyond what Tasks 1–3 already specified.

## Issues Encountered

None beyond the five items documented above.

## User Setup Required

None — no external service configuration required.

## Known Stubs

None. All copy is final (not placeholder) and defensible from `PROJECT.md`'s confirmed facts; no data source is stubbed or unwired.

## Threat Flags

None. This plan's threat register (T-02-16 through T-02-20, T-02-SC in `02-03-PLAN.md`) covers exactly the surface this plan introduces — no new network endpoint, auth path, file-access pattern, or schema change at a trust boundary beyond what that register already accounts for.

## Next Phase Readiness

- **Phase 2 is now feature-complete for this scope:** all five sections (Hero, CTA row, Brand story, Location, FAQ) render in `src/app/page.tsx` in D-01's fixed order, `npm run build`/`lint`/`test` all exit 0, and `02-VALIDATION.md` carries no remaining `TBD` rows.
- **Deferred to end-of-phase UAT** (per `human_verify_mode: end-of-phase`, not skipped, consistent with 02-01/02-02-SUMMARY.md's identical pattern):
  - Brand-story voice check (does it read as someone who works there, not an agency?) and confirmation that every sentence is defensible from `PROJECT.md` alone (coverage D8's `human_judgment: true` row)
  - Whether the three adjacent charcoal sections (brand-story/Location/FAQ) read as visually distinct blocks given the diagonal-wedge device, rather than one undifferentiated field
  - FAQ keyboard-only walk (Tab/Enter/Space, focus-ring legibility) and a network-panel check confirming the FAQ adds no JavaScript request (coverage D10)
  - The one Manual-Only row carried from plan 02-01 (INTEGRA-01 mobile-fold visibility) — unchanged by this plan, still pending
- **Phase 3 (cardápio)** is the next content-skeleton phase (`product-categories`, `writtenInPhase: 3`) — no blocker from this plan; `src/app/page.tsx`'s fragment shape already accommodates additional sibling sections with no restructuring, matching the same extensibility note 02-01/02-02-SUMMARY.md recorded.
- **Phase 5 (SEO)** can build FAQ structured-data markup (`schema-dts` `FAQPage`) directly against the shipped `FaqEntry[]` shape (`question`/`answer`) — no data-shape change needed.
- No blockers for phase transition.

---
*Phase: 02-hero-ctas-location*
*Completed: 2026-09-13*

## Self-Check: PASSED

All 3 created files (`BrandStory.tsx`, `Faq.tsx`, `sections.test.ts`) and 3 task commits (`cc18b50`, `afcb25a`, `a86e90b`) verified present.

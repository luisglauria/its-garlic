---
status: diagnosed
trigger: "UAT Test 2 (G-02-2): em viewports mobile de 375px e 390px, os CTAs de iFood e WhatsApp aparecem empilhados, não lado a lado. Além disso, a seção de CTAs está fora do Hero e depois da ilustração, portanto não fica acima da dobra."
created: 2026-09-13T23:30:00Z
updated: 2026-09-13T23:52:00Z
goal: find_root_cause_only
symptoms_prefilled: true
---

## Current Focus

hypothesis: CONFIRMED — three independent contributing causes (AND-gate), see Resolution
test: static source analysis of page.tsx / Hero.tsx / CtaGroup.tsx + Tailwind breakpoint
  resolution + vertical/horizontal layout arithmetic
expecting: n/a — investigation complete
next_action: none (goal is find_root_cause_only; a separate planning step owns the fix)

bug_class: Bohrbug — fully deterministic, reproduces on every load at the named viewports;
  purely a function of static markup + static CSS class names, no timing/state involved.

rca_branching:
  candidate_causes:
    - "code (CSS): CTA row direction is flex-col until the sm breakpoint (640px)"
    - "code (composition): CtaGroup is a sibling <section> after Hero, not inside it"
    - "design/spec: hero vertical budget (full-width 1:1 illustration) exceeds the viewport"
    - "config: custom Tailwind breakpoint override — RULED OUT (see Eliminated)"
    - "data: copy length makes side-by-side unachievable at the declared padding/type size"
  and_gate: "YES — this failure requires >1 contributing condition simultaneously. Symptom 1
    (stacking) and Symptom 2 (below fold) have disjoint causes, and Symptom 2 itself needs BOTH
    the sibling-section composition AND the hero's vertical budget: fixing either one alone still
    leaves the CTA row below the fold at 375x667. root_cause therefore holds a set, not a single
    cause."

## Symptoms

expected: |
  On 375x667 and 390x844 mobile viewports, both order CTAs (iFood, WhatsApp) are visible
  SIDE BY SIDE without scrolling past the hero. INTEGRA-01 fold criterion holds
  (both order CTAs visible pre-scroll).
actual: |
  1. The two CTAs render STACKED (vertical) at 375px and 390px, not side by side.
  2. The CTA section sits OUTSIDE the Hero, AFTER the illustration, so it is below the fold.
  (Disabled button states and unavailability notices are correct — not part of this bug.)
errors: none (visual/layout defect, no console errors reported)
reproduction: UAT Test 2 — .planning/phases/02-hero-ctas-location/02-UAT.md, load homepage at 375x667 / 390x844
started: discovered during UAT of phase 02 (never worked — implementation defect, not a regression)

## Eliminated

- hypothesis: "A custom Tailwind `@theme` breakpoint override moved `sm` below 375px, so
    `sm:flex-row` should have applied and something else broke it."
  evidence: "src/styles/design-tokens.css `@theme inline` block (lines 44-55) declares only
    colour and font tokens — no `--breakpoint-*` key. src/app/globals.css adds no `@theme` of its
    own. Installed tailwindcss@4.3.3 theme.css line 327 keeps the stock `--breakpoint-sm: 40rem`
    (640px). So `sm:` really is 640px and genuinely does not apply at 375/390px."
  timestamp: 2026-09-13T23:44:00Z

- hypothesis: "A persistent test asserts the Hero→CtaGroup sibling order, so the composition was
    deliberately locked and must not change."
  evidence: "grep across src/**/*.test.ts finds no `indexOf`/section-order assertion. The five-
    section order check exists only as a one-shot inline `node -e` inside 02-03-PLAN.md's verify
    block (line 277), not as a committed test. home.test.ts only asserts that page.tsx calls the
    builders and renders <Location — nothing about Hero/CtaGroup adjacency. The composition is
    therefore NOT test-locked; it is only doc-locked by CONTEXT.md D-01."
  timestamp: 2026-09-13T23:50:00Z

- hypothesis: "The buttons stack because the flex row wraps (flex-wrap) once content exceeds the
    container."
  evidence: "The row div (CtaGroup.tsx line 27) declares no `flex-wrap` utility at all. The
    stacking is the base `flex-col` direction, not wrapping. (Relevant consequence: because there
    is no wrap and flex items default to `min-width:auto`, forcing `flex-row` at mobile would
    cause horizontal OVERFLOW, not a graceful wrap — see Evidence.)"
  timestamp: 2026-09-13T23:47:00Z

## Evidence

- timestamp: 2026-09-13T23:38:00Z
  checked: src/app/page.tsx lines 21-32
  found: "`<Hero />` and `<CtaGroup ... />` are rendered as SIBLING elements inside a fragment.
    CtaGroup is not passed into Hero and is not a child of it."
  implication: "Symptom 2 confirmed structurally: the CTA row is genuinely outside the Hero
    section, exactly as the user reported."

- timestamp: 2026-09-13T23:39:00Z
  checked: src/components/home/Hero.tsx lines 12-55
  found: "Hero's own `<section>` closes only after its last child, and its children in source
    order are: kicker <p>, <h1>, subhead <p>, the 1:1 illustration <div>, then the provisional
    disclosure <div>. The illustration is the 4th of 5 children."
  implication: "Because CtaGroup is the next sibling section, the CTA row necessarily renders
    AFTER the illustration and after the disclosure — matching 'depois da ilustração'."

- timestamp: 2026-09-13T23:41:00Z
  checked: src/components/home/CtaGroup.tsx line 27
  found: "The order-CTA row is `<div className=\"flex w-full flex-col items-center gap-3
    sm:flex-row sm:justify-center\">`. Base (mobile-first) direction is `flex-col`; `flex-row`
    is gated behind the `sm:` variant."
  implication: "Direct cause of Symptom 1: at 375px and 390px the `sm:` variant does not match,
    so only `flex-col` applies and the two OrderCta children stack vertically."

- timestamp: 2026-09-13T23:44:00Z
  checked: "tailwindcss@4.3.3 theme.css; src/styles/design-tokens.css @theme inline; globals.css"
  found: "`--breakpoint-sm: 40rem` (640px) is the stock value and is not overridden anywhere in
    this project."
  implication: "`sm:flex-row` first applies at 640px — 265px wider than the 375px target and
    250px wider than the 390px target. The breakpoint choice is simply wrong for the requirement."

- timestamp: 2026-09-13T23:46:00Z
  checked: "Vertical fold arithmetic at 375x667 (Header 88px + Hero box model), computed from
    the literal Tailwind classes: header py-4 + h-14 logo = 88px; SkipLink is `sr-only` = 0px;
    hero py-12 = 48px top; gap-6 = 24px between 5 children; h1 32px/leading-tight = 40px per
    line; illustration = `aspect-square w-full max-w-sm` => min(343, 384) = 343px square."
  found: "Bottom edge of the illustration lands at ~747px; the Hero section ends at ~865px; the
    CTA row therefore begins ~865px down versus a 667px viewport => ~198px BELOW the fold.
    Sensitivity check (h1 collapsed to 1 line and subhead to 3 lines — the most generous case):
    illustration bottom still lands at ~685px, still 18px below the 667px fold."
  implication: "Symptom 2 is NOT caused by section order alone. Even if CtaGroup were nested
    inside Hero as its last child, it would STILL be below the fold at 375x667, because the
    hero's own content column already overspends the viewport before the CTA row starts. The
    full-width 343px square illustration is the single dominant consumer (~46% of all the
    vertical space above the CTA row)."

- timestamp: 2026-09-13T23:47:00Z
  checked: "Same arithmetic at 390x844"
  found: "Illustration bottom ~762px (fits inside 844), but the Hero section still ends at
    ~880px — so the CTA row starts ~36px below the 844px fold. Both named viewports fail, 390px
    only marginally."
  implication: "Consistent with the user reporting both viewports as failing. 390x844 is a near
    miss, which is why a modest reduction in hero vertical budget would fix that viewport but
    NOT 375x667."

- timestamp: 2026-09-13T23:48:00Z
  checked: "Horizontal fit of two primary-tier CTAs at 343px/358px available content width.
    TIER_CLASS.primary (OrderCta.tsx line 18) = `px-6` (48px horizontal padding) + 16px semibold
    Manrope label; PendingCta (line 39) renders `{label} {ctaCopy.pendingSuffix}` so the live
    label today is 'Pedir no iFood (em breve)' / 'Chamar no WhatsApp (em breve)'."
  found: "Current pending labels: ~256px + ~289px + 12px gap = ~557px versus 343px available =>
    overflows by ~214px at 375px (~199px at 390px). Even the FUTURE confirmed labels ('Pedir no
    iFood' / 'Chamar no WhatsApp') sum to ~373px => still overflows by ~30px at 375px and ~15px
    at 390px. No `flex-wrap` is declared and flex items default to `min-width:auto`, so this
    overflows the container rather than wrapping."
  implication: "CRITICAL for the fix: this is NOT a one-class fix. Simply changing `flex-col
    sm:flex-row` to `flex-row` would replace stacking with horizontal overflow / a broken row.
    Achieving side-by-side at 375px requires also reducing the horizontal cost — shorter mobile
    labels, smaller px/type at mobile, allowing the label to wrap inside the button, or a
    2-column grid with flexible track widths."

- timestamp: 2026-09-13T23:50:00Z
  checked: ".planning/phases/02-hero-ctas-location/02-01-PLAN.md lines 103, 414-422, 429 and
    02-01-SUMMARY.md lines 97-106"
  found: "The plan explicitly recorded INTEGRA-01's fold criterion as unmeasurable by this
    project's DOM-less test stack ('no viewport in a node environment') and deferred it to a
    human-check / 02-VALIDATION.md Manual-Only row. Meanwhile the plan's own machine-checkable
    acceptance criterion (line 429) reads 'renders CtaGroup immediately after Hero' — which the
    sibling-section implementation satisfies literally while still violating the human-check on
    the very next lines (415-417: 'visible side by side without scrolling past the hero')."
  implication: "Process root cause: the only gate that could have caught this was manual, and it
    was deferred to end-of-phase UAT — which is precisely where it was caught. The automated
    acceptance criterion encoded proximity in SOURCE ORDER ('immediately after Hero') rather than
    the actual requirement (co-visibility within the first viewport), so every automated gate
    passed on a layout that fails the requirement."

- timestamp: 2026-09-13T23:51:00Z
  checked: ".planning/phases/02-hero-ctas-location/02-CONTEXT.md line 32 (D-01) and
    02-UI-SPEC.md lines 179-182 (hero focal point)"
  found: "D-01 fixes the home as FIVE sibling sections (Hero -> CTAs -> Marca -> Localização ->
    FAQ), explicitly marked 'reversible — reordenar seções de uma landing page é uma mudança de
    layout local'. Separately, UI-SPEC's focal-point statement mandates 'the headline above it
    [the illustration] and the three CTAs below it — this explicit ordering... is what
    establishes hero hierarchy'."
  implication: "The two governing documents jointly REQUIRE the failing layout: D-01 makes the
    CTA row a separate section after Hero, and UI-SPEC requires the CTAs to sit below a
    full-width 1:1 illustration. Satisfying INTEGRA-01's fold criterion at 375x667 is impossible
    without amending at least one of them. This is a spec conflict, not merely a coding slip —
    the fix owner must make that amendment explicitly. D-01 self-documents as reversible, so it
    is the cheaper of the two to amend."

## Resolution

root_cause: |
  Three independent, simultaneously-necessary causes (AND-gate confirmed):

  (1) STACKING — src/components/home/CtaGroup.tsx line 27 sets the order-CTA row to
      `flex-col ... sm:flex-row`. Tailwind v4.3.3's stock `sm` breakpoint is 640px (verified
      un-overridden in this project), so at the 375px and 390px target viewports only the base
      `flex-col` applies and the two buttons stack. Compounding it: at those widths the two
      primary buttons need ~557px (current "(em breve)" labels) or ~373px (future confirmed
      labels) against ~343px of available content width, so the row could not fit side by side
      even with the breakpoint corrected — the button padding (`px-6`) and label lengths must
      change too.

  (2) COMPOSITION — src/app/page.tsx lines 26-27 render `<Hero />` and `<CtaGroup />` as sibling
      sections, and Hero's own section ends only after the illustration and its disclosure. The
      CTA row is therefore structurally outside the hero and after the illustration, exactly as
      reported. This follows CONTEXT.md D-01's five-sibling-section decision.

  (3) VERTICAL BUDGET — even nested inside Hero, the CTA row would still fall below the fold at
      375x667: header (88px) + hero padding/gaps + a 2-line 32px headline + a 4-line subhead +
      a full-width `aspect-square` illustration (343px) puts the illustration's bottom edge at
      ~747px and the hero's end at ~865px, versus a 667px viewport (~198px below the fold; still
      18px below it under the most generous line-count assumptions). 02-UI-SPEC.md's hero
      focal-point statement mandates the CTAs sit BELOW that illustration, so the spec itself
      makes the fold criterion unreachable at 375x667 as currently written.

fix: not applied — goal is find_root_cause_only; a separate planning step owns the fix
verification: n/a
files_changed: []

why_not_caught: |
  No gate existed for this class. 02-01-PLAN.md line 103 explicitly recorded INTEGRA-01's fold
  criterion as unmeasurable by this project's DOM-less (node-environment) test stack and routed
  it to 02-VALIDATION.md's Manual-Only table. The machine-checkable acceptance criterion that
  stood in for it (line 429, "renders CtaGroup immediately after Hero") tests source adjacency,
  not viewport co-visibility — so it passed on the failing layout. The manual check then caught
  it at end-of-phase UAT, which is the designed behaviour of `human_verify_mode: end-of-phase`,
  just later than a build-time gate would have.

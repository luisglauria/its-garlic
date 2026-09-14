---
status: diagnosed
trigger: "a voz e o conteúdo da história estão corretos, mas a separação visual não está totalmente clara. A cunha diagonal aparece apenas após a seção de história; Localização e FAQ continuam com o mesmo fundo charcoal, sem separador próprio. Verificar se as três seções precisam de divisores visuais mais explícitos."
created: 2026-09-13T23:30:00Z
updated: 2026-09-13T23:58:00Z
mode: find_root_cause_only
symptoms_prefilled: true
bug_class: "Bohrbug (fully deterministic — static Server-Component markup, no state, no clock, reproduces on every render)"
gap_id: G-02-4
---

## Current Focus

hypothesis: CONFIRMED (see Resolution.root_cause) — option (a) from the brief: the separator is
  structurally placed in exactly one spot. Option (b) (invisible due to the sibling dead-token bug)
  is RULED OUT as the cause by a differential experiment, but is confirmed as a *masking* defect
  that must be fixed first for any separator change to be observable.
test: complete — 6 independent methods (source grep over all of src/, live served DOM order, live
  served CSS cascade read, live headless screenshot, palette-repaired differential render,
  per-pixel column sampling of both renders)
expecting: n/a
next_action: "Diagnose-only mode (UAT flow) — return ROOT CAUSE FOUND to caller. Do NOT apply a fix."

reasoning_checkpoint:
  hypothesis: |
    The diagonal-wedge separator is a single hardcoded <div> that exists only inside
    BrandStory.tsx. It is the ONLY clip-path/border/divider element anywhere in src/.
    Location.tsx and Faq.tsx carry no separator of any kind, and BrandStory, Location, Faq AND
    Footer all carry the identical `bg-surface-primary` (#202526) with no inter-section gap — so
    there are FOUR consecutive same-surface blocks and exactly ONE separator, sitting at the first
    of three boundaries. Nothing exists at the Location→Faq or Faq→Footer seams to be invisible.
  confirming_evidence:
    - "grep for clip-path|border-t|border-b|divide-|separator|divider across all of src/ returns exactly one section-level separator: BrandStory.tsx:32. Faq.tsx:16's border-b is an intra-FAQ row rule between <details> entries, not a section boundary."
    - "Live served DOM order: bg-surface-deep, bg-surface-deep, bg-surface-deep, [bg-surface-primary + wedge div], bg-surface-primary, bg-surface-primary, bg-surface-primary — 4 charcoal blocks, 1 wedge."
    - "Palette-repaired differential render, pixel column x=8: rgb(32,37,38) unbroken from y=1274 to y=2199 (926px) across BrandStory+Location+Faq+Footer with zero interruption."
    - "Same render, column x=382: a single 14px black run at y=1536..1549 (the wedge, thickest at the right edge) then 650px of unbroken rgb(32,37,38). Reproduces the user's report verbatim."
  falsification_test: |
    If a second clip-path/border/background-variation element had existed at the Location→Faq or
    Faq→Footer boundary in source or in the served DOM, the hypothesis would be dead — the cause
    would then have been paint (option b), not placement. It does not exist in either.
    Equally: if the palette-repaired render had shown separation between Location and FAQ, the
    hypothesis would be dead. It showed 650px of a single uninterrupted colour value.
  fix_rationale: |
    Addresses placement/design-contract (why no separator exists at two of three boundaries),
    not paint (why the one that exists is currently unpainted). Fixing only the token cycle
    restores the charcoal field and makes the single wedge appear — i.e. it produces EXACTLY the
    state the user is complaining about, so it cannot be the fix for this gap.
  blind_spots: |
    Measured in Chrome 152 headless at 390px width only (the viewport UAT Test 4 used). The `sm:`
    breakpoint variant (h-10 wedge) was not rendered, so the wedge's 640px+ appearance is inferred
    from the class string, not measured. "Reads as distinct blocks" is ultimately a human judgment
    — the pixel evidence proves the surfaces are byte-identical and that only one divider exists,
    which is necessary but the final verdict is still the user's. The differential render used the
    live dev-server CSS inlined into a saved copy of the live HTML; `next/image` assets did not
    load in that copy (irrelevant to section backgrounds, which is all that was measured).
  candidate_causes:
    - "code/structure: the wedge is one hardcoded div in BrandStory.tsx; Location.tsx and Faq.tsx have no separator, and page.tsx/layout.tsx render the sections adjacent with no gap (PRIMARY)"
    - "design-contract/spec: 02-UI-SPEC.md's Color table assigns --color-surface-primary to all three sections at once while citing brand-guidelines.md's 'variação de seção' — an ALTERNATION rule — and never assigns any second surface, so no alternation was available to implement"
    - "process/scope: 02-03-SUMMARY.md's key-decision reasons only about Faq's BOTTOM edge ('bordered only by the footer') and never about Faq's TOP edge against Location, and wrongly assumes the footer is a different surface (Footer.tsx:15 is also bg-surface-primary)"
    - "design/salience: even when painted, the existing wedge is #000000 on #202526 = 1.35:1 contrast and only ~14-19px tall tapering to 0px — a near-invisible device (contributing, quantified)"
    - "config/CSS (RULED OUT as cause, confirmed as mask): the design-tokens.css @theme self-reference cycle makes every bg-surface-* utility transparent, so as shipped there is no charcoal and no wedge on screen at all"
  and_gate: |
    YES for the user's stated EXPECTED outcome; NO for the reported SYMPTOM.
    - Symptom as reported ("wedge only after the story; Location and FAQ have no separator of
      their own"): the structural placement alone is necessary and sufficient. Proven by the
      differential render, which reproduces it with the token bug neutralized.
    - Expected outcome ("the three sections read as distinct blocks"): requires BOTH the token
      cycle fixed (or the separator will not paint at all) AND separators added at the remaining
      boundaries (or they will not exist). Fixing either alone leaves the gap open. The token
      cycle must be fixed FIRST or no separator change is observable.

## Symptoms

expected: |
  Reading the brand-story / Location / FAQ sections together, the three adjacent charcoal sections
  read as distinct blocks (via the diagonal-wedge separator) rather than one undifferentiated
  field. (UAT Test 4 / gap G-02-4, severity cosmetic.)
actual: |
  The voice/content of the brand story are correct, but the visual separation is not clear. The
  diagonal wedge appears ONLY after the brand-story section; Location and FAQ keep the same
  charcoal background with no separator of their own.
errors: none (visual/layout issue, no console errors)
reproduction: "Test 4 in .planning/phases/02-hero-ctas-location/02-UAT.md — load homepage at 390px, scroll to the brand-story/Location/FAQ run."
started: |
  Since plan 02-03, commit cc18b50 ("Task 1: The brand story") — the wedge was introduced there
  and only there. It has never had a counterpart at any other boundary.

## Eliminated

- hypothesis: "(option b from the brief) A separator IS placed between each pair of adjacent dark
    sections, but all of them are invisible because of the sibling finding's dead brand-colour
    tokens (design-tokens.css @theme inline self-reference cycle)."
  evidence: |
    Two-part refutation.
    (1) PLACEMENT: no separator markup exists at the Location→Faq or Faq→Footer boundary to be
        made invisible. `grep -nE 'clip-path|clipPath|border-t|border-b|divide-|separator|divider|
        wedge' src/` returns exactly one section-level separator in the whole tree
        (BrandStory.tsx:32). The live served DOM confirms: Location's <section> and Faq's
        <section> carry `class="bg-surface-primary text-text-on-dark"` and nothing else.
    (2) DIFFERENTIAL: I neutralized the token cycle (injected literal brand hex values as a
        last-in-cascade <style> over an otherwise byte-identical copy of the live HTML + live
        compiled CSS) and re-rendered. The reported symptom REPRODUCED VERBATIM: one 14px black
        diagonal band at the BrandStory→Location seam, then 650px of a single uninterrupted
        rgb(32,37,38) across Location + Faq + Footer. Removing the suspected cause did not remove
        the symptom, therefore it is not the cause of this gap.
    NOTE: the token cycle IS confirmed live and IS a blocking prerequisite (see Evidence
    2026-09-13T23:44). As shipped, the page has no charcoal and no wedge at all, so no separator
    change is observable until it is fixed. It masks this gap; it does not cause it.
  timestamp: 2026-09-13T23:50:00Z

- hypothesis: "The separator is intended to repeat between every pair of adjacent dark sections and
    is emitted by a shared component/loop that is failing to render for the 2nd and 3rd boundary."
  evidence: |
    No such component exists. There is no Separator/Divider/Wedge component file anywhere in
    src/components/, and page.tsx (lines 26-30) composes the five sections as five literal JSX
    elements with no wrapper, no map, and no interleaved separator. The wedge is an inline
    `<div aria-hidden>` literal inside BrandStory.tsx's own <section>. 02-03-SUMMARY.md's
    tech-stack.patterns entry confirms this was deliberate: the wedge is "achieved entirely from
    within the bordering section's own box rather than by editing the neighbouring section."
  timestamp: 2026-09-13T23:38:00Z

- hypothesis: "Sections are separated by a vertical gap (UI-SPEC Spacing Scale's '2xl | 48px |
    Vertical gap between the five homepage sections') that is collapsing."
  evidence: |
    No gap is implemented anywhere, so none can collapse. layout.tsx:43 wraps children in
    `<main id="main-content" className="flex-1">` — no `gap-*`, no `space-y-*`, not a flex/grid
    container over the sections. Each section supplies only its own internal padding (BrandStory
    py-8 sm:py-10, Location py-8, Faq py-8 sm:py-10). With identical backgrounds, internal padding
    produces 64px of CONTINUOUS charcoal at each seam — whitespace, but no boundary. That is
    precisely the "one undifferentiated field" the user describes.
  timestamp: 2026-09-13T23:41:00Z

- hypothesis: "Faq.tsx's `border-b border-accent-olive/40` (line 16) is a section-boundary rule
    that should be separating the FAQ from its neighbours."
  evidence: |
    It is on the `<details>` element inside the FAQ's inner list, once per FAQ entry — an
    intra-component row rule between the four disclosures, not a section boundary. It sits
    entirely within the FAQ's `max-w-5xl px-4` inner wrapper, so it does not even span the
    viewport width, and there are four of them, none at the section's own top or bottom edge.
  timestamp: 2026-09-13T23:39:00Z

## Evidence

- timestamp: 2026-09-13T23:33:00Z
  checked: "src/components/home/BrandStory.tsx, Faq.tsx, Location.tsx; src/app/page.tsx; src/app/layout.tsx; src/components/layout/Footer.tsx (full source reads, not summaries)"
  found: |
    BrandStory.tsx:30-33 — the wedge, in full:
      <div aria-hidden="true"
           className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-surface-deep
                      [clip-path:polygon(0_100%,100%_40%,100%_100%)] sm:h-10" />
    positioned against the section's own `relative overflow-hidden` box (line 19).
    Faq.tsx:11 — <section className="bg-surface-primary text-text-on-dark"> — no separator.
    Location.tsx:26 — <section className="bg-surface-primary text-text-on-dark"> — no separator.
    Footer.tsx:15 — <div className="bg-surface-primary text-text-on-dark"> — no separator, no
    border-top.
    page.tsx:26-30 — five adjacent JSX siblings, no wrapper, no interleaving.
    layout.tsx:43 — <main className="flex-1">, no gap/space-y utility.
  implication: |
    The charcoal run is FOUR blocks long, not three (the footer is the same surface), with exactly
    one separator at the first of three boundaries. The user under-reported: Faq→Footer is a third
    unseparated same-surface seam.

- timestamp: 2026-09-13T23:35:00Z
  checked: "grep -nE 'clip-path|clipPath|border-t|border-b|divide-|separator|divider|wedge|cunha' over all of src/ ; plus grep for bg-surface-primary|bg-surface-deep"
  found: |
    Exactly ONE section-level separator in the entire tree: BrandStory.tsx:32.
    The only other border in the matches is Faq.tsx:16's per-<details> row rule.
    Full surface map of the homepage, in render order:
      body            bg-surface-deep     (layout.tsx:38)
      Header          bg-surface-deep     (Header.tsx:10)
      Hero            bg-surface-deep     (Hero.tsx:12)
      CtaGroup        bg-surface-deep     (CtaGroup.tsx:22)
      BrandStory      bg-surface-primary  (BrandStory.tsx:19)  + wedge
      Location        bg-surface-primary  (Location.tsx:26)    <- no separator
      Faq             bg-surface-primary  (Faq.tsx:11)         <- no separator
      Footer          bg-surface-primary  (Footer.tsx:15)      <- no separator
  implication: |
    No alternation whatsoever: two black blocks then four charcoal blocks. Confirms option (a)
    (structurally placed once) and rules out any "repeat mechanism that failed" theory.

- timestamp: 2026-09-13T23:37:00Z
  checked: "live dev server http://localhost:3000/ — served HTML, section class strings in DOM order"
  found: |
    body bg-surface-deep / div bg-surface-deep / section bg-surface-deep / section bg-surface-deep
    / section relative overflow-hidden bg-surface-primary + div pointer-events-none absolute
    inset-x-0 bottom-0 h-8 bg-surface-deep [clip-path:polygon(...)] sm:h-10
    / section bg-surface-primary / section bg-surface-primary / div bg-surface-primary
  implication: "The shipped DOM matches the source exactly — no build step injects or strips separators."

- timestamp: 2026-09-13T23:42:00Z
  checked: "served compiled CSS /_next/static/chunks/[root-of-the-server]__1372h70._.css (26,322 bytes)"
  found: |
    .bg-surface-deep    { background-color: var(--color-surface-deep); }
    .bg-surface-primary { background-color: var(--color-surface-primary); }
    and, both UNLAYERED, in this order:
      idx 5395  :root       { ... --color-surface-primary: #202526; --color-surface-deep: #000; ... }
      idx 5918  :root,:host { ... --color-surface-primary: var(--color-surface-primary);
                                  --color-surface-deep:    var(--color-surface-deep); ... }
    `@layer theme;` is emitted EMPTY. No @property registration exists for any --color-* token
    (the 37 @property declarations are all Tailwind's own --tw-*).
  implication: |
    Independently reproduces the sibling finding at the served-artifact level: same specificity,
    same (no) layer, later source order -> the self-reference wins -> unregistered custom-property
    cycle -> guaranteed-invalid value -> both bg-surface-* utilities are invalid at computed-value
    time -> background-color falls back to its initial value, `transparent`.

- timestamp: 2026-09-13T23:44:00Z
  checked: "headless Chrome 152 screenshot of the LIVE page (390x2600), then per-pixel vertical column sampling at x=8 and x=382"
  found: |
    x=8:   rgb(255,255,255) for the entire 2600px column — a single unbroken white run.
    x=382: every background run is rgb(255,255,255). The only non-white runs are rgb(49,38,107)
           at y348..452 and rgb(0,0,0) at y454..731 — both INSIDE the hero SVG illustration,
           whose colours are baked into the asset.
    Visual: white page, black text, no charcoal anywhere, no wedge anywhere.
  implication: |
    The token cycle is live right now. As shipped the user cannot see charcoal sections OR the
    wedge — so the verbatim report ("Localização e FAQ continuam com o mesmo fundo charcoal", "a
    cunha diagonal aparece") does NOT describe the current live state. It describes the
    palette-working state (confirmed next). Practical consequence for the fix planner: the token
    cycle is a hard prerequisite — until it is fixed, no separator change is observable and Test 4
    cannot be re-run.

- timestamp: 2026-09-13T23:48:00Z
  checked: |
    DIFFERENTIAL EXPERIMENT (the decisive test). Saved the live HTML, inlined the live compiled CSS
    verbatim, then appended one last-in-cascade <style> with the seven literal brand hex values —
    neutralizing the token cycle while changing NOTHING about the DOM, the components, or the
    compiled utilities. Re-rendered headless at 390x2200 and re-sampled the same pixel columns.
  found: |
    Column x=8 (left edge — the wedge polygon's apex, ~0px thick here):
      y    0..1273  rgb(0,0,0)      <- Hero + CtaGroup (black)
      y 1274..2199  rgb(32,37,38)   <- 926px of UNBROKEN #202526: BrandStory + Location + Faq + Footer
    Column x=382 (right edge — the wedge at its thickest):
      y 1274..1535  rgb(32,37,38)   <- BrandStory
      y 1536..1549  rgb(0,0,0)      <- THE WEDGE: one 14px black band, the only divider on the page
      y 1550..2199  rgb(32,37,38)   <- 650px of UNBROKEN #202526: Location + Faq + Footer
    Screenshot confirms visually: charcoal field, one shallow black diagonal right before "Onde
    fica a It's Garlic", then Location and FAQ flowing together with no seam.
  implication: |
    DECISIVE on both counts. (1) The reported symptom reproduces verbatim with the token bug
    neutralized -> the token bug is NOT the cause of this gap (option b refuted). (2) The single
    divider is confirmed to be at the BrandStory->Location boundary only, and Location->Faq
    ->Footer is one continuous 650px surface of a single colour value -> option (a) confirmed.

- timestamp: 2026-09-13T23:52:00Z
  checked: "salience arithmetic on the separator device itself (WCAG relative-luminance contrast)"
  found: |
    wedge fill #000000 vs section #202526 ............ 1.35:1
    Location #202526 vs Faq #202526 (the bare seam) .. 1.00:1
    full-section alternation Preto vs Carvão ......... 1.35:1
    alt surface Roxo #31266B vs Carvão .............. 1.20:1   (brand-guidelines.md:24's documented
                                                                "superfície escura alternativa —
                                                                variação de seção")
    Oliva #7D804D vs Carvão (hairline-rule option) ... 3.74:1
    Geometry: h-8 = 32px box, polygon starts at 40% height on the right -> ~19px at its thickest
    (14px measured), tapering to 0px at the left edge. Slope ≈ 2.8° across a 390px viewport.
  implication: |
    A third, independent contributing factor: even when painted, the existing device is a ~1.35:1,
    ~19px, 2.8°-slope taper — near the threshold of perceptibility. Simply cloning it to the other
    two boundaries would likely NOT satisfy "read as distinct blocks" either. Oliva is the only
    brand value that clears 3:1 against Carvão, which is why Faq.tsx already reaches for
    `border-accent-olive/40` for its own row rules.

- timestamp: 2026-09-13T23:55:00Z
  checked: "the design contract and the plan decision that produced this shape — 02-UI-SPEC.md Color table, docs/brand-guidelines.md, 02-03-SUMMARY.md key-decisions"
  found: |
    02-UI-SPEC.md Color table, Secondary row: "--color-surface-primary #202526 (Carvão) |
    Brand-story, Localização, and FAQ section backgrounds (alternating with Preto per
    docs/brand-guidelines.md's 'variação de seção'); footer (already built)". It assigns ONE
    surface to all three sections plus the footer, and cites an ALTERNATION rule in the same
    breath — but never assigns any second surface to any of the three.
    docs/brand-guidelines.md:24 — Roxo #31266B is the brand's documented "Superfície escura
    alternativa (variação de seção, nunca texto)": a dedicated alternate section surface exists.
    docs/brand-guidelines.md:134 — "Formas diagonais — recortes/blocos diagonais como elemento
    gráfico de composição entre seções": the diagonal device itself is on-brand and correct.
    BrandStory.tsx:8-14 (the implementer's own comment) — "The UI-SPEC assigns that same charcoal
    surface to this section, Location and the FAQ, so the three sit adjacent on the same
    background. Rather than substitute a colour the spec did not assign, a decorative diagonal
    wedge... separating this section visually from Location without touching Location.tsx (02-03's
    scope is this file, Faq.tsx and page.tsx only)".
    02-03-SUMMARY.md key-decisions — "a small aria-hidden div with a CSS clip-path diagonal wedge
    at BrandStory's bottom edge and (implicitly, by not needing one — Faq is the last section,
    bordered only by the footer) no equivalent needed at Faq's edges."
  implication: |
    The one-wedge shape was a conscious, documented decision, not an oversight in the code — and
    it rests on two upstream errors:
    (i) SPEC: the Color table flattened an alternation rule into a single-surface assignment,
        leaving the implementer with no second surface to alternate and forcing a workaround;
    (ii) PLAN REASONING: the quoted key-decision reasons only about Faq's BOTTOM edge and never
        about Faq's TOP edge against Location, and it assumes "bordered only by the footer" is
        safe — but Footer.tsx:15 is also bg-surface-primary, so that edge is unseparated too.
        Plus Location.tsx was out of 02-03's files_modified scope, so the one boundary the plan
        DID think about was the only one it was allowed to touch.

## Resolution

root_cause: |
  (1) PRIMARY — structural placement (option (a) from the brief): the diagonal-wedge separator is a
      single hardcoded `<div aria-hidden>` inside `src/components/home/BrandStory.tsx:30-33`, and
      is the only section-level separator in the entire `src/` tree. `Location.tsx` and `Faq.tsx`
      contain no separator, border, or background variation, and `page.tsx`/`layout.tsx` render the
      sections as directly adjacent siblings with no inter-section gap. The homepage therefore has
      FOUR consecutive `bg-surface-primary` (#202526) blocks — BrandStory, Location, Faq and the
      Footer — and exactly ONE separator, at the first of three boundaries. Proven by a
      differential render with the brand palette repaired: 650px of a single uninterrupted
      rgb(32,37,38) across Location + Faq + Footer, with the one 14px wedge band above it.
  (2) CONTRIBUTING — design contract: `02-UI-SPEC.md`'s Color table assigns `--color-surface-primary`
      to brand-story, Localização, FAQ *and* the footer simultaneously while citing
      `docs/brand-guidelines.md`'s "variação de seção" — which is an *alternation* rule, and the
      brand has a dedicated alternate dark section surface for it (Roxo #31266B,
      brand-guidelines.md:24). The spec never assigned a second surface to any of the three, so no
      alternation was available to implement and the wedge became a workaround (stated verbatim in
      BrandStory.tsx:8-14).
  (3) CONTRIBUTING — plan reasoning: `02-03-SUMMARY.md`'s key-decision accounts only for Faq's
      BOTTOM edge ("Faq is the last section, bordered only by the footer — no equivalent needed"),
      never for Faq's TOP edge against Location, and wrongly presumes the footer is a different
      surface. Location.tsx was also outside 02-03's `files_modified` scope, so the single boundary
      the plan reasoned about was the only one it was permitted to touch.
  (4) CONTRIBUTING — salience (option (c) from the brief, quantified): even when painted, the
      existing wedge is #000000 on #202526 = **1.35:1** contrast, ~19px tall at its thickest,
      tapering to 0px at the left edge (≈2.8° slope at 390px). Cloning it to the other two
      boundaries would likely still not read as "distinct blocks". Of the brand values, only Oliva
      #7D804D clears 3:1 against Carvão (3.74:1).
  NOT THE CAUSE, BUT A BLOCKING PREREQUISITE — the sibling finding's dead brand-colour tokens
  (`src/styles/design-tokens.css:44-55` @theme self-reference + `globals.css:1-2` import order) are
  confirmed live on the served CSS and in a live screenshot: every sampled background pixel is
  rgb(255,255,255), so as shipped there is NO charcoal and NO wedge on screen at all. That defect
  MASKS this gap (it makes the one existing wedge transparent too) but does not cause it — removing
  it in the differential render reproduced the reported symptom verbatim. It must nevertheless be
  fixed FIRST, or no separator change will be observable and UAT Test 4 cannot be re-run.
fix: "[not applied — diagnose-only mode, per debug_context goal: find_root_cause_only]"
verification: "[n/a — no fix applied]"
files_changed: []

---
status: diagnosed
trigger: "a navegação por Tab funciona, mas nenhum anel de foco visível aparece nas perguntas do FAQ nem no link 'Como chegar'. Corrigir o estado :focus-visible para que o elemento atualmente focado tenha contraste claro contra o fundo."
created: 2026-09-13T22:30:00Z
updated: 2026-09-13T23:05:00Z
mode: find_root_cause_only
bug_class: Bohrbug (fully deterministic — reproduces on every focus of every focusable element)
---

## Current Focus

hypothesis: CONFIRMED (see Resolution.root_cause)
test: complete — confirmed by 4 independent methods (static CSS read, isolated Chrome repro,
  live-page CDP computed-style read, live-page runtime causality test)
expecting: n/a
next_action: "Diagnose-only mode — return ROOT CAUSE FOUND to caller. Do NOT apply a fix."

reasoning_checkpoint:
  hypothesis: |
    `--color-accent` (and every other brand colour token) computes to the guaranteed-invalid
    value because of a self-referential CSS custom property, so
    `:focus-visible { outline: 3px solid var(--color-accent) }` is invalid at computed-value
    time and falls back to `unset` -> `outline-style: none`. Because that author declaration
    still wins the cascade against the UA stylesheet's native focus ring, the browser default
    ring is suppressed too — leaving zero focus indication anywhere on the site.
  confirming_evidence:
    - "Live page: getComputedStyle(:root).getPropertyValue('--color-accent') === '' (empty)"
    - "Live page: every tab stop reports outline-style:'none' while matches(':focus-visible')===true"
    - "Runtime injection of literal values flipped every tab stop to 'solid 3px rgb(184,255,0)'"
  falsification_test: |
    If --color-accent had resolved to #b8ff00 on the live page, or if outline-style had been
    'solid' at any tab stop, the hypothesis would be dead. Neither happened.
  fix_rationale: |
    Addresses the root cause (the token never resolves), not the symptom (the missing ring).
    Adding a hardcoded fallback to the focus rule would mask a defect that is simultaneously
    killing the ENTIRE brand palette site-wide.
  blind_spots: |
    Only tested in Chrome 152 headless. Custom-property cycle handling is spec-defined and
    implemented identically in Firefox/Safari, so cross-browser risk is judged negligible, but
    it was not directly measured. Did not test the production `next build` output in a browser
    (its CSS was read statically and contains the identical defect).
  candidate_causes:
    - "code/CSS-authoring: self-referential `--color-accent: var(--color-accent)` in @theme inline (design-tokens.css)"
    - "config/build-pipeline: @import order in globals.css makes Tailwind emit the @theme block UNLAYERED and AFTER the literals, so the self-reference wins the cascade instead of losing to it"
  and_gate: |
    YES — both conditions are required. Proven by rebuilding the same CSS with the import
    order swapped (layer-probe): with `@import "tailwindcss"` first, the @theme block lands
    INSIDE `@layer theme` and BEFORE the literal, so the unlayered literal wins and NO cycle
    forms despite the self-reference still being present. The self-reference alone is latent;
    the import order alone is harmless. Together they are fatal.

## Symptoms

expected: |
  Focus ring clearly visible against the section background on each FAQ <summary> and on the
  "Como chegar" directions link when tabbing through the page. (UAT Test 5, cross-ref Test 3.)
actual: |
  Tab navigation works (focus moves correctly), but NO visible focus ring appears anywhere.
errors: none (no console errors — this is a silent CSS computed-value failure)
reproduction: |
  Load any page, press Tab. Measured via CDP on http://localhost:3000.
started: |
  Latent since commit 11014a9 (09-13 14:15, phase 01-05, "publish the official palette and type
  scale as paired CSS and JSON design tokens") — design-tokens.css has not been modified since.
  Surfaced in phase 02 UAT only because phase 02 is the first phase to UAT keyboard navigation.

## Eliminated

- hypothesis: "A component-level class removes the focus ring (focus:outline-none, outline-none,
    or a focus-visible: utility overriding the global rule)"
  evidence: "grep -rnE 'focus:|focus-visible|outline-none' across src/ returns ZERO focus-related
    classes in Faq.tsx and Location.tsx. Both rely entirely on the single global rule in
    globals.css. The only component focus classes in the repo are SkipLink.tsx's `focus:*`
    utilities, which are unrelated to the FAQ/directions elements."
  timestamp: 2026-09-13T22:58:00Z

- hypothesis: "The focus ring exists but has insufficient contrast against the section background
    (designed for light background, rendered on charcoal)"
  evidence: "Computed outline-style is literally 'none' — the ring is not merely low-contrast, it
    is not painted at all. Contrast is irrelevant."
  timestamp: 2026-09-13T22:50:00Z

- hypothesis: "The :focus-visible rule was stripped or never compiled into the served CSS"
  evidence: "Present verbatim in BOTH the dev bundle (line 1010-1013 of
    src_app_globals_css_1igg3k2._.single.css) and the production bundle
    (.next/static/chunks/2n872g_tv4u65.css): `outline:3px solid var(--color-accent);outline-offset:2px`.
    The rule is delivered; its VALUE is what fails."
  timestamp: 2026-09-13T22:45:00Z

- hypothesis: "The stylesheet never loaded / Tailwind is not applying at all (which would also
    produce empty custom properties)"
  evidence: "CONTROL probe: document.styleSheets.length === 1 with 61 rules; Tailwind utilities
    demonstrably apply (body display:flex, link min-height:44px, text-decoration:underline,
    summary list-style-type:none, summary font-size:20px). Tailwind's own theme vars resolve
    (--spacing:'.25rem', --color-zinc-300:'lab(...)'). The CSS is loaded and working."
  timestamp: 2026-09-13T23:00:00Z

- hypothesis: "Test 3 (directions link PASS) vs Test 5 (same link FAIL) is a real behavioural
    discrepancy — e.g. focus ring depends on tab order or prior focus state"
  evidence: "Measured BOTH 'Como chegar' instances (CtaGroup.tsx:57 and Location.tsx:96) at every
    tab stop across three full tab cycles: all report outline-style 'none', identically, every
    time, regardless of tab order or previously focused element. Both use the same class string.
    No state dependence exists. Test 3's PASS was a FALSE PASS: it bundled six acceptance
    criteria into one verdict, and the user passed it on the dominant ones (link is obviously a
    link, opens Google Maps). Test 5 isolated keyboard navigation and correctly caught it."
  timestamp: 2026-09-13T23:02:00Z

## Evidence

- timestamp: 2026-09-13T22:42:00Z
  checked: "src/app/globals.css and src/styles/design-tokens.css (source)"
  found: |
    globals.css:21-24 declares a single global `:focus-visible { outline: 3px solid
    var(--color-accent); outline-offset: 2px }`. design-tokens.css:21-42 declares
    `:root { --color-accent: #b8ff00; ... }`, then :44-55 declares
    `@theme inline { --color-accent: var(--color-accent); ... }` — a SELF-REFERENCE.
  implication: "Suspected custom-property dependency cycle. Needs compiled-output confirmation."

- timestamp: 2026-09-13T22:45:00Z
  checked: "compiled CSS, dev (.next/dev/.../src_app_globals_css_*.css) and prod (.next/static/chunks/2n872g_tv4u65.css)"
  found: |
    Both bundles emit, UNLAYERED and adjacent:
      :root      { --color-accent:#b8ff00; ... }            <- from the plain :root block
      :root,:host{ --color-accent:var(--color-accent); ... } <- from @theme inline, LATER
    and an EMPTY `@layer theme;` statement. Both builds are newer than the sources (fresh).
  implication: |
    Same specificity (0,1,0), same (no) cascade layer, later source order -> the
    self-referential declaration WINS. The literal #b8ff00 is discarded by the cascade.

- timestamp: 2026-09-13T22:50:00Z
  checked: "isolated Chrome 152 repro of the exact emitted cascade (scratchpad/cycle-test.html)"
  found: |
    Rendered screenshot: literal-#b8ff00 control swatch and control outline BOTH render lime;
    `background-color: var(--color-accent)` paints NOTHING; `color: var(--color-accent)` renders
    white (inherited), not lime; `outline: 3px solid var(--color-accent)` paints NOTHING; an
    autofocused <summary> shows NO ring at all (UA default ring suppressed too).
  implication: "The cycle is real in a production browser engine and it kills outlines exactly as reported."

- timestamp: 2026-09-13T22:56:00Z
  checked: "live page http://localhost:3000 via CDP — computed styles + real Tab keypresses"
  found: |
    :root custom properties ALL empty string: --color-accent "", --color-surface-primary "",
    --color-surface-deep "", --color-accent-olive "", --color-accent-coral "", --color-text-on-dark "".
    Every tab stop (skip link, both "Como chegar" links, all 4 FAQ <summary>, Instagram link):
      matchesFocusVisible: true  /  outlineStyle: "none"  /  outlineColor: rgb(0,0,0)  /  boxShadow: "none"
    "Como chegar" link computed color rgb(0,0,0) (black), text-decoration-color rgb(0,0,0).
    First .bg-accent element (iFood button) background rgba(0,0,0,0) (transparent).
  implication: |
    Confirmed on the real page: :focus-visible MATCHES correctly (so the selector and the
    <summary>/<a> focusability are fine) but the outline is not painted. The entire brand
    palette is dead, not just the focus ring.

- timestamp: 2026-09-13T23:00:00Z
  checked: "CONTROL probe separating 'CSS missing' from 'these specific vars are cyclic'"
  found: |
    Tailwind's own vars resolve: --spacing ".25rem", --color-zinc-300 "lab(...)", --default-font-family "...".
    Project vars declared ONLY in the plain :root block resolve: --text-body "1rem", --text-heading-2 "1.5rem".
    Project vars ALSO mirrored self-referentially in @theme inline are DEAD: --color-accent "", --color-surface-deep "".
    Stylesheet loaded (1 sheet / 61 rules); utilities applying (body flex, link min-height 44px, etc).
  implication: |
    The dead/alive split falls EXACTLY on "is this var mirrored in the @theme inline block?".
    That is decisive: the @theme inline self-reference is the cause. Nothing else correlates.
    Note the type-scale tokens survive precisely because they were NOT mirrored into @theme.

- timestamp: 2026-09-13T23:02:00Z
  checked: "live-page runtime causality test (injected literal values, no repo file touched)"
  found: |
    BEFORE: every tab stop -> outline: none 3px rgb(0,0,0)
    AFTER injecting `:root{--color-accent:#b8ff00;...}`:
      root --color-accent -> "#b8ff00"; body background -> rgb(0,0,0) (brand black restored)
      every tab stop -> outline: solid 3px rgb(184, 255, 0)   <- the lime ring appears
  implication: "Causal link proven in both directions on the real page. Root cause confirmed."

- timestamp: 2026-09-13T23:04:00Z
  checked: "AND-gate test — rebuilt the same CSS through @tailwindcss/postcss with import order swapped"
  found: |
    A (as shipped, design-tokens.css imported FIRST): @theme block emitted UNLAYERED, self-ref
      at index 139 AFTER the literal at index 95 -> self-ref wins -> cycle. `@layer theme;` empty.
    B (@import "tailwindcss" FIRST): @theme block emitted INSIDE `@layer theme {`, self-ref at
      index 1479 BEFORE the literal at index 15059 -> unlayered literal wins -> NO cycle,
      despite the self-reference still being present in the source.
  implication: |
    Two contributing conditions, both required (AND-gate): the self-referential mirror AND the
    import order that makes it land unlayered-and-last. Fixing only one removes the symptom;
    fixing the import order alone leaves the self-reference latent for a future refactor to
    re-trigger.

- timestamp: 2026-09-13T23:05:00Z
  checked: "blast radius beyond the reported symptom"
  found: |
    Live page renders WHITE background with BLACK text — bg-surface-deep/bg-surface-primary and
    text-text-on-dark are all transparent/initial. Brand colour survives ONLY inside raster/SVG
    assets (logo, garlic illustration), which carry their own embedded colours. SkipLink's
    `focus:bg-accent` / `focus:text-surface-deep` are dead too, so the skip link is also
    effectively invisible when focused.
  implication: |
    Explains why UAT Test 1 ("hero brand fidelity") passed: the images still look on-brand.
    This defect is far larger than the reported focus-ring symptom — it is a total brand-palette
    outage (MARCA-02/MARCA-03) plus a WCAG 2.4.7 failure plus a contrast failure.

## Resolution

root_cause: |
  A CSS custom-property dependency cycle kills every brand colour token, which makes the global
  focus-ring declaration invalid at computed-value time and silently removes ALL focus outlines
  (including the browser's native one). Two conditions are BOTH required:
  (1) src/styles/design-tokens.css:44-55 mirrors each brand token onto itself —
      `@theme inline { --color-accent: var(--color-accent); ... }`; AND
  (2) src/app/globals.css:1-2 imports design-tokens.css BEFORE `@import "tailwindcss"`, which
      makes Tailwind v4 emit the @theme variables UNLAYERED and AFTER the plain `:root` literals
      (leaving `@layer theme;` empty), so the self-referential declaration WINS the cascade
      instead of losing to the literal.
  Result: `--color-accent` computes to the guaranteed-invalid value, so
  `outline: 3px solid var(--color-accent)` is invalid at computed-value time and computes to
  `unset` -> `outline-style: none`. The author declaration still beats the UA stylesheet, so the
  browser's default focus ring is suppressed as well -> zero focus indication site-wide.
fix: "[not applied — diagnose-only mode, per debug_context goal: find_root_cause_only]"
verification: "[n/a — no fix applied]"
files_changed: []

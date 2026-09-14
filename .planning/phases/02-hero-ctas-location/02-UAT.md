---
status: complete
phase: 02-hero-ctas-location
source: [02-VERIFICATION.md]
started: 2026-09-13T22:25:00Z
updated: 2026-09-14T02:20:00Z
---

## Current Test

[testing complete]

## Tests

### 1. Hero brand fidelity and CLS on mobile viewports
expected: On a 375x667 and 390x844 mobile viewport, load the homepage and look at the hero
  (kicker, headline, illustration). The concept line, headline and illustration read as It's
  Garlic rather than a generic burger site (compare against img/logo.png and the Instagram
  reference screenshots); the "Imagem ilustrativa — foto real em breve" disclosure is legible
  and unmistakably attached to the illustration; the kicker/headline do not wrap past two
  lines; the illustration does not jump or reflow as it loads.
result: pass

### 2. CTA row fold visibility and keyboard behavior
expected: On the same two mobile viewports, confirm both order CTAs (iFood, WhatsApp) are
  visible side by side without scrolling past the hero; Tab through the CTA row; click each
  pending button. INTEGRA-01's fold criterion holds (both order CTAs visible pre-scroll); the
  two pending buttons read as deliberately unavailable rather than broken; Tab reaches the
  directions link with a clear visible focus ring against the dark surface; the coral
  unavailability notices are legible; clicking each pending button does nothing at all.
result: issue
reported: "em viewports mobile de 375px e 390px, os CTAs de iFood e WhatsApp aparecem
  empilhados, não lado a lado. Além disso, a seção de CTAs está fora do Hero e depois da
  ilustração, portanto não fica acima da dobra. Os botões desabilitados e os avisos de
  indisponibilidade estão corretos. Corrigir o posicionamento/layout antes de marcar o teste
  como pass."
severity: major

### 3. Location section tone and chip-wrap on mobile
expected: On a 390x844 mobile viewport, read the Location section (hours, modality chips,
  directions link) and activate the directions link. The hours block reads as honestly
  unconfirmed rather than broken or empty; the provisional marker is legible olive-on-black
  inside the charcoal section; modality chips wrap rather than overflow; the directions link
  is obviously a link, Tab reaches it with a visible focus ring, and activating it opens the
  real store location in Google Maps in a new tab; nothing in the section reads as a promise
  that the store is open right now.
result: pass

### 4. Brand story voice authenticity
expected: Read the brand story out loud as if you were the person behind the counter; then
  look at the brand-story/Location/FAQ sections together. It sounds like someone who works
  there and likes the food, not an agency trying to sound young; it makes the garlic bread
  read as the starting point rather than the ceiling; every sentence is defensible from
  PROJECT.md alone; the three adjacent charcoal sections read as distinct blocks (via the
  diagonal-wedge separator) rather than one undifferentiated field.
result: issue
reported: "a voz e o conteúdo da história estão corretos, mas a separação visual não está
  totalmente clara. A cunha diagonal aparece apenas após a seção de história; Localização e
  FAQ continuam com o mesmo fundo charcoal, sem separador próprio. Verificar se as três
  seções precisam de divisores visuais mais explícitos."
severity: cosmetic

### 5. FAQ keyboard behavior and zero-JS honesty
expected: Use the FAQ with keyboard only (Tab to each question, Enter/Space to open/close);
  read all four answers; open the browser network panel and reload. Focus ring is clearly
  visible against the section background on each summary; Enter and Space both open and close
  each entry; the four answers are ones the brand owner could stand behind word for word,
  especially the ordering answer (honest about channels, no working-link promise); the FAQ
  adds no JavaScript request of its own on reload.
result: issue
reported: "a navegação por Tab funciona, mas nenhum anel de foco visível aparece nas
  perguntas do FAQ nem no link 'Como chegar'. Corrigir o estado :focus-visible para que o
  elemento atualmente focado tenha contraste claro contra o fundo."
severity: major

## Summary

total: 5
passed: 2
issues: 3
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-02-2
  truth: "Both order CTAs (iFood, WhatsApp) visible side by side without scrolling past the
    hero (INTEGRA-01's fold criterion)."
  status: resolved
  resolved_by: 02-05-PLAN.md
  resolved_at: 2026-09-14
  reason: "User reported: em viewports mobile de 375px e 390px, os CTAs de iFood e WhatsApp
    aparecem empilhados, não lado a lado. Além disso, a seção de CTAs está fora do Hero e
    depois da ilustração, portanto não fica acima da dobra. Os botões desabilitados e os
    avisos de indisponibilidade estão corretos. Corrigir o posicionamento/layout antes de
    marcar o teste como pass."
  severity: major
  test: 2
  root_cause: |
    Three independently-necessary causes (AND-gate — no single fix resolves the truth):
    (1) CtaGroup.tsx uses `flex-col ... sm:flex-row`, but Tailwind's `sm` breakpoint is 640px
    (unoverridden), so at 375/390px only `flex-col` applies; even fixed, the two button labels
    (~557px with today's "(em breve)" suffix, ~373px once links are confirmed) don't fit
    side-by-side in the ~343px available width. (2) page.tsx renders `<Hero />` and
    `<CtaGroup />` as sibling sections, so the CTA row sits structurally after the Hero and its
    illustration, not inside it. (3) Even if nested inside Hero, the hero's own vertical budget
    (header + 2-line headline + subhead + full-width aspect-square illustration) pushes the
    hero's end to ~865-880px, below the 667/844px viewport fold. No automated gate caught this
    because the only machine-checkable test asserts source adjacency (CtaGroup right after
    Hero in JSX), not viewport co-visibility.
  artifacts:
    - path: "src/components/home/CtaGroup.tsx"
      issue: "flex-col with sm:flex-row (640px) — wrong breakpoint for 375/390px; button
        labels too wide to fit side-by-side even at the right breakpoint"
    - path: "src/app/page.tsx"
      issue: "Hero and CtaGroup rendered as sibling sections — CTA row outside Hero, after
        the illustration"
    - path: "src/components/home/Hero.tsx"
      issue: "aspect-square w-full max-w-sm illustration consumes ~343px of vertical budget,
        the dominant contributor to pushing content below the fold"
    - path: "src/components/home/OrderCta.tsx"
      issue: "px-6 padding plus the '(em breve)' suffix make both labels too wide to sit
        side-by-side at 343px"
    - path: ".planning/phases/02-hero-ctas-location/02-UI-SPEC.md"
      issue: "mandates CTAs below the full-width 1:1 illustration — conflicts with the fold
        criterion at 375x667"
    - path: ".planning/phases/02-hero-ctas-location/02-CONTEXT.md"
      issue: "D-01 places the CTA row in a separate section after Hero (self-marked
        reversible)"
  missing:
    - "Amend D-01 to move the order-CTA row inside Hero, above the illustration, and/or
      shrink the hero's mobile vertical budget (cap illustration height on mobile)"
    - "Fix side-by-side fit at 343px: drop the sm: breakpoint gate and reduce horizontal
      cost (shorter mobile labels/padding, or grid-cols-2 with min-w-0 tracks)"
    - "Verify the fix against both the current '(em breve)' labels and the future
      confirmed-link labels"
    - "Add a persistent test/guard for the amended fold contract (none exists today)"
  debug_session: ".planning/debug/DEBUG-cta-row-stacked-below-fold.md"

- gap_id: G-02-4
  truth: "The three adjacent charcoal sections (brand story, Location, FAQ) read as distinct
    blocks via the diagonal-wedge separator, rather than one undifferentiated field."
  status: resolved
  resolved_by: 02-06-PLAN.md
  resolved_at: 2026-09-14
  reason: "User reported: a voz e o conteúdo da história estão corretos, mas a separação
    visual não está totalmente clara. A cunha diagonal aparece apenas após a seção de
    história; Localização e FAQ continuam com o mesmo fundo charcoal, sem separador próprio.
    Verificar se as três seções precisam de divisores visuais mais explícitos."
  severity: cosmetic
  test: 4
  root_cause: |
    The diagonal wedge is a single hardcoded element inside BrandStory.tsx — the only
    section-level separator in the codebase. Location.tsx, Faq.tsx and Footer.tsx have no
    separator, border, or background variation of their own, so three consecutive
    same-surface (bg-surface-primary) seams exist: BrandStory→Location, Location→Faq, and an
    unreported Faq→Footer — with only the first one separated. This is currently masked by
    G-02-5's dead color tokens (every background renders browser-default white on the live
    page, so there is no charcoal and no visible wedge at all right now); a differential test
    confirmed the missing-separator defect reproduces even after the token cycle is patched,
    so it is a distinct, second defect, not a symptom of G-02-5 — G-02-5 is a blocking
    prerequisite, not the cause. Once tokens are restored, the wedge itself is also low
    contrast (~1.35:1 on charcoal) and may still read as too subtle. Upstream: 02-UI-SPEC.md's
    Color table assigns bg-surface-primary to all three sections plus the footer without ever
    assigning the alternate surface that brand-guidelines.md's "variação de seção" rule calls
    for.
  artifacts:
    - path: "src/components/home/BrandStory.tsx"
      issue: "holds the one and only diagonal-wedge separator, confined to this file's scope"
    - path: "src/components/home/Location.tsx"
      issue: "bg-surface-primary with no separator at either edge"
    - path: "src/components/home/Faq.tsx"
      issue: "bg-surface-primary with no separator at either edge (its own border-b is an
        intra-component row rule, not a section boundary)"
    - path: "src/components/layout/Footer.tsx"
      issue: "a fourth consecutive charcoal block with no top border — same defect,
        unreported by the user"
    - path: "src/app/page.tsx"
      issue: "sections composed as direct siblings with no gap-*/space-y-* — the UI-SPEC's
        48px inter-section gap is not implemented"
    - path: ".planning/phases/02-hero-ctas-location/02-UI-SPEC.md"
      issue: "Color table flattens an intended surface-alternation rule into a single-surface
        assignment for all three sections"
  missing:
    - "Fix G-02-5 (dead color tokens) first — nothing here is observable until then"
    - "Decide the separation device at the spec level: real surface alternation
      (Preto/Roxo on Location per brand-guidelines.md) or one shared separator applied at
      all three seams"
    - "Size/contrast the chosen device for salience — only Oliva clears 3:1 against Carvão;
      the current wedge does not"
    - "Also address the unreported Faq→Footer seam and the never-implemented 48px
      inter-section gap"
  debug_session: ".planning/debug/DEBUG-charcoal-sections-no-separator.md"

- gap_id: G-02-5
  truth: "Focus ring is clearly visible against the section background on each FAQ summary
    and on the directions link when tabbing through the page."
  status: resolved
  resolved_by: 02-04-PLAN.md
  resolved_at: 2026-09-14
  reason: "User reported: a navegação por Tab funciona, mas nenhum anel de foco visível
    aparece nas perguntas do FAQ nem no link 'Como chegar'. Corrigir o estado
    :focus-visible para que o elemento atualmente focado tenha contraste claro contra o
    fundo."
  severity: major
  test: 5
  root_cause: |
    A CSS custom-property dependency cycle kills every brand color token, which makes the
    global focus-ring declaration invalid at computed-value time and silently removes ALL
    focus outlines, including the browser's native one. Two conditions are both required:
    (1) design-tokens.css mirrors each brand token onto itself inside `@theme inline`
    (`--color-accent: var(--color-accent)`, etc.); AND (2) globals.css imports
    design-tokens.css BEFORE `@import "tailwindcss"`, which makes Tailwind v4 emit the
    @theme variables unlayered and after the plain :root literals (leaving `@layer theme;`
    empty), so the self-referential declaration wins the cascade instead of losing to the
    literal. Result: --color-accent (and every other brand token) computes to the
    guaranteed-invalid value, so `outline: 3px solid var(--color-accent)` is invalid at
    computed-value time and computes to `unset` -> outline-style: none — and the author
    declaration still beats the UA stylesheet, so even the default browser ring is
    suppressed. Confirmed by 4 independent methods (static CSS read, isolated Chrome repro,
    live-page CDP computed-style read, live-page runtime causality test with injected
    literals). Blast radius is far larger than the reported symptom: the ENTIRE brand
    palette is dead site-wide (backgrounds, text colors, SkipLink's focus styles too) —
    this is a total brand-palette outage plus a WCAG 2.4.7 failure, not just a missing
    focus ring. Test 3's earlier "pass" on the directions-link focus ring was a false pass:
    the same link, measured directly, shows outline-style "none" at every tab stop; Test 3
    bundled six criteria into one verdict and passed on the dominant ones.
  artifacts:
    - path: "src/styles/design-tokens.css"
      issue: "@theme inline block mirrors every brand token onto itself (self-referential
        custom property)"
    - path: "src/app/globals.css"
      issue: "imports design-tokens.css before @import \"tailwindcss\", causing the @theme
        block to land unlayered and after the :root literals; also holds the
        :focus-visible rule that depends on the dead --color-accent token"
    - path: "src/components/layout/SkipLink.tsx"
      issue: "focus:bg-accent / focus:text-surface-deep also dead — the skip link is
        invisible when focused too"
  missing:
    - "Break the self-reference cycle (reference the token via its real literal value
      inside @theme inline rather than mirroring itself), and/or fix the @import order so
      tailwindcss loads before the token literals, restoring the intended cascade"
    - "Verify the entire brand palette (backgrounds, text colors, borders) after the fix —
      not just the focus ring — since this bug is site-wide, not focus-ring-scoped"
    - "Add a regression guard (e.g. a computed-style smoke test) so this can't silently
      regress again"
  debug_session: ".planning/debug/DEBUG-focus-ring-invisible-faq-directions.md"

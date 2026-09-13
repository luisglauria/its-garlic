---
status: complete
phase: 02-hero-ctas-location
source: [02-VERIFICATION.md]
started: 2026-09-13T22:25:00Z
updated: 2026-09-13T23:25:00Z
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
  status: failed
  reason: "User reported: em viewports mobile de 375px e 390px, os CTAs de iFood e WhatsApp
    aparecem empilhados, não lado a lado. Além disso, a seção de CTAs está fora do Hero e
    depois da ilustração, portanto não fica acima da dobra. Os botões desabilitados e os
    avisos de indisponibilidade estão corretos. Corrigir o posicionamento/layout antes de
    marcar o teste como pass."
  severity: major
  test: 2
  artifacts: []
  missing: []

- gap_id: G-02-4
  truth: "The three adjacent charcoal sections (brand story, Location, FAQ) read as distinct
    blocks via the diagonal-wedge separator, rather than one undifferentiated field."
  status: failed
  reason: "User reported: a voz e o conteúdo da história estão corretos, mas a separação
    visual não está totalmente clara. A cunha diagonal aparece apenas após a seção de
    história; Localização e FAQ continuam com o mesmo fundo charcoal, sem separador próprio.
    Verificar se as três seções precisam de divisores visuais mais explícitos."
  severity: cosmetic
  test: 4
  artifacts: []
  missing: []

- gap_id: G-02-5
  truth: "Focus ring is clearly visible against the section background on each FAQ summary
    and on the directions link when tabbing through the page."
  status: failed
  reason: "User reported: a navegação por Tab funciona, mas nenhum anel de foco visível
    aparece nas perguntas do FAQ nem no link 'Como chegar'. Corrigir o estado
    :focus-visible para que o elemento atualmente focado tenha contraste claro contra o
    fundo."
  severity: major
  test: 5
  artifacts: []
  missing: []

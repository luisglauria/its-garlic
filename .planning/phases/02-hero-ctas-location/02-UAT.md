---
status: testing
phase: 02-hero-ctas-location
source: [02-VERIFICATION.md]
started: 2026-09-13T22:25:00Z
updated: 2026-09-13T22:25:00Z
---

## Current Test

number: 1
name: Hero brand fidelity and CLS on mobile viewports
expected: |
  The concept line, headline and illustration read as It's Garlic rather than a generic burger
  site (compare against img/logo.png and the Instagram reference screenshots); the "Imagem
  ilustrativa — foto real em breve" disclosure is legible and unmistakably attached to the
  illustration; the kicker/headline do not wrap past two lines; the illustration does not jump
  or reflow as it loads.
awaiting: user response

## Tests

### 1. Hero brand fidelity and CLS on mobile viewports
expected: On a 375x667 and 390x844 mobile viewport, load the homepage and look at the hero
  (kicker, headline, illustration). The concept line, headline and illustration read as It's
  Garlic rather than a generic burger site (compare against img/logo.png and the Instagram
  reference screenshots); the "Imagem ilustrativa — foto real em breve" disclosure is legible
  and unmistakably attached to the illustration; the kicker/headline do not wrap past two
  lines; the illustration does not jump or reflow as it loads.
result: [pending]

### 2. CTA row fold visibility and keyboard behavior
expected: On the same two mobile viewports, confirm both order CTAs (iFood, WhatsApp) are
  visible side by side without scrolling past the hero; Tab through the CTA row; click each
  pending button. INTEGRA-01's fold criterion holds (both order CTAs visible pre-scroll); the
  two pending buttons read as deliberately unavailable rather than broken; Tab reaches the
  directions link with a clear visible focus ring against the dark surface; the coral
  unavailability notices are legible; clicking each pending button does nothing at all.
result: [pending]

### 3. Location section tone and chip-wrap on mobile
expected: On a 390x844 mobile viewport, read the Location section (hours, modality chips,
  directions link) and activate the directions link. The hours block reads as honestly
  unconfirmed rather than broken or empty; the provisional marker is legible olive-on-black
  inside the charcoal section; modality chips wrap rather than overflow; the directions link
  is obviously a link, Tab reaches it with a visible focus ring, and activating it opens the
  real store location in Google Maps in a new tab; nothing in the section reads as a promise
  that the store is open right now.
result: [pending]

### 4. Brand story voice authenticity
expected: Read the brand story out loud as if you were the person behind the counter; then
  look at the brand-story/Location/FAQ sections together. It sounds like someone who works
  there and likes the food, not an agency trying to sound young; it makes the garlic bread
  read as the starting point rather than the ceiling; every sentence is defensible from
  PROJECT.md alone; the three adjacent charcoal sections read as distinct blocks (via the
  diagonal-wedge separator) rather than one undifferentiated field.
result: [pending]

### 5. FAQ keyboard behavior and zero-JS honesty
expected: Use the FAQ with keyboard only (Tab to each question, Enter/Space to open/close);
  read all four answers; open the browser network panel and reload. Focus ring is clearly
  visible against the section background on each summary; Enter and Space both open and close
  each entry; the four answers are ones the brand owner could stand behind word for word,
  especially the ordering answer (honest about channels, no working-link promise); the FAQ
  adds no JavaScript request of its own on reload.
result: [pending]

## Summary

total: 5
passed: 0
issues: 0
pending: 5
skipped: 0
blocked: 0

## Gaps

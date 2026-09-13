---
phase: "02"
slug: "hero-ctas-location"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
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

*Draft — seeded from RESEARCH.md's Phase Requirements → Test Map before planning; Plan/Wave/Task ID
columns are filled by the planner once PLAN.md tasks exist.*

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| TBD | TBD | TBD | HERO-01 | — | Hero source contains "Mais que um pão de alho!" and uses design tokens (no hex literal) | static source inspection | `npx vitest run src/components/home/home.test.ts` | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | HERO-02 | — | Hero/CtaGroup source contains all three CTA labels verbatim | static source inspection | same file | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | HERO-03 | — | Hero source uses `next/image` (not `<img>`), a sized container, and renders the "Imagem ilustrativa" provisional label | static source inspection | same file | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | LOCAL-01 | outbound redirect integrity | `Location` renders address fields via props (not hardcoded) and calls `buildMapsUrl()`; no `<iframe` anywhere in repo | static source inspection + fixture-prop unit test | same file | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | LOCAL-02 | — | `Location` maps over `store.modalities` (array), not hardcoded chips | fixture-prop unit test (1-item vs 3-item array) | same file | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | LOCAL-03 | — | Provisional-hours notice renders when `hours.schedule.length === 0`; not rendered for a non-empty fixture | fixture-prop unit test | same file | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | LOCAL-04 | outbound redirect integrity | "Como chegar" anchor `href` equals `buildMapsUrl().url` | static source inspection | same file | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | INTEGRA-01 | outbound redirect integrity | `OrderCta` renders live `<a>` when `{confirmed: true}`, disabled `<button>` with "(em breve)" when `{confirmed: false}` | fixture-prop unit test | `npx vitest run src/components/home/OrderCta.test.ts` | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | INTEGRA-01 (mobile-fold) | — | CTAs visible without scrolling on a ~375–390px-tall mobile viewport | manual/visual only — not automatable by this stack | n/a | n/a | ⬜ pending (manual) |
| TBD | TBD | TBD | INTEGRA-02 | outbound redirect integrity | Same confirmed/disabled contract as INTEGRA-01, WhatsApp CTA | fixture-prop unit test | same file as OrderCta | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | INTEGRA-03 | Spoofing (of commercial claims) | Unavailability notice renders only when `!ifood.confirmed`, and always points at the Maps CTA, never a nonexistent `/cardapio` route | fixture-prop unit test | same file as CtaGroup | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | INTEGRA-05 | — | No `<form`, no `checkout`/`cart` literal anywhere under `src/components/home/` or `src/app/page.tsx` | repo-wide static grep guard | `npx vitest run src/components/home/home.test.ts` | ❌ Wave 0 | ⬜ pending |
| TBD | TBD | TBD | SEC-03 (carried) | Tampering / Spoofing | New `home/` components call `build*Url()` / `assertAllowedHost()` — no raw `https://` literal | static source inspection | same file | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/components/home/home.test.ts` (or one file per component, matching the granularity the
  planner chooses) — covers HERO-01/02/03, LOCAL-01/02/03/04, INTEGRA-05, and the SEC-03 no-raw-URL
  guard.
- [ ] `src/components/home/OrderCta.test.ts` — covers INTEGRA-01/02/03's confirmed/disabled branches
  via fixture props (no framework change needed).
- No new test *framework* or config gap — `vitest.config.ts`'s `node` environment already covers
  this phase's testing style; the RTL/jsdom path was researched and explicitly not adopted (see
  RESEARCH.md Alternatives Considered).

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| "Pedir no iFood" and WhatsApp CTA visible side by side without scrolling past the fold | INTEGRA-01 (mobile-fold) | Viewport-relative visual layout; not observable from source text or a fixture-prop render assertion in this project's DOM-less test stack | Load the page in a mobile viewport (~375×667–390×844), confirm both CTAs are visible pre-scroll |

*If none: "All phase behaviors have automated verification."*

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending — draft seeded before planning; the planner fills Plan/Wave/Task ID and
`/gsd-validate-phase` (or the phase's own verification pass) confirms sign-off after execution.

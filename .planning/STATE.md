---
gsd_state_version: "1.0"
current_phase: 02
current_phase_name: Hero, CTAs & Location
status: executing
stopped_at: Completed 02-05-PLAN.md (gap closure G-02-2) — human-check for order-CTA fold/overflow/focus at 375x667 and 390x844 still required before G-02-2 is fully closed in UAT
last_updated: "2026-09-14T02:27:48.895Z"
last_activity: 2026-09-13
last_activity_desc: Phase 02 execution started
state_head: c6ed3d407b18df5c93c01a520c39aabc575fba2c
progress:
  total_phases: 5
  completed_phases: 0
  total_plans: 12
  completed_plans: 11
  percent: 0
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-09-12)

**Core value:** Fazer o visitante entender em segundos que a It's Garlic é "mais que um pão de
alho" e sair do site com um pedido feito no iFood ou uma conversa iniciada no WhatsApp — sem
fricção, mobile-first.
**Current focus:** Phase 02 — Hero, CTAs & Location

## Current Position

Phase: 02 (Hero, CTAs & Location) — EXECUTING
Plan: 3 of 6
Status: Ready to execute
phase-1 checkbox intentionally left unchecked — the phase-completion predicate
(`gsd_run phase uat-passed --require-verification`) does not pass while G-01-2 is open. User
explicitly authorized starting Phase 2 anyway (2026-09-13) rather than waiting on the domain
registrar purchase, which has no ETA. Re-run `/gsd-verify-work 01` to close G-01-2 once a
registrar is chosen and MFA/registrar-lock are configured.
Phase 02: Hero, CTAs & Location — about to start (discuss/plan)
Last activity: 2026-09-13 — Phase 02 execution started

Progress: [░░░░░░░░░░] 0%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: - min
- Total execution time: 0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| - | - | - | - |

**Recent Trend:**

- Last 5 plans: none yet
- Trend: N/A (project not started)

*Updated after each plan completion*
**Per-Plan Metrics:**

| Plan | Duration | Tasks | Files |
|------|----------|-------|-------|
| Phase 01 P01 | 31min | 3 tasks | 22 files |
| Phase 01 P02 | ~7min | 3 tasks | 15 files |
| Phase 01 P03 | ~6min | 2 tasks | 3 files |
| Phase 01 P04 | 9min | 3 tasks | 5 files |
| Phase 01 P05 | ~35min | 3 tasks | 14 files |
| Phase 01 P06 | ~40min | 3 tasks | 8 files |
| Phase 02 P01 | 20min | 3 tasks | 10 files |
| Phase 02 P02 | ~5min | 2 tasks | 5 files |
| Phase 02 P03 | ~15min | 3 tasks | 7 files |
| Phase 02 P04 | 9min | 2 tasks | 7 files |
| Phase 02 P05 | ~20min | 3 tasks | 10 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- [Roadmapping]: Vertical MVP slicing adapted from research's 5-phase suggestion — Hero+Location
  (Phase 2) and Menu (Phase 3) sequenced before Promotions/Almoço (Phase 4) so the client's own
  "versão mínima navegável" launch gate (hero + cardápio) lands as early as possible.
- [Roadmapping]: Security requirements (SEC-01–17) split across phases by where the safeguard is
  concretely built or verified — repo/account setup (branch protection, MFA, secret scanning,
  headers config) in Phase 1; search/XSS-safe rendering in Phase 3 (built) and Phase 5 (tested);
  production-only verification (CSP enforcement, DNS lock, rollback) in Phase 5.
- [Roadmapping]: Both [BLOQUEADOR de fase] pendências (confirmed operating hours; confirmed iFood
  URL + WhatsApp number) do not block phases outright — Phases 2 and 4 ship with clearly-labeled
  provisional/placeholder data and carry an explicit follow-up note once the client confirms.
- [Phase 01]: 01-01: TypeScript pinned to scaffold's ^5 (5.9.3), not npm latest 7.0.2, per RESEARCH.md Open Question 2
- [Phase 01]: 01-01: @types/node bumped ^20 -> ^24 (dev-only) to resolve vitest@5 peer conflict; engines.node stays >=20.9
- [Phase 01]: 01-01: git.allow_default_branch_commits=true added to config.json — repo has no remote, branching_strategy already none, prior GSD commits already on master
- [Phase 01]: [Phase 01] 01-02: storeInfoSchema follows PATTERNS.md literally with z.literal for neighborhood/city/state (single confirmed location); a second location would be a schema change, not a data edit
- [Phase 01]: [Phase 01] 01-02: link.schema.ts uses Zod v4 top-level z.url() with a .refine() enforcing confirmed:false requires a non-empty pendingConfirmation
- [Phase 01]: [Phase 01] 01-02: ARQ-02 ESLint no-restricted-imports exemption extended to *.test.ts files so schema regression tests can import the real src/data/store.ts module to prove ARQ-03 has teeth
- [Phase 01]: [Phase 01] 01-03: Only contact-location skeleton entry marked confirmed:false — hero/ctas carry CTA labels and the WhatsApp channel name, not the pending iFood URL/WhatsApp number, so honest D-05 scoping leaves only operating hours unconfirmed
- [Phase 01]: [Phase 01] 01-03: TDD task (skeleton.ts) committed as test -> feat per tdd.md commit-scope contract; no REFACTOR commit needed
- [Phase 01]: 01-04: Task 2 checkpoint resolved — public GitHub repository on GitHub Free selected; SEC-12/13/14 fully satisfiable via GitHub-native branch protection, required PR review, and secret scanning at no cost
- [Phase 01]: 01-04: REQUIREMENTS.md marked complete for SEC-06/07/09/17 only, not SEC-10/12/13/14 — those remain Pending until the account owner actually performs the manual GitHub/Vercel/registrar actions documented (unchecked) in SECURITY.md
- [Phase 01]: [Phase 01] 01-05: extraction thresholds tuned against img/logo.png raw pixels (lettering r,g,b>190; icon g>150,100<r<230,b<100), logged by scripts/vectorize-logo.mjs on every run
- [Phase 01]: [Phase 01] 01-05: promotional-script typeface (Caveat) is a Claude's-Discretion typography choice, not a PROJECT.md-locked decision - flagged for human aesthetic review alongside logo fidelity
- [Phase 01]: [Phase 01] 01-06: Header/Footer render only the landmark's inner content (a plain div); src/app/layout.tsx owns the single literal header/main/footer tags directly
- [Phase 01]: [Phase 01] 01-06: docs/brand-guidelines.md contrast table is computed via the WCAG relative-luminance formula over the seven official hex values, not asserted qualitatively - white-on-charcoal (~15.5:1) is the recommended body-text pairing
- [Phase 01]: [Phase 01] 01-06: create-next-app's light/dark scaffold vars removed from globals.css (referenced the now-removed --font-geist-* vars); design-tokens.css and tailwindcss imports kept intact
- [Phase 01 UAT]: Test 1 (client copy approval) passed on verbal approval attested by the user, on behalf of the actual brand-owner (user's sister) — covers tone/structure as working base only, not final per-section copy.
- [Phase 01 UAT]: Test 2 issue accepted as deferred (not a code defect): SEC-12/14 complete; SEC-13 accepted risk (sole maintainer, AR-07); SEC-10 registrar leg deferred with no ETA by explicit user decision (AR-08) — domain registrar purchase not happening this phase. User authorized starting Phase 2 despite Phase 1 remaining formally incomplete in ROADMAP.md.
- [Phase 01]: Remote `origin` connected to https://github.com/luisglauria/its-garlic (audited file list before push, per user's explicit process); branch `phase-01-foundation` pushed (not `main`, no --force). `main` (local) still has no upstream tracking.
- [Phase 02]: 02-01: OrderCta/PendingCta signature extended with an optional describedBy prop (beyond the plan's locked artifact table) to associate the coral unavailability notice with the pending iFood button via aria-describedby
- [Phase 02]: 02-01: page.tsx Task 2 rewrite removed the walking-skeleton store-name/address block entirely (not just the CTA ternary) — Location (LOCAL-01..04) is plan 02-02's scope
- [Phase 02]: 02-01: pendingSuffix = "(em breve)", provisionalBadgeLabel = "Provisório" — vocabulary plan 02-02's hours notice reuses
- [Phase 02]: [Phase 02]: 02-02: hoursPendingBody = "Em atualização — confirme no iFood ou no WhatsApp antes de vir." — UI-SPEC empty-state wording verbatim, names the concrete channels to check
- [Phase 02]: [Phase 02]: 02-02: Location's directions anchor reuses ctaCopy.mapsLabel ("Como chegar") rather than a duplicate LocationCopy field — reuses plan 02-01's locked vocabulary
- [Phase 02]: [Phase 02]: 02-02: populated-schedule rows render as {row.days}: {row.open} – {row.close} — the shape Phase 4's time-aware journey and the client's eventual hours confirmation apply against
- [Phase 02]: [Phase 02]: 02-03: brandStoryCopy — heading 'Mais que um pão de alho' + two paragraphs covering all three skeleton carry-points (what/where/why the garlic bread is the signature)
- [Phase 02]: [Phase 02]: 02-03: faqs — four entries (location/ordering/modalities/delivery), address/modality cross-checked against getStoreInfo() by sections.test.ts, ordering answer names iFood/WhatsApp without promising a working link
- [Phase 02]: [Phase 02]: 02-03: diagonal-wedge separator (CSS clip-path revealing the black body background) at BrandStory's bottom edge separates the three adjacent charcoal sections without editing Location.tsx (out of this plan's scope)
- [Phase 02]: [Phase 02]: 02-03: content-integrity gate over home-copy.ts — 5 named tests (currency, award/rating, superlative/urgency, cart/checkout, clock time), the mechanical half of tone-of-voice.md §5
- [Phase 02]: [Phase 02]: 02-04: colours+script-font moved to a Tailwind static @theme block (literals), Anton/Manrope moved to an inline @theme block keyed by distinct --font-display-anton/--font-body-manrope variable names — same-name binding was the self-reference bug (G-02-5)
- [Phase 02]: [Phase 02]: 02-04: globals.css import order swapped (tailwindcss first, design-tokens.css second) so the theme block lands inside @layer theme ahead of any unlayered literal
- [Phase 02]: [Phase 02]: 02-04: check-brand-css.mjs checks the LAST (cascade-winning) declaration of each colour token against design-tokens.json, not mere presence, since a presence-only check would have passed on the original outage
- [Phase 02]: [Phase 02]: 02-05: D-01a amends D-01 -- order-CTA row moves inside Hero (between subhead and illustration) instead of a separate section after it, closing G-02-2's fold criterion
- [Phase 02]: [Phase 02]: 02-05: TIER_CLASS moved from Body(16px) to Label(14px) type-size token, px-6->px-4, w-full+text-center, PendingCta renders label+suffix as two lines -- brings the two-button order row under 343px mobile content width
- [Phase 02]: [Phase 02]: 02-05: hero-fold.test.ts guards co-visibility mechanics (real computed widths, row-vs-illustration index) rather than source adjacency, the exact gap that let G-02-2 ship uncaught

### Pending Todos

None yet.

### Blockers/Concerns

- [Phase 1, carried forward — not a Phase 2 blocker] SEC-10 registrar-MFA leg and SEC-15
  (registrar lock) remain open. User explicitly decided (2026-09-13) not to choose/purchase a
  domain registrar during Phase 1 — deferred with no ETA (AR-08 in `01-SECURITY.md`, gap G-01-2
  in `01-UAT.md`). Phase 1 is NOT marked complete in ROADMAP.md as a result. Does not block
  Phase 2 (UI work does not depend on it) — re-run `/gsd-verify-work 01` once a registrar exists.
- [Phase 2, Phase 4] Operating hours unconfirmed — only divergent 2.5–4.8-year-old Instagram
  stories found ("Seg-Qua 12h–22h..." vs. "Dom-Qua 11h15–21h30..."). Blocks only the *real*
  version of LOCAL-03 and PROMO-02/03; ships provisional/labeled in the meantime.
- [Phase 2] Exact iFood store URL and official WhatsApp number unconfirmed — INTEGRA-01/02/04
  ship with a clearly-marked placeholder destination via the Phase 1 integrations module, never a
  guessed link.
- [Phase 5] Domain/hosting registrar not finalized — affects when SEC-15 (DNS registrar lock +
  MFA) can actually be completed; hosting itself is decided (Vercel).
- [Phase 5] Existence of a Google Meu Negócio profile unknown — affects NAP consistency scope for
  SEO-01, not the rest of the site.
- [Content, all phases] Responsible party/process for post-launch cardápio/preço/horário updates
  still undecided by client (not a code blocker, but affects how "editable" data is documented).

## Deferred Items

Items acknowledged and deferred at milestone close, most recent first:

| Category | Item | Status | Deferred At | Milestone |
|----------|------|--------|-------------|-----------|
| v2 scope | INTEGRA-V2-01/02 — WhatsApp AI ordering bot; WhatsApp becomes primary CTA once backend exists | Deferred | 2026-09-12 (project init) | v1 MVP |
| v2 scope | CARD-V2-01 — marking sold-out products on the site (vs. iFood only) | Deferred (client: "decidir depois") | 2026-09-12 (project init) | v1 MVP |
| v2 scope | ANALYTICS-V2-01 — conversion event tracking (CTA clicks) | Deferred (explicit client decision: no analytics in MVP) | 2026-09-12 (project init) | v1 MVP |

## Session Continuity

Last session: 2026-09-14T02:27:48.844Z
Stopped at: Completed 02-05-PLAN.md (gap closure G-02-2) — human-check for order-CTA fold/overflow/focus at 375x667 and 390x844 still required before G-02-2 is fully closed in UAT
Resume file: None
Session resumed 2026-09-13, proceeding to execute gap-closure plans.
Next: /gsd-execute-phase 02

---
phase: 01-foundation-architecture-brand-identity-security-baseline
plan: 03
subsystem: content
tags: [content, tone-of-voice, typescript, vitest, tdd]

# Dependency graph
requires:
  - phase: 01-01
    provides: "Toolchain (npm build/lint/test), tsconfig @/* alias, vitest.config.mts"
provides:
  - "src/content/tone-of-voice.md — PT-BR tone-of-voice guide (register, person, rhythm, regionalism, forbidden moves, accessibility, 7 approved/rejected example pairs)"
  - "src/content/skeleton.ts — typed contentSkeleton inventory of all 7 site sections, each tagged confirmed or pending client confirmation"
  - "src/content/skeleton.test.ts — automated guard over the skeleton's structural and confirmed/pending invariants"
provides_content_authority: "Establishes the voice and structure Phase 2 (hero, brand-story, ctas, faqs, contact-location) and Phase 3 (product-categories) write their final copy inside"
affects: ["01-06", "Phase 2 (hero/location copy)", "Phase 3 (menu copy)", "Phase 5 (SEO metadata copy)"]

# Actuals (#2632)
actuals:
  tokens: 4434
  tasks: 2
  commits: 4
  plan_head_before: 02817de1c801270745da3b7042572e1a57659d58

# Tech tracking
tech-stack:
  added: []
  patterns: ["confirmed / pendingConfirmation marker convention (mirrors 01-02's hours.provisional / hours.pendingConfirmation) applied to content-layer data, not just commercial data"]

key-files:
  created:
    - src/content/tone-of-voice.md
    - src/content/skeleton.ts
    - src/content/skeleton.test.ts
  modified: []

key-decisions:
  - "Only the contact-location skeleton entry is confirmed:false. Per the plan's own carries-text scoping (hero/ctas carry CTA labels and channel names, not literal iFood URLs or WhatsApp numbers), the only unconfirmed fact actually carried anywhere in the skeleton is operating hours — so contact-location is the sole unconfirmed entry, matching D-05's 'mark honestly, don't over-flag' spirit."
  - "product-categories entry lists all ten official category names as a single carries string (comma-separated) rather than ten separate array entries — keeps the >=2-entries behavior test simple while still satisfying the 'names all ten categories' acceptance criterion verbatim."
  - "TDD task committed as three atomic commits (test -> feat -> a small fix), following gsd-core/references/tdd.md's RED/GREEN/REFACTOR commit-scope contract; no REFACTOR commit was needed since the GREEN implementation was already minimal and clean."

patterns-established:
  - "Content-layer data (src/content/*) uses the same confirmed/pendingConfirmation marker shape as commercial data-layer schemas (src/lib/schemas/*), so a future reader only needs to learn the convention once."

requirements-completed: [CONT-01, CONT-02, CONT-03]

coverage:
  - id: D1
    description: "PT-BR tone-of-voice guide covering register/person, the 'Mais que um pão de alho!' concept, rhythm, regionalism, a hard 'never do' list, language accessibility, and 7 approved/rejected example pairs — a writer can read one file and know how to sound"
    requirement: "CONT-01"
    verification:
      - kind: other
        ref: "node -e line-count/section/pairs check from 01-03-PLAN.md Task 1 <verify> — 129 lines, all 7 named sections present, 7 example pairs (>=6 required)"
        status: pass
    human_judgment: true
    rationale: "Register (jovem/descontraído/urbano vs. corporate, Recife regionalism landing as warm vs. caricatured) is an explicit judgment call per the plan's own <human-check> — not mechanically verifiable by a script."
  - id: D2
    description: "Typed contentSkeleton enumerating all 7 required sections (hero, brand-story, product-categories, ctas, faqs, seo-metadata, contact-location), each with title/purpose/carries/confirmed/writtenInPhase, guarded by an automated test suite"
    requirement: "CONT-02"
    verification:
      - kind: unit
        ref: "src/content/skeleton.test.ts — 8 tests: seven-unique-ids, non-empty title/purpose/>=2 carries, pendingConfirmation invariant both directions, contact-location hours+unconfirmed, all ten categories present, no price-shaped digits, writtenInPhase present"
        status: pass
      - kind: other
        ref: "npm run build (exit 0, no Type error) and npm run lint (exit 0)"
        status: pass
    human_judgment: false
  - id: D3
    description: "Every unconfirmed fact in the skeleton (operating hours, in contact-location) carries a non-empty pendingConfirmation citing REQUIREMENTS.md bloco 5; no product, price, rating, award, or opening time is invented anywhere in either deliverable"
    requirement: "CONT-03"
    verification:
      - kind: unit
        ref: "src/content/skeleton.test.ts — 'every entry with confirmed:false has a non-empty pendingConfirmation' and 'contact-location carries the operating-hours item and is marked unconfirmed'"
        status: pass
      - kind: other
        ref: "grep -nE '[0-9]{1,2}h[0-9]{0,2}|[0-9]{1,2}:[0-9]{2}' src/content/tone-of-voice.md src/content/skeleton.ts (no match) and grep -n 'R$' src/content/tone-of-voice.md (no match after the fix commit)"
        status: pass
    human_judgment: false

duration: ~25min
completed: 2026-09-13
status: complete
---

# Phase 1 Plan 3: Content Voice & Structure Summary

**PT-BR tone-of-voice guide (7 sections, 7 approved/rejected example pairs) plus a typed, test-guarded 7-section content skeleton — one skeleton entry (contact-location) explicitly marked pending client confirmation of operating hours, every other entry confirmed against PROJECT.md.**

## Performance

- **Duration:** ~25 min (commit-to-commit)
- **Tasks:** 2 (1 auto, 1 auto+tdd)
- **Commits:** 4 (docs, test, feat, fix)
- **Files created:** 3

## Accomplishments

- Wrote `src/content/tone-of-voice.md`: 129 lines in Portuguese, covering quem fala e para quem, o conceito central ("Mais que um pão de alho!"), ritmo e forma, regionalismo, o que nunca fazer (verbatim list of forbidden moves), acessibilidade da linguagem, and 7 approved/rejected example pairs — closing with an explicit note naming Phase 2 and Phase 3 as owners of final per-section copy.
- Built `src/content/skeleton.ts` via TDD: wrote `skeleton.test.ts` first (confirmed RED — `Cannot find module './skeleton'`), then implemented `contentSkeleton` with exactly the seven required section ids, each carrying a `title`, `purpose`, `carries` list, `confirmed` boolean, optional `pendingConfirmation`, and `writtenInPhase`.
- Only `contact-location` is `confirmed: false` — its `pendingConfirmation` names the unconfirmed operating hours and cites REQUIREMENTS.md bloco 5, mirroring plan 01-02's `hours.provisional`/`hours.pendingConfirmation` convention rather than inventing a second marker vocabulary.
- `product-categories` names all ten official menu categories from PROJECT.md verbatim, with a note that sanduíches no pão de alho is the differentiator versus a generic hamburgueria.
- Full verification chain green: `npx vitest run src/content/skeleton.test.ts` (8/8), `npm test` (4 files / 32 tests, up from 3 files in 01-02), `npm run build` (exit 0, no Type error), `npm run lint` (exit 0).

## Task Commits

Each task was committed atomically:

1. **Task 1: Write the PT-BR tone-of-voice guide** - `534606b` (docs), fix follow-up `1fe392b` (fix)
2. **Task 2: Build the typed content skeleton with its confirmed/pending guard** - RED `8563182` (test), GREEN `ad822ad` (feat)

_TDD task produced 2 commits (test -> feat); no REFACTOR commit was needed — the GREEN implementation was already minimal._

## Files Created/Modified

- `src/content/tone-of-voice.md` - PT-BR tone-of-voice guide: register/person, concept, rhythm, regionalism, forbidden-moves list, accessibility, 7 example pairs, closing scope note
- `src/content/skeleton.ts` - `ContentSectionId`, `ContentSection`, `contentSkeleton` (7 entries)
- `src/content/skeleton.test.ts` - 8 tests guarding the skeleton's structural and confirmed/pending invariants

## Decisions Made

- Only `contact-location` is `confirmed: false` — the plan's own carries-text scoping means no other section literally carries an unconfirmed fact (hero/ctas name CTA labels and the WhatsApp *channel*, not the pending WhatsApp *number* or iFood URL), so marking only `contact-location` unconfirmed is the honest, non-over-flagging reading of D-05.
- `product-categories`'s ten official category names are carried as one comma-separated string rather than ten separate array entries — simpler while still satisfying the acceptance criterion that the text names all ten categories verbatim.
- Followed `gsd-core/references/tdd.md`'s RED -> GREEN commit-scope contract for the TDD task (separate `test(...)` and `feat(...)` commits) rather than folding both into one task commit.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Currency symbol in an explicit placeholder example risked tripping the plan-level "no price" verification**
- **Found during:** Post-Task-2 self-review against the plan's overall `<verification>` item 4 ("No price, unlisted product name, or opening time appears in either file")
- **Issue:** Task 1's rejected-example 3 used `"R$ [preço fictício]"` — an explicit placeholder per the task's own action spec ("use an explicit placeholder token and say so"), but the literal `R$` currency symbol was still visible in the file text and could be misread as stating a price by a downstream mechanical check.
- **Fix:** Reworded to `"[placeholder de valor]"` — same pedagogical point (never invent a price), zero currency symbol, zero ambiguity.
- **Files modified:** `src/content/tone-of-voice.md`
- **Verification:** `grep -n 'R$' src/content/tone-of-voice.md` — no match; Task 1's automated verify script (line count, sections, pairs count) re-run and still passes (129 lines, 7 pairs).
- **Committed in:** `1fe392b` (fix)

---

**Total deviations:** 1 auto-fixed (1 bug/ambiguity tightening)
**Impact on plan:** Cosmetic tightening of an already-compliant example; no scope change, no new content invented.

## Issues Encountered

None.

## User Setup Required

None — no external service configuration required.

## Pending Client Confirmations (from this plan's skeleton)

Only one skeleton entry is marked `confirmed: false`:

| Section | Field | Pending reason |
|---------|-------|-----------------|
| `contact-location` | operating hours (part of the `carries` list) | "Horário de funcionamento ainda não confirmado pelo cliente — as únicas referências encontradas (stories antigos do Instagram) têm entre 2,5 e 4,8 anos e divergem entre si; ver REQUIREMENTS.md bloco 5 (Pendências) e PROJECT.md Pendências." |

This is the same unconfirmed-hours pendency already tracked in `STATE.md` Blockers/Concerns and `PROJECT.md` Pendências — no new pendency was introduced by this plan.

## Next Phase Readiness

- Phase 2 can start writing hero, brand-story, ctas, faqs, and contact-location copy directly against `src/content/tone-of-voice.md` (voice) and `src/content/skeleton.ts` (structure/information carried) without re-deriving either.
- Phase 3 has the same for `product-categories`; Phase 5 has the same for `seo-metadata`.
- The `confirmed`/`pendingConfirmation` convention on `contact-location` is ready for a one-line flip to `confirmed: true` once the client confirms operating hours — no structural change needed.
- Open item carried forward (unchanged by this plan): operating hours, exact iFood store URL, and WhatsApp number remain the project's standing pending confirmations (see `STATE.md` Blockers/Concerns).

## Self-Check: PASSED

All 3 claimed created files verified present on disk; all 4 commits (`534606b`, `8563182`, `ad822ad`, `1fe392b`) verified present in `git log --oneline --all`.

---
*Phase: 01-foundation-architecture-brand-identity-security-baseline*
*Completed: 2026-09-13*

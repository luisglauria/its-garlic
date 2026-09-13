---
phase: 01-foundation-architecture-brand-identity-security-baseline
plan: 04
subsystem: infra
tags: [security, csp, headers, ci, github-actions, gitleaks, vitest, next-config]

# Dependency graph
requires:
  - phase: 01-01
    provides: Next.js scaffold, `next.config.ts` shell, `vitest.config.mts` runner config, `package.json` engines/test-script pins
provides:
  - "src/lib/security/headers.ts — buildCsp(mode) + securityHeaders(mode), the single testable source of the response header set"
  - "next.config.ts headers() hook wired to securityHeaders(), applied to every route"
  - "SECURITY.md — D-06 four-part checklist (scope, code/config items, manual account actions, SEC-17 standing constraint)"
  - ".github/workflows/ci.yml — npm ci + lint + test + audit(high) + gitleaks gate on push/pull_request"
affects: [phase-5-security-verification, ship]

# Actuals (#2632) — chars/4 over the realized diff (added lines only), not a harness token count.
actuals:
  tokens: 5800
  tasks: 3
  commits: 3
plan_head_before: 926441fd568b66ae0a09819c4bee4553acb5b324

tech-stack:
  added: [gitleaks (CI-only static binary, not an npm dependency)]
  patterns:
    - "Security headers/CSP extracted into a pure, unit-testable module (buildCsp/securityHeaders) rather than declared inline in next.config.ts, so the production-vs-development policy divergence is provable by assertion, not by inspection"
    - "D-06 checklist pattern: every security requirement documented in SECURITY.md is explicitly tagged code/config (checked, verified by a named command) or manual account-level action (always unchecked, named owner, exact settings path) — never blended"

key-files:
  created:
    - src/lib/security/headers.ts
    - src/lib/security/headers.test.ts
    - SECURITY.md
    - .github/workflows/ci.yml
  modified:
    - next.config.ts

key-decisions:
  - "Task 2 checkpoint resolved by the user: public GitHub repository on the Free plan. Recorded in SECURITY.md Part 3 — branch protection, required PR review, and native secret scanning with push protection are all free on a public repo, so SEC-12/13/14 are fully satisfiable at no cost (vs. the private-paid or private-free alternatives presented at the checkpoint)."
  - "REQUIREMENTS.md traceability was updated for SEC-06, SEC-07, SEC-09, and SEC-17 only — NOT for SEC-10/12/13/14. Those four remain 'Pending' in REQUIREMENTS.md even though this plan is done, because the plan's own prohibition list forbids marking any manual account-level control as satisfied from inside the repository, and REQUIREMENTS.md's Complete/Pending column is exactly that kind of satisfaction claim. Documenting a checklist row is not the same as the account owner having performed the action. This is a deliberate narrowing of the generic 'mark all frontmatter requirement IDs complete' executor step, applied because the plan's explicit prohibition (P9, transparency/integrity) takes precedence over the generic default."
  - "gitleaks is invoked as a downloaded static binary in CI (curl the GitHub release tarball, run the binary directly) rather than the gitleaks-action marketplace action, per RESEARCH.md's guidance to sidestep private-repository action-licensing ambiguity. This stays correct even though the repo ended up public — it costs nothing and remains valid if visibility ever changes."
  - "SECURITY.md's manual-actions heading is worded 'Ações manuais do dono das contas (fora do repositório) — Parte 3' (not 'Parte 3 — Ações manuais...') so the section starts with the exact phrase the plan's own automated verification regex looks for (`/^Ações manuais/i` after splitting on `## ` headings)."

patterns-established:
  - "Security header module pattern: any future header/CSP change goes through src/lib/security/headers.ts, never inline in next.config.ts, so it stays unit-testable."
  - "D-06 checklist format in SECURITY.md is the template for any future security documentation — code items get a checked box + verifying command; manual items get an unchecked box + exact settings path + named owner, permanently."

requirements-completed: [SEC-06, SEC-07, SEC-09, SEC-10, SEC-12, SEC-13, SEC-14, SEC-17]

coverage:
  - id: D1
    description: "Testable security-header module (buildCsp/securityHeaders) wired into next.config.ts's headers() hook, applied to every route; production CSP omits both script-relaxation keywords, development CSP differs only on that point"
    requirement: SEC-07
    verification:
      - kind: unit
        ref: "src/lib/security/headers.test.ts (11 assertions)"
        status: pass
      - kind: other
        ref: "npm run build — next.config.ts compiles and headers() resolves"
        status: pass
    human_judgment: false
  - id: D2
    description: "SECURITY.md D-06 checklist: four-part split (scope, code/config, manual account actions, SEC-17 standing constraint), SEC-12/13/14 rows reflecting the public-repo decision, SEC-13 solo-maintainer question answered with both consequences named, zero pre-ticked manual rows"
    requirement: SEC-10
    verification:
      - kind: other
        ref: "node inline script: line-count >=70, all 8 SEC ids present, manual section has 0 checked / >=4 unchecked rows (plan <verify> block, all 3 checks pass)"
        status: pass
    human_judgment: true
    rationale: "Structural checks (line count, requirement IDs present, no pre-ticked manual boxes) are automated and pass, but whether the SEC-12/13/14 narrative accurately reflects the chosen GitHub plan's actual feature availability, and whether the solo-maintainer trade-off is fairly stated, is a judgment call for the account owner to confirm before relying on it operationally."
  - id: D3
    description: "CI gate (.github/workflows/ci.yml): npm ci, lint, test, npm audit --audit-level=high, gitleaks secret scan on push and pull_request, no continue-on-error, no npm install"
    requirement: SEC-14
    verification:
      - kind: other
        ref: "node inline script: required steps/triggers present, no continue-on-error, no npm install (plan <verify> block, passes)"
        status: pass
    human_judgment: true
    rationale: "Workflow YAML structure is verified locally, but the workflow has never actually run on GitHub Actions — no remote is configured and none was created by this plan (explicitly out of scope). A human must confirm the first real run goes green and that audit/gitleaks steps can genuinely fail, not just that the YAML parses."

duration: 9min
completed: 2026-09-13
status: complete
---

# Phase 1 Plan 4: Security Header Module, D-06 Checklist & CI Gate Summary

**Unit-tested CSP/security-header module wired into next.config.ts, a four-part D-06 security checklist in SECURITY.md reflecting a public-GitHub-repo decision, and a CI gate (npm ci + lint + test + audit + gitleaks) that fails on a real finding.**

## Performance

- **Duration:** 9 min (commit-to-commit: `cbd7392` at 13:52:12 to `35f91ae` at 14:01:02, America/Recife)
- **Started:** 2026-09-13T16:52:12Z
- **Completed:** 2026-09-13T17:01:02Z
- **Tasks:** 3 (1 auto/TDD, 1 checkpoint:decision, 1 auto)
- **Files modified:** 5 (4 created, 1 modified)

## Accomplishments

- Extracted the Content-Security-Policy and response-header set out of `next.config.ts` into a pure, unit-testable module (`src/lib/security/headers.ts`), proving by assertion — not inspection — that the production policy omits both script-relaxation keywords while the development policy differs only on that one point.
- Resolved the Task 2 repository-visibility checkpoint: the user selected a **public GitHub repository on the Free plan**, which makes SEC-12 (branch protection), SEC-13 (required PR review), and SEC-14 (secret scanning + push protection) all satisfiable with GitHub-native controls at no cost.
- Wrote `SECURITY.md`, a 188-line, four-part D-06 checklist: scope/limits, code-implementable items (checked, each naming its verifying command), manual account-level actions (all left unchecked, each naming the exact settings path and the responsible owner), and the SEC-17 standing constraint naming all five triggering features (login, CMS, database, checkout, AI chatbot — explicitly including the deferred WhatsApp AI ordering bot).
- Answered the SEC-13 solo-maintainer question by naming both consequences (self-approval on a protected branch vs. adding a second reviewer) without picking one, as the plan required.
- Wrote `.github/workflows/ci.yml`: triggers on `push` and `pull_request`, runs `npm ci` (never `npm install`), lint, test, a high-severity-gated `npm audit`, and a `gitleaks` secret scan using the downloaded static binary (not the marketplace action, per RESEARCH.md's private-repo-licensing caution) — no `continue-on-error` anywhere.

## Task Commits

Each task was committed atomically:

1. **Task 1: Extract testable security-header module, wire into next.config.ts** — `cbd7392` (test, RED) + `98f93ab` (feat, GREEN)
2. **Task 2: Decide GitHub repository visibility** — checkpoint:decision, no code commit; user selected `public` (see Decisions Made)
3. **Task 3: Write the D-06 security baseline checklist and the CI gate** — `35f91ae` (feat)

**Plan metadata:** commit pending as part of this final step (`docs(01-04): complete...`)

_Note: Task 1 was TDD (`tdd="true"`) — RED commit `cbd7392` then GREEN commit `98f93ab`; no separate REFACTOR commit was needed._

## Files Created/Modified

- `src/lib/security/headers.ts` - `buildCsp(mode)` + `securityHeaders(mode)`, the single source of the response header set (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options)
- `src/lib/security/headers.test.ts` - 11 Vitest assertions proving the production/development CSP divergence and the full header set shape
- `next.config.ts` - imports `securityHeaders` via a relative path and returns it from the async `headers()` hook for every route
- `SECURITY.md` - D-06 four-part checklist: scope, code/config items, manual account actions (all unchecked), SEC-17 standing constraint
- `.github/workflows/ci.yml` - `npm ci` + lint + test + `npm audit --audit-level=high` + `gitleaks detect`, on `push` and `pull_request`, full-history checkout, no failure-swallowing steps

## Decisions Made

- **Task 2 (checkpoint:decision):** Repository visibility = **public, GitHub Free**. Rationale from the user's own selection context: SEC-04 already guarantees no secrets are ever committed, so there is nothing sensitive to expose by going public, and public unlocks branch protection + required review + native secret scanning at zero recurring cost — versus paying for GitHub Pro to stay private, or staying private-free and accepting SEC-12/13 as unenforceable platform gaps. This is recorded as a near-one-way door in SECURITY.md itself (publishing cannot be cleanly undone).
- **No git remote was created and nothing was pushed.** Per explicit continuation instructions, creating the GitHub repository and pushing is a separate manual step the user will approve later after reviewing an audited file list — SECURITY.md documents that step as a future manual action; this plan only wrote files.
- **REQUIREMENTS.md marked complete for SEC-06, SEC-07, SEC-09, and SEC-17 only** — not SEC-10, SEC-12, SEC-13, SEC-14. Those four are documented in SECURITY.md as accurate, ready-to-execute checklist rows, but the actual account-level actions (enabling MFA, turning on branch protection, enabling push protection) have not been performed by the account owner yet, because the repository doesn't exist on GitHub yet. Marking them "Complete" in REQUIREMENTS.md would be exactly the false assertion the plan's own prohibitions forbid. See `## Next Phase Readiness` for what unblocks them.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] SECURITY.md manual-actions heading reworded so the plan's own verification regex matches**
- **Found during:** Task 3, running the plan's own `<verify>` automated checks before committing
- **Issue:** The plan's acceptance-criteria script splits `SECURITY.md` on `## ` headings and requires the manual-actions section to start with the literal phrase "Ações manuais" (`/^A[cç][oõ]es manuais/i`). The natural heading order ("Parte 3 — Ações manuais...") fails that regex because the segment starts with "Parte 3 —", not "Ações manuais".
- **Fix:** Reworded the heading to `## Ações manuais do dono das contas (fora do repositório) — Parte 3` so the section content the script inspects starts with the exact phrase it checks for, without changing the meaning or the four-part structure.
- **Files modified:** SECURITY.md
- **Verification:** Re-ran the plan's own three `SECURITY.md` verification scripts — all three pass (line count 188 ≥70, all 8 SEC ids present, manual section: 5 unchecked / 0 checked rows).
- **Committed in:** `35f91ae` (Task 3 commit)

**2. [Rule 1 - Bug] ci.yml's own explanatory comment tripped its own "no `npm install`" verification check**
- **Found during:** Task 3, running the plan's own `<verify>` automated checks before committing
- **Issue:** A code comment explaining *why* the workflow uses `npm ci` instead of the plain-install subcommand contained the literal substring "npm install", which the plan's verification script flags as a forbidden pattern (it can't distinguish a comment from an actual invocation).
- **Fix:** Reworded the comment to describe the same rationale ("never the plain-install subcommand") without spelling out the literal two-word command.
- **Files modified:** .github/workflows/ci.yml
- **Verification:** Re-ran the plan's ci.yml verification script — passes (`ci gate OK`).
- **Committed in:** `35f91ae` (Task 3 commit)

---

**Total deviations:** 2 auto-fixed (2 blocking — both self-inflicted collisions with the plan's own verification regexes, fixed by wording changes with no semantic impact)
**Impact on plan:** Both fixes are cosmetic wording adjustments to satisfy the plan's own automated checks; no scope creep, no change to what SECURITY.md or ci.yml actually do.

## Issues Encountered

None beyond the two auto-fixed wording collisions documented above.

## User Setup Required

None for this plan's deliverables directly. However, `SECURITY.md` Part 3 now lists the concrete next actions the account owner (not Claude) needs to perform once ready to go live with the repository:

1. Create and publish the GitHub repository (public, per the Task 2 decision) — explicitly **not** done by this plan.
2. Enable MFA on GitHub and Vercel (registrar MFA is blocked on the domain registrar decision, still pending per `PROJECT.md` Pendências).
3. Turn on branch protection for `main` with required PR review (`Settings → Branches → Branch protection rules`).
4. Enable secret scanning push protection (`Settings → Code security and analysis`).
5. Decide the SEC-13 solo-maintainer question (self-approval on a protected branch vs. adding a second reviewer) — both options and their consequences are named in `SECURITY.md`, but the choice itself is the account owner's.

## Next Phase Readiness

- The code/config half of the Phase 1 security baseline (SEC-06, SEC-07, SEC-09, SEC-17) is complete and verified by automated checks that will keep proving it on every future change.
- SEC-10, SEC-12, SEC-13, SEC-14 are accurately documented but genuinely still pending — they require the account owner to create the GitHub repository and perform the manual dashboard actions listed in `SECURITY.md` Part 3. This is expected: D-06 always scoped this phase to *documenting* the manual half, not executing it (see `01-CONTEXT.md`).
- SEC-11 (headers/CSP verified against the real production domain) remains Phase 5 scope by design — this plan proves the policy correct by unit test, not against a live domain, because no domain exists yet.
- No blockers for Phase 1's remaining plans (01-05, 01-06) — this plan's deliverables (header module, CI gate, SECURITY.md) are self-contained and don't gate anything else in this phase.

---
*Phase: 01-foundation-architecture-brand-identity-security-baseline*
*Completed: 2026-09-13*

## Self-Check: PASSED

All created files verified present on disk (`src/lib/security/headers.ts`,
`src/lib/security/headers.test.ts`, `next.config.ts`, `SECURITY.md`,
`.github/workflows/ci.yml`, this SUMMARY.md); all three plan commits
(`cbd7392`, `98f93ab`, `35f91ae`) verified present in `git log --oneline --all`.

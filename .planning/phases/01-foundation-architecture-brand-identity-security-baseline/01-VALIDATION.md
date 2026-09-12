---
phase: "01"
slug: "foundation-architecture-brand-identity-security-baseline"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: draft
nyquist_compliant: false
wave_0_complete: false
created: "2026-09-12"
---

# Phase 01 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest `5.0.0` `[VERIFIED: npm registry]`, setup pattern `[CITED: nextjs.org/docs/app/guides/testing/vitest]` |
| **Config file** | `vitest.config.mts` — none exists yet (Wave 0) |
| **Quick run command** | `npx vitest run lib/integrations/allowlist.test.ts` |
| **Full suite command** | `npm run test` (once the `test` script is added to `package.json`) |
| **Estimated runtime** | ~10 seconds (small unit suite, no browser/jsdom) |

---

## Sampling Rate

- **After every task commit:** Run `npx vitest run <changed-file>.test.ts`
- **After every plan wave:** Run `npm run test`
- **Before `/gsd-verify-work`:** Full suite must be green; production-header verification (Strict-Transport-Security, live CSP check) is explicitly out of scope for Phase 1 — Phase 5/SEC-11 owns that
- **Max feedback latency:** 10 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 01-TBD | TBD | 0 | ARQ-03 | — | Malformed `data/*` entry fails the build | unit | `npx vitest run lib/schemas/*.test.ts` | ❌ W0 | ⬜ pending |
| 01-TBD | TBD | TBD | SEC-03 | T-01-link-swap | Outbound link hostname validated against allowlist | unit | `npx vitest run lib/integrations/allowlist.test.ts` | ❌ W0 | ⬜ pending |
| 01-TBD | TBD | TBD | SEC-04 | T-01-secret-leak | No secret pattern in `.gitignore`-covered files / committed history | manual + CI (gitleaks) | `gitleaks detect --source . --no-git=false` (or CI step) | ❌ W0 | ⬜ pending |
| 01-TBD | TBD | TBD | SEC-07 | T-01-missing-headers | Security headers present in `next.config.ts` | unit/smoke | Vitest test importing `nextConfig` and asserting the `headers()` array shape | ❌ W0 | ⬜ pending |
| 01-TBD | TBD | TBD | MARCA-01 | — | 6 logo variants exist at expected `public/brand/` paths | manual/smoke | Node script or Vitest `fs.existsSync` check listing the 6 expected filenames | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Task IDs/plan/wave are placeholders — the planner fills in real values when PLAN.md files are created; this table's Req ID → test-command mapping is the binding contract.*

---

## Wave 0 Requirements

- [ ] `vitest.config.mts` — framework install: `npm install -D vitest vite-tsconfig-paths` (no `jsdom`/React Testing Library needed yet — Phase 1 has no interactive components to render-test)
- [ ] `lib/schemas/*.test.ts` — stubs covering ARQ-03
- [ ] `lib/integrations/allowlist.test.ts` — stubs covering SEC-03
- [ ] `.github/workflows/ci.yml` — running `npm ci`, `npm run test`, `npm audit`, and a `gitleaks` CLI step (covers SEC-09's "auditoria antes de cada release" as an automated gate, and is the natural home for a `gitleaks` fallback under SEC-14 if the repo ends up private-on-Free)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| MFA enabled on GitHub, Vercel, and domain registrar | SEC-10 | Dashboard-only action, no API/CLI surface exercised by this phase; registrar not yet chosen | Enable MFA in each provider's account security settings; screenshot or checklist confirmation |
| Branch protection on `main` (required PR + ≥1 approval) | SEC-12, SEC-13 | GitHub repo settings UI; also blocked on the public/private decision (Open Question 1 in RESEARCH.md) | Repo Settings → Branches → Add rule for `main`; verify a direct push is rejected |
| Secret scanning + push protection enabled | SEC-14 | Free tier only on public repos or paid private (GHAS); private-on-Free falls back to the `gitleaks` CI step instead | Repo Settings → Code security → confirm secret scanning is "Enabled", or confirm `gitleaks` CI step is green |
| Domain registrar lock + MFA | SEC-15 | Registrar not yet chosen (`PROJECT.md` Pendências); out of Phase 1 scope per ROADMAP (Phase 5) | Deferred — tracked here for traceability only |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 10s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

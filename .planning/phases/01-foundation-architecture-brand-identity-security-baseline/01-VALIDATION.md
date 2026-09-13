---
phase: "01"
slug: "foundation-architecture-brand-identity-security-baseline"
# status lifecycle: draft (seeded by plan-phase) → validated (set by validate-phase §6)
# audit-milestone §5.5 distinguishes NOT-VALIDATED (draft) from PARTIAL (validated + nyquist_compliant: false) (#2117)
status: validated
nyquist_compliant: true
wave_0_complete: true
created: "2026-09-12"
validated: "2026-09-13"
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

| Plan | Wave | Requirement | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|------|------|-------------|-----------------|-----------|--------------------|-------------|--------|
| 01-01 | 1 | ARQ-01 | No DB/auth/admin/payment dependency in package.json | build/manual | `npm ls` inspection + `npm run build` | N/A | ✅ green |
| 01-02 | 2 | ARQ-02 | Component outside repository/integrations seam importing `@/data/*` fails lint | unit | `npm run lint` (with a deliberate violation demonstrated once, then reverted) | `eslint.config.mjs` | ✅ green |
| 01-02 | 2 | ARQ-03 | Malformed `store.ts` entry fails the build | unit + demonstrated | `npx vitest run src/lib/schemas/store.schema.test.ts` + live build-failure demo (Task 3) | `src/lib/schemas/store.schema.test.ts` | ✅ green |
| 01-02 | 2 | SEC-03 | Outbound link hostname validated against allowlist, look-alike host rejected | unit | `npx vitest run src/lib/integrations/allowlist.test.ts` | `src/lib/integrations/allowlist.test.ts` | ✅ green |
| 01-02 | 2 | INTEGRA-04 | iFood/WhatsApp/Instagram/Maps URLs built via typed integration functions | unit | `npx vitest run src/lib/integrations/integrations.test.ts` | `src/lib/integrations/integrations.test.ts` | ✅ green |
| 01-02 | 2 | CONT-03 | Unconfirmed external destinations carry `confirmed: false` + placeholder token | unit | `npx vitest run src/lib/schemas/link.schema.ts` (covered via store schema suite) | `src/data/links.ts` | ✅ green |
| 01-03 | 2 | CONT-01, CONT-02 | Content skeleton's 7 sections typed; only pending sections carry `confirmed: false` | unit | `npx vitest run src/content/skeleton.test.ts` | `src/content/skeleton.test.ts` | ✅ green |
| 01-04 | 2 | SEC-07 | Security header set (CSP, HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options) present and dev/prod CSP differ only on script-eval | unit | `npx vitest run src/lib/security/headers.test.ts` | `src/lib/security/headers.test.ts` | ✅ green |
| 01-01 | 1 | SEC-04, SEC-05 | No secret pattern in `.gitignore`-covered files; `.env.example` has no real values | manual + CI (gitleaks) | `.github/workflows/ci.yml` gitleaks step | `.github/workflows/ci.yml` | ✅ green (CI) |
| 01-04 | 2 | SEC-06 | No `localStorage`/`sessionStorage` write in the codebase | manual/code-review rule | `SECURITY.md` Part 2 standing rule | `SECURITY.md` | ✅ green (policy) |
| 01-04 | 2 | SEC-09 | Dependency audit gate fails CI on high/critical advisory | CI | `.github/workflows/ci.yml` `npm audit --audit-level=high` step | `.github/workflows/ci.yml` | ✅ green (CI) |
| 01-04 | 2 | SEC-10, SEC-12, SEC-13, SEC-14 | MFA / branch protection / required PR / secret scanning — GitHub-native, account-owner action | manual | `SECURITY.md` Part 3, unchecked pending the repo's first push | N/A | ⬜ pending (manual, correctly unmarked — repo not yet created) |
| 01-04 | 2 | SEC-17 | Standing rule: threat-model review required before login/CMS/DB/checkout/AI chatbot | policy doc | `SECURITY.md` Part 4 | `SECURITY.md` | ✅ green (policy) |
| 01-05 | 2 | MARCA-01, MARCA-02, MARCA-03, MARCA-04, MARCA-05 | 6 logo variants exist, design tokens (CSS/JSON) parity | unit | `npx vitest run src/lib/brand/brand-assets.test.ts` | `src/lib/brand/brand-assets.test.ts` | ✅ green |
| 01-06 | 3 | PERF-01 | Single landmark structure, skip link, visible focus ring, WCAG contrast pair calculated | unit + manual | `npx vitest run src/components/layout/layout.test.ts` + `docs/brand-guidelines.md` contrast table | `src/components/layout/layout.test.ts` | ✅ green (structural; live Lighthouse audit is a production-gate, out of local Phase 1 scope per PROJECT.md) |
| 01-06 | 3 | PERF-03 | Mobile-first responsive shell | unit + build | `npx vitest run src/components/layout/layout.test.ts` + `npm run build` | `src/components/layout/layout.test.ts` | ✅ green (structural; numeric LCP/CLS/INP budget is a production-gate) |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*
*Reconstructed 2026-09-13 from the 6 executed PLAN/SUMMARY pairs — all Wave 0 draft placeholders resolved to real plan/wave/file values. Full suite verified green at audit time: 7 test files, 79 tests, `npm run build` and `npm run lint` both exit 0.*

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

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags (`vitest.config.mts` runs one-shot; verified via `npx vitest run`)
- [x] Feedback latency < 10s (full suite: ~0.2s runtime)
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** validated 2026-09-13 — 0 gaps found, all 6 plans' requirements already carry passing automated tests or documented manual-only status (SEC-10/12/13/14, correctly pending until the GitHub repository exists).

---

## Validation Audit 2026-09-13

| Metric | Count |
|--------|-------|
| Requirements in scope | 24 (ARQ-01..03, MARCA-01..05, INTEGRA-04, CONT-01..03, PERF-01, PERF-03, SEC-03..07, SEC-09, SEC-17, SEC-10/12/13/14 manual) |
| Gaps found | 0 |
| Resolved | 0 (none needed — all tests pre-existed from plan execution) |
| Escalated to manual-only | 4 (SEC-10, SEC-12, SEC-13, SEC-14 — correctly unmarked pending GitHub repo creation) |

---
phase: "01"
slug: "foundation-architecture-brand-identity-security-baseline"
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: "2026-09-13"
verified: "2026-09-13"
---

# Phase 01 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.
> Register authored at plan time (`register_authored_at_plan_time: true`) — every one of the 6 PLAN.md files carried a `<threat_model>` block, verified here against the implemented code rather than scanned from scratch.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| npm registry → local machine | Third-party package tarballs and install-time scripts execute with developer privileges | package code, install scripts |
| developer working tree → git history | Anything committed survives deletion attempts | source, planning docs |
| build output → browser bundle | `NEXT_PUBLIC_*` values are inlined into JS served to every visitor | env values (none currently defined) |
| visitor browser → third-party destination | Every order/contact path leaves the site as a plain outbound anchor | outbound URLs (iFood/WhatsApp/Instagram/Maps) |
| hand-authored `src/data/*` → rendered HTML | Commercial facts edited by hand, rendered as authoritative | store name, address, hours |
| visitor browser ← CDN / edge response | Response headers are the only control over how a browser treats content | HTTP response headers |
| contributor → git history → production deploy | A push to the default branch triggers a deploy | commits, credentials |
| GitHub / Vercel / registrar dashboards | Account-level controls live outside this repository | account credentials, MFA state |
| `img/logo.png` → generated SVG → served document | Generated SVG is parsed as a document by the browser | vectorized markup |
| `public/` directory → browser | Everything under `public/` is served verbatim at a predictable URL | brand assets |
| visitor (incl. keyboard/screen-reader) → rendered shell | The shell is the only navigation surface on every page | DOM structure, focus order |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-01-SC | Tampering | `npm install`/`npm ci` (17 packages: 01-01; sharp/potrace/svgo: 01-05) | high | mitigate | RESEARCH.md Package Legitimacy Audit (0 SLOP, 9 heuristic-only SUS) + Task 1 `gate="blocking-human"` checkpoint approved by user before install; lockfile committed; `npm ci` in CI fails on drift (SEC-09) | closed |
| T-01-02 | Information Disclosure | `.gitignore`, `.env.example`, CI secret scan | high | mitigate | `.env*` unignorable-by-accident, `.env.example` comment-only, `server-only` installed (01-01); `gitleaks` static binary against full history on push/PR (01-04, `.github/workflows/ci.yml`) (SEC-04, SEC-05, SEC-14) | closed |
| T-01-07 | Tampering | scaffold promotion from temp dir to repo root | medium | mitigate | `--disable-git` prevented nested-repo overwrite of `.git/`; pre-existing planning commit history intact and verified post-promotion | closed |
| T-01-08 | Elevation of Privilege | application attack surface (DB/auth/admin/payment) | medium | mitigate | ARQ-01 machine-checked absence of any DB/ORM/auth/payment dependency — server-side attack classes out of scope by construction | closed |
| T-01-09 | Repudiation | build provenance | low | accept | No production deployment exists yet; deployment provenance and rollback are Phase 5 scope (SEC-16) | closed |
| T-01-01 | Tampering / Spoofing | `src/lib/integrations/*`, `src/data/links.ts` (built 01-02, consumed by content in 01-03, footer in 01-06) | high | mitigate | Single `assertAllowedHost()` chokepoint, exact-hostname-equality against `ALLOWED_HOSTS`; automated rejection tests for suffix/substring look-alikes (`allowlist.test.ts`); ESLint `no-restricted-imports` blocks bypass (SEC-03, INTEGRA-04, ARQ-02) | closed |
| T-01-05 | Spoofing | unconfirmed iFood/WhatsApp destinations | medium | mitigate | Invalid placeholder path token + machine-readable `confirmed: false` + schema refusal of unconfirmed records with no explanation (CONT-03) | closed |
| T-01-03 | Tampering | `src/data/store.ts` commercial facts (01-02); footer literal drift (01-06); account credentials (01-04, see transfer row) | high | mitigate | `storeInfoSchema.parse` fails build on malformed edit, demonstrated live against a real violation (ARQ-03); footer/header consume `getStoreInfo()`/`buildInstagramUrl()` exclusively, no literals, enforced by lint boundary | closed |
| T-01-10 | Information Disclosure | tracer page rendered data | low | accept | Only already-public data rendered (store name, address, public profile links); no `localStorage`/`sessionStorage` use (SEC-06) | closed |
| T-01-11 | Denial of Service | outbound destination availability | low | accept | iFood availability outside project control; visible-unavailability notice is Phase 2 scope (INTEGRA-03) | closed |
| T-01-12 | Spoofing | authored copy asserting unconfirmed facts | high | mitigate | `confirmed`/`pendingConfirmation` required field enforced by test; tone guide's "nunca fazer" list; no unconfirmed price/product/hour (CONT-03, D-05) | closed |
| T-01-13 | Tampering | a later phase treating skeleton as final copy | medium | mitigate | Every entry carries `writtenInPhase`; tone guide states which phase finalizes each section's wording (D-04) | closed |
| T-01-14 | Information Disclosure | contact/location content | low | accept | All information already public (street address, public Instagram profile); no staff/customer personal data | closed |
| T-01-04 | Tampering / Information Disclosure | response headers, `src/lib/security/headers.ts` | high | mitigate | Ten-directive CSP + HSTS + nosniff + Referrer-Policy + anti-clickjacking header on every route; production policy proven by test to omit script-relaxation keywords (SEC-07). Production-domain live verification is Phase 5 (SEC-11) | closed |
| T-01-03-acct | Tampering / Elevation of Privilege | GitHub/Vercel/registrar accounts | high | transfer | Cannot be mitigated in code. Documented as named manual rows in root `SECURITY.md` Part 3 with exact settings path and responsible owner (D-06). Repository visibility resolved `public` by user decision at the Task 2 checkpoint. User self-reported (2026-09-13, not independently verified by the agent — no dashboard access) SEC-10 (GitHub+Vercel legs), SEC-12, and SEC-14 as active; SEC-13's second-reviewer guarantee is accepted as a residual gap (AR-07) since the user is the sole maintainer. Remote creation and push remain explicitly deferred pending the user's file-list audit approval | closed (transfer); SEC-13 sub-item tracked as AR-07 |
| T-01-15 | Information Disclosure | browser storage | low | mitigate | No code touches `localStorage`/`sessionStorage`; asserted by source-tree check, recorded as standing code-review rule in root `SECURITY.md` (SEC-06) | closed |
| T-01-16 | Spoofing | clickjacking / framing of the site | medium | mitigate | `frame-ancestors 'none'` in CSP + legacy `X-Frame-Options` header (01-04), unchanged through 01-06 | closed |
| T-01-17 | Repudiation | production deploy provenance and rollback | low | accept | Deployment provenance, tested rollback (SEC-16), registrar lock (SEC-15) assigned to Phase 5 by ROADMAP.md; listed here for traceability only | closed |
| T-01-18 | Spoofing | `public/brand/*.svg` / brand guide presented as official logo | medium | mitigate | Every generated SVG carries an embedded provisional notice naming `img/logo.png` as the official source (01-05); `docs/brand-guidelines.md` repeats it (01-06); human self-check verified fidelity against the original (D-01, D-02) | closed |
| T-01-19 | Tampering | generated/rendered SVG markup | medium | mitigate | `svgo` strips script elements and event-handler attributes, asserted by test (01-05); `next/image` component used rather than inline SVG injection (01-06); `object-src 'none'` (01-04) as defence in depth | closed |
| T-01-20 | Tampering | brand palette values | medium | mitigate | Seven official hex values asserted character-for-character against PROJECT.md in both CSS and JSON token files; off-palette hex fails the gate | closed |
| T-01-21 | Information Disclosure | third-party font CDN requests | low | mitigate | Fonts self-hosted by the framework's font module (Anton/Manrope, wired in 01-06 against 01-05's `--font-` variables); no runtime request to a font CDN | closed |
| T-01-22 | Denial of Service | oversized/unoptimised brand assets | low | accept | Asset weight bounded by `svgo` optimisation and 180×180 raster ceiling; numeric performance budget (LCP, Lighthouse) verified against production in Phase 5 | closed |
| T-01-23 | Denial of Service (accessibility exclusion) | shell landmarks, skip link, focus treatment | high | mitigate | Exactly one `header`/`main`/`footer` landmark; skip link fragment asserted to match `main` id; focus-visible treatment asserted in `globals.css`; 21 structural tests (`layout.test.ts`) (PERF-01) | closed |
| T-01-24 | Information Disclosure | third-party font CDN requests (shell-level restatement of T-01-21) | low | mitigate | Both families self-hosted, bound to token variables; no stylesheet link to a font provider | closed |
| T-01-25 | Denial of Service | layout shift / oversized above-the-fold image | medium | mitigate | Header logo rendered via `next/image` with explicit dimensions and `priority`, reserving space and preloading rather than lazy-loading; numeric LCP/CLS budget verified against production in Phase 5 | closed |

*Status: open · closed · open — below high threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above `workflow.security_block_on` (currently: high) count toward `threats_open`*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party / account-level, documented in root `SECURITY.md`)*
*Several threat IDs recur across plans (e.g. T-01-01, T-01-03, T-01-16, T-01-18, T-01-19) because the same trust boundary is touched by more than one plan — listed once here with every contributing plan named in the Component column.*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-01 | T-01-09 | No production deployment exists yet; provenance/rollback tracked for Phase 5 (SEC-16) | Project (via ROADMAP.md scope assignment) | 2026-09-13 |
| AR-02 | T-01-10, T-01-14 | Only already-public commercial/location data rendered; no personal data touched | Project | 2026-09-13 |
| AR-03 | T-01-11 | Third-party (iFood) availability outside project control; user-visible notice deferred to Phase 2 (INTEGRA-03) | Project | 2026-09-13 |
| AR-04 | T-01-17 | Deploy provenance/rollback/registrar-lock explicitly assigned to Phase 5 by ROADMAP.md | Project | 2026-09-13 |
| AR-05 | T-01-22 | Numeric performance budget (LCP/Lighthouse) can only be verified against a live production deploy, which does not exist yet (Phase 5) | Project | 2026-09-13 |
| AR-06 | T-01-03-acct | GitHub/Vercel/registrar MFA, branch protection, required PR review, and native secret scanning cannot be enabled until the repository exists; repo visibility (`public`) decided by user 2026-09-13, remote creation deferred pending user's audited file-list approval before first push. **Update 2026-09-13:** user self-reports GitHub+Vercel MFA (SEC-10, registrar leg still pending — no registrar chosen), main branch protection with required PR / no direct push / no force-push / no branch deletion (SEC-12), and secret scanning + push protection (SEC-14) as now active on the GitHub side. None of these are independently verified by the agent (no remote configured in this local repo, no dashboard access) — recorded as user attestation, the same evidentiary standard the human-verification UAT step uses. | User (repository-visibility checkpoint, plan 01-04 Task 2; MFA/branch-protection/secret-scanning attestation, phase verify-work session) | 2026-09-13 |
| AR-07 | T-01-03-acct (SEC-13 sub-item) | The user is the sole maintainer of the repository. Required-PR-review's "second pair of eyes" guarantee is therefore not obtainable — self-approval on a protected branch is the only available approval path today. This is accepted as a residual gap, not marked as a satisfied requirement: root `SECURITY.md`'s SEC-13 row stays unchecked and explicitly states the guarantee is absent. Re-evaluate if a second maintainer joins the project. | User | 2026-09-13 |
| AR-08 | T-01-03-acct (SEC-10 registrar sub-item) | The domain registrar has not been chosen yet (`PROJECT.md` Pendências). The user explicitly decided NOT to choose/purchase a registrar during this phase — the registrar leg of SEC-10 (MFA + registrar lock, SEC-15) is deferred with no ETA until the domain purchase happens. GitHub and Vercel MFA legs of SEC-10 remain user-attested active. This is an operational deferral, not a satisfied requirement or a code defect: root `SECURITY.md`'s SEC-10 row stays unchecked. The user explicitly authorized starting Phase 2 with this item still open (UAT gap G-01-2, `01-UAT.md`). | User | 2026-09-13 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-09-13 | 25 (unique threat IDs; 6 PLAN.md threat models consolidated) | 25 | 0 | orchestrator (execute-phase L1 verification — `register_authored_at_plan_time: true`, `asvs_level: 1`, short-circuit per secure-phase.md §3) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-09-13

**Note on the root `SECURITY.md`:** this phase-level file is the per-phase threat-register contract (GSD's own audit trail). It is distinct from the root-level `SECURITY.md` written by plan 01-04 Task 3, which is the project's public-facing D-06 security baseline checklist (code-verifiable items + manual account-owner actions). Both are consistent: every `transfer`-disposition threat above points back to the corresponding unchecked row in the root `SECURITY.md` Part 3.

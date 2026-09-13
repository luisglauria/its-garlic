---
phase: 01-foundation-architecture-brand-identity-security-baseline
reviewed: 2026-09-13T00:00:00Z
depth: standard
files_reviewed: 47
files_reviewed_list:
  - .env.example
  - .github/workflows/ci.yml
  - .gitignore
  - docs/brand-guidelines.md
  - eslint.config.mjs
  - next.config.ts
  - package.json
  - postcss.config.mjs
  - public/brand/favicon-source.svg
  - public/brand/logo-icone.svg
  - public/brand/logo-invertido.svg
  - public/brand/logo-mono-branco.svg
  - public/brand/logo-mono-preto.svg
  - public/brand/logo-principal.svg
  - scripts/vectorize-logo.mjs
  - src/app/globals.css
  - src/app/icon.svg
  - src/app/layout.tsx
  - src/app/page.tsx
  - src/components/layout/Footer.tsx
  - src/components/layout/Header.tsx
  - src/components/layout/SkipLink.tsx
  - src/components/layout/layout.test.ts
  - src/content/skeleton.test.ts
  - src/content/skeleton.ts
  - src/content/tone-of-voice.md
  - src/data/links.ts
  - src/data/store.ts
  - src/lib/brand/brand-assets.test.ts
  - src/lib/integrations/allowlist.test.ts
  - src/lib/integrations/allowlist.ts
  - src/lib/integrations/ifood.ts
  - src/lib/integrations/instagram.ts
  - src/lib/integrations/integrations.test.ts
  - src/lib/integrations/maps.ts
  - src/lib/integrations/whatsapp.ts
  - src/lib/repositories/store-repository.ts
  - src/lib/schemas/link.schema.ts
  - src/lib/schemas/store.schema.test.ts
  - src/lib/schemas/store.schema.ts
  - src/lib/security/headers.test.ts
  - src/lib/security/headers.ts
  - src/styles/design-tokens.css
  - src/styles/design-tokens.json
  - tsconfig.json
  - vitest.config.mts
  - SECURITY.md
findings:
  critical: 1
  warning: 3
  info: 3
  total: 7
status: issues_found
---

# Phase 01: Code Review Report

**Reviewed:** 2026-09-13T00:00:00Z
**Depth:** standard
**Files Reviewed:** 47
**Status:** issues_found

## Summary

The foundation phase is solid overall: the data-boundary architecture (schemas → repository/integration seams → components) is consistently applied, the allowlist/CSP/header machinery is unit-tested and matches the documented threat model, and the brand-asset generation pipeline fails loudly on incomplete output. No hardcoded secrets, no `eval`/`innerHTML`, no empty catch blocks, no `localStorage`/`sessionStorage` usage were found.

The most significant defect is a gap between what the `link.schema.ts` data model *models* (a `confirmed`/`pendingConfirmation` distinction for external links) and what the integration builders *enforce*: none of `ifood.ts`, `whatsapp.ts`, `instagram.ts`, or `maps.ts` ever read the `confirmed` field before returning a URL, so `src/app/page.tsx`'s live "Pedir no iFood" button currently points at a real `ifood.com.br` URL with a placeholder path — a functioning-looking CTA that 404s for any real visitor, silently undermining the project's stated core value ("sair do site com um pedido feito no iFood ... sem fricção"). A second, lower-likelihood finding is that the central SEC-03 allowlist (`assertAllowedHost`) validates hostname only, never URL scheme, so a non-`https:` or scheme-smuggled URL with a matching hostname would pass the one guard the project's own `SECURITY.md` names as its primary content-integrity control. Remaining findings are minor hardening/quality items (unverified CI binary download, missing `Permissions-Policy`, dead dependency, docs mislabeling, small duplication).

## Critical Issues

### CR-01: Unconfirmed external links render as live, unlabeled CTAs — no code path checks `ExternalLink.confirmed`

**File:** `src/lib/integrations/ifood.ts:6-12`, also `src/lib/integrations/whatsapp.ts:5-15`, `src/lib/integrations/instagram.ts:5-11`, `src/lib/integrations/maps.ts:5-11`, consumed by `src/app/page.tsx:6,18-25`

**Issue:** `src/lib/schemas/link.schema.ts` deliberately models a `confirmed: boolean` + `pendingConfirmation` pair so that a not-yet-confirmed destination can be tracked and (per the schema's own `.refine` comment) never "silently ship a guessed link." `src/data/links.ts` currently has `ifood` and `whatsapp` marked `confirmed: false` with a literal placeholder path (`https://www.ifood.com.br/PLACEHOLDER_PENDING_CLIENT_CONFIRMATION`). However, `buildIFoodUrl()` / `buildWhatsAppUrl()` (and the other two builders) only look up the record and run it through `assertAllowedHost` — they never inspect `record.confirmed`. Because `www.ifood.com.br` is itself an allowlisted host, `assertAllowedHost` happily returns the broken placeholder URL with no error and no signal to the caller that the link is unconfirmed.

`src/app/page.tsx` calls `buildIFoodUrl()` unconditionally and renders the result as a normal, fully-interactive `<a target="_blank">` labeled "Pedir no iFood" — the site's primary conversion action. As currently committed, any real visitor who clicks this button today is sent to a 404 on ifood.com.br with zero indication anything is wrong. This is exactly the class of silent-placeholder-shipping the schema's `.refine` validator was written to prevent, but the prevention stops at the data layer and never reaches the render path — the one place it actually matters for a live site. `CLAUDE.md`'s content constraint ("todo dado não confirmado deve ser marcado como provisório/pendente de confirmação") is violated in the rendered output, even though the underlying data file is correctly annotated.

**Fix:** Enforce (or expose) the `confirmed` flag at the integration boundary — either throw from the builder when `confirmed` is `false` (mirroring the "fail loudly" pattern already used for missing records), or have the builder return `{ url, confirmed }` so the calling component can render a visibly "pendente" state instead of a normal CTA:

```ts
// src/lib/integrations/ifood.ts
export function buildIFoodUrl(): string {
  const record = externalLinks.find((link) => link.id === "ifood");
  if (!record) {
    throw new Error("Missing 'ifood' record in external links data");
  }
  if (!record.confirmed) {
    throw new Error(
      `'ifood' link is not confirmed: ${record.pendingConfirmation ?? "no explanation provided"}`,
    );
  }
  return assertAllowedHost(record.url);
}
```
or, to keep the page renderable pre-confirmation while still being honest with the visitor, return the confirmation state and have `page.tsx` swap in a disabled/"em breve" affordance instead of a working link.

## Warnings

### WR-01: `assertAllowedHost` validates hostname only, never URL scheme

**File:** `src/lib/integrations/allowlist.ts:17-25`

**Issue:** `SECURITY.md` names this function as *the* SEC-03 control: "todo link de pedido/contato ... passa por essa lista central." The implementation only checks `new URL(url).hostname` against `ALLOWED_HOSTS`; it never asserts `protocol === "https:"`. A URL such as `http://www.ifood.com.br/x` (downgraded to plaintext) or a non-special-scheme URL crafted so the WHATWG URL parser resolves an authority component matching an allowed hostname (e.g. `javascript://wa.me/%0a...`) would pass this check purely on hostname equality — the function's only defense. This is currently low-risk because the only caller today is the developer-controlled `src/data/links.ts`, but the module is documented and tested as the project's single hardened boundary against destination-swap attacks, and its own test suite (`allowlist.test.ts`) never exercises scheme validation, so a regression here would ship silently.

**Fix:**
```ts
export function assertAllowedHost(url: string): string {
  const parsed = new URL(url);
  if (parsed.protocol !== "https:") {
    throw new Error(`Blocked non-HTTPS outbound URL: ${url}`);
  }
  if (!ALLOWED_HOSTS.includes(parsed.hostname as (typeof ALLOWED_HOSTS)[number])) {
    throw new Error(`Blocked outbound host not on allowlist: ${parsed.hostname}`);
  }
  return url;
}
```

### WR-02: CI downloads and executes the gitleaks binary with no integrity verification

**File:** `.github/workflows/ci.yml:46-56`

**Issue:** The "Download gitleaks" step `curl`s a release tarball straight from `github.com/gitleaks/gitleaks/releases/...`, extracts it, `chmod +x`s it, and runs it — with no checksum or signature check against the download. HTTPS protects transport integrity but not supply-chain integrity: if that specific release asset were ever compromised (compromised maintainer account, GitHub Releases asset tampering, or a redirect through a compromised mirror), CI would `chmod +x` and execute arbitrary code with the workflow's permissions (repo checkout, `GITHUB_TOKEN` scope). This directly undercuts SEC-14's stated goal (secret-scanning gate) by trusting an unverified binary to provide it.

**Fix:** Pin and verify a published SHA256 checksum for the exact `gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz` asset before extracting:
```yaml
- name: Download gitleaks
  run: |
    set -euo pipefail
    GITLEAKS_VERSION="8.21.2"
    EXPECTED_SHA256="<pin the published checksum for this asset/version>"
    curl -sSL -o gitleaks.tar.gz \
      "https://github.com/gitleaks/gitleaks/releases/download/v${GITLEAKS_VERSION}/gitleaks_${GITLEAKS_VERSION}_linux_x64.tar.gz"
    echo "${EXPECTED_SHA256}  gitleaks.tar.gz" | sha256sum -c -
    tar -xzf gitleaks.tar.gz gitleaks
    chmod +x gitleaks
```

### WR-03: No `Permissions-Policy` header, despite production being verified against securityheaders.com

**File:** `src/lib/security/headers.ts:39-47`

**Issue:** `CLAUDE.md`'s stack notes explicitly call for verifying header posture with securityheaders.com post-deploy. `securityHeaders()` sets CSP, HSTS, `X-Content-Type-Options`, `Referrer-Policy`, and `X-Frame-Options`, but never sets `Permissions-Policy`. For a static marketing site with no legitimate use of camera/microphone/geolocation/USB/etc., omitting this header is a straightforward, low-cost hardening gap that securityheaders.com/Mozilla Observatory-style scans typically flag, and it's inconsistent with the project's otherwise thorough header set.

**Fix:**
```ts
{
  key: "Permissions-Policy",
  value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
},
```
Add to the array returned by `securityHeaders()`, and extend `headers.test.ts` to assert its presence/value the same way the other four headers are asserted.

## Info

### IN-01: `server-only` is a declared dependency but never imported anywhere in `src/`

**File:** `package.json:19`

**Issue:** `server-only` is listed as a runtime dependency, and `.env.example`'s own commentary describes it as "installed and ready to mark any future module." A repo-wide search (`grep -rl server-only src`) returns no matches — it is not wired into any current module. This is intentional per the comment (pre-provisioned for a future secret-holding module) but is worth flagging as dead weight today; if it lingers unused for multiple phases it's easy to forget the convention it exists to enforce.

**Fix:** No action required now if intentionally pre-provisioned; consider adding a short tracking note (e.g. a TODO tied to the phase that introduces the first server-only module) so the dependency's purpose stays discoverable, or defer adding it to `package.json` until the first module that needs it lands.

### IN-02: `design-tokens.json`'s `"$schema"` key is repurposed as free-text documentation

**File:** `src/styles/design-tokens.json:2`

**Issue:** `$schema` is a JSON Schema convention meaning "URI of the schema this document validates against." Here it holds a prose description string ("It's Garlic — design tokens (MARCA-02, MARCA-03)..."). Any tool that treats `$schema` per convention (IDE JSON validation, schema-aware linters) will either ignore it silently or attempt to dereference the string as a URI and fail. It's harmless today but is a footgun for anyone who later wires up real JSON Schema validation for this file.

**Fix:** Rename the key to something non-conventional, e.g. `"_description"` or `"$comment"` (the latter is itself a real, tool-recognized JSON Schema keyword for free-text notes and would be the more correct choice here).

### IN-03: Header/Footer duplicate the same container/spacing pattern

**File:** `src/components/layout/Header.tsx:10-11`, `src/components/layout/Footer.tsx:15-16`

**Issue:** Both components independently repeat `mx-auto flex max-w-5xl ... px-4 ... sm:px-6` for their outer container. With only two consumers this is minor, but as more sections adopt the same page-width container in later phases, this pattern is likely to be copy-pasted further rather than centralized, making a future width/gutter change (e.g. adjusting `max-w-5xl`) an N-file edit instead of a one-file edit.

**Fix:** Extract a small shared `Container` (or `PageWidth`) component once a third consumer appears — not urgent enough to justify introducing an abstraction for two call sites today, but worth watching.

---

_Reviewed: 2026-09-13T00:00:00Z_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

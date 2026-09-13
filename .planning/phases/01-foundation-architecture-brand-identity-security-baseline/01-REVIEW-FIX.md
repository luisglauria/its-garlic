---
phase: 01-foundation-architecture-brand-identity-security-baseline
fixed_at: 2026-09-13T14:50:00Z
review_path: .planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-REVIEW.md
iteration: 1
findings_in_scope: 1
fixed: 1
skipped: 0
status: all_fixed
---

# Phase 01: Code Review Fix Report

**Fixed at:** 2026-09-13T14:50:00Z
**Source review:** .planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-REVIEW.md
**Iteration:** 1

**Summary:**
- Findings in scope for this pass: 1 (CR-01 only — explicitly scoped by the requester, not the
  full REVIEW.md finding set)
- Fixed: 1
- Skipped: 0

This fix pass targeted **CR-01 only**, per explicit instruction. WR-01, WR-02, WR-03, IN-01,
IN-02, and IN-03 were deliberately left untouched — see "Findings left open" below. They are
**not** fixed and **not** skipped-due-to-failure; they were simply out of scope for this run and
remain open in `01-REVIEW.md` pending a separate decision.

## Fixed Issues

### CR-01: Unconfirmed external links render as live, unlabeled CTAs — no code path checks `ExternalLink.confirmed`

**Files modified:**
- `src/lib/integrations/types.ts` (new — shared `IntegrationLink` return type)
- `src/lib/integrations/ifood.ts`
- `src/lib/integrations/whatsapp.ts`
- `src/lib/integrations/instagram.ts`
- `src/lib/integrations/maps.ts`
- `src/app/page.tsx`
- `src/components/layout/Footer.tsx`
- `src/lib/integrations/integrations.test.ts`

**Commit:** `fbbf14e`

**Approach chosen:** the "coming soon" / disabled-state option (the second option offered in the
REVIEW.md fix suggestion), per explicit user choice — not the build-time-throw option.

**Applied fix:**

- Each integration builder (`buildIFoodUrl`, `buildWhatsAppUrl`, `buildInstagramUrl`,
  `buildMapsUrl`) previously returned a bare `string` URL and never inspected
  `ExternalLink.confirmed`. All four now return a shared `IntegrationLink` shape:
  `{ url: string, confirmed: boolean, pendingConfirmation?: string }`, still passing the URL
  through `assertAllowedHost` exactly as before (the SEC-03 allowlist guard is unchanged).
- `src/app/page.tsx` now branches on `ifood.confirmed`: when `true` it renders the original live
  `<a target="_blank">` "Pedir no iFood" CTA unchanged; when `false` (the current state — see
  `src/data/links.ts`, `ifood.confirmed: false`) it renders a native `<button type="button"
  disabled>` labeled "Pedido pelo iFood em breve" instead. A disabled `<button>` is inert and
  announced correctly by assistive tech with no client-side JavaScript required, keeping the page
  a pure Server Component.
- `src/data/links.ts` shows `whatsapp` is also `confirmed: false`, but `buildWhatsAppUrl()` is not
  currently consumed by any component (`page.tsx` only calls `buildIFoodUrl()`; no WhatsApp CTA
  exists yet in the rendered UI). The builder itself now correctly signals `confirmed: false` /
  carries `pendingConfirmation`, so whichever future phase adds a WhatsApp CTA to the page will
  have the gate already available at the integration boundary — no live/dead link risk was
  introduced or left unaddressed in the *current* rendered output, since there is no WhatsApp CTA
  to render yet.
- `src/components/layout/Footer.tsx`'s Instagram CTA (`confirmed: true`) was updated only to read
  `.url` off the new return shape — no rendering/behavior change, since Instagram is already a
  confirmed destination.
- `src/lib/integrations/integrations.test.ts` updated all four builders' existing assertions to
  read `.url`, and added two new tests: one confirming a confirmed record's builder still returns
  a usable URL with no `pendingConfirmation`, and one confirming an unconfirmed record's builder
  reports `confirmed: false` with a non-empty `pendingConfirmation` rather than silently returning
  the placeholder as if it were valid.

**Verification performed:**
- `npm run build` — exit 0, static page generation succeeded, no TypeScript errors.
- `npm test` (vitest) — exit 0, 81/81 tests passed (7 test files), including the two new
  confirmed/unconfirmed assertions.
- `npm run lint` — exit 0 (one pre-existing, unrelated warning in
  `scripts/vectorize-logo.mjs:28` — not touched by this fix, not introduced by it).
- Manually confirmed in `src/app/page.tsx` that the unconfirmed iFood path no longer produces a
  working `<a href="...PLACEHOLDER...">` styled as a normal live CTA — it renders a disabled
  `<button>` with no `href` at all.

## Findings left open (out of scope for this pass)

The following findings from `01-REVIEW.md` were **not** touched in this run. They are not marked
fixed and not marked skipped-due-to-error — they were excluded from scope by explicit
instruction and remain open for a separate decision:

- **WR-01** — `assertAllowedHost` validates hostname only, never URL scheme
  (`src/lib/integrations/allowlist.ts:17-25`)
- **WR-02** — CI downloads and executes the gitleaks binary with no integrity verification
  (`.github/workflows/ci.yml:46-56`)
- **WR-03** — No `Permissions-Policy` header (`src/lib/security/headers.ts:39-47`)
- **IN-01** — `server-only` is a declared dependency but never imported (`package.json:19`)
- **IN-02** — `design-tokens.json`'s `"$schema"` key repurposed as free-text documentation
  (`src/styles/design-tokens.json:2`)
- **IN-03** — Header/Footer duplicate the same container/spacing pattern
  (`src/components/layout/Header.tsx:10-11`, `src/components/layout/Footer.tsx:15-16`)

---

_Fixed: 2026-09-13T14:50:00Z_
_Fixer: Claude (gsd-code-fixer)_
_Iteration: 1_

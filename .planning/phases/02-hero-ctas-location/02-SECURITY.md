---
phase: "02"
slug: "hero-ctas-location"
status: verified
# threats_open = count of OPEN threats at or above workflow.security_block_on severity (the blocking gate)
threats_open: 0
asvs_level: 1
created: "2026-09-14"
---

# Phase 02 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| visitor → outbound destination | Every CTA in this phase is a handoff point from the site to a third party (iFood, WhatsApp, Google Maps). PROJECT.md records link substitution to a fraudulent destination as this project's largest real risk. | outbound URL |
| unconfirmed data → rendered control | `src/data/links.ts` / store hours carry records the client has not confirmed. The render layer decides whether that becomes an inert affordance or a live click/claim. | confirmed-flag-gated content |
| hand-authored SVG → rendered document | `public/brand/hero-illustration.svg` is authored by hand and served on every page load. | static asset markup |
| copy module → visitor's commercial expectations | `src/content/home-copy.ts` is the only place this phase states anything about the business (hero, CTAs, brand story, FAQ). A claim written here is read as fact. | prose content |
| validated store record → rendered address/hours/modalities | `getStoreInfo()` parses the record against the schema; a hardcoded copy in a component bypasses that validation and can drift from it silently. | store record fields |
| FAQ facts → validated store record | Two FAQ answers restate the address and modalities, creating a second place those facts live. | duplicated record fields |
| FAQ disclosure → assistive technology | The FAQ is the only interactive surface on the page, and the element a keyboard user lands on first. | keyboard/AT interaction |
| build → browser (compiled stylesheet) | The compiled stylesheet (design tokens, focus rule) is the only artifact plan 02-04 changes that reaches a visitor. Carries no user input, no secret. | compiled CSS |
| component → browser (decorative/CTA markup) | Rendered CTA and separator markup. The only untrusted-adjacent value in it is an outbound destination URL (CTAs) or nothing at all (separator). | rendered markup |
| integrations module → component | `IntegrationLink` values cross here; the `confirmed` flag gates whether a destination may become an href. | IntegrationLink |

---

## Threat Register

| Threat ID | Category | Component | Severity | Disposition | Mitigation | Status |
|-----------|----------|-----------|----------|-------------|------------|--------|
| T-02-01 | Tampering | `home/` components constructing an outbound URL themselves | high | mitigate | Every destination arrives as an `IntegrationLink` from `buildIFoodUrl`/`buildWhatsAppUrl`/`buildMapsUrl`, each calling `assertAllowedHost()` (Phase 1, SEC-03); guard suite asserts no URL literal / no direct `@/data/*` import in any `home/` component. | closed |
| T-02-02 | Spoofing | unconfirmed order destination rendered as a live control | high | mitigate | `OrderCta` branches on typed `confirmed`; unconfirmed branch renders a native `disabled` button with no href. Fixtures assert no iFood/WhatsApp host, no sentinel, in rendered output. | closed |
| T-02-03 | Spoofing | provisional illustration read as real photography | medium | mitigate | `ProvisionalBadge` disclosure asserted present in prerendered HTML; asset carries a provisional header comment. | closed |
| T-02-04 | Tampering | script/event-handler markup inside hand-authored hero SVG | medium | mitigate | Hand-authored (never traced) so such markup never appears; absence asserted automatically; CSP `object-src 'none'` is the backstop. | closed |
| T-02-05 | Spoofing | invented commercial claim in new copy | medium | mitigate | All copy in one reviewable file against `tone-of-voice.md` §5; acceptance criteria forbid price/hour/award/rating/superlative. | closed |
| T-02-06 | Repudiation / product-intent violation | on-site ordering affordance under `home/` | medium | mitigate | Directory-sweeping guard asserts no form/cart/checkout affordance in every `home/` component and the page, covering later-added files too. | closed |
| T-02-07 | Denial of Service (accessibility exclusion) | pending CTA state | high | mitigate | Native `disabled` button (not an ARIA hint on a navigable anchor); notice associated via `aria-describedby`; 44px touch floor; human-check walked the keyboard path. | closed |
| T-02-08 | Denial of Service | layout shift from hero image | medium | mitigate | Fixed 1:1 aspect-ratio container, `fill`, explicit `sizes`, `preload`; square-viewBox asserted. Numeric LCP/CLS budget verified against production in Phase 5. | closed |
| T-02-09 | Information Disclosure | third-party click tracking on CTAs | low | mitigate | No analytics/beacon added (explicit out-of-scope decision); a later silent addition would be a reviewable violation. | closed |
| T-02-SC (02-01) | Tampering | package-manager installs | n/a | accept | No install task in plan 02-01 — phase adds no dependency this plan. | closed |
| T-02-10 | Spoofing (of commercial fact) | hours block | high | mitigate | Provisional marker bound to the record's own flag (not schedule emptiness); clock-time guard over comment-stripped source of every `home/` component and the copy module. | closed |
| T-02-11 | Tampering | address rendered from a component literal | medium | mitigate | Address arrives as a prop from `getStoreInfo()`; absence of a street/number literal asserted automatically; ARQ-02 lint boundary blocks direct data import. | closed |
| T-02-12 | Spoofing | directions destination | high | mitigate | Href from `buildMapsUrl()` (single allow-listed chokepoint, SEC-03); no URL literal permitted; href-equals-builder-url fidelity asserted. | closed |
| T-02-13 | Spoofing (of commercial fact) | modality chips | medium | mitigate | Chips mapped from the validated record via a label map typed against the schema's own enum — an unadvertisable modality is a compile error. | closed |
| T-02-14 | Denial of Service / Information Disclosure | embedded third-party map | medium | mitigate | LOCAL-01 rules out an embedded frame in the MVP; absence asserted repository-wide across `src/`. | closed |
| T-02-15 | Denial of Service (accessibility exclusion) | provisional marker's contrast | medium | mitigate | Shared badge carries its own deep-surface background so olive text keeps the compliant pairing even on charcoal; human-check + global focus-visible + 44px touch floor. | closed |
| T-02-SC (02-02) | Tampering | package-manager installs | n/a | accept | No install task in plan 02-02 — phase adds no dependency this plan. | closed |
| T-02-16 | Spoofing (of commercial fact) | brand story and FAQ copy | high | mitigate | One reviewable module; named-test content-integrity gate asserts absence of currency/award/rating/star/superlative/guilt/clock-time; defensibility from PROJECT.md is a recorded human read. | closed |
| T-02-17 | Tampering | FAQ facts drifting from validated record | medium | mitigate | Rendered-output test reads the real record through `getStoreInfo()` and asserts the FAQ's address/modality answers match. | closed |
| T-02-18 | Repudiation / product-intent violation | on-site ordering expectation introduced by copy | medium | mitigate | Cart/checkout sweep extended to the copy module; ordering answer asserted to route to iFood/WhatsApp only; site collects nothing. | closed |
| T-02-19 | Denial of Service (accessibility exclusion) | FAQ disclosure | high | mitigate | Native `<details>`/`<summary>`; hand-wired expanded/controls attributes and click handlers asserted absent in source and rendered output; keyboard-only human-check. | closed |
| T-02-20 | Denial of Service | client bundle growth from a hand-rolled accordion | low | mitigate | Zero-JavaScript requirement asserted structurally (no client directive/hook/handler); confirmed by network-panel check. | closed |
| T-02-SC (02-03) | Tampering | package-manager installs | n/a | accept | No install task in plan 02-03 — accordion built on a platform element, not a library. | closed |
| T-02-04-01 | Tampering | `src/styles/design-tokens.css` | low | mitigate | Off-palette/drifted value rejected by `brand-assets.test.ts` mirror guard + new compiled-artifact checker (`verify:css`), which reads official values from the JSON mirror, never a literal typed into the checker. | closed |
| T-02-04-02 | Information Disclosure | compiled CSS in `.next` | low | accept | Stylesheet contains only brand colours, font stacks, type scale — no env var, no `NEXT_PUBLIC_*`, no secret. | closed |
| T-02-04-03 | Denial of Service | `scripts/check-brand-css.mjs` | low | accept | Build-time-only script, node builtins only, bounded directory read; never executed in a request path. | closed |
| T-02-04-04 | Elevation of Privilege | `src/app/layout.tsx` | low | accept | Change limited to two next/font variable name strings; no directive, runtime, header or route behaviour change. | closed |
| T-02-04-SC | Tampering | package-manager installs | n/a | accept | No install task in plan 02-04 — both new files use only already-declared dependencies and node builtins. | closed |
| T-02-05-01 | Tampering | `src/components/home/OrderCtaRow.tsx` | high | mitigate | New file is exactly where a URL literal could bypass the allowlist chokepoint (SEC-03); covered by the existing directory sweep in `home.test.ts` (fails on any `https://` literal or direct data import). | closed |
| T-02-05-02 | Spoofing | `src/components/home/OrderCta.tsx` | high | mitigate | `confirmed` branch and native disabled control carried over unchanged; rendered-output tests assert no href/fixture-url/unconfirmed host, moved into the new row's describe block. | closed |
| T-02-05-03 | Elevation of Privilege | `src/components/home/Hero.tsx` | low | accept | Hero gains two typed props and one child element; stays a Server Component, no directive/hook/clock read. | closed |
| T-02-05-04 | Repudiation | `.planning/.../02-CONTEXT.md` | low | mitigate | D-01's text preserved; D-01a amendment added beneath it with date and gap id — decision history stays auditable. | closed |
| T-02-05-SC | Tampering | package-manager installs | n/a | accept | No install task in plan 02-05 — fold guard uses the already-installed test runner/renderer. | closed |
| T-02-06-01 | Information Disclosure | `src/components/layout/SectionSeparator.tsx` | low | accept | Background-and-shape band, no text, no children, no data binding — nothing can leak through it. | closed |
| T-02-06-02 | Tampering | `src/app/page.tsx`, `src/components/layout/Footer.tsx` | medium | mitigate | Editing page composition/footer risks disturbing SEC-03 seams (footer's allowlisted Instagram anchor, page's integration builder calls); existing `home.test.ts`/`layout.test.ts` sweeps run in Task 2 verify; separator adds no anchor. | closed |
| T-02-06-03 | Denial of Service | rendered page | low | accept | Static markup with a clipping shape; no request, no script, no layout thrash; below the fold at both target viewports. | closed |
| T-02-06-04 | Elevation of Privilege | `src/components/layout/SectionSeparator.tsx` | low | accept | Presentational Server Component, no directive/hook/clock-read/event-handler, not focusable. | closed |
| T-02-06-SC | Tampering | package-manager installs | n/a | accept | No install task in plan 02-06 — separator hand-rolled from token utilities. | closed |

*Status: open · closed · open — below {block_on} threshold (non-blocking)*
*Severity: critical > high > medium > low — only open threats at or above `workflow.security_block_on` (high) count toward `threats_open`*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

| Risk ID | Threat Ref | Rationale | Accepted By | Date |
|---------|------------|-----------|-------------|------|
| AR-02-01 | T-02-04-02, T-02-04-03, T-02-04-04, T-02-05-03, T-02-06-01, T-02-06-03, T-02-06-04 | Low-severity, no-user-input, no-secret, build-time-only or presentational-only components with no client execution surface — accepted as standard for a static marketing site with no auth/data layer. | Claude (secure-phase audit) | 2026-09-14 |
| AR-02-02 (carried, see AR-08 in 01-SECURITY.md) | SEC-10, SEC-15 | Domain registrar not yet chosen; registrar-lock/MFA legs deferred with no ETA by explicit user decision in Phase 1. Does not block Phase 2 (no code dependency). | User | 2026-09-13 |

*Accepted risks do not resurface in future audit runs.*

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-09-14 | 35 | 35 | 0 | Claude (secure-phase, short-circuit — `register_authored_at_plan_time: true`, `asvs_level: 1`, all 6 plans' `<threat_model>` blocks read directly; auditor subagent not spawned per L1 short-circuit rule) |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-09-14

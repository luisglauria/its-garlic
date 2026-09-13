# Phase 2: Hero, CTAs & Location - Research

**Researched:** 2026-09-13
**Domain:** Next.js 16 App Router marketing homepage (Server Components), accessible disabled-CTA
patterns, CLS-safe image containers, native accordions — no new libraries, all work happens on
top of the seams Phase 1 already built.
**Confidence:** MEDIUM — the architecture, data seams, and copy facts are HIGH (read directly from
the repo this session); a few Next.js 16-specific API details came from a `WebFetch` of official
docs, which this project's own tooling scores as LOW-confidence-by-provider regardless of source
authority — flagged explicitly below, not smoothed over.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

- **D-01:** The home ships **five** sections, not just Hero + Localização: **Hero → CTAs → Marca
  → Localização → FAQ**, in that order. Action (pedir/ver cardápio) comes immediately after the
  hero, before institutional text.
- **D-02:** Brand-story and FAQ use final copy this phase (not skeleton tone), grounded in
  `src/content/tone-of-voice.md` and the `brand-story`/`faqs` entries of `src/content/skeleton.ts`
  — never inventing facts beyond what `PROJECT.md` already confirms.
- **D-03:** The hero uses an **illustrated composition** (dark `#202526`/`#000000` background,
  lime `#B8FF00` blocks, line-art garlic illustration per `docs/brand-guidelines.md`), clearly
  labeled provisional — not the real product photography HERO-03 literally asks for, because the
  client hasn't sent photos yet. Reversible: it's a swappable asset, not a structural decision.
- **D-04:** The hero component ships with a **fixed image slot** (`next/image`, explicit
  dimensions/`sizes`) pointing at the provisional illustrated asset. Swapping in the real photo
  later must be a file replacement only — no layout/CLS risk.
- **D-05:** While `buildIFoodUrl()`/`buildWhatsAppUrl()` return `confirmed: false`, the "Pedir no
  iFood" and WhatsApp CTAs render **visually in place but disabled**, labeled "{Ação} (em breve)"
  — never a live-looking link to the placeholder URL. Satisfies INTEGRA-03 without shipping a
  broken link.
- **D-06:** Both order CTAs (iFood, WhatsApp) get the **identical** visual "em breve" treatment —
  no special-casing WhatsApp even though it's also a human support channel.
- **D-07:** The Localização section shows "Horário de funcionamento: em atualização — confirme no
  iFood ou WhatsApp antes de vir" (exact wording is Claude's discretion within this shape) with a
  "provisório" badge — never either of the two divergent Instagram-story hours as if current.

### Claude's Discretion

- Exact markup/CSS of the illustrated hero composition (diagonal shapes, garlic illustration
  layout) — must use `src/styles/design-tokens.css` tokens and follow `docs/brand-guidelines.md`.
- Exact wording of the "em breve" CTA labels and the hours notice — must keep the
  problem+next-step shape and respect `tone-of-voice.md` §5's hard rules (no invented hours/urgency).
- Whether the disabled CTA uses `aria-disabled`, native `disabled`, or another accessible pattern
  — must keep visible focus and correct screen-reader announcement (WCAG, PERF-01).

### Deferred Ideas (OUT OF SCOPE)

None new this round — the only scope addition (brand-story + FAQ copy) was already assigned to
Phase 2 by the Phase 1 content skeleton's `writtenInPhase: 2`, not a new capability.

</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HERO-01 | Hero communicates "Mais que um pão de alho!" with the official visual identity | Fully supported — brand facts read from `PROJECT.md`/`docs/brand-guidelines.md` this session; see Architecture Patterns → Hero. |
| HERO-02 | Hero includes "Ver cardápio", "Pedir no iFood", "Como chegar" CTAs | Fully supported for copy/labels (locked in `src/content/skeleton.ts`); **note:** per D-01 these render in the separate CTAs section below the hero visual, not inside the hero image block itself. |
| HERO-03 | Hero's visual focus is real product photography, not generic burger imagery | **Partially supported — locked exception.** D-03/D-04 ship an illustrated composition instead, explicitly labeled provisional (`"Imagem ilustrativa — foto real em breve"`). The literal requirement is not met this phase; the labeled substitute is the CONTEXT.md-authorized path. Real-photo swap is a pure file replacement later (D-04) — see Architecture Patterns → Hero Image Container. |
| LOCAL-01 | Full address + working "Como chegar" Maps link, no embedded iframe | Fully supported — `getStoreInfo()` + `buildMapsUrl()` already built and tested (Phase 1); no iframe exists anywhere in the codebase. |
| LOCAL-02 | Service modalities (balcão/delivery/take away) shown | Fully supported — `storeInfoSchema.modalities` is a typed enum array, already populated with all three. See UI Considerations → flexible wrapping chip row. |
| LOCAL-03 | Hours shown, editable format, marked provisional pending confirmation | Fully supported — `hours.provisional: true`, `hours.schedule: []`, `pendingConfirmation` string already in `src/data/store.ts`/schema; D-07 fixes the exact display shape. |
| LOCAL-04 | "Como chegar" button goes to Google Maps | Fully supported — `buildMapsUrl()` returns `confirmed: true` today (real destination, no placeholder). |
| INTEGRA-01 | "Pedir no iFood" button prominent, mobile-first | Fully supported for placement/label; **the "visible without scrolling" acceptance criterion is a viewport/visual fact this research cannot verify by static analysis** — flagged as a manual-check item, see Common Pitfalls #4. |
| INTEGRA-02 | WhatsApp button available as alternate order/contact channel | Fully supported — `buildWhatsAppUrl()` already built; D-06 fixes its visual parity with the iFood CTA. |
| INTEGRA-03 | If iFood unavailable, show a notice without swapping the primary CTA | Fully supported — D-05 + the `IntegrationLink.confirmed`/`pendingConfirmation` contract (already built, Phase 1) is exactly this mechanism. |
| INTEGRA-05 | No page offers its own checkout — every order path ends at iFood/WhatsApp | Fully supported by construction (ARQ-01: no cart/checkout code exists anywhere in the repo) — recommend a cheap regression test, see Validation Architecture. |

</phase_requirements>

## Summary

Phase 2 is almost entirely a **presentation-layer** phase: every data seam it needs — the store
repository (`getStoreInfo()`), the four integration builders (`buildIFoodUrl`/`buildWhatsAppUrl`/
`buildInstagramUrl`/`buildMapsUrl`), the `IntegrationLink { url, confirmed, pendingConfirmation }`
contract, the Zod-validated store/link schemas, the security headers, and the design tokens — was
already built and tested in Phase 1. There is **no new library to install** and **no new
architectural seam to invent**; the work is composing five Server Components on top of those
seams, writing final Portuguese copy for two of them (brand-story, FAQ), and getting the
disabled/provisional visual states right per D-05/D-06/D-07.

The one genuinely new technical surface is the **hero's illustrated image slot** (D-03/D-04): a
`next/image` container that must reserve its layout box before any load (CLS-safety) and must be a
one-file swap when the real photo arrives. This requires (a) hand-authoring a new provisional SVG
illustration asset — there's no automated pipeline for this, unlike the logo (`scripts/
vectorize-logo.mjs` needs a source photo, which doesn't exist for the hero) — and (b) a
`position: relative` + `fill` + Tailwind `aspect-square` container, the same pattern the official
Next.js docs recommend for "unknown aspect ratio" images. A second, easy-to-miss technical fact
surfaced this session: **Next.js 16 deprecated the `priority` prop in favor of `preload`** — the
existing `Header.tsx` (built in Phase 1) already uses the deprecated prop, and the new hero image
should use `preload={true}` going forward (see Common Pitfalls #1 for the confidence caveat on
this specific claim).

**Primary recommendation:** Build five Server Components (`Hero`, `CtaGroup`, `BrandStory`,
`Location`, `Faq`) under a new `src/components/home/` folder, composed by `src/app/page.tsx`,
consuming `getStoreInfo()`/the integration builders exactly as `Footer.tsx` already does — install
nothing new, extract two small shared pieces (`OrderCta` for the iFood/WhatsApp disabled-state
duplication, `ProvisionalBadge` for the two "provisório" labels), and extend the project's existing
**static-source-inspection** test convention (`layout.test.ts`) to the new components rather than
introducing `jsdom`/React Testing Library.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Hero headline + illustration rendering | Frontend Server (RSC/SSG) | CDN/Static | Pure static marketing content, no per-user state; Next.js pre-renders the HTML, Vercel's edge serves the optimized image. |
| Order CTA gating (`confirmed`/disabled) | Frontend Server | — | `confirmed` is read from a local file at build time, not a runtime API — there is no backend to own this decision (ARQ-01). |
| External link construction + allowlist validation | Frontend Server (Integrations module) | — | The site's only "backend-shaped" logic today (SEC-03 chokepoint) — this is the exact seam a future WhatsApp-bot backend would plug into without a frontend rewrite (ARQ-02). |
| Location / modalities / hours display | Frontend Server | Database/Storage (local `store.ts` as the pseudo-DB) | `getStoreInfo()` is the one sanctioned read path from the local data layer, Zod-validated at build (ARQ-03). |
| FAQ disclosure interaction | Browser (native `<details>/<summary>`) | — | Zero client JS — the browser's native disclosure widget owns open/closed state; no "use client" needed. |
| Image optimization (AVIF/WebP, responsive `srcset`) | CDN/Static (Vercel Image Optimization) | Frontend Server (emits `sizes`/`fill` markup) | Matches the stack's own stated LCP rationale — but see Common Pitfalls #2: this is not on by default. |
| Security headers / CSP | Frontend Server (`next.config.ts`) | CDN/Static (edge applies the header) | Already built in Phase 1; unaffected by this phase — no new host needs allow-listing. |

## Standard Stack

### Core

No new core technology. Reusing the stack Phase 1 already installed and verified:

| Library | Version (from `package.json`, read this session) | Purpose | Status |
|---------|---------|---------|--------|
| next | `16.3.5` [VERIFIED: package.json] | App Router, `next/image`, `headers()` | Already installed |
| react / react-dom | `19.2.8` [VERIFIED: package.json] | Server Components (default, no client JS this phase) | Already installed |
| tailwindcss | `^4` [VERIFIED: package.json] | Styling, native `aspect-ratio` utilities | Already installed |
| zod | `^4.6.4` [VERIFIED: package.json] | `storeInfoSchema`/`externalLinkSchema` (unchanged this phase) | Already installed |
| vitest | `^5.0.0` [VERIFIED: package.json] | Test runner, `node` environment | Already installed |

### Supporting

No new supporting library either. Nothing in this phase's scope (five static sections, one
disabled-state CTA, one native accordion) crosses the bar CLAUDE.md itself sets for adding a
dependency ("only if component variants get non-trivial... don't add it speculatively").

### Alternatives Considered

| Instead of | Could use | Tradeoff |
|------------|-----------|----------|
| Native `<details>/<summary>` for FAQ | A JS accordion (Radix/headlessui/hand-rolled) | Adds a client-side island and a dependency for behavior the browser gives for free; only justify this if a future phase needs custom open/close animation or multi-select accordion semantics the native element can't express. |
| Native `disabled` button for "em breve" CTAs | `aria-disabled` on a styled `<a>` | `aria-disabled` keeps the element focusable/discoverable but requires manually suppressing the click *and* the href — a real regression risk (see Common Pitfalls #5, T-01-05's exact failure mode). Native `disabled` is simpler and matches the Phase 1 precedent already in `src/app/page.tsx`. Use `aria-disabled` only if a future design wants the disabled CTA to stay in tab order. |
| Hand-authored provisional SVG illustration | Commission/generate a raster placeholder image | An SVG stays crisp at any hero size, is tiny, self-hosted (no CSP change), and can be edited the same way `logo-icone.svg` was — but it must be hand-drawn/composed this time since there's no source photo for `vectorize-logo.mjs` to trace. |
| Extending the existing static-source-inspection test style | Installing `vitest` + `@vitejs/plugin-react` + `jsdom` + `@testing-library/react` + `@testing-library/dom` per the official Next.js Vitest guide | RTL lets you assert on *rendered* DOM (actual `disabled` attribute value, actual text node) instead of regexing source text — more robust, but it's a new testing paradigm introduced mid-project, adds 4 new packages (3 of which the legitimacy check flags `SUS` — see Package Legitimacy Audit), and the project's own established convention (`layout.test.ts`, `integrations.test.ts`) already covers this phase's requirement shapes. Recommend **not** adopting this phase; revisit if a later phase needs real interaction testing (e.g., the cardápio search/filter in Phase 3). |

**Installation:** None — no new packages this phase.

## Package Legitimacy Audit

**No new packages are being installed this phase** — the table below documents the *considered
but not adopted* alternative (RTL + jsdom stack, see above), for transparency, since the legitimacy
check was run on it during research.

| Package | Registry | Age (latest publish) | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|-----------------------|---------------|--------------|---------|--------------|
| `jsdom` | npm | 2026-07-29 | ~72.7M | `github.com/jsdom/jsdom` | OK | Not adopted — see Alternatives Considered |
| `@vitejs/plugin-react` | npm | 2026-08-28 | ~65.1M | `github.com/vitejs/vite-plugin-react` | SUS (`too-new`) | Not adopted |
| `@testing-library/react` | npm | 2026-08-27 | ~43.0M | `github.com/testing-library/react-testing-library` | SUS (`too-new`) | Not adopted |
| `@testing-library/dom` | npm | 2026-09-13 | ~51.9M | `github.com/testing-library/dom-testing-library` | SUS (`too-new`) | Not adopted |

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `@vitejs/plugin-react`, `@testing-library/react`,
`@testing-library/dom` — the `too-new` reason here is a **recent-patch-date false positive**
(each package has 40–70M weekly downloads and an active, well-known GitHub org — `npm view
<pkg> version` this session confirmed mature version numbers: `6.1.1`, `16.3.3`, `10.4.2`
respectively), not evidence of a new/hallucinated package. **This audit table is moot unless a
future phase reverses the Alternatives Considered decision and actually installs this stack** — if
it does, the planner must still add a `checkpoint:human-verify` task before install per protocol,
despite this research's own assessment that the flags are benign.

## Architecture Patterns

### System Architecture Diagram

```
Visitor's browser
   │  GET /
   ▼
Next.js App Router (RSC, statically generated at build time)
   │
   ├─ src/app/page.tsx  ──composes──▶ five home sections, in D-01's fixed order:
   │      │
   │      ├─ Hero            reads: (no data — static headline/illustration copy)
   │      ├─ CtaGroup         reads: buildIFoodUrl(), buildWhatsAppUrl(), buildMapsUrl()
   │      │                          └─ each passes through assertAllowedHost() (SEC-03)
   │      ├─ BrandStory       reads: (static copy, src/content/home-copy.ts)
   │      ├─ Location         reads: getStoreInfo()  ──▶ storeInfoSchema.parse(rawStore)
   │      │                          (address, modalities, hours.provisional/schedule)
   │      └─ Faq              reads: (static copy, src/content/home-copy.ts)
   │
   ▼
Rendered HTML + next/image srcset (AVIF/WebP once next.config.ts enables it — see Pitfall #2)
   │
   ▼
Every CTA/link is a plain <a target="_blank"> or a disabled <button> — NONE hit a checkout route.
   │
   ├─ confirmed:true  → live anchor → iFood / WhatsApp / Google Maps / Instagram (external, allow-listed)
   └─ confirmed:false → disabled <button> "{label} (em breve)" → no navigation at all
```

### Recommended Project Structure

```
src/
├── app/
│   └── page.tsx                 # composes the five sections in D-01's order; no section logic here
├── components/
│   ├── layout/                  # existing (Header, Footer, SkipLink) — unchanged this phase
│   └── home/                    # NEW — one file per D-01 section, plus two shared pieces
│       ├── Hero.tsx              # HERO-01/02(labels only)/03 — headline + illustrated image slot
│       ├── CtaGroup.tsx          # HERO-02 + INTEGRA-01/02/03 — the four CTAs as their own section
│       ├── OrderCta.tsx          # shared: renders one IntegrationLink as live-or-"(em breve)" (D-05/D-06)
│       ├── ProvisionalBadge.tsx  # shared: the "provisório"/"imagem ilustrativa" label (D-03, D-07)
│       ├── BrandStory.tsx        # brand-story final copy (D-02)
│       ├── Location.tsx          # LOCAL-01..04 — address, modalities chips, hours notice, Maps CTA
│       └── Faq.tsx                # FAQ using native <details>/<summary>
├── content/
│   ├── skeleton.ts               # existing — structural inventory, unchanged
│   ├── tone-of-voice.md          # existing — unchanged
│   └── home-copy.ts              # NEW — final hero/brand-story/CTA-label/FAQ copy (D-02), not src/data
public/
└── brand/
    └── hero-illustration.svg     # NEW — hand-authored provisional asset (D-03/D-04), same
                                   #       "ARQUIVO PROVISORIO" comment-header convention as
                                   #       logo-icone.svg (see Header.tsx precedent)
```

Naming above is a *recommendation*, not a lock — CONTEXT.md's Claude's Discretion explicitly
leaves exact markup/file structure to whoever plans/executes. It exists so the planner isn't
starting from zero.

### Pattern 1: Compose data once at the page, pass typed props down

**What:** `src/app/page.tsx` calls `getStoreInfo()` and the four `build*Url()` functions once, and
passes the results as typed props into `Location`/`CtaGroup` — rather than each section component
calling the repository/integration functions itself (the pattern `Footer.tsx` uses today).

**When to use:** Specifically for `Location`'s hours block and `CtaGroup`'s order CTAs, because
Validation Architecture below needs to exercise the "populated schedule" branch of LOCAL-03 and the
"confirmed: true" branch of INTEGRA-01/02/03 with fixture data — neither branch exists in real data
yet (`hours.schedule` is always `[]`, both order links are always `confirmed: false`). A
presentational component that accepts `hours: StoreInfo["hours"]` / `link: IntegrationLink` as a
prop can be unit-tested with both branches today; a component that calls `getStoreInfo()` itself
cannot, without mocking the repository (which the project has never done).

`Footer.tsx`'s self-fetching pattern is fine to leave as-is — it has only one state to render.

**Example:**
```tsx
// src/app/page.tsx (recommended shape)
import { getStoreInfo } from "@/lib/repositories/store-repository";
import { buildIFoodUrl } from "@/lib/integrations/ifood";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp";
import { buildMapsUrl } from "@/lib/integrations/maps";
import { Hero } from "@/components/home/Hero";
import { CtaGroup } from "@/components/home/CtaGroup";
import { BrandStory } from "@/components/home/BrandStory";
import { Location } from "@/components/home/Location";
import { Faq } from "@/components/home/Faq";

export default function Home() {
  const store = getStoreInfo();
  const ifood = buildIFoodUrl();
  const whatsapp = buildWhatsAppUrl();
  const maps = buildMapsUrl();

  return (
    <>
      <Hero />
      <CtaGroup ifood={ifood} whatsapp={whatsapp} maps={maps} />
      <BrandStory />
      <Location store={store} maps={maps} />
      <Faq />
    </>
  );
}
```
*(Source: derived from the existing `src/app/page.tsx` and `Footer.tsx` shapes read this session —
not from an external doc; this is the phase's own architectural extrapolation.)*

### Pattern 2: Shared `OrderCta` for the D-06 duplicated disabled state

**What:** One component takes `{ link: IntegrationLink; label: string }` and renders either a live
`<a>` (if `link.confirmed`) or a disabled `<button>` reading `"{label} (em breve)"` — reused
verbatim for both the iFood and WhatsApp CTAs, so D-06's "identical visual treatment" rule is
structural, not a copy-paste each engineer has to remember to keep in sync.

**Example (extending the exact pattern already in `src/app/page.tsx`, read this session):**
```tsx
// src/components/home/OrderCta.tsx
import type { IntegrationLink } from "@/lib/integrations/types";

export function OrderCta({ link, label }: { link: IntegrationLink; label: string }) {
  if (link.confirmed) {
    return (
      <a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="rounded-full bg-accent px-6 py-3 text-base font-semibold text-surface-deep"
      >
        {label}
      </a>
    );
  }
  // D-05: never a live-looking link to the placeholder URL — a native `disabled` button
  // needs no client JS to be inert and announced correctly by assistive tech.
  return (
    <button
      type="button"
      disabled
      aria-describedby={link.pendingConfirmation ? "order-cta-pending" : undefined}
      className="cursor-not-allowed rounded-full bg-surface-primary px-6 py-3 text-base font-semibold text-text-on-dark opacity-60"
    >
      {label} (em breve)
    </button>
  );
}
```

### Pattern 3: CLS-safe hero image container (`fill` + native `aspect-ratio`)

**What:** `next/image`'s `fill` prop requires a positioned parent; combine it with Tailwind's
native `aspect-square` utility (Tailwind v4 ships `aspect-ratio` support without the old
`@tailwindcss/aspect-ratio` plugin) to reserve the exact 1:1 box the illustration needs before
anything loads — matching `logo-icone.svg`'s own square viewBox convention (UI-SPEC).

**Example:**
```tsx
// src/components/home/Hero.tsx (image slot only)
import Image from "next/image";

<div className="relative aspect-square w-full max-w-sm">
  <Image
    src="/brand/hero-illustration.svg"
    alt="Ilustração de alho em traço lima sobre fundo escuro"
    fill
    // Next.js 16 deprecated `priority` in favor of `preload` — see Common Pitfalls #1
    // for the confidence caveat on this specific claim.
    preload
    sizes="(max-width: 640px) 90vw, 400px"
  />
</div>
```
*(Source: [CITED, LOW-tier per this project's classify-confidence seam — see Common Pitfalls #1]
nextjs.org/docs/app/api-reference/components/image, fetched this session, version 16.3.5 /
lastUpdated 2026-08-25 — direct quotes: "The parent element must assign position: 'relative',
'fixed', or 'absolute'" and "`sizes` should be used when... The image is using the `fill` prop.")*

### Anti-Patterns to Avoid

- **Hardcoding any iFood/WhatsApp/Instagram/Maps URL string in a new `home/` component:**
  bypasses `assertAllowedHost()` and the `confirmed` gate — exactly the class of bug Phase 1's
  ESLint `no-restricted-imports` rule and CR-01 fix exist to prevent. Always go through
  `build*Url()`.
- **A JS-driven FAQ accordion:** unnecessary client bundle and ARIA wiring for something
  `<details>/<summary>` gives for free (see Don't Hand-Roll).
- **Fetching `getStoreInfo()`/`build*Url()` independently inside every new section component:**
  works, but makes the empty/populated-hours and confirmed/unconfirmed-link branches untestable
  without mocking — prefer Pattern 1 for `Location` and `CtaGroup` specifically.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible FAQ disclosure | A custom JS accordion with `aria-expanded`/`aria-controls` wiring | Native `<details>/<summary>` | [CITED: MEDIUM, cross-checked WebSearch — WebAIM/aditus.io/216digital] Accessible by default: `<summary>` behaves like a button, expanded/collapsed state is exposed to assistive tech automatically, Enter/Space work with zero JS. |
| CLS-safe hero image box | Manual `padding-top` percentage-hack container | `fill` + Tailwind's native `aspect-square` | [CITED: MEDIUM] Tailwind v4 uses the browser's native `aspect-ratio` property; the old `@tailwindcss/aspect-ratio` plugin is unneeded and doesn't install cleanly under v4. |
| Disabled-CTA-that-will-later-become-live | A styled `<a aria-disabled>` with manual click/keydown suppression | Native `disabled` `<button>` | [CITED: MEDIUM] `aria-disabled` is the right tool only when the control must *stay focusable* for the flow to succeed; here the action is fully inert until confirmed, so native `disabled` (already the Phase 1 precedent) is simpler and can't be defeated by a stray click handler bug. |
| External destination construction | A new URL template string in a `home/` component | `buildIFoodUrl()`/`buildWhatsAppUrl()`/`buildMapsUrl()` (already built) | Single allow-listed chokepoint (SEC-03); duplicating URL construction reintroduces the exact risk Phase 1 closed. |
| Repeated "provisório" visual treatment | Copy-pasted badge markup in `Hero` and `Location` | One shared `ProvisionalBadge` component | DRY; keeps the Oliva-colored badge visually identical everywhere per UI-SPEC, and means a future color/wording change is one edit, not two. |

**Key insight:** every "don't hand-roll" item above already has a first-party answer in this
codebase or the platform — the entire risk surface in this phase is *forgetting to reuse* what
Phase 1 built (the integration/repository seams) or reintroducing a JS dependency for behavior
the browser already provides, not missing tooling.

## Runtime State Inventory

Not applicable — this phase is new-component construction on top of already-built seams, not a
rename/refactor/migration. No stored data, live service config, OS-registered state, secret/env
var names, or build artifacts change name or location this phase. Confirmed by reading
`src/data/store.ts`, `src/data/links.ts`, and both schema files this session: none of the field
names, file paths, or identifiers found in Phase 1 change in Phase 2's scope.

## Common Pitfalls

### Pitfall 1: `next/image`'s `priority` prop is deprecated in Next.js 16 — confidence caveat

**What goes wrong:** Copying `Header.tsx`'s existing `priority` prop into the new hero image looks
like the safe, established pattern — but the official Next.js docs (fetched this session) state:
*"Starting with Next.js 16, the `priority` property has been deprecated in favor of the `preload`
property in order to make the behavior clear."* [`preload` docs: "When to use it: The image is the
[LCP] element... The image is above the fold, typically the hero image."]

**Why it happens:** `Header.tsx` was built during Phase 1, likely before this specific v16 change
was internalized, or the deprecation is easy to miss since `priority` still works (deprecated, not
removed — no build error).

**Confidence caveat (must be disclosed, not smoothed over):** this project's own `classify-confidence`
tool scores raw `webfetch`-sourced findings as **LOW** regardless of the source's authority,
separate from the qualitative `[CITED: official docs]` tag. The quote above is a direct read of
`nextjs.org/docs/app/api-reference/components/image` (version 16.3.5, `lastUpdated: 2026-08-25`) —
not training-knowledge guesswork — but per this project's provenance rules, a LOW-tier finding
should not be treated as silently authoritative. **Recommend the planner re-confirm this one fact**
(e.g. a second WebFetch/search, or checking the installed `next` package's own TypeScript types for
a `@deprecated` JSDoc on `priority`) before committing to `preload` across the codebase.

**How to avoid:** Use `preload={true}` on the new hero image once confirmed; optionally file a
tech-debt note for `Header.tsx`'s pre-existing `priority` usage (out of this phase's scope to fix,
inherited from Phase 1).

**Warning signs:** A console deprecation warning in `next dev` output mentioning `priority`.

### Pitfall 2: AVIF is not enabled by default — `next.config.ts` has no `images` block today

**What goes wrong:** The project's own tech-stack rationale (`.claude/CLAUDE.md`) claims "a
first-party image optimizer with AVIF/WebP" as a reason for choosing Next.js — but `next.config.ts`
(read this session) has no `images` key at all, and the Next.js default is `formats: ['image/webp']`
only. AVIF requires explicitly setting `formats: ['image/avif', 'image/webp']`.

**Why it happens:** Phase 1 never shipped a real content image (`Header.tsx`'s logo is an SVG,
which `next/image` serves unoptimized regardless of the `formats` config) — this phase is the
first to actually exercise the raster/optimization pipeline the stack research assumed.

**How to avoid:** Add to `next.config.ts`:
```ts
const nextConfig: NextConfig = {
  images: { formats: ["image/avif", "image/webp"] },
  async headers() { /* unchanged */ },
};
```
**Warning signs:** Inspecting the `<img>` element's `srcset` in devtools shows only `.webp` URLs,
never `.avif`, even in a browser that supports AVIF.

### Pitfall 3: The hero illustration is an SVG — `next/image` serves it unoptimized, and that's correct

**What goes wrong:** Expecting the new SVG hero asset to get AVIF/WebP conversion or a responsive
`srcset` like a photo would, then being confused when it doesn't.

**Why it happens:** Next.js auto-detects `.svg` sources and serves them as-is (`unoptimized`
behavior applies automatically) — this is documented, intentional behavior, not a misconfiguration.
It's also the same behavior `logo-icone.svg` already relies on via `Header.tsx`.

**How to avoid:** Nothing to fix — the `fill` + `aspect-square` container still protects CLS
regardless of optimization; no `dangerouslyAllowSVG` config is needed since the SVG is served
as-is, self-hosted, never through the remote-image optimization path.

### Pitfall 4: "Visible without scrolling on mobile" is not verifiable by source inspection or a unit test

**What goes wrong:** Treating INTEGRA-01's "visible or easily accessible, mobile-first" and the
Phase 2 success criterion #2 ("iFood and WhatsApp CTAs side by side on mobile without scrolling
past the fold") as satisfied once the JSX exists and the labels are correct.

**Why it happens:** Both of the project's testing approaches this session (static source
inspection, and the RTL alternative considered above) run in Node/jsdom without a real viewport —
neither can measure actual pixel position against a fold line.

**How to avoid:** Treat this explicitly as a **manual/visual check** (mobile emulation at a common
small viewport, e.g. 375×667 or 390×844) during UAT — not something a green `npm test` proves. See
Validation Architecture → Sampling Rate.

### Pitfall 5: Recreating the exact bug D-05/CR-01 already fixed once

**What goes wrong:** Building the disabled CTA as a styled `<a href={link.url} aria-disabled="true">`
instead of a native `disabled` `<button>` — `aria-disabled` alone does **not** prevent navigation;
without also stripping/guarding the `href` and the click handler, a keyboard or assistive-tech user
can still activate the placeholder link and land on `.../PLACEHOLDER_PENDING_CLIENT_CONFIRMATION`.

**Why it happens:** `aria-disabled` "looks" like the accessible-friendly choice from a quick search,
and CONTEXT.md explicitly leaves this choice to whoever implements it — but the tradeoff (manual
suppression burden) is easy to skip under time pressure.

**How to avoid:** Default to the native `disabled` `<button>` pattern already used in
`src/app/page.tsx` (Phase 1) for `OrderCta`, unless there's a concrete reason the CTA must stay
focusable.

**Warning signs:** A code review or test that finds a real `href` attribute value equal to
`externalLinks.find(l => l.id === "ifood").url` on any element that isn't gated by `confirmed`.

### Pitfall 6: Flipping `hours.provisional` to `false` without real hours fails the build — that's correct, not a bug to route around

**What goes wrong:** An editor (client or developer) tries to "clean up" `src/data/store.ts` by
setting `provisional: false` once they've written *some* schedule, without an actual client
confirmation — `storeInfoSchema`'s `provisional: z.literal(true)` (read this session,
`src/lib/schemas/store.schema.ts:15`) makes this fail `.parse()` and fail the build.

**Why it happens:** The literal-type guard is intentionally strict (ARQ-03/CONT-03) — it's easy to
mistake the resulting build failure for a Phase 2 regression instead of the schema doing its job.

**How to avoid:** Document this behavior for whoever edits `store.ts` next: the only way to ship
real hours is a deliberate schema edit (changing the literal type), not a data-only change — by
design.

## Code Examples

### Reading and rendering the modalities as a flexible list (LOCAL-02)

```tsx
// src/components/home/Location.tsx (excerpt)
import type { StoreInfo } from "@/lib/schemas/store.schema";

const MODALITY_LABEL: Record<StoreInfo["modalities"][number], string> = {
  balcao: "Balcão",
  delivery: "Delivery",
  "take-away": "Take away",
};

<ul className="flex flex-wrap gap-2">
  {store.modalities.map((modality) => (
    <li key={modality} className="rounded-full bg-surface-primary px-3 py-1 text-sm">
      {MODALITY_LABEL[modality]}
    </li>
  ))}
</ul>
```
*(Source: `storeInfoSchema.modalities` type read this session,
`src/lib/schemas/store.schema.ts:11` — `z.array(z.enum(["balcao", "delivery", "take-away"]))`;
UI-SPEC's "flexible wrapping list/chip row" resolution for this element.)*

### Rendering the hours provisional notice (LOCAL-03, D-07)

```tsx
// src/components/home/Location.tsx (excerpt)
{store.hours.schedule.length === 0 && (
  <div>
    <ProvisionalBadge />
    <h3>Horário de funcionamento</h3>
    <p>Em atualização — confirme no iFood ou no WhatsApp antes de vir.</p>
  </div>
)}
```
*(Source: `src/data/store.ts` — `hours.schedule: []` today [VERIFIED: src/data/store.ts:20];
copy shape from `02-UI-SPEC.md`'s Copywriting Contract, itself Claude's-discretion wording per
CONTEXT.md.)*

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| `next/image` `priority` prop | `preload` prop | Next.js `16.0.0` per official docs (LOW-tier per this project's webfetch classification — see Pitfall #1) | `priority` still works but is deprecated; new code in this phase should prefer `preload`. |
| `@tailwindcss/aspect-ratio` plugin | Native CSS `aspect-ratio` via Tailwind v4's built-in `aspect-*` utilities | Tailwind v4 (already installed) | No plugin needed for the hero's 1:1 container; the plugin is reported incompatible with v4 in community discussion. |
| JS-driven / ARIA-hand-wired accordions | Native `<details>/<summary>` | Long-standing browser support; newly relevant here since this is the project's first accordion-shaped UI (FAQ) | Zero client JS for the FAQ section, consistent with the project's Server-Component-by-default architecture. |

**Deprecated/outdated:** `next/image`'s `priority` prop (see above, with confidence caveat).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `next/image`'s `priority` prop is deprecated in favor of `preload` starting Next.js 16 | Common Pitfalls #1, Pattern 3 | Low-to-medium: if wrong, `preload` is simply the wrong prop name and the hero image would need a one-line fix (`preload` → `priority`); does not affect CLS-safety or layout, since the fallback (`priority`) is what `Header.tsx` already uses successfully in production-equivalent code. This project's `classify-confidence` seam independently scores this finding LOW (webfetch-provider ceiling) even though it was read directly from the official docs page this session — flagged per protocol rather than presented as settled. |
| A2 | The exact ASVS category numbers used in the Security Domain table below (V4/V5/etc.) match OWASP ASVS's actual numbering | Security Domain | Low: the *controls* recommended (allowlist validation, no new input surface) are grounded in code read this session regardless of which ASVS chapter number they're filed under; only the category *labels* are unverified training knowledge. |
| A3 | Recommended file names/paths (`src/components/home/*.tsx`, `src/content/home-copy.ts`, `public/brand/hero-illustration.svg`) | Architecture Patterns → Recommended Project Structure | None — CONTEXT.md's Claude's Discretion explicitly leaves exact structure open; this is a proposal, not a claim of fact. |

## Open Questions

1. **What does "Ver cardápio" link to?**
   - What we know: the label and visual tier (secondary, accent-outline) are locked (UI-SPEC).
   - What's unclear: Phase 3 (the actual cardápio page) hasn't shipped, so there's no real route
     yet.
   - Recommendation: the planner should record an explicit assumption for the interim target (a
     stub `/cardapio` route returning a "em construção" placeholder, or an in-page anchor to the
     product-categories skeleton entry once it exists) — this is the UI-SPEC's own flagged
     unresolved row, not a new gap found in this research pass.

2. **Should the hero illustration be a single flat SVG, or a composed layering of the existing
   `logo-icone.svg` over CSS diagonal-shape `<div>`s?**
   - What we know: D-04 says the slot is `next/image` pointing at "the asset" (singular), which
     reads as one file, not a CSS composition inside the `next/image` box.
   - What's unclear: whether reusing `logo-icone.svg`'s garlic path data inside a new, larger
     hand-authored SVG (diagonal shapes + garlic line-art in one file) is preferred over drawing a
     wholly new illustration.
   - Recommendation: author one new SVG file reusing `logo-icone.svg`'s garlic path as a
     starting point for the line-art element (visual consistency, less net-new drawing), following
     the same "ARQUIVO PROVISORIO" comment-header convention. Left to Claude's Discretion per
     CONTEXT.md.

## Environment Availability

No new external dependency this phase — Node (`>=20.9`), npm, and the Next.js toolchain were
already verified working in Phase 1 (six plans executed, tests passing). Authoring a new SVG
illustration by hand needs no additional tool beyond a text editor; `sharp`/`svgo` (already
installed dev dependencies from Phase 1's logo pipeline) are available if the planner wants to
sanitize the hand-authored SVG the same way `scripts/vectorize-logo.mjs` sanitizes the logo SVGs,
but this is optional, not required, since a hand-authored file (unlike a traced one) can simply be
written without an embedded `<script>`/`on*=` attribute in the first place.

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest `5.0.0` [VERIFIED: package.json], `environment: "node"` (no DOM) |
| Config file | `vitest.config.ts` (repo root) — unchanged this phase |
| Quick run command | `npx vitest run src/components/home` (once the new test files exist) |
| Full suite command | `npm test` (== `vitest run`) |

**Recommendation (see Alternatives Considered):** continue the project's established
**static-source-inspection** convention (`src/components/layout/layout.test.ts`,
`src/lib/integrations/integrations.test.ts`) — assert against component *source text* (regex on
imports, JSX attributes, literal strings) and against pure functions passed fixture props — rather
than introducing `jsdom`/React Testing Library. This requires zero new dependencies and matches
every existing test file in the repo.

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|--------------------|-------------|
| HERO-01 | Hero source contains the "Mais que um pão de alho!" line and uses design tokens (no hex literal) | static source inspection | `npx vitest run src/components/home/home.test.ts` | ❌ Wave 0 |
| HERO-02 | Hero/CtaGroup source contains all three CTA labels verbatim | static source inspection | same file | ❌ Wave 0 |
| HERO-03 | Hero source uses `next/image` (not `<img>`), a `fill`/`aspect-square` container, and renders the "Imagem ilustrativa" provisional label | static source inspection | same file | ❌ Wave 0 |
| LOCAL-01 | `Location` renders `store.address`/`neighborhood`/`city`/`state` via a prop (not a hardcoded literal) and calls `buildMapsUrl()`; no `<iframe` anywhere in the repo | static source inspection + fixture-prop unit test | same file | ❌ Wave 0 |
| LOCAL-02 | `Location` maps over `store.modalities` (array), not three hardcoded chip elements | fixture-prop unit test (pass a 1-item and a 3-item array, assert chip count matches) | same file | ❌ Wave 0 |
| LOCAL-03 | `Location` renders the provisional hours notice when `hours.schedule.length === 0`, and does **not** render it when passed a fixture with a non-empty schedule | fixture-prop unit test (Pattern 1 makes this possible — real data only ever exercises the empty branch) | same file | ❌ Wave 0 |
| LOCAL-04 | "Como chegar" anchor's `href` equals `buildMapsUrl().url` | static source inspection | same file | ❌ Wave 0 |
| INTEGRA-01 / 02 | `OrderCta` renders a live `<a>` when passed `{confirmed: true}` and a disabled `<button>` with "(em breve)" when passed `{confirmed: false}` | fixture-prop unit test (two fixtures, no repository mocking needed) | `npx vitest run src/components/home/OrderCta.test.ts` | ❌ Wave 0 |
| INTEGRA-03 | The unavailability notice text renders only when `!ifood.confirmed`, and always points at the Maps CTA, never a nonexistent `/cardapio` route | fixture-prop unit test | same file as CtaGroup | ❌ Wave 0 |
| INTEGRA-05 | No `<form`, no `checkout`/`cart` literal anywhere under `src/components/home/` or `src/app/page.tsx` | repo-wide static grep guard (same style as `layout.test.ts`'s "no fixed pixel dimensions" sweep) | `npx vitest run src/components/home/home.test.ts` | ❌ Wave 0 |
| INTEGRA-01 (mobile-fold) | CTAs visible without scrolling on a ~375–390px-tall mobile viewport | **manual/visual only** — not automatable by this project's test stack | n/a | manual UAT |

### Sampling Rate

- **Per task commit:** `npx vitest run <new-file>` (fast — `node` environment, no DOM startup cost).
- **Per wave merge:** `npm test` (whole suite; the project is small enough that there's no
  meaningful split between "quick" and "full" yet).
- **Phase gate:** full suite green, **plus** a manual mobile-viewport check for the fold-visibility
  criterion (Pitfall #4) before `/gsd-verify-work`.

### Wave 0 Gaps

- [ ] `src/components/home/home.test.ts` (or one file per component, matching the granularity the
  planner chooses) — covers HERO-01/02/03, LOCAL-01/02/03/04, INTEGRA-05.
- [ ] `src/components/home/OrderCta.test.ts` — covers INTEGRA-01/02/03's confirmed/disabled
  branches via fixture props (no framework change needed).
- No new test *framework* or config gap — `vitest.config.ts`'s `node` environment already covers
  this phase's testing style; the RTL/jsdom path was considered and explicitly not adopted (see
  Alternatives Considered).

## Security Domain

### Applicable ASVS Categories

*(Category labels below are `[ASSUMED]` — see A2 in Assumptions Log; the underlying controls are
grounded in code read this session.)*

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No auth surface exists or is added this phase (ARQ-01). |
| V3 Session Management | No | No session state. |
| V4 Access Control | No | No per-user data or roles. |
| V5 Input Validation | Yes (unchanged) | `storeInfoSchema`/`externalLinkSchema` (Zod, Phase 1) continue to gate all commercial/link data; this phase adds no new *user* input (search/filter is Phase 3). |
| V6 Cryptography | No | Nothing new to encrypt/sign this phase. |
| — (outbound redirect integrity) | Yes | `assertAllowedHost()` exact-hostname allowlist (Phase 1, SEC-03) — every new component must call the existing `build*Url()` functions, never construct a URL literal. |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|-----------------------|
| A new `home/` component hardcodes an iFood/WhatsApp/Maps URL instead of calling `build*Url()`, bypassing `assertAllowedHost()` | Tampering / Spoofing | Continue ARQ-02's lint boundary + add a static-source-inspection test asserting each new component imports the builder functions and contains no raw `https://` literal (mirrors `layout.test.ts`'s existing check on `Footer.tsx`). |
| Disabled CTA implemented as `aria-disabled` on an `<a>` with a real placeholder `href`, letting a keyboard/AT user still activate the unconfirmed link | Tampering (of user expectation) | Prefer native `disabled` `<button>` (Pitfall #5) — this is the exact defect class Phase 1's CR-01 fixed once already. |
| New brand-story/FAQ copy states an invented fact (hours, price, "premiado", etc.) tone-of-voice.md §5 forbids | Spoofing (of commercial claims) | Manual review against `tone-of-voice.md` before commit; the content lives in one new file (`src/content/home-copy.ts`), making review a single-file diff. |
| Hand-authored hero SVG asset contains an embedded `<script>`/`on*=` attribute | Tampering (malicious markup rendered as a document) | Write the SVG by hand without such attributes in the first place; optionally run it through `svgo` (already installed) as defense-in-depth, same as Phase 1's logo pipeline; CSP's `object-src 'none'` (Phase 1) is a further backstop. |

## Sources

### Primary (HIGH confidence)

- `C:\Users\luisgx\Desktop\Projetos\Its garlic\package.json` — read this session, exact installed
  versions of `next`, `react`, `tailwindcss`, `zod`, `vitest`.
- `src/data/store.ts`, `src/data/links.ts`, `src/lib/schemas/store.schema.ts`,
  `src/lib/schemas/link.schema.ts`, `src/lib/integrations/{types,ifood,whatsapp,maps,allowlist}.ts`,
  `src/lib/repositories/store-repository.ts` — read this session; the exact data/integration seams
  this phase must reuse.
- `src/content/skeleton.ts`, `src/content/tone-of-voice.md`, `docs/brand-guidelines.md`,
  `.planning/PROJECT.md` — read this session; the confirmed facts and brand rules this phase's copy
  must stay inside.
- `src/components/layout/layout.test.ts`, `src/lib/integrations/integrations.test.ts` — read this
  session; the established test-style convention this research recommends extending.
- `npm view jsdom / @vitejs/plugin-react / @testing-library/react / @testing-library/dom version` +
  `gsd-tools query package-legitimacy check` — run this session, npm registry ground truth for the
  considered-but-not-adopted testing stack.

### Secondary (MEDIUM confidence)

- WebSearch, cross-checked against official-domain results in the same query
  (`classify-confidence --provider websearch --verified` → `MEDIUM`):
  - `disabled` vs `aria-disabled` best practice (css-tricks.com, kittygiraudel.com, MDN)
  - `next/image` `fill` + `aspect-ratio` CLS pattern (nextjs.org, logrocket.com)
  - Native `<details>/<summary>` FAQ accessibility (webaim.org, aditus.io, 216digital.com)
  - Tailwind v4 native `aspect-ratio` utilities (tailwindcss.com, github.com/tailwindlabs discussion)
  - Server Components as the App Router default (nextjs.org/docs)

### Tertiary (LOW confidence — flagged, not smoothed over)

- `WebFetch` of `nextjs.org/docs/app/api-reference/components/image` (version 16.3.5,
  `lastUpdated: 2026-08-25`) — the exact source of the `priority`-deprecated-in-favor-of-`preload`
  claim (Pitfall #1, A1). This project's `classify-confidence` seam scores raw `webfetch` LOW
  regardless of the fetched source's authority — disclosed per protocol rather than upgraded to
  `[VERIFIED]` on the strength of the source alone.
- `WebFetch` of `nextjs.org/docs/app/guides/testing/vitest` — same LOW tier; used only to name the
  exact RTL/jsdom package set for the (not-adopted) Alternatives Considered entry.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — no new dependency; every version claim read directly from `package.json`
  this session.
- Architecture: HIGH for the data/integration seams (read from source), MEDIUM for the
  presentation-layer patterns (Pattern 1/2/3 — sound extrapolation from existing code + MEDIUM-tier
  web sources), LOW-disclosed for the one Next.js-16-specific API detail (Pitfall #1).
- Pitfalls: MEDIUM-to-HIGH — five of six pitfalls are grounded in code read this session
  (`next.config.ts`, schemas, existing test files); one (#1) is explicitly flagged LOW-tier per this
  project's own confidence seam despite an official-docs origin.

**Research date:** 2026-09-13
**Valid until:** 30 days (stable domain — no fast-moving dependency this phase; re-check sooner
only if Next.js ships another `16.x` minor before planning starts, given the `priority`/`preload`
churn already observed).

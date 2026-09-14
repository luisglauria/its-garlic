---
phase: 02-hero-ctas-location
reviewed: 2026-09-13T00:00:00Z
depth: standard
files_reviewed: 15
files_reviewed_list:
  - next.config.ts
  - public/brand/hero-illustration.svg
  - src/app/page.tsx
  - src/components/home/BrandStory.tsx
  - src/components/home/CtaGroup.tsx
  - src/components/home/Faq.tsx
  - src/components/home/Hero.tsx
  - src/components/home/Location.test.ts
  - src/components/home/Location.tsx
  - src/components/home/OrderCta.test.ts
  - src/components/home/OrderCta.tsx
  - src/components/home/ProvisionalBadge.tsx
  - src/components/home/home.test.ts
  - src/components/home/sections.test.ts
  - src/content/home-copy.ts
findings:
  critical: 1
  warning: 2
  info: 2
  total: 5
status: issues_found
---

# Phase 02: Code Review Report

**Reviewed:** 2026-09-13
**Depth:** standard
**Files Reviewed:** 15
**Status:** issues_found

## Summary

Reviewed the hero/CTA/location/brand-story/FAQ slice. Most of the code is careful, well-commented,
and the static-source test suite (`home.test.ts`, `sections.test.ts`) enforces a good set of
structural invariants (no literal URLs, no `aria-disabled`, no clock times, no cart affordances).

However, one finding is a confirmed, production-breaking defect: the hero illustration — the
page's designated LCP element, explicitly marked `preload` — fails to load at all, because
`next.config.ts` does not enable `images.dangerouslyAllowSVG`. I started `next dev` and requested
the exact URL the `<Image>` component generates for `/brand/hero-illustration.svg`; the Next.js
image optimizer returned HTTP 400 with body `"url" parameter is valid but image type is not
allowed"`. This directly contradicts the comment in `next.config.ts` claiming the SVG is "served
as-is regardless of this config." Since this is the only above-the-fold visual asset in the phase,
this breaks HERO-03 and the project's LCP acceptance criterion outright, and none of the existing
tests can catch it because the suite only asserts against source text (`renderToStaticMarkup`
never actually requests the image).

A second, real (if less severe) defect: `CtaGroup`'s unconfirmed-destination notice is wired only
to the iFood CTA (`!ifood.confirmed`), even though the WhatsApp CTA is *also* currently
unconfirmed (`src/data/links.ts`) and carries its own `pendingConfirmation` message that is never
rendered anywhere. The result, with today's real data, is a "Chamar no WhatsApp" button that
renders disabled with a `(em breve)` suffix and zero adjacent explanation, immediately next to an
iFood button that *does* explain itself — contradicting the file's own comment ("no special-casing
WhatsApp... identical primary-tier treatment").

## Critical Issues

### CR-01: Hero image (LCP element) returns HTTP 400 — `dangerouslyAllowSVG` not enabled

**File:** `next.config.ts:9-16`, `src/components/home/Hero.tsx:36-42`
**Issue:**
`next/image`'s default loader routes every non-`unoptimized` local image — including files served
from `/public` by string path — through the built-in image optimization endpoint
(`/_next/image?url=...`). The installed Next.js version (`node_modules/next/dist/server/image-optimizer.js:1107-1116`)
explicitly rejects any upstream resource whose content type is `image/svg+xml` unless
`images.dangerouslyAllowSVG` is `true` in `next.config.ts`, returning a 400 error instead.

`next.config.ts` sets `images.formats` but never sets `dangerouslyAllowSVG`, and `Hero.tsx`'s
`<Image src="/brand/hero-illustration.svg" fill preload ... />` does not pass `unoptimized`
either. I verified this empirically: started `next dev` and requested the exact optimizer URL the
component produces for this asset —

```
$ curl -s "http://localhost:3000/_next/image?url=%2Fbrand%2Fhero-illustration.svg&w=640&q=75"
"url" parameter is valid but image type is not allowed
$ curl -s -o /dev/null -w "%{http_code}\n" "http://localhost:3000/_next/image?url=%2Fbrand%2Fhero-illustration.svg&w=640&q=75"
400
```

This is the site's only above-the-fold visual element, the one explicitly marked `preload` to
protect the LCP budget (HERO-03/PERF). In its current state, the hero renders a broken image in
every environment that doesn't set `images.unoptimized: true` (dev, `next start`, and Vercel's
production image pipeline all share this code path) — a direct regression against the ≤2.5s LCP
acceptance criterion and against HERO-03 ("CLS-safe illustrated image slot").

The `next.config.ts` comment ("the only hero asset is an SVG, which next/image serves as-is
regardless of this config") is factually incorrect for this Next.js version and is the likely
reason this was never caught — it argued away the exact config flag that was needed. None of the
phase's tests catch this because `home.test.ts`/`OrderCta.test.ts` use `renderToStaticMarkup`
against source text only; nothing in the suite actually requests the rendered `<img>`'s `src`.

**Fix:** Either enable SVG optimization explicitly (simplest, matches the file's own stated intent
that this asset needs no raster pipeline):

```ts
// next.config.ts
images: {
  formats: ["image/avif", "image/webp"],
  dangerouslyAllowSVG: true,
  // Recommended alongside dangerouslyAllowSVG (Next.js docs): force the optimizer to serve
  // SVGs as attachments and apply a strict CSP to the /_next/image response itself, since SVG
  // can carry inline script.
  contentDispositionType: "attachment",
  contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
},
```

or, since a vector illustration gains nothing from `next/image`'s raster optimization anyway, skip
the optimizer for this asset entirely:

```tsx
// Hero.tsx
<Image
  src="/brand/hero-illustration.svg"
  alt={heroCopy.imageAlt}
  fill
  preload
  unoptimized
  sizes="(max-width: 640px) 90vw, 400px"
/>
```
Either way, correct the now-disproven `next.config.ts` comment, and add at least one test/manual
check that actually requests the rendered image URL (or runs `next build && next start` and curls
`/_next/image`) before this phase is signed off — this exact defect class is invisible to
source-text assertions.

## Warnings

### WR-01: WhatsApp CTA renders disabled with no explanation while iFood's identical state does

**File:** `src/components/home/CtaGroup.tsx:27-63`
**Issue:** `IFOOD_NOTICE_ID`/`describedBy` and the unavailability `<p>` are wired exclusively to
`ifood.confirmed`:

```tsx
<OrderCta
  link={ifood}
  ...
  describedBy={!ifood.confirmed ? IFOOD_NOTICE_ID : undefined}
/>
<OrderCta link={whatsapp} label={ctaCopy.whatsappLabel} tier="primary" />
...
{!ifood.confirmed && (
  <p id={IFOOD_NOTICE_ID} ...>{ctaCopy.ifoodUnavailableNotice}</p>
)}
```

`src/data/links.ts` currently has `whatsapp.confirmed: false` too, and `buildWhatsAppUrl()`
already returns a `pendingConfirmation` message for exactly this case
(`"Número oficial de WhatsApp da It's Garlic ainda não foi confirmado pelo cliente."`), but that
string is never rendered anywhere in the component tree — `IntegrationLink.pendingConfirmation`
is dead data for this CTA. The rendered result today is a WhatsApp button that appears disabled
with a bare "(em breve)" suffix and no adjacent explanation or `aria-describedby` link, directly
beside an iFood button that does explain itself. The file's own comment claims parity ("no
special-casing WhatsApp even though it is also a human support channel"), which this does not
achieve. WhatsApp is called out in the project brief as a primary support/order channel, so this
gap works directly against the "sem fricção" core value.

**Fix:** Either give WhatsApp its own notice/`describedBy` id mirroring the iFood pattern (reusing
`link.pendingConfirmation` instead of a second hardcoded copy string keeps both notices honest if
one integration confirms before the other):

```tsx
const WHATSAPP_NOTICE_ID = "whatsapp-unavailable-notice";
...
<OrderCta
  link={whatsapp}
  label={ctaCopy.whatsappLabel}
  tier="primary"
  describedBy={!whatsapp.confirmed ? WHATSAPP_NOTICE_ID : undefined}
/>
...
{!whatsapp.confirmed && whatsapp.pendingConfirmation && (
  <p id={WHATSAPP_NOTICE_ID} className="max-w-md text-center text-[length:var(--text-body-sm)] text-accent-coral">
    {whatsapp.pendingConfirmation}
  </p>
)}
```
or explicitly document/accept the asymmetry (e.g. because the FAQ already covers it) rather than
leaving it implicit and contradicted by the surrounding comment.

### WR-02: `hours.schedule` rows keyed on a non-unique field

**File:** `src/components/home/Location.tsx:75-79`
**Issue:** `key={row.days}` assumes `days` is unique within `store.hours.schedule`. Nothing in
`StoreInfo`'s schema enforces uniqueness of that field, so two rows sharing the same `days` string
(e.g. a future edit splitting one day into two time windows, "Sexta" lunch and "Sexta" dinner)
would silently collide on React key and risk incorrect reconciliation between renders.
**Fix:** Key on the row's index combined with content, or derive a composite key:
```tsx
{store.hours.schedule.map((row, index) => (
  <li key={`${row.days}-${index}`} ...>
```

## Info

### IN-01: Index used as React key over a content array

**File:** `src/components/home/BrandStory.tsx:24-28`
**Issue:** `brandStoryCopy.paragraphs.map((paragraph, index) => <p key={index}>...)` uses the
array index as key. Harmless today since the array is static and never reordered/filtered at
runtime, but it's a recognized anti-pattern that becomes a real bug the moment the copy module
grows a mechanism to reorder or conditionally omit paragraphs.
**Fix:** Key on the paragraph text itself (already guaranteed unique prose) instead of position:
```tsx
{brandStoryCopy.paragraphs.map((paragraph) => (
  <p key={paragraph} className="text-[length:var(--text-body)]">{paragraph}</p>
))}
```

### IN-02: `Hero.tsx`'s fixed `sizes` value drifts slightly from its actual container cap

**File:** `src/components/home/Hero.tsx:35-42`
**Issue:** The image container is `max-w-sm` (24rem = 384px), but `sizes` declares `400px` for the
`>640px` breakpoint. The 16px discrepancy is minor and won't visibly break anything, but it means
the browser may fetch a slightly larger image variant than the layout ever displays.
**Fix:** Align the `sizes` value with the actual Tailwind cap, e.g. `"(max-width: 640px) 90vw, 384px"`.

---

_Reviewed: 2026-09-13_
_Reviewer: Claude (gsd-code-reviewer)_
_Depth: standard_

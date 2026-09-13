# Phase 2: Hero, CTAs & Location - Pattern Map

**Mapped:** 2026-09-13
**Files analyzed:** 9 (7 new components/content files, 1 modified page, 1 modified config)
**Analogs found:** 9 / 9

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|--------------------|------|-----------|-----------------|----------------|
| `src/components/home/Hero.tsx` | component | request-response (static render) | `src/components/layout/Header.tsx` | role-match (image slot pattern) |
| `src/components/home/CtaGroup.tsx` | component | request-response | `src/app/page.tsx` (walking-skeleton CTA block) | exact |
| `src/components/home/OrderCta.tsx` | component | request-response | `src/app/page.tsx` (confirmed/disabled ternary) | exact |
| `src/components/home/ProvisionalBadge.tsx` | component | request-response | none direct — derive from `hours.provisional` convention in `src/lib/schemas/store.schema.ts` | role-match |
| `src/components/home/BrandStory.tsx` | component | request-response (static copy) | `src/components/layout/Footer.tsx` | role-match |
| `src/components/home/Location.tsx` | component | CRUD (read-only, repository) | `src/components/layout/Footer.tsx` | exact |
| `src/components/home/Faq.tsx` | component | request-response (native disclosure) | none in repo — new pattern (native `<details>`) | no analog |
| `src/content/home-copy.ts` | config/content | static data | `src/content/skeleton.ts` | role-match |
| `src/app/page.tsx` (rewrite) | route/page | request-response | itself (Phase 1 walking skeleton) — pattern to replace, not copy verbatim | exact (self) |
| `src/components/home/home.test.ts` | test | static-source-inspection | `src/components/layout/layout.test.ts` | exact |
| `src/components/home/OrderCta.test.ts` | test | fixture-prop unit test | `src/lib/integrations/integrations.test.ts` | role-match |

## Pattern Assignments

### `src/components/home/Hero.tsx` (component, static render)

**Analog:** `src/components/layout/Header.tsx` (full file read above)

**Imports pattern:**
```tsx
import Image from "next/image";
```

**Core image-slot pattern** (Header.tsx lines 16-23, adapt to `fill` + `aspect-square` per UI-SPEC/RESEARCH Pattern 3):
```tsx
<Image
  src="/brand/logo-principal.svg"
  alt="It's Garlic — mais que um pão de alho"
  width={160}
  height={160}
  priority
  className="h-14 w-14 sm:h-16 sm:w-16"
/>
```
Adapt for Hero to the `fill` + positioned-parent + `aspect-square` shape (UI-SPEC "Hero image container contract"):
```tsx
<div className="relative aspect-square w-full max-w-sm">
  <Image
    src="/brand/hero-illustration.svg"
    alt="Ilustração de alho em traço lima sobre fundo escuro"
    fill
    priority
    sizes="(max-width: 640px) 90vw, 400px"
  />
</div>
```
Note RESEARCH.md Pitfall #1 flags `preload` as the Next 16 replacement for `priority`, but rates that claim LOW-confidence (webfetch-sourced) and recommends re-confirming before committing — `Header.tsx`'s own working precedent uses `priority`. Default to matching the existing precedent (`priority`) unless the planner independently re-verifies `preload`.

**No hex literals rule:** `layout.test.ts` line 124-133 enforces "neither Header nor Footer contains a hex colour literal" — the same rule should extend to Hero (design tokens only, per D-03/CONTEXT.md).

**Comment-header convention for provisional assets** (apply to `public/brand/hero-illustration.svg`, matching the "ARQUIVO PROVISORIO" convention referenced for `logo-icone.svg`).

---

### `src/components/home/CtaGroup.tsx` + `OrderCta.tsx` (component, request-response)

**Analog:** `src/app/page.tsx` (current walking-skeleton, full file above) — this exact ternary is what must be extracted into a shared, reusable component per D-06/RESEARCH Pattern 2.

**Core confirmed/disabled pattern** (page.tsx lines 18-39):
```tsx
{ifood.confirmed ? (
  <a
    href={ifood.url}
    target="_blank"
    rel="noopener noreferrer"
    className="rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800"
  >
    Pedir no iFood
  </a>
) : (
  // CR-01: the iFood destination is not yet confirmed — render a visibly disabled
  // affordance instead of a live-looking link to a placeholder URL. A native disabled
  // <button> needs no client-side JS to be inert or announced correctly by assistive tech.
  <button
    type="button"
    disabled
    className="cursor-not-allowed rounded-full bg-zinc-300 px-6 py-3 text-base font-medium text-zinc-500"
  >
    Pedido pelo iFood em breve
  </button>
)}
```

**Refactor target (extract into `OrderCta.tsx`):**
```tsx
import type { IntegrationLink } from "@/lib/integrations/types";

export function OrderCta({ link, label }: { link: IntegrationLink; label: string }) {
  if (link.confirmed) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className="/* accent fill, per UI-SPEC */">
        {label}
      </a>
    );
  }
  return (
    <button type="button" disabled className="/* opacity-60, per UI-SPEC */">
      {label} (em breve)
    </button>
  );
}
```

**Colors:** replace the walking-skeleton's `bg-black`/`bg-zinc-300` literals with design tokens (`--color-accent` fill, `--color-surface-deep`/`--color-surface-primary` text — never white, per UI-SPEC's "CTA fill rule").

**Anti-pattern warning (RESEARCH Pitfall #5):** never use `aria-disabled` on an `<a href={link.url}>` — the native `disabled <button>` shown above is the established, tested precedent (this exact defect class was already fixed once, CR-01).

---

### `src/components/home/Location.tsx` (component, CRUD read-only)

**Analog:** `src/components/layout/Footer.tsx` (full file above) — near-identical shape: reads `getStoreInfo()` once, renders address fields, calls one integration builder.

**Imports pattern** (Footer.tsx lines 7-8):
```tsx
import { getStoreInfo } from "@/lib/repositories/store-repository";
import { buildInstagramUrl } from "@/lib/integrations/instagram";
```
For Location, follow RESEARCH Pattern 1 instead — accept `store`/`maps` as **props** from `page.tsx` (not self-fetch), so hours/confirmed branches are unit-testable with fixtures:
```tsx
import type { StoreInfo } from "@/lib/schemas/store.schema";
import type { IntegrationLink } from "@/lib/integrations/types";

export function Location({ store, maps }: { store: StoreInfo; maps: IntegrationLink }) {
  /* ... */
}
```

**Address rendering pattern** (Footer.tsx lines 18-20, reuse verbatim):
```tsx
<p className="text-sm">
  {store.address} — {store.neighborhood}, {store.city} - {store.state}
</p>
```

**Modalities chip-row pattern** (RESEARCH.md Code Examples, sourced from `storeInfoSchema.modalities`, `src/lib/schemas/store.schema.ts:11`):
```tsx
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

**Hours provisional-notice pattern** (RESEARCH.md, D-07):
```tsx
{store.hours.schedule.length === 0 && (
  <div>
    <ProvisionalBadge />
    <h3>Horário de funcionamento</h3>
    <p>Em atualização — confirme no iFood ou no WhatsApp antes de vir.</p>
  </div>
)}
```

**External-link anchor pattern** (Footer.tsx lines 21-27, reuse verbatim shape for the "Como chegar" Maps CTA):
```tsx
<a
  href={maps.url}
  target="_blank"
  rel="noopener noreferrer"
  className="text-sm text-accent underline decoration-accent underline-offset-4 hover:text-text-on-dark"
>
  Como chegar
</a>
```
(Maps is `confirmed: true` today per `src/lib/integrations/maps.ts` — no disabled branch needed here, unlike OrderCta.)

---

### `src/components/home/BrandStory.tsx` / `Faq.tsx` (component, static copy)

**Analog:** `src/components/layout/Footer.tsx` for container/section shape (`bg-surface-primary text-text-on-dark`, `mx-auto max-w-5xl px-4 py-8 sm:px-6` wrapper).

**Faq.tsx has no direct in-repo analog** — RESEARCH.md and UI-SPEC both specify native `<details>/<summary>`, zero client JS, first accordion-shaped UI in the project. Use the shape:
```tsx
<details>
  <summary>{question}</summary>
  <p>{answer}</p>
</details>
```
No "use client" needed (Server Component compatible).

---

### `src/content/home-copy.ts` (content/config, static data)

**Analog:** `src/content/skeleton.ts` (full file read above) — same typed-export convention (`export const X: readonly T[] = [...]`), same "confirmed/pendingConfirmation" vocabulary reused from `store.schema.ts`, same header-comment style explaining provenance/source-of-truth.

```ts
// Mirrors the `confirmed` / `pendingConfirmation` marker convention already established by
// src/lib/schemas/store.schema.ts rather than inventing a second vocabulary.
export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}
export const faqs: readonly FaqEntry[] = [ /* ... */ ];
```

---

### `src/app/page.tsx` (rewrite, request-response)

**Analog:** itself (current walking skeleton, full file above) — the pattern to **replace**, not extend. Compose the five section components in D-01's fixed order, fetching data once and passing typed props down (RESEARCH.md Pattern 1):
```tsx
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
Note: keep the "no second `<main>`" comment from the current file — `src/app/layout.tsx` already renders the single `<main id="main-content">` landmark; the new sections are plain `<section>`s, not a wrapping `<div>` with its own semantics.

---

### `src/components/home/home.test.ts` (test, static-source-inspection)

**Analog:** `src/components/layout/layout.test.ts` (full file above) — copy the exact test style: `readFileSync` + regex assertions against source text, `describe`/`test` blocks per component, no DOM/jsdom.

**Read-file helper** (layout.test.ts lines 5-13, reuse verbatim):
```ts
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = process.cwd();
function read(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}
```

**No-hardcoded-URL / no-hex-literal guard pattern** (layout.test.ts lines 113-133, extend to `home/` components):
```ts
test("Footer reads store facts and the Instagram link only through the repository/integration seams", () => {
  expect(footer).toMatch(/getStoreInfo/);
  expect(footer).toMatch(/buildInstagramUrl/);
  expect(footer).not.toMatch(/Jos[eé] Bonif[aá]cio/);
  expect(footer).not.toMatch(/https:\/\//);
});
test("neither Header nor Footer contains a hex colour literal", () => {
  expect(content).not.toMatch(/#[0-9a-fA-F]{6}/);
});
```
Apply the same two guards to every new `home/` component (RESEARCH.md's ARQ-02 lint-boundary threat pattern).

---

### `src/components/home/OrderCta.test.ts` (test, fixture-prop unit test)

**Analog:** `src/lib/integrations/integrations.test.ts` (excerpt above) — same `describe`/`test` + `expect` shape, but exercising a component with fixture props instead of a builder function:
```ts
test("an unconfirmed record's builder signals confirmed: false with a pending explanation", () => {
  const ifood = buildIFoodUrl();
  expect(ifood.confirmed).toBe(false);
  expect(ifood.pendingConfirmation).toBeTruthy();
});
```
For `OrderCta`, since there's no DOM renderer available (node environment, no RTL — see RESEARCH.md Alternatives Considered), test the **source text** of `OrderCta.tsx` with fixture-shaped assertions, or test via `home.test.ts`'s static-source-inspection style checking both the `confirmed`/disabled branches exist and reference `IntegrationLink`.

## Shared Patterns

### Data access boundary (ARQ-02)
**Source:** `src/lib/repositories/store-repository.ts`, `src/lib/integrations/{ifood,maps,whatsapp,instagram}.ts`
**Apply to:** every new `home/` component — never import `src/data/*.ts` directly, never construct a URL literal; always call `getStoreInfo()` / `build*Url()`.
```ts
import { getStoreInfo } from "@/lib/repositories/store-repository";
export function getStoreInfo() {
  return storeInfoSchema.parse(rawStore); // .parse, not .safeParse — malformed data must fail the build
}
```

### `IntegrationLink` confirmed/disabled contract
**Source:** `src/lib/integrations/types.ts` (full file above)
**Apply to:** `OrderCta.tsx`, `CtaGroup.tsx`, `Location.tsx`'s Maps CTA
```ts
export interface IntegrationLink {
  url: string;
  confirmed: boolean;
  pendingConfirmation?: string;
}
```

### Native-disabled-button pattern (never `aria-disabled` on a live `href`)
**Source:** `src/app/page.tsx` (current walking skeleton), reinforced by RESEARCH.md Pitfall #5 / CR-01
**Apply to:** `OrderCta.tsx` — this is the exact defect class already fixed once in this codebase; do not regress it.

### Section container shape (dark surface + max-width wrapper)
**Source:** `src/components/layout/Footer.tsx` lines 15-16
**Apply to:** `BrandStory.tsx`, `Location.tsx`, `Faq.tsx` (alternating `surface-deep`/`surface-primary` backgrounds per UI-SPEC Color table)
```tsx
<div className="bg-surface-primary text-text-on-dark">
  <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:px-6">
```

### Design-tokens-only rule (no hex literals)
**Source:** `layout.test.ts` lines 124-133
**Apply to:** all new `home/` components — enforced by extending the same test guard.

## No Analog Found

| File | Role | Data Flow | Reason |
|------|------|-----------|--------|
| `src/components/home/Faq.tsx` | component | event-driven (native disclosure) | First accordion-shaped UI in the project — no existing `<details>/<summary>` usage anywhere in the repo. Use RESEARCH.md's Don't-Hand-Roll guidance (native element, zero JS) directly; no in-repo precedent to copy from. |
| `src/components/home/ProvisionalBadge.tsx` | component | static render | No standalone badge component exists yet — closest precedent is the *convention* (`hours.provisional`/`pendingConfirmation` fields in `store.schema.ts`), not a component. Derive markup fresh per UI-SPEC's Oliva-color badge spec. |

## Metadata

**Analog search scope:** `src/app/page.tsx`, `src/components/layout/`, `src/lib/integrations/`, `src/lib/repositories/`, `src/lib/schemas/`, `src/content/`
**Files scanned:** 12 (Header.tsx, Footer.tsx, page.tsx, layout.test.ts, types.ts, ifood.ts, maps.ts, integrations.test.ts, store-repository.ts, store.schema.ts, skeleton.ts, tone-of-voice.md referenced not re-read)
**Pattern extraction date:** 2026-09-13

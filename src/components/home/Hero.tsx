// HERO-01/HERO-03, D-01a — the above-the-fold hero: the brand concept as real document text on
// the brand's deep surface (UI-SPEC Color table), then the two order CTAs (G-02-2 — moved inside
// the hero, between the subhead and the illustration, so both sit above the fold at the
// 375x667/390x844 mobile targets — see .planning/debug/DEBUG-cta-row-stacked-below-fold.md),
// then the CLS-safe 1:1 illustrated image slot (D-03/D-04) that becomes a one-file swap once the
// client supplies real product photography. Stays a Server Component: no client directive, no
// hooks, and no read of the current time anywhere — the time-aware journey is Phase 4's,
// isolated in its own client island, not here.
import Image from "next/image";
import type { IntegrationLink } from "@/lib/integrations/types";
import { heroCopy } from "@/content/home-copy";
import { OrderCtaRow } from "./OrderCtaRow";
import { ProvisionalBadge } from "./ProvisionalBadge";

export function Hero({
  ifood,
  whatsapp,
}: {
  ifood: IntegrationLink;
  whatsapp: IntegrationLink;
}) {
  return (
    <section className="bg-surface-deep text-text-on-dark">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 py-12 text-center sm:px-6 sm:py-16">
        {/* Kicker: the locked brand concept line, styled like Footer.tsx's store-name line
            (font-display, uppercase, accent colour) — the hero's central visual anchor is the
            illustration below, per UI-SPEC's focal-point statement, so the concept line and
            headline sit above it as real document text a crawler/screen reader/text-only reader
            can all read — this is what HERO-01 actually asserts. */}
        <p className="font-display text-lg tracking-wide text-accent uppercase">
          {heroCopy.kicker}
        </p>
        <h1 className="text-[length:var(--text-heading-1)] font-display leading-tight">
          {heroCopy.headline}
        </h1>
        <p className="max-w-md text-[length:var(--text-body)] font-body">{heroCopy.subhead}</p>

        {/* D-01a/G-02-2: the two order CTAs render here, between the subhead and the
            illustration, so INTEGRA-01's fold criterion is reachable at 375x667/390x844. */}
        <OrderCtaRow ifood={ifood} whatsapp={whatsapp} />

        {/* Hero image container contract (UI-SPEC, D-04): a positioned parent carrying a fixed
            1:1 aspect ratio and a fluid width, `next/image` inside it using `fill` so the layout
            box is reserved before any load (CLS-safety). Swapping this file at the same path is
            the only step needed once the client's real product photo arrives — no container or
            CSS change. `preload`, not `priority`: Next.js 16 deprecated `priority` in favour of
            `preload` (confirmed against the installed package's own
            node_modules/next/dist/shared/lib/get-img-props.d.ts this session — see
            02-01-PLAN.md assumption A-02; do not copy Header.tsx's deprecated prop name). */}
        <div className="relative aspect-square w-full max-w-sm">
          <Image
            src="/brand/hero-illustration.svg"
            alt={heroCopy.imageAlt}
            fill
            preload
            sizes="(max-width: 640px) 90vw, 400px"
          />
        </div>

        {/* T-02-03: the disclosure renders adjacent to the image, visible without interaction,
            so nobody could mistake the illustration for real product photography. */}
        <div className="flex flex-col items-center gap-1">
          <ProvisionalBadge />
          <p className="text-[length:var(--text-body-sm)] font-body font-semibold text-accent-olive">
            {heroCopy.imageDisclosure}
          </p>
        </div>
      </div>
    </section>
  );
}

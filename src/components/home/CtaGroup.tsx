// HERO-02, D-01a (G-02-2) — the secondary and tertiary CTAs that follow the hero: "Ver cardápio"
// (pending, no destination yet — Phase 3) and "Como chegar" (LOCAL-04, a live confirmed Maps
// link). The order CTAs (iFood, WhatsApp) and their coral unavailability notices now render
// inside Hero instead of here — see OrderCtaRow.tsx and Hero.tsx.
import type { IntegrationLink } from "@/lib/integrations/types";
import { ctaCopy } from "@/content/home-copy";
import { PendingCta } from "./OrderCta";

export function CtaGroup({ maps }: { maps: IntegrationLink }) {
  return (
    <section className="bg-surface-deep text-text-on-dark">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:px-6">
        {/* A-01: "Ver cardápio" has no destination this phase (Phase 3 ships /cardapio) — it
            renders through the same inert pending treatment as the order CTAs, rather than a
            live-looking link to a route that does not exist yet (the same defect class D-05
            forbids for the order CTAs). Phase 3 flips this to a live OrderCta-style anchor by
            changing this one call site. */}
        <PendingCta label={ctaCopy.menuLabel} tier="secondary" />

        {/* LOCAL-04: buildMapsUrl() reports confirmed: true today — a live anchor, no pending
            branch needed here, reusing Footer.tsx's external-anchor shape. */}
        <a
          href={maps.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-[length:var(--text-body)] text-accent underline decoration-accent underline-offset-4 hover:text-text-on-dark"
        >
          {ctaCopy.mapsLabel}
        </a>
      </div>
    </section>
  );
}

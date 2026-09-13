// HERO-02/INTEGRA-01/02/03 — the CTA row rendered directly below the hero: the three locked
// labels (HERO-02) plus the WhatsApp CTA (INTEGRA-02) and the INTEGRA-03 unavailability notice.
// Rendered on the deep surface, because the notice below is coral and the brand guide's contrast
// table records coral as non-compliant against the charcoal surface.
import type { IntegrationLink } from "@/lib/integrations/types";
import { ctaCopy } from "@/content/home-copy";
import { OrderCta, PendingCta } from "./OrderCta";

const IFOOD_NOTICE_ID = "ifood-unavailable-notice";
const WHATSAPP_NOTICE_ID = "whatsapp-unavailable-notice";

export function CtaGroup({
  ifood,
  whatsapp,
  maps,
}: {
  ifood: IntegrationLink;
  whatsapp: IntegrationLink;
  maps: IntegrationLink;
}) {
  return (
    <section className="bg-surface-deep text-text-on-dark">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 px-4 py-8 sm:px-6">
        {/* "Pedir no iFood" is the visually primary CTA (INTEGRA-01); the WhatsApp CTA gets the
            identical primary-tier treatment (D-06) — no special-casing WhatsApp even though it
            is also a human support channel. */}
        <div className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <OrderCta
            link={ifood}
            label={ctaCopy.ifoodLabel}
            tier="primary"
            describedBy={!ifood.confirmed ? IFOOD_NOTICE_ID : undefined}
          />
          <OrderCta
            link={whatsapp}
            label={ctaCopy.whatsappLabel}
            tier="primary"
            describedBy={!whatsapp.confirmed ? WHATSAPP_NOTICE_ID : undefined}
          />
        </div>

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

        {/* INTEGRA-03: explains the real situation and points at the one action that genuinely
            works right now (directions) — never swaps in another live order channel. WhatsApp
            gets the identical treatment (02-REVIEW.md WR-01): it is unconfirmed exactly like
            iFood (src/data/links.ts), so it needs the same explained-disabled notice rather than
            silently rendering disabled next to a button that explains itself. */}
        {!ifood.confirmed && (
          <p
            id={IFOOD_NOTICE_ID}
            className="max-w-md text-center text-[length:var(--text-body-sm)] text-accent-coral"
          >
            {ctaCopy.ifoodUnavailableNotice}
          </p>
        )}
        {!whatsapp.confirmed && (
          <p
            id={WHATSAPP_NOTICE_ID}
            className="max-w-md text-center text-[length:var(--text-body-sm)] text-accent-coral"
          >
            {ctaCopy.whatsappUnavailableNotice}
          </p>
        )}
      </div>
    </section>
  );
}

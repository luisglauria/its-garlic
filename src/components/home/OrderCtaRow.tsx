// HERO-02/INTEGRA-01/02/03, D-01a (G-02-2) — the two order CTAs (iFood, WhatsApp) as a single
// reusable row, composed by Hero.tsx directly above the illustration so both actions sit above
// the fold at the 375x667/390x844 mobile targets (INTEGRA-01's fold criterion —
// .planning/debug/DEBUG-cta-row-stacked-below-fold.md). Owns the two coral unavailability
// notices too — moved here verbatim from CtaGroup.tsx, so the INTEGRA-03 behaviour UAT already
// passed on does not change, only where it renders.
import type { IntegrationLink } from "@/lib/integrations/types";
import { ctaCopy } from "@/content/home-copy";
import { OrderCta } from "./OrderCta";

const IFOOD_NOTICE_ID = "ifood-unavailable-notice";
const WHATSAPP_NOTICE_ID = "whatsapp-unavailable-notice";

// Two-column grid at the mobile base, no responsive prefix on the column count (G-02-2's direct
// fix — the previous `flex-col sm:flex-row` only switched to a row at 640px, 250px wider than
// the wider of the two target viewports). A grid track is `minmax(0, 1fr)` in this framework
// version, so the tracks cannot be pushed wider than the row by their content the way flex items
// with an auto minimum can. Exported so hero-fold.test.ts measures this real string instead of
// parsing JSX, and so a future edit here is what the guard actually re-checks.
export const ORDER_ROW_CLASS = "grid w-full grid-cols-2 gap-3";

export function OrderCtaRow({
  ifood,
  whatsapp,
}: {
  ifood: IntegrationLink;
  whatsapp: IntegrationLink;
}) {
  return (
    <div className="flex w-full flex-col items-center gap-3">
      {/* "Pedir no iFood" is the visually primary CTA (INTEGRA-01); the WhatsApp CTA gets the
          identical primary-tier treatment (D-06) — no special-casing WhatsApp even though it is
          also a human support channel. */}
      <div className={ORDER_ROW_CLASS}>
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

      {/* INTEGRA-03: explains the real situation and points at the one action that genuinely
          works right now (directions) — never swaps in another live order channel. WhatsApp gets
          the identical treatment (02-REVIEW.md WR-01): it is unconfirmed exactly like iFood
          (src/data/links.ts), so it needs the same explained-disabled notice rather than
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
  );
}

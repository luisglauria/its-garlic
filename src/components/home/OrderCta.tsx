// INTEGRA-01/02/03 — the one shared CTA primitive both order actions render through (D-06): a
// live anchor when `link.confirmed` is true, a native disabled <button> otherwise. A native
// disabled button needs no client-side JavaScript to be inert and is announced correctly by
// assistive technology with no extra wiring — this codebase already shipped and fixed the
// aria-disabled-on-a-live-href defect once (CR-01); OrderCta does not regress it. `link` is
// typed `IntegrationLink`, so the confirmed gate is a type-level contract, not a convention a
// caller could accidentally skip by passing a bare url string.
import type { IntegrationLink } from "@/lib/integrations/types";
import { ctaCopy } from "@/content/home-copy";

type Tier = "primary" | "secondary";

// 44px minimum touch target (UI-SPEC Spacing Scale exception, WCAG 2.5.5) via `min-h-11`
// (2.75rem = 44px). Primary tier: accent fill with deep-surface text — never white, per the
// brand guide's CTA fill rule. Secondary tier: accent-outline with accent text. Label size
// (14px/600, UI-SPEC Typography role) and one spacing-scale step down on horizontal padding
// (`px-6` → `px-4`, G-02-2) bring the button's horizontal cost down enough to fit two-up at
// 343px of mobile content width — hero-fold.test.ts measures the real numbers below rather than
// asserting a hardcoded conclusion. `w-full` + `text-center` let a button fill its grid track
// (OrderCtaRow) and centre a wrapped label; no utility here may suppress wrapping, since a
// narrow track plus a non-wrapping label is exactly the overflow failure mode the debug session
// (.planning/debug/DEBUG-cta-row-stacked-below-fold.md) warned about. Exported so both
// OrderCtaRow.tsx's tests and hero-fold.test.ts assert against the real class string.
export const TIER_CLASS: Record<Tier, string> = {
  primary:
    "inline-flex w-full min-h-11 items-center justify-center rounded-full bg-accent px-4 py-3 text-center text-[length:var(--text-body-sm)] font-semibold text-surface-deep",
  secondary:
    "inline-flex w-full min-h-11 items-center justify-center rounded-full border-2 border-accent px-4 py-3 text-center text-[length:var(--text-body-sm)] font-semibold text-accent",
};

export function PendingCta({
  label,
  tier = "primary",
  describedBy,
}: {
  label: string;
  tier?: Tier;
  describedBy?: string;
}) {
  return (
    <button
      type="button"
      disabled
      aria-describedby={describedBy}
      className={`${TIER_CLASS[tier]} cursor-not-allowed opacity-60`}
    >
      {/* G-02-2/UI-SPEC amendment: the label and the "(em breve)" suffix render as two lines
          inside the same button, instead of one inline string — this is what lets the label fit
          the narrow two-column track (see OrderCtaRow). Both lines stay inside the one control,
          so the accessible name still reads as the label followed by the suffix (D-05
          unchanged). */}
      <span className="flex flex-col leading-tight">
        <span>{label}</span>
        <span className="font-normal">{ctaCopy.pendingSuffix}</span>
      </span>
    </button>
  );
}

export function OrderCta({
  link,
  label,
  tier = "primary",
  describedBy,
}: {
  link: IntegrationLink;
  label: string;
  tier?: Tier;
  describedBy?: string;
}) {
  if (link.confirmed) {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" className={TIER_CLASS[tier]}>
        {label}
      </a>
    );
  }
  // D-05/CR-01: an unconfirmed destination never reaches a real href — delegate to PendingCta's
  // native disabled <button> instead of an `aria-disabled` hint on a still-navigable anchor.
  return <PendingCta label={label} tier={tier} describedBy={describedBy} />;
}

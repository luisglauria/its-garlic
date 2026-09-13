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
// brand guide's CTA fill rule. Secondary tier: accent-outline with accent text.
const TIER_CLASS: Record<Tier, string> = {
  primary:
    "inline-flex min-h-11 items-center justify-center rounded-full bg-accent px-6 py-3 text-[length:var(--text-body)] font-semibold text-surface-deep",
  secondary:
    "inline-flex min-h-11 items-center justify-center rounded-full border-2 border-accent px-6 py-3 text-[length:var(--text-body)] font-semibold text-accent",
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
      {label} {ctaCopy.pendingSuffix}
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

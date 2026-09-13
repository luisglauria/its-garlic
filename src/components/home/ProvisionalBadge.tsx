// D-03/D-07 — the one shared "provisório" marker, reused by the hero's image disclosure (this
// plan) and by plan 02-02's hours notice. Sets its own deep-surface background rather than
// inheriting the caller's: docs/brand-guidelines.md's contrast table records olive text as
// compliant against the deep surface (~5,1:1, AA) and non-compliant against the charcoal one
// (~3,7:1) — a badge that inherited whatever background it landed on would silently become
// unreadable once reused inside plan 02-02's charcoal Location section.
import { provisionalBadgeLabel } from "@/content/home-copy";

export function ProvisionalBadge({ label = provisionalBadgeLabel }: { label?: string }) {
  return (
    <span className="inline-flex w-fit items-center rounded-full bg-surface-deep px-3 py-1 text-[length:var(--text-body-sm)] font-body font-semibold text-accent-olive">
      {label}
    </span>
  );
}

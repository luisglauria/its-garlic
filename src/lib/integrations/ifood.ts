// Source: RESEARCH.md Pattern 2 (ARQ-02 seam 2) — the only integration module Task 1 needs;
// whatsapp/instagram/maps land in Task 2.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";
import type { IntegrationLink } from "./types";

// Returns `confirmed`/`pendingConfirmation` alongside the URL (01-REVIEW.md CR-01) so
// src/app/page.tsx can render a disabled "em breve" state instead of a live, unlabeled CTA
// pointed at the placeholder path in src/data/links.ts.
export function buildIFoodUrl(): IntegrationLink {
  const record = externalLinks.find((link) => link.id === "ifood");
  if (!record) {
    throw new Error("Missing 'ifood' record in external links data");
  }
  return {
    url: assertAllowedHost(record.url),
    confirmed: record.confirmed,
    pendingConfirmation: record.pendingConfirmation,
  };
}

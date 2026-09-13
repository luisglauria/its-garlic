// Source: RESEARCH.md Pattern 2 (whatsapp.ts template), same shape as ifood.ts.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";
import type { IntegrationLink } from "./types";

// Returns `confirmed`/`pendingConfirmation` alongside the URL (01-REVIEW.md CR-01) — see
// ifood.ts for the rationale; callers must gate any rendered CTA on `confirmed`.
export function buildWhatsAppUrl(message?: string): IntegrationLink {
  const record = externalLinks.find((link) => link.id === "whatsapp");
  if (!record) {
    throw new Error("Missing 'whatsapp' record in external links data");
  }
  // An unencoded message is how a stray "&" silently truncates the prefilled text.
  const url = message
    ? `${record.url}?text=${encodeURIComponent(message)}`
    : record.url;
  return {
    url: assertAllowedHost(url),
    confirmed: record.confirmed,
    pendingConfirmation: record.pendingConfirmation,
  };
}

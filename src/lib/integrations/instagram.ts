// Source: RESEARCH.md Pattern 2, same shape as ifood.ts.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";
import type { IntegrationLink } from "./types";

// Returns `confirmed`/`pendingConfirmation` alongside the URL (01-REVIEW.md CR-01) — see
// ifood.ts for the rationale; callers must gate any rendered CTA on `confirmed`.
export function buildInstagramUrl(): IntegrationLink {
  const record = externalLinks.find((link) => link.id === "instagram");
  if (!record) {
    throw new Error("Missing 'instagram' record in external links data");
  }
  return {
    url: assertAllowedHost(record.url),
    confirmed: record.confirmed,
    pendingConfirmation: record.pendingConfirmation,
  };
}

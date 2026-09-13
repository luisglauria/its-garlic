// Source: RESEARCH.md Pattern 2, same shape as ifood.ts.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";

export function buildInstagramUrl(): string {
  const record = externalLinks.find((link) => link.id === "instagram");
  if (!record) {
    throw new Error("Missing 'instagram' record in external links data");
  }
  return assertAllowedHost(record.url);
}

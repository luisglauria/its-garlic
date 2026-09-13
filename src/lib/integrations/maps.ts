// Source: RESEARCH.md Pattern 2, same shape as ifood.ts.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";

export function buildMapsUrl(): string {
  const record = externalLinks.find((link) => link.id === "maps");
  if (!record) {
    throw new Error("Missing 'maps' record in external links data");
  }
  return assertAllowedHost(record.url);
}

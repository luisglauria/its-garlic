// Source: RESEARCH.md Pattern 2 (ARQ-02 seam 2) — the only integration module Task 1 needs;
// whatsapp/instagram/maps land in Task 2.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";

export function buildIFoodUrl(): string {
  const record = externalLinks.find((link) => link.id === "ifood");
  if (!record) {
    throw new Error("Missing 'ifood' record in external links data");
  }
  return assertAllowedHost(record.url);
}

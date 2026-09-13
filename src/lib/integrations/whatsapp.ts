// Source: RESEARCH.md Pattern 2 (whatsapp.ts template), same shape as ifood.ts.
import { assertAllowedHost } from "./allowlist";
import externalLinks from "@/data/links";

export function buildWhatsAppUrl(message?: string): string {
  const record = externalLinks.find((link) => link.id === "whatsapp");
  if (!record) {
    throw new Error("Missing 'whatsapp' record in external links data");
  }
  // An unencoded message is how a stray "&" silently truncates the prefilled text.
  const url = message
    ? `${record.url}?text=${encodeURIComponent(message)}`
    : record.url;
  return assertAllowedHost(url);
}

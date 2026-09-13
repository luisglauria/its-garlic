// Shared return shape for integration builders (01-REVIEW.md CR-01 fix). Before this type
// existed, every builder (ifood/whatsapp/instagram/maps) returned a bare `string`, so a caller
// had no way to tell an unconfirmed placeholder URL (src/data/links.ts, `confirmed: false`) from
// a real, click-ready destination — the site rendered a live-looking CTA that 404s. Builders now
// surface `confirmed` (and, when false, `pendingConfirmation`) so the render layer can gate the
// CTA instead of silently shipping a broken link.
export interface IntegrationLink {
  url: string;
  confirmed: boolean;
  pendingConfirmation?: string;
}

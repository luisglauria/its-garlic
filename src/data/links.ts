// External destinations per REQUIREMENTS.md bloco 5. Instagram and Maps resolve to the real,
// confirmed destinations (PROJECT.md Business Context). iFood and WhatsApp are unconfirmed:
// the hostname is a real official host (so the allowlist guard exercises correctly), but the
// path segment is the deliberately-invalid placeholder token so a real click-test fails loudly
// rather than silently shipping a guessed store slug or phone number.
import type { ExternalLink } from "@/lib/schemas/link.schema";

const externalLinks: ExternalLink[] = [
  {
    id: "ifood",
    url: "https://www.ifood.com.br/PLACEHOLDER_PENDING_CLIENT_CONFIRMATION",
    confirmed: false,
    pendingConfirmation:
      "URL real da loja da It's Garlic no iFood ainda não foi confirmada pelo cliente.",
  },
  {
    id: "whatsapp",
    url: "https://wa.me/PLACEHOLDER_PENDING_CLIENT_CONFIRMATION",
    confirmed: false,
    pendingConfirmation:
      "Número oficial de WhatsApp da It's Garlic ainda não foi confirmado pelo cliente.",
  },
  {
    id: "instagram",
    url: "https://www.instagram.com/itsgarlicrecife",
    confirmed: true,
  },
  {
    id: "maps",
    url: "https://www.google.com/maps/search/?api=1&query=Rua+Jos%C3%A9+Bonif%C3%A1cio%2C+747%2C+Mercado+da+Torre%2C+Recife-PE",
    confirmed: true,
  },
];

export default externalLinks;

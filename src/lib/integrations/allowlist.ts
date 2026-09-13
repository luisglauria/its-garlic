// Source: RESEARCH.md Pattern 2 — the single outbound-destination guard (SEC-03).
// Hostnames confirmed against the actual destinations once the client provides them
// (see RESEARCH.md Open Questions — iFood store URL / WhatsApp number are both pending
// confirmation).
export const ALLOWED_HOSTS = [
  "ifood.com.br",
  "www.ifood.com.br",
  "wa.me",
  "api.whatsapp.com",
  "instagram.com",
  "www.instagram.com",
  "google.com",
  "www.google.com",
  "maps.app.goo.gl",
] as const;

export function assertAllowedHost(url: string): string {
  const { hostname } = new URL(url);
  // Exact equality is load-bearing: `endsWith`/`includes` would accept a look-alike host
  // that merely suffixes or embeds an allowed domain (SEC-03).
  if (!ALLOWED_HOSTS.includes(hostname as (typeof ALLOWED_HOSTS)[number])) {
    throw new Error(`Blocked outbound host not on allowlist: ${hostname}`);
  }
  return url;
}

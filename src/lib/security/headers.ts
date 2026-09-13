// SEC-07 — the single source of the response header set (production and development), extracted
// out of `next.config.ts` so the Content-Security-Policy is unit-testable: a policy defined
// inline in the config file cannot be tested, and SEC-07 is the requirement most likely to be
// silently wrong.
//
// Source: RESEARCH.md Pattern 3 / PATTERNS.md `next.config.ts` template — the official Next.js
// "Without Nonces" CSP example, extended only for `next/image`'s `blob:`/`data:` usage.
//
// No third-party host is added to any directive (RESEARCH.md Pattern 3): LOCAL-01 rules out an
// embedded map, MARCA-05's note rules out a live Instagram feed, and every remaining external
// interaction (iFood/WhatsApp/Instagram/Maps) is a plain outbound `<a target="_blank">` link,
// which no CSP directive governs. Adding hosts speculatively widens the policy for no benefit.
//
// No nonce-based policy is used either: nonces force every route into per-request dynamic
// rendering, which kills static generation for a site with no per-user state, and a documented
// framework issue lets a re-render inherit another requester's header on some hosts.
export type SecurityHeaderMode = "development" | "production";

export function buildCsp(mode: SecurityHeaderMode): string {
  const isDev = mode === "development";
  // The `mode` parameter exists for exactly one reason: the dev server needs script evaluation
  // permitted, and production must not have it. Branch on `mode` only inside `script-src`.
  const csp = `
    default-src 'self';
    script-src 'self'${isDev ? " 'unsafe-eval'" : ""};
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data:;
    font-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `;
  // A multi-line header value is rejected by HTTP — strip every newline before returning.
  return csp.replace(/\n/g, "").trim();
}

export function securityHeaders(mode: SecurityHeaderMode): { key: string; value: string }[] {
  return [
    { key: "Content-Security-Policy", value: buildCsp(mode) },
    { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
    { key: "X-Content-Type-Options", value: "nosniff" },
    { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
    { key: "X-Frame-Options", value: "DENY" },
  ];
}

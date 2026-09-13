// SEC-07 — automated assertions over the production and development security-header policies.
// Source: PLAN.md 01-04 Task 1 <behavior>; template pattern per PATTERNS.md `next.config.ts`.
import { describe, expect, test } from "vitest";
import { buildCsp, securityHeaders } from "./headers";

const REQUIRED_DIRECTIVES = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src",
  "img-src",
  "font-src",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
];

// Names of destinations reached only via plain outbound <a target="_blank"> links (RESEARCH.md
// Pattern 3) — none of them belongs in a CSP directive because the MVP embeds nothing.
const THIRD_PARTY_HOSTS = ["ifood", "whatsapp", "wa.me", "instagram", "googleapis", "google.com"];

describe("buildCsp", () => {
  test("production policy contains all ten required directives", () => {
    const csp = buildCsp("production");
    for (const directive of REQUIRED_DIRECTIVES) {
      expect(csp).toContain(directive);
    }
  });

  test("production policy contains no newline characters", () => {
    expect(buildCsp("production")).not.toMatch(/\n/);
  });

  test("development policy contains no newline characters", () => {
    expect(buildCsp("development")).not.toMatch(/\n/);
  });

  test("production script-src omits both script-relaxation keywords", () => {
    const csp = buildCsp("production");
    const scriptSrc = csp.match(/script-src[^;]*/)?.[0] ?? "";
    expect(scriptSrc).not.toContain("unsafe-eval");
    expect(scriptSrc).not.toContain("unsafe-inline");
  });

  test("development script-src contains the eval keyword", () => {
    const csp = buildCsp("development");
    const scriptSrc = csp.match(/script-src[^;]*/)?.[0] ?? "";
    expect(scriptSrc).toContain("unsafe-eval");
  });

  test("development and production policies differ only in the script-src directive", () => {
    const prod = buildCsp("production");
    const dev = buildCsp("development");
    const prodNormalized = prod.replace(/script-src[^;]*;/, "SCRIPT_SRC;");
    const devNormalized = dev.replace(/script-src[^;]*;/, "SCRIPT_SRC;");
    expect(devNormalized).toBe(prodNormalized);
    expect(dev).not.toBe(prod);
  });

  test("policy names no third-party hostname in either mode", () => {
    const combined = (buildCsp("production") + buildCsp("development")).toLowerCase();
    for (const host of THIRD_PARTY_HOSTS) {
      expect(combined).not.toContain(host);
    }
  });
});

describe("securityHeaders", () => {
  test("production headers include all five required keys with no duplicates", () => {
    const headers = securityHeaders("production");
    const keys = headers.map((h) => h.key);
    const requiredKeys = [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "X-Frame-Options",
    ];
    for (const key of requiredKeys) {
      expect(keys).toContain(key);
    }
    expect(new Set(keys).size).toBe(keys.length);
  });

  test("Strict-Transport-Security has a max-age of at least one year, includeSubDomains, and preload", () => {
    const headers = securityHeaders("production");
    const hsts = headers.find((h) => h.key === "Strict-Transport-Security")?.value ?? "";
    const maxAgeMatch = hsts.match(/max-age=(\d+)/);
    expect(maxAgeMatch).not.toBeNull();
    expect(Number(maxAgeMatch?.[1])).toBeGreaterThanOrEqual(31536000);
    expect(hsts).toContain("includeSubDomains");
    expect(hsts).toContain("preload");
  });

  test("X-Content-Type-Options is exactly nosniff", () => {
    const headers = securityHeaders("production");
    expect(headers.find((h) => h.key === "X-Content-Type-Options")?.value).toBe("nosniff");
  });

  test("Referrer-Policy is exactly strict-origin-when-cross-origin", () => {
    const headers = securityHeaders("production");
    expect(headers.find((h) => h.key === "Referrer-Policy")?.value).toBe(
      "strict-origin-when-cross-origin",
    );
  });
});

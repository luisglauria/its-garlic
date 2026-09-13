// SEC-03 — automated destination validation: accepts official hosts, rejects look-alikes.
// Source: RESEARCH.md Pattern 2 test example, extended per PLAN.md Task 2 <behavior>.
import { describe, expect, test } from "vitest";
import { ALLOWED_HOSTS, assertAllowedHost } from "./allowlist";

describe("assertAllowedHost", () => {
  test.each(ALLOWED_HOSTS)(
    "accepts an official destination on %s",
    (host) => {
      const url = `https://${host}/some-path`;
      expect(assertAllowedHost(url)).toBe(url);
    },
  );

  test("rejects a host that merely suffixes an allowed domain", () => {
    // "wa.me.evil.example" ends with "me.evil.example", not the allowed "wa.me" — but a
    // naive `endsWith`/`includes` check against the wrong operand could be fooled by
    // "evil-wa.me" style registrable-domain look-alikes. Assert the throw either way.
    expect(() => assertAllowedHost("https://evil-wa.me/x")).toThrow();
  });

  test("rejects a host that suffixes an allowed domain on a different registrable domain", () => {
    expect(() => assertAllowedHost("https://wa.me.evil.example/x")).toThrow();
  });

  test("rejects a host that embeds an allowed domain as a substring", () => {
    expect(() => assertAllowedHost("https://notwa.me.attacker.com/x")).toThrow();
  });

  test("throws for a string that is not a parseable absolute URL", () => {
    expect(() => assertAllowedHost("not-a-url")).toThrow();
  });
});

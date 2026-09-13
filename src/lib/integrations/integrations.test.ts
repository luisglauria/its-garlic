// Asserts every integration builder returns an allowlisted URL, and that buildWhatsAppUrl
// percent-encodes its message argument (PLAN.md Task 2 <behavior>).
import { describe, expect, test } from "vitest";
import { ALLOWED_HOSTS } from "./allowlist";
import { buildIFoodUrl } from "./ifood";
import { buildWhatsAppUrl } from "./whatsapp";
import { buildInstagramUrl } from "./instagram";
import { buildMapsUrl } from "./maps";

describe("integration builders", () => {
  test("buildIFoodUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildIFoodUrl());
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildWhatsAppUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildWhatsAppUrl());
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildInstagramUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildInstagramUrl());
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildMapsUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildMapsUrl());
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildWhatsAppUrl percent-encodes its message argument", () => {
    const url = buildWhatsAppUrl("olá & bem-vindo");
    const { searchParams } = new URL(url);
    expect(searchParams.get("text")).toBe("olá & bem-vindo");
    // The raw query string must carry the percent-encoded form, not a literal unescaped "&"
    // that would silently truncate the prefilled text.
    expect(url).not.toContain("text=olá & bem-vindo");
    expect(url).toContain(encodeURIComponent("olá & bem-vindo"));
  });
});

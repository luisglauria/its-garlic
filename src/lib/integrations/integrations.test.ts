// Asserts every integration builder returns an allowlisted URL, and that buildWhatsAppUrl
// percent-encodes its message argument (PLAN.md Task 2 <behavior>). Also asserts the
// `confirmed`/`pendingConfirmation` contract added by 01-REVIEW.md CR-01: a confirmed record's
// builder returns a normal usable URL, and an unconfirmed record's builder signals that status
// instead of silently returning the placeholder as if it were valid.
import { describe, expect, test } from "vitest";
import { ALLOWED_HOSTS } from "./allowlist";
import { buildIFoodUrl } from "./ifood";
import { buildWhatsAppUrl } from "./whatsapp";
import { buildInstagramUrl } from "./instagram";
import { buildMapsUrl } from "./maps";

describe("integration builders", () => {
  test("buildIFoodUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildIFoodUrl().url);
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildWhatsAppUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildWhatsAppUrl().url);
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildInstagramUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildInstagramUrl().url);
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildMapsUrl returns an allowlisted hostname", () => {
    const { hostname } = new URL(buildMapsUrl().url);
    expect(ALLOWED_HOSTS).toContain(hostname);
  });

  test("buildWhatsAppUrl percent-encodes its message argument", () => {
    const { url } = buildWhatsAppUrl("olá & bem-vindo");
    const { searchParams } = new URL(url);
    expect(searchParams.get("text")).toBe("olá & bem-vindo");
    // The raw query string must carry the percent-encoded form, not a literal unescaped "&"
    // that would silently truncate the prefilled text.
    expect(url).not.toContain("text=olá & bem-vindo");
    expect(url).toContain(encodeURIComponent("olá & bem-vindo"));
  });

  test("a confirmed record's builder reports confirmed: true with no pending explanation", () => {
    const instagram = buildInstagramUrl();
    expect(instagram.confirmed).toBe(true);
    expect(instagram.pendingConfirmation).toBeUndefined();

    const maps = buildMapsUrl();
    expect(maps.confirmed).toBe(true);
    expect(maps.pendingConfirmation).toBeUndefined();
  });

  test("an unconfirmed record's builder signals confirmed: false with a pending explanation, not a silently-valid URL", () => {
    const ifood = buildIFoodUrl();
    expect(ifood.confirmed).toBe(false);
    expect(ifood.pendingConfirmation).toBeTruthy();

    const whatsapp = buildWhatsAppUrl();
    expect(whatsapp.confirmed).toBe(false);
    expect(whatsapp.pendingConfirmation).toBeTruthy();
  });
});

// Source: 01-03-PLAN.md Task 2 <behavior> — guards the typed content skeleton (CONT-02) and
// its confirmed/pending marker convention (CONT-03, D-05).
import { describe, expect, test } from "vitest";
import { contentSkeleton } from "./skeleton";

const REQUIRED_IDS = [
  "hero",
  "brand-story",
  "product-categories",
  "ctas",
  "faqs",
  "seo-metadata",
  "contact-location",
] as const;

// Source: PROJECT.md ## Requirements — the ten official menu categories, verbatim.
const OFFICIAL_CATEGORIES = [
  "pães de alho",
  "sanduíches no pão de alho",
  "sanduíches tradicionais",
  "sanduíches premium",
  "petiscos",
  "espetinhos",
  "almoço",
  "bebidas",
  "happy hour",
  "combo do dia",
] as const;

describe("contentSkeleton", () => {
  test("has exactly seven entries, one per required section id", () => {
    expect(contentSkeleton).toHaveLength(7);
    const ids = contentSkeleton.map((section) => section.id);
    expect(new Set(ids).size).toBe(7);
    for (const id of REQUIRED_IDS) {
      expect(ids).toContain(id);
    }
  });

  test("every entry has a non-empty title, purpose, and at least two carries entries", () => {
    for (const section of contentSkeleton) {
      expect(section.title.length).toBeGreaterThan(0);
      expect(section.purpose.length).toBeGreaterThan(0);
      expect(section.carries.length).toBeGreaterThanOrEqual(2);
    }
  });

  test("every entry with confirmed:false has a non-empty pendingConfirmation", () => {
    for (const section of contentSkeleton) {
      if (!section.confirmed) {
        expect(section.pendingConfirmation).toBeTruthy();
        expect((section.pendingConfirmation ?? "").length).toBeGreaterThan(0);
      }
    }
  });

  test("every entry with confirmed:true carries no pendingConfirmation", () => {
    for (const section of contentSkeleton) {
      if (section.confirmed) {
        expect(section.pendingConfirmation).toBeUndefined();
      }
    }
  });

  test("contact-location carries the operating-hours item and is marked unconfirmed", () => {
    const section = contentSkeleton.find((s) => s.id === "contact-location");
    expect(section).toBeDefined();
    expect(section?.confirmed).toBe(false);
    expect(section?.carries.some((item) => /hor[áa]rio/i.test(item))).toBe(true);
  });

  test("product-categories names all ten official categories from PROJECT.md", () => {
    const section = contentSkeleton.find((s) => s.id === "product-categories");
    expect(section).toBeDefined();
    const carriesText = (section?.carries ?? []).join(" ");
    for (const category of OFFICIAL_CATEGORIES) {
      expect(carriesText).toContain(category);
    }
  });

  test("no carries entry contains a currency symbol or a price-shaped digit sequence", () => {
    const priceLikePattern = /R\$|\$\s?\d|\d+[.,]\d{2}\b/;
    for (const section of contentSkeleton) {
      for (const item of section.carries) {
        expect(priceLikePattern.test(item)).toBe(false);
      }
    }
  });

  test("every entry declares which phase writes its final wording", () => {
    for (const section of contentSkeleton) {
      expect(typeof section.writtenInPhase).toBe("number");
      expect(section.writtenInPhase).toBeGreaterThan(0);
    }
  });
});

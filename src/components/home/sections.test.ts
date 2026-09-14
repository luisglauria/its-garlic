// CONT-02 — rendered-output tests for the two sections this plan added, using the same
// `renderToStaticMarkup` pattern plan 02-02's Location.test.ts already established (no jsdom/RTL).
// Element/disclosure counts are asserted against the copy arrays' own lengths, never a number
// typed into this file, so adding a paragraph or a FAQ entry cannot silently go unrendered or
// undetected. The FAQ's address/modality answers are checked against the real record read through
// getStoreInfo() — the mechanical guard behind T-02-17 that stops the FAQ from becoming a second,
// drifting source of the same facts.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { BrandStory } from "./BrandStory";
import { Faq } from "./Faq";
import { brandStoryCopy, faqs } from "@/content/home-copy";
import { getStoreInfo } from "@/lib/repositories/store-repository";

const REAL_STORE = getStoreInfo();

describe("BrandStory (CONT-02)", () => {
  const markup = renderToStaticMarkup(createElement(BrandStory));

  test("renders the neighbourhood and the city", () => {
    expect(markup).toContain("Mercado da Torre");
    expect(markup).toContain("Recife");
  });

  test("references the garlic bread", () => {
    expect(markup).toMatch(/p[aã]o de alho/i);
  });

  test("renders exactly one element per brandStoryCopy.paragraphs entry", () => {
    const paragraphs = markup.match(/<p\b/g) ?? [];
    expect(
      paragraphs.length,
      "the rendered paragraph count must track brandStoryCopy.paragraphs.length, not a hardcoded number",
    ).toBe(brandStoryCopy.paragraphs.length);
  });
});

describe("Faq (CONT-02)", () => {
  const markup = renderToStaticMarkup(createElement(Faq));

  test("renders one native disclosure per faqs entry", () => {
    const details = markup.match(/<details\b/g) ?? [];
    const summaries = markup.match(/<summary\b/g) ?? [];
    expect(
      details.length,
      "the rendered disclosure count must track faqs.length, not a hardcoded number",
    ).toBe(faqs.length);
    expect(summaries.length).toBe(faqs.length);
  });

  // react-dom/server's renderToStaticMarkup correctly HTML-entity-escapes an apostrophe inside
  // text content (' -> &#x27;) and a double quote (" -> &quot;) — expected/correct escaping, the
  // same defect class 02-01-SUMMARY.md's Deviation #3 already documented once for a raw-URL
  // match; compare against the escaped form rather than the raw copy string.
  function htmlEscaped(value: string): string {
    return value.replace(/'/g, "&#x27;").replace(/"/g, "&quot;");
  }

  test("every question and answer string appears in the rendered output", () => {
    for (const entry of faqs) {
      expect(markup).toContain(htmlEscaped(entry.question));
      expect(markup).toContain(htmlEscaped(entry.answer));
    }
  });

  test("no hand-wired expanded or controls attribute appears anywhere in the output", () => {
    expect(markup).not.toMatch(/aria-expanded|aria-controls/);
  });

  test("the address answer agrees with the real store record read through getStoreInfo()", () => {
    const addressAnswer = faqs.find((entry) => entry.question.includes("Onde"))?.answer ?? "";
    expect(addressAnswer).toContain(REAL_STORE.address);
    expect(addressAnswer).toContain(REAL_STORE.neighborhood);
    expect(addressAnswer).toContain(REAL_STORE.city);
    expect(addressAnswer).toContain(REAL_STORE.state);
  });

  test("the modality answer mentions every modality the real record carries", () => {
    const MODALITY_LABEL: Record<(typeof REAL_STORE.modalities)[number], string> = {
      balcao: "balcão",
      delivery: "delivery",
      "take-away": "take away",
    };
    const modalityAnswer =
      faqs.find((entry) => entry.question.includes("formas de atendimento"))?.answer ?? "";
    for (const modality of REAL_STORE.modalities) {
      expect(modalityAnswer.toLowerCase()).toContain(MODALITY_LABEL[modality]);
    }
  });
});

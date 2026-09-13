// Guards MARCA-01 (Task 1's six logo variants) and MARCA-02/MARCA-03 (this task's
// design tokens): a partially-generated variant set, or a colour/typography token
// added to one file but not its pair, fails this suite instead of shipping silently.
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = process.cwd();

// Copied character for character from PROJECT.md's seven official brand colours.
const OFFICIAL_PALETTE = [
  "#B8FF00",
  "#202526",
  "#000000",
  "#31266B",
  "#FF3B30",
  "#7D804D",
  "#FFFFFF",
];

const BRAND_VARIANTS = [
  "logo-principal.svg",
  "logo-invertido.svg",
  "logo-mono-preto.svg",
  "logo-mono-branco.svg",
  "logo-icone.svg",
  "favicon-source.svg",
];

describe("brand logo variants (MARCA-01)", () => {
  for (const name of BRAND_VARIANTS) {
    test(`${name} exists, is non-empty, and carries the provisional-source notice`, () => {
      const filePath = path.join(ROOT, "public", "brand", name);
      expect(existsSync(filePath)).toBe(true);

      const content = readFileSync(filePath, "utf8");
      expect(content.length).toBeGreaterThan(200);
      expect(content).toMatch(/<svg/);
      expect(content).toMatch(/logo\.png/);
    });
  }
});

describe("design tokens (MARCA-02, MARCA-03)", () => {
  const jsonPath = path.join(ROOT, "src", "styles", "design-tokens.json");
  const cssPath = path.join(ROOT, "src", "styles", "design-tokens.css");

  function loadTokens() {
    const json = JSON.parse(readFileSync(jsonPath, "utf8")) as Record<string, unknown>;
    const css = readFileSync(cssPath, "utf8");
    return { json, css };
  }

  function colourSection(json: Record<string, unknown>): Record<string, unknown> {
    const colours = (json.colors ?? json.colours ?? json.color) as
      | Record<string, unknown>
      | undefined;
    expect(colours, "design-tokens.json has no colour section").toBeDefined();
    return colours as Record<string, unknown>;
  }

  test("design-tokens.json exists and parses as JSON", () => {
    expect(existsSync(jsonPath)).toBe(true);
    expect(() => JSON.parse(readFileSync(jsonPath, "utf8"))).not.toThrow();
  });

  test("design-tokens.css exists", () => {
    expect(existsSync(cssPath)).toBe(true);
  });

  test("JSON colour section has exactly seven entries", () => {
    const { json } = loadTokens();
    const colours = colourSection(json);
    expect(Object.keys(colours)).toHaveLength(7);
  });

  test("every JSON colour value is one of the seven official hex codes (case-insensitive)", () => {
    const { json } = loadTokens();
    const colours = colourSection(json);
    const values = Object.values(colours).map((v) => String(v).toUpperCase());
    for (const value of values) {
      expect(OFFICIAL_PALETTE).toContain(value);
    }
  });

  test("every CSS --color- custom property matches a JSON colour value, and the two sets are equal", () => {
    const { json, css } = loadTokens();
    const colours = colourSection(json);
    const jsonVals = Object.values(colours)
      .map((v) => String(v).toUpperCase())
      .sort();
    const decls = [...css.matchAll(/--color-[A-Za-z0-9-]+\s*:\s*(#[0-9a-fA-F]{6})/g)]
      .map((m) => m[1].toUpperCase())
      .sort();
    expect(decls).toEqual(jsonVals);
  });

  test("neither token file contains a hex colour outside the official seven", () => {
    const { json, css } = loadTokens();
    const jsonText = JSON.stringify(json);
    const allHex = [
      ...(jsonText.match(/#[0-9a-fA-F]{6}/g) ?? []),
      ...(css.match(/#[0-9a-fA-F]{6}/g) ?? []),
    ].map((h) => h.toUpperCase());
    const offPalette = allHex.filter((h) => !OFFICIAL_PALETTE.includes(h));
    expect(offPalette).toEqual([]);
  });

  test("CSS declares a display-font and a body-font custom property", () => {
    const { css } = loadTokens();
    expect(css).toMatch(/--font-display\s*:/);
    expect(css).toMatch(/--font-body\s*:/);
  });

  test("CSS declares at least one heading size and one body size custom property", () => {
    const { css } = loadTokens();
    expect(css).toMatch(/--text-heading[a-z0-9-]*\s*:/i);
    expect(css).toMatch(/--text-body[a-z0-9-]*\s*:/i);
  });

  test("JSON typography section names the display, body, and promotional-only script families", () => {
    const { json } = loadTokens();
    const typography = json.typography as
      | { display?: { family?: string }; body?: { family?: string }; script?: { family?: string; promotionalOnly?: boolean } }
      | undefined;
    expect(typography, "design-tokens.json has no typography section").toBeDefined();
    expect(typography?.display?.family).toBeTruthy();
    expect(typography?.body?.family).toBeTruthy();
    expect(typography?.script?.family).toBeTruthy();
    expect(typography?.script?.promotionalOnly).toBe(true);
  });
});

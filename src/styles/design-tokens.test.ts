// Source-level regression guard over both conditions of the AND-gate that produced the
// total brand-palette + focus-ring outage diagnosed in
// .planning/debug/DEBUG-focus-ring-invisible-faq-directions.md:
//   (1) a custom property mirrored onto itself inside a Tailwind @theme block, AND
//   (2) an import order that lets that self-reference win the cascade over the literal.
// Runs inside `npm test` (fast, no build step) so either condition fails here before it ever
// reaches the compiled-artifact checker in scripts/check-brand-css.mjs. One named test per
// fact, so a failure says exactly which condition broke.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = process.cwd();

function read(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

// Same comment-stripping convention as src/components/home/home.test.ts's `stripComments`:
// several assertions below are "this must not appear", and design-tokens.css / globals.css
// carry deliberate explanatory comments naming these exact concepts (the DEBUG file path, the
// self-reference term). Stripping comments first means an honest comment can never fail the
// gate and teach the next developer to delete comments instead of fixing code.
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

const tokensCss = stripComments(read("src", "styles", "design-tokens.css"));
const globalsCss = stripComments(read("src", "app", "globals.css"));
const layoutTsx = read("src", "app", "layout.tsx");

// The seven official brand colour names as they appear in the `--color-<name>` custom
// property declarations (PROJECT.md / design-tokens.json).
const BRAND_COLOUR_NAMES = [
  "accent",
  "surface-primary",
  "surface-deep",
  "text-on-dark",
  "accent-purple",
  "accent-coral",
  "accent-olive",
] as const;

/** Finds the [start, end) character span of every `@theme ...{ ... }` block in `css`. */
function themeBlockSpans(css: string): Array<[number, number]> {
  const spans: Array<[number, number]> = [];
  const opener = /@theme\b[^{]*\{/g;
  let match: RegExpExecArray | null;
  while ((match = opener.exec(css))) {
    const bodyStart = match.index + match[0].length;
    let depth = 1;
    let i = bodyStart;
    for (; i < css.length && depth > 0; i++) {
      if (css[i] === "{") depth++;
      else if (css[i] === "}") depth--;
    }
    spans.push([match.index, i]);
    opener.lastIndex = i;
  }
  return spans;
}

function isInsideAnySpan(index: number, spans: Array<[number, number]>): boolean {
  return spans.some(([start, end]) => index >= start && index < end);
}

describe("design-tokens.css carries no self-referential custom property", () => {
  test("no --name declaration resolves through var(--name) of the same name", () => {
    // The negative lookahead is load-bearing: without it, `--font-display: var(--font-display-anton)`
    // would false-positive as a self-reference, because `\b` alone treats the transition from
    // "display" to "-anton" as a word boundary. Custom property names may contain letters, digits
    // and hyphens, so only a character outside that set (comma, paren, whitespace, semicolon) may
    // follow the backreference for this to be a genuine same-name match.
    const selfReferences = [
      ...tokensCss.matchAll(/--([a-z0-9-]+)\s*:\s*var\(\s*--\1(?![a-z0-9-])/g),
    ].map((m) => m[1]);
    expect(
      selfReferences,
      `the following custom properties are defined in terms of themselves: ${selfReferences.join(", ")}`,
    ).toEqual([]);
  });
});

describe("globals.css imports the framework before the project token sheet", () => {
  test("`@import \"tailwindcss\"` appears before the design-tokens.css import", () => {
    const tailwindIndex = globalsCss.indexOf('@import "tailwindcss"');
    const tokensIndex = globalsCss.indexOf("design-tokens.css");
    expect(tailwindIndex, "globals.css must import tailwindcss").toBeGreaterThanOrEqual(0);
    expect(tokensIndex, "globals.css must import design-tokens.css").toBeGreaterThanOrEqual(0);
    expect(
      tailwindIndex,
      "the framework import must come first, or Tailwind emits the project theme block unlayered and last — letting a self-reference win the cascade over the literal",
    ).toBeLessThan(tokensIndex);
  });
});

describe("the seven brand colours are declared once each, as literals, inside a theme block", () => {
  const declarations = [
    ...tokensCss.matchAll(/--color-([a-z0-9-]+)\s*:\s*([^;]+);/g),
  ].map((m) => ({ name: m[1], value: m[2].trim(), index: m.index ?? -1 }));
  const spans = themeBlockSpans(tokensCss);

  for (const name of BRAND_COLOUR_NAMES) {
    test(`--color-${name} is declared exactly once`, () => {
      const matches = declarations.filter((d) => d.name === name);
      expect(matches, `expected exactly one --color-${name} declaration`).toHaveLength(1);
    });

    test(`--color-${name} is declared as a literal hex value, not a var() reference`, () => {
      const decl = declarations.find((d) => d.name === name);
      expect(decl, `--color-${name} must be declared`).toBeDefined();
      expect(decl!.value).toMatch(/^#[0-9a-fA-F]{6}$/);
    });

    test(`--color-${name} is declared inside a @theme block`, () => {
      const decl = declarations.find((d) => d.name === name);
      expect(decl, `--color-${name} must be declared`).toBeDefined();
      expect(
        isInsideAnySpan(decl!.index, spans),
        `--color-${name} must sit inside a @theme block to be a Tailwind theme key, not an inert custom property`,
      ).toBe(true);
    });
  }

  test("exactly seven brand colour names are declared in total", () => {
    const names = new Set(declarations.map((d) => d.name));
    expect([...names].sort()).toEqual([...BRAND_COLOUR_NAMES].sort());
  });
});

describe("the two font theme keys resolve through distinct next/font variable names", () => {
  function fontKeyVariable(keyName: "font-display" | "font-body"): string {
    const re = new RegExp(`--${keyName}\\s*:\\s*var\\(\\s*(--[a-z0-9-]+)`);
    const match = tokensCss.match(re);
    expect(match, `--${keyName} must resolve through a var() reference`).not.toBeNull();
    return match![1];
  }

  test("--font-display references a variable name distinct from --font-display itself", () => {
    const referenced = fontKeyVariable("font-display");
    expect(
      referenced,
      "a theme key reading a variable of its own name is the self-reference bug this plan fixes",
    ).not.toBe("--font-display");
  });

  test("--font-body references a variable name distinct from --font-body itself", () => {
    const referenced = fontKeyVariable("font-body");
    expect(
      referenced,
      "a theme key reading a variable of its own name is the self-reference bug this plan fixes",
    ).not.toBe("--font-body");
  });

  test("layout.tsx binds its next/font instances to exactly the variable names design-tokens.css references", () => {
    const displayVar = fontKeyVariable("font-display");
    const bodyVar = fontKeyVariable("font-body");
    expect(
      layoutTsx,
      `layout.tsx must bind a next/font instance's variable to ${displayVar}`,
    ).toMatch(new RegExp(`variable:\\s*["']${displayVar}["']`));
    expect(
      layoutTsx,
      `layout.tsx must bind a next/font instance's variable to ${bodyVar}`,
    ).toMatch(new RegExp(`variable:\\s*["']${bodyVar}["']`));
  });
});

describe("the global focus rule references a colour declared as a literal", () => {
  test(":focus-visible's outline colour is a token declared with a literal value in design-tokens.css", () => {
    const focusRuleMatch = globalsCss.match(/:focus-visible\s*\{[^}]*outline\s*:[^;]*var\(\s*(--[a-z0-9-]+)/);
    expect(focusRuleMatch, "globals.css must declare a :focus-visible outline referencing a token").not.toBeNull();
    const tokenName = focusRuleMatch![1].replace(/^--/, "");
    const colourName = tokenName.replace(/^color-/, "");
    expect(
      BRAND_COLOUR_NAMES as readonly string[],
      `the focus rule references ${focusRuleMatch![1]}, which must be one of the seven brand colours declared as a literal`,
    ).toContain(colourName);
  });
});

// Structural guard over the shared shell (src/app/layout.tsx + its layout components).
// Static source inspection, matching the project's established test style (see
// src/lib/brand/brand-assets.test.ts) — the Vitest environment is "node" (no DOM), so these
// assert against file text rather than a rendered tree.
import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = process.cwd();

function read(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

describe("root layout shell (PERF-01, PERF-03)", () => {
  const layout = read("src", "app", "layout.tsx");

  test("declares lang=\"pt-BR\"", () => {
    expect(layout).toMatch(/lang="pt-BR"/);
  });

  test("is a Server Component — no \"use client\" directive", () => {
    expect(layout).not.toMatch(/["']use client["']/);
  });

  test("never reads the current time (no hydration-mismatch risk)", () => {
    expect(layout).not.toMatch(/new Date\(/);
  });

  test("contains exactly one <header>, one <main>, and one <footer> landmark", () => {
    for (const tag of ["header", "main", "footer"]) {
      const count = (layout.match(new RegExp(`<${tag}[ >]`, "g")) ?? []).length;
      expect(count, `expected exactly 1 <${tag}>, found ${count}`).toBe(1);
    }
  });

  test("the <main> landmark carries id=\"main-content\"", () => {
    expect(layout).toMatch(/id="main-content"/);
  });

  test("binds both font instances to the design-token --font- variable names", () => {
    expect(layout).toMatch(/variable:\s*["']--font-display["']/);
    expect(layout).toMatch(/variable:\s*["']--font-body["']/);
  });

  test("exports a metadata object with a non-empty title and description", () => {
    expect(layout).toMatch(/export const metadata/);
    expect(layout).toMatch(/title:/);
    expect(layout).toMatch(/description:/);
  });
});

describe("SkipLink (PERF-01)", () => {
  const skipLink = read("src", "components", "layout", "SkipLink.tsx");

  test("exports SkipLink", () => {
    expect(skipLink).toMatch(/export function SkipLink/);
  });

  test("href targets #main-content", () => {
    expect(skipLink).toMatch(/href="#main-content"/);
  });

  test("is hidden with a screen-reader-only utility, not display:none, and has a focus escape", () => {
    expect(skipLink).toMatch(/sr-only/);
    expect(skipLink).not.toMatch(/display:\s*none/);
    expect(skipLink).toMatch(/focus:not-sr-only|focus-visible|:focus/);
  });
});

describe("globals.css (PERF-01, PERF-03)", () => {
  const globals = read("src", "app", "globals.css");

  test("still imports design-tokens.css", () => {
    expect(globals).toMatch(/design-tokens\.css/);
  });

  test("declares a focus-visible treatment", () => {
    expect(globals).toMatch(/:focus-visible|:focus/);
  });
});

describe("no fixed pixel dimensions in the shell (PERF-03)", () => {
  const files = [
    ["src", "app", "layout.tsx"],
    ["src", "components", "layout", "Header.tsx"],
    ["src", "components", "layout", "Footer.tsx"],
    ["src", "components", "layout", "SkipLink.tsx"],
  ];

  for (const segments of files) {
    test(`${segments.join("/")} has no fixed pixel width/height`, () => {
      const content = read(...segments);
      expect(content).not.toMatch(
        /\b(w|h|min-w|max-w)-\[[0-9]+px\]|width:\s*[0-9]+px|height:\s*[0-9]+px/,
      );
    });
  }
});

describe("brand shell components (MARCA-05)", () => {
  const header = read("src", "components", "layout", "Header.tsx");
  const footer = read("src", "components", "layout", "Footer.tsx");

  test("Header renders a public/brand/logo- path through next/image, marked priority, with alt text", () => {
    expect(header).toMatch(/brand\/logo-/);
    expect(header).toMatch(/from\s+["']next\/image["']/);
    expect(header).not.toMatch(/<img[\s>]/);
    expect(header).toMatch(/alt=/);
    expect(header).toMatch(/priority/);
  });

  test("Footer reads store facts and the Instagram link only through the repository/integration seams", () => {
    expect(footer).toMatch(/getStoreInfo/);
    expect(footer).toMatch(/buildInstagramUrl/);
    expect(footer).not.toMatch(/Jos[eé] Bonif[aá]cio/);
    expect(footer).not.toMatch(/https:\/\//);
  });

  test("Footer renders no operating-hours block", () => {
    expect(footer).not.toMatch(/hours\.schedule|horário de funcionamento/i);
  });

  test("neither Header nor Footer contains a hex colour literal", () => {
    for (const [name, content] of [
      ["Header", header],
      ["Footer", footer],
    ] as const) {
      expect(content, `${name} should reference design tokens, not a hex literal`).not.toMatch(
        /#[0-9a-fA-F]{6}/,
      );
    }
  });

  test("the Instagram anchor opens safely in a new tab with descriptive link text", () => {
    expect(footer).toMatch(/target="_blank"/);
    expect(footer).toMatch(/rel="noopener noreferrer"/);
    expect(footer).toMatch(/Instagram/);
  });
});

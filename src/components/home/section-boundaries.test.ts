// G-02-4 — the guard over the section-boundary rule this gap-closure plan establishes:
// every seam between two adjacent sections that share the same CHARCOAL surface
// (bg-surface-primary) must carry the shared `SectionSeparator` device, and it must be the ONLY
// boundary device in the codebase. Static source inspection, matching the project's established
// test style (src/components/home/home.test.ts, src/lib/brand/brand-assets.test.ts) — the Vitest
// environment is "node" (no DOM), so most assertions read file text rather than a rendered tree.
//
// Scope note: this guard classifies EVERY home section's surface (deep or charcoal) from its own
// source, but only requires a separator between two sections that are BOTH charcoal — the exact
// surface repetition that produced G-02-4 (.planning/debug/DEBUG-charcoal-sections-no-separator.md).
// Hero and CtaGroup are both bg-surface-deep and directly adjacent with no separator between them;
// that is a distinct, pre-existing design decision (the "above the fold" hero moment reads as one
// continuous block) that this gap never reported and this plan's files_modified never touches —
// asserting a separator there would be inventing a new requirement, not deriving the one this gap
// actually describes.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import { SectionSeparator, SEPARATOR_CLASS } from "@/components/layout/SectionSeparator";

const ROOT = process.cwd();

function read(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

// Reused verbatim from home.test.ts's own helper — several assertions below are "this string
// must not appear", and this file's own explanatory comments legitimately name the concepts
// (clip-path, bg-surface-*) being asserted against; stripping comments first stops an honest
// comment from failing its own guard.
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

// ---------------------------------------------------------------------------------------------
// Derive, do not hardcode, each home section's surface and the page's real render order.
// ---------------------------------------------------------------------------------------------

const PAGE_SOURCE = stripComments(read("src", "app", "page.tsx"));

// The home section component tags this guard knows how to classify by reading their own file,
// plus the separator tag itself. Order in the page's rendered JSX is read from the source, never
// assumed.
const HOME_SECTION_FILE: Record<string, string> = {
  Hero: "Hero.tsx",
  CtaGroup: "CtaGroup.tsx",
  BrandStory: "BrandStory.tsx",
  Location: "Location.tsx",
  Faq: "Faq.tsx",
};

const TAG_PATTERN = new RegExp(
  `<(${Object.keys(HOME_SECTION_FILE).join("|")}|SectionSeparator)\\b`,
  "g",
);

const renderOrder = [...PAGE_SOURCE.matchAll(TAG_PATTERN)].map((m) => m[1]);

type Surface = "deep" | "primary";

function surfaceOf(componentName: string): Surface {
  const fileName = HOME_SECTION_FILE[componentName];
  const content = stripComments(read("src", "components", "home", fileName));
  const match = content.match(/className="([^"]*\bbg-surface-(deep|primary)\b[^"]*)"/);
  expect(
    match,
    `${componentName}'s root element must declare a bg-surface-deep or bg-surface-primary utility so this guard can classify its surface`,
  ).toBeTruthy();
  return match![2] as Surface;
}

describe("adjacent same-surface seams carry the shared separator (G-02-4)", () => {
  let previous: { name: string; surface: Surface; index: number } | null = null;

  renderOrder.forEach((name, index) => {
    if (name === "SectionSeparator") return;

    const surface = surfaceOf(name);
    const prev = previous;

    if (prev && prev.surface === "primary" && surface === "primary") {
      test(`${prev.name} -> ${name}: both charcoal, a SectionSeparator must sit between them`, () => {
        const between = renderOrder.slice(prev.index + 1, index);
        expect(
          between,
          `${prev.name} and ${name} are adjacent and both resolve to the charcoal surface (bg-surface-primary) — a SectionSeparator must render between them or the seam reads as one undifferentiated field (G-02-4)`,
        ).toContain("SectionSeparator");
      });
    }

    previous = { name, surface, index };
  });

  test("page.tsx renders at least one charcoal-to-charcoal seam (sanity: the guard above is not vacuous)", () => {
    let charcoalPairCount = 0;
    let prevSurface: Surface | null = null;
    for (const name of renderOrder) {
      if (name === "SectionSeparator") continue;
      const surface = surfaceOf(name);
      if (prevSurface === "primary" && surface === "primary") charcoalPairCount += 1;
      prevSurface = surface;
    }
    expect(
      charcoalPairCount,
      "this guard exists to police charcoal-to-charcoal seams — if none exist in page order, the test above would pass by having nothing to check",
    ).toBeGreaterThan(0);
  });
});

describe("the FAQ-to-footer seam, asserted explicitly (G-02-4)", () => {
  test("Faq resolves to the charcoal surface", () => {
    expect(surfaceOf("Faq")).toBe("primary");
  });

  test("Footer's root element declares the same charcoal surface as the section above it", () => {
    const footer = stripComments(read("src", "components", "layout", "Footer.tsx"));
    const match = footer.match(/className="([^"]*\bbg-surface-(deep|primary)\b[^"]*)"/);
    expect(match, "Footer's root element must declare a bg-surface-* utility").toBeTruthy();
    expect(match![2]).toBe("primary");
  });

  test("Footer renders a SectionSeparator before its own content wrapper", () => {
    const footer = stripComments(read("src", "components", "layout", "Footer.tsx"));
    const separatorIndex = footer.indexOf("<SectionSeparator");
    const contentIndex = footer.search(/<div className="mx-auto/);
    expect(separatorIndex, "Footer must render <SectionSeparator /> at all").toBeGreaterThan(-1);
    expect(
      contentIndex,
      "Footer must still render its own content wrapper",
    ).toBeGreaterThan(-1);
    expect(
      separatorIndex,
      "the separator must render before the footer's content wrapper, at the top edge of the seam",
    ).toBeLessThan(contentIndex);
  });
});

// ---------------------------------------------------------------------------------------------
// Exactly one separator device exists in the codebase.
// ---------------------------------------------------------------------------------------------

describe("exactly one boundary device exists in the codebase (G-02-4)", () => {
  const SRC_DIR = path.join(ROOT, "src");
  const CLIP_PATH_SHAPE = /clip-path|clipPath/;

  function collectSourceFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectSourceFiles(full);
      if (/\.(ts|tsx|css)$/.test(entry.name) && !entry.name.includes(".test.")) return [full];
      return [];
    });
  }

  test("no file other than SectionSeparator.tsx declares a polygon clip-path shape", () => {
    // <!-- planner-discipline-allow: clip-path -->
    const offenders: string[] = [];
    for (const file of collectSourceFiles(SRC_DIR)) {
      if (path.basename(file) === "SectionSeparator.tsx") continue;
      const content = stripComments(readFileSync(file, "utf8"));
      if (CLIP_PATH_SHAPE.test(content)) offenders.push(path.relative(ROOT, file));
    }
    expect(
      offenders,
      "a second hand-rolled boundary shape has appeared outside SectionSeparator.tsx — this is exactly the pattern regression this guard exists to catch, and the class of defect that let BrandStory's one-off wedge ship without a footer/Location counterpart",
    ).toEqual([]);
  });

  test("SectionSeparator.tsx itself declares the clip-path shape (proves the sweep above is not vacuous)", () => {
    const content = stripComments(
      read("src", "components", "layout", "SectionSeparator.tsx"),
    );
    expect(CLIP_PATH_SHAPE.test(content)).toBe(true);
  });
});

// ---------------------------------------------------------------------------------------------
// Salience is measured from the real token values, not asserted as an opinion.
// ---------------------------------------------------------------------------------------------

describe("the separator's salience is measured against the real brand values (G-02-4)", () => {
  const tokens = JSON.parse(
    read("src", "styles", "design-tokens.json"),
  ) as { colors: Record<string, string> };

  function hexToRgb(hex: string): [number, number, number] {
    const bare = hex.replace(/^#/, "");
    return [
      parseInt(bare.slice(0, 2), 16),
      parseInt(bare.slice(2, 4), 16),
      parseInt(bare.slice(4, 6), 16),
    ];
  }

  // WCAG 2.x relative-luminance + contrast-ratio formula, computed here rather than imported, so
  // this guard has no dependency on a library ever silently changing the arithmetic underneath it.
  function relativeLuminance([r, g, b]: [number, number, number]): number {
    const channel = (c: number) => {
      const s = c / 255;
      return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
    };
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
  }

  function contrastRatio(hexA: string, hexB: string): number {
    const la = relativeLuminance(hexToRgb(hexA));
    const lb = relativeLuminance(hexToRgb(hexB));
    const lighter = Math.max(la, lb);
    const darker = Math.min(la, lb);
    return (lighter + 0.05) / (darker + 0.05);
  }

  test("olive against charcoal clears the 3:1 non-text contrast minimum", () => {
    const ratio = contrastRatio(tokens.colors.accentOlive, tokens.colors.surfacePrimary);
    expect(
      ratio,
      `Oliva against Carvão must clear 3:1 (the non-text/UI-component contrast minimum) to be salient as a section boundary rule — measured ${ratio.toFixed(2)}:1`,
    ).toBeGreaterThanOrEqual(3);
  });

  test("the exported band class string uses the olive token for its rule", () => {
    expect(SEPARATOR_CLASS).toContain("border-accent-olive");
  });

  test("the two dark surfaces do not clear 3:1 against each other — recorded as why a taper alone cannot carry the boundary", () => {
    const ratio = contrastRatio(tokens.colors.surfaceDeep, tokens.colors.surfacePrimary);
    expect(
      ratio,
      `Preto against Carvão measured ${ratio.toFixed(2)}:1 — below the 3:1 minimum, which is why the boundary rule is olive, not a same-surface taper`,
    ).toBeLessThan(3);
  });
});

// ---------------------------------------------------------------------------------------------
// The band is decorative only, and sized to the spacing scale's declared value.
// ---------------------------------------------------------------------------------------------

describe("the separator is decorative and sized to the spacing scale (G-02-4)", () => {
  test("is hidden from assistive technology", () => {
    const markup = renderToStaticMarkup(createElement(SectionSeparator));
    expect(markup).toMatch(/aria-hidden="true"/);
  });

  test("renders no text content", () => {
    const markup = renderToStaticMarkup(createElement(SectionSeparator));
    const textOnly = markup.replace(/<[^>]+>/g, "").trim();
    expect(textOnly, "a decorative band must carry no content of its own").toBe("");
  });

  test("the declared mobile-base height matches the UI-SPEC Spacing Scale's 2xl row, read from the spec itself", () => {
    const uiSpec = read(".planning", "phases", "02-hero-ctas-location", "02-UI-SPEC.md");
    const row = uiSpec.match(/\|\s*2xl\s*\|\s*(\d+)px\s*\|/);
    expect(row, "the UI-SPEC Spacing Scale must still declare a 2xl row").toBeTruthy();
    const declaredPx = Number(row![1]);
    const tailwindUnit = declaredPx / 4; // Tailwind's default spacing scale: 1 unit = 4px
    const classes = SEPARATOR_CLASS.split(/\s+/);
    expect(
      classes,
      `the separator's base (mobile) height must be h-${tailwindUnit}, matching the UI-SPEC's declared 2xl value of ${declaredPx}px`,
    ).toContain(`h-${tailwindUnit}`);
  });
});

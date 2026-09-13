// Structural guard suite over the above-the-fold slice (HERO-01/02/03, INTEGRA-01/02/03/05,
// SEC-03/ARQ-02 carried, PERF-03 carried). Static source inspection, matching the project's
// established test style (src/components/layout/layout.test.ts) — Vitest's environment is
// "node" (no DOM), so these assert against file text rather than a rendered tree.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const ROOT = process.cwd();

function read(...segments: string[]): string {
  return readFileSync(path.join(ROOT, ...segments), "utf8");
}

// Strips line and block comments before every absence assertion below. Several of the
// assertions in this file are "this string must not appear", and the components deliberately
// carry explanatory comments about exactly those concepts (e.g. the CR-01 comment naming
// `aria-disabled`) — asserting against raw text would make an honest code comment fail the gate,
// which teaches the next developer to delete comments instead of fixing code.
function stripComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:])\/\/.*$/gm, "$1");
}

// The sweep: every non-test file under src/components/home/, plus the page that composes them —
// read by directory listing (readdirSync) rather than a hardcoded filename list, so a section a
// later phase adds is covered from the day it lands. Excluding test files is not a loophole: a
// fixture-prop test legitimately holds a fixture url (and, from plan 02-02, a fixture schedule),
// the same reason eslint.config.mjs already exempts test files from the data-import boundary.
const HOME_DIR = path.join(ROOT, "src", "components", "home");
const homeComponentFiles = readdirSync(HOME_DIR)
  .filter((name) => name.endsWith(".tsx") && !name.includes(".test."))
  .sort();

const sweepPaths: readonly string[][] = [
  ...homeComponentFiles.map((name) => ["src", "components", "home", name]),
  ["src", "app", "page.tsx"],
];

const sweep = sweepPaths.map((segments) => {
  const raw = read(...segments);
  return { label: segments.join("/"), raw, stripped: stripComments(raw) };
});

describe("Hero (HERO-01, HERO-03)", () => {
  const copy = read("src", "content", "home-copy.ts");
  const hero = read("src", "components", "home", "Hero.tsx");

  test("the locked brand concept line is present in the copy module", () => {
    expect(copy, "heroCopy.kicker must be the locked concept line").toMatch(
      /Mais que um p[aã]o de alho!/,
    );
  });

  test("Hero reads its wording from the copy module, not inline strings", () => {
    expect(hero).toMatch(/@\/content\/home-copy/);
  });

  test("Hero renders the illustration through next/image with a CLS-safe container", () => {
    expect(hero, "Hero must use the framework image component").toMatch(
      /from\s+["']next\/image["']/,
    );
    expect(hero, "Hero must point at the hero illustration asset").toMatch(
      /brand\/hero-illustration/,
    );
    expect(hero, "Hero image must use fill so its box is reserved by the container").toMatch(
      /\bfill\b/,
    );
    expect(hero, "Hero image container must declare an aspect ratio (CLS-safety)").toMatch(
      /aspect-/,
    );
    expect(hero, "Hero image must set a sizes attribute, which fill requires").toMatch(
      /\bsizes=/,
    );
    expect(hero, "Hero image must be marked preload, protecting the LCP budget").toMatch(
      /\bpreload\b/,
    );
  });

  test("Hero never renders a raw raster image tag", () => {
    expect(hero, "a raw <img> bypasses the image pipeline").not.toMatch(/<img[\s>]/);
  });
});

describe("CTA labels (HERO-02)", () => {
  const copy = read("src", "content", "home-copy.ts");
  const ctaGroup = read("src", "components", "home", "CtaGroup.tsx");

  test("all three locked CTA labels appear verbatim in the copy module", () => {
    expect(copy).toMatch(/Ver card[aá]pio/);
    expect(copy).toMatch(/Pedir no iFood/);
    expect(copy).toMatch(/Como chegar/);
  });

  test("CtaGroup renders the labels through the copy module, not as inline strings", () => {
    expect(ctaGroup).toMatch(/ctaCopy\.menuLabel/);
    expect(ctaGroup).toMatch(/ctaCopy\.ifoodLabel/);
    expect(ctaGroup).toMatch(/ctaCopy\.mapsLabel/);
  });
});

describe("the confirmed gate (INTEGRA-01, INTEGRA-02, INTEGRA-03)", () => {
  const orderCta = read("src", "components", "home", "OrderCta.tsx");
  const ctaGroup = read("src", "components", "home", "CtaGroup.tsx");

  test("OrderCta types its link prop as IntegrationLink and branches on confirmed", () => {
    expect(orderCta, "the confirmed gate must be a type-level contract").toMatch(
      /IntegrationLink/,
    );
    expect(orderCta).toMatch(/\.confirmed/);
  });

  test("OrderCta renders a natively disabled control in the unconfirmed branch", () => {
    expect(orderCta).toMatch(/\bdisabled\b/);
  });

  test("no home/ component (or the page) attaches an ARIA disabled attribute to an anchor — CR-01 regression guard", () => {
    for (const file of sweep) {
      expect(
        file.stripped,
        `${file.label} should never carry aria-disabled — this exact defect class was already fixed once (CR-01), and an aria-disabled anchor still lets a keyboard/AT user activate a destination that does not exist`,
      ).not.toMatch(/aria-disabled/);
    }
  });

  test("CtaGroup renders both order CTAs through the shared OrderCta primitive (D-06 parity)", () => {
    const orderCtaUses = ctaGroup.match(/<OrderCta\b/g) ?? [];
    expect(
      orderCtaUses.length,
      "CtaGroup should render exactly two OrderCta elements (iFood, WhatsApp) so parity cannot drift by copy-paste",
    ).toBe(2);
  });
});

describe("no on-site ordering (INTEGRA-05)", () => {
  for (const file of sweep) {
    test(`${file.label} offers no form element and no cart/checkout affordance`, () => {
      expect(file.stripped, `${file.label} must never render a <form>`).not.toMatch(/<form[\s>]/);
      expect(
        file.stripped,
        `${file.label} must never mention a cart/checkout affordance — every order path ends at iFood or WhatsApp (INTEGRA-05)`,
      ).not.toMatch(/\bcart\b|\bcheckout\b|\bcarrinho\b/i);
    });
  }
});

describe("the seams (SEC-03, ARQ-02, INTEGRA-04 carried)", () => {
  for (const file of sweep) {
    test(`${file.label} contains no URL literal, no direct data import, and no hex colour literal`, () => {
      expect(
        file.stripped,
        `${file.label} must build destinations through a build*Url() function, not a URL literal`,
      ).not.toMatch(/https:\/\//);
      expect(
        file.stripped,
        `${file.label} must import the data layer only through the repository/integration seams (ARQ-02)`,
      ).not.toContain("@/data");
      expect(
        file.stripped,
        `${file.label} should reference design tokens, not a hex colour literal`,
      ).not.toMatch(/#[0-9a-fA-F]{6}/);
    });
  }

  test("the page calls all three integration builders", () => {
    const page = read("src", "app", "page.tsx");
    for (const fn of ["buildIFoodUrl", "buildWhatsAppUrl", "buildMapsUrl"]) {
      expect(page, `page.tsx should call ${fn}()`).toMatch(new RegExp(fn));
    }
  });
});

describe("responsive baseline (PERF-03 carried)", () => {
  for (const file of sweep) {
    test(`${file.label} has no fixed pixel width/height`, () => {
      // next/image's `sizes` attribute legitimately carries `(max-width: 640px)`-style media
      // conditions — that is the correct mobile-first breakpoint pattern this same suite
      // requires above, not a fixed CSS/Tailwind dimension. Strip the attribute's own value
      // before running the fixed-pixel guard so it isn't a false positive here.
      const withoutSizesAttr = file.stripped.replace(/\bsizes="[^"]*"/g, 'sizes=""');
      expect(
        withoutSizesAttr,
        `${file.label} must stay fluid/mobile-first — no fixed pixel dimension`,
      ).not.toMatch(/\b(w|h|min-w|max-w)-\[[0-9]+px]|width:\s*[0-9]+px|height:\s*[0-9]+px/);
    });
  }
});

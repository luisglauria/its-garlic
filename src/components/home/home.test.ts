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

// LOCAL-03/D-07: the Portuguese hour-marker form ("12h", "9h30") and the colon-separated form
// ("12:00"). Declared as a named module constant, not inlined, so a deliberate edit on the day
// real hours ship — and only together with a client confirmation — is a one-line, reviewable
// change, the same design as store.schema.ts's `hours.provisional` literal type: cheap to change
// on purpose, expensive to defeat by accident.
const CLOCK_TIME = /\b\d{1,2}h(?:\d{2})?\b|\b\d{1,2}:\d{2}\b/;

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

describe("Location seams (LOCAL-01, LOCAL-04)", () => {
  const location = read("src", "components", "home", "Location.tsx");
  const page = read("src", "app", "page.tsx");

  test("Location types its store prop as StoreInfo", () => {
    expect(location, "the modality enum and hours shape must be compiler-checked").toMatch(
      /StoreInfo/,
    );
  });

  test("Location maps over the modalities array rather than hardcoding chips", () => {
    expect(location).toMatch(/modalities\.map/);
  });

  test("Location reads its directions href from the maps link prop", () => {
    expect(location, "the href must come from the prop, never a literal").toContain("maps.url");
  });

  test("Location contains no address literal, no URL literal and no iframe", () => {
    expect(
      location,
      "the address must arrive through the repository seam, never a literal — Jos[eé] Bonif[aá]cio/747",
    ).not.toMatch(/Jos[eé] Bonif[aá]cio|747/);
    expect(location).not.toMatch(/https:\/\//);
    expect(location, "LOCAL-01 rules out an embedded frame").not.toMatch(/<iframe/i);
  });

  test("the page reads the store record through the repository seam and composes Location", () => {
    expect(page, "page.tsx must call getStoreInfo()").toMatch(/getStoreInfo/);
    expect(page, "page.tsx must render <Location").toMatch(/<Location\b/);
  });
});

describe("no embedded map, repository-wide (LOCAL-01)", () => {
  // Written repository-wide rather than scoped to home/: LOCAL-01's ban is about the site, and a
  // map embedded from a layout component or a later phase's section would break the Core Web
  // Vitals independence the requirement exists to protect, while passing a guard scoped to this
  // folder.
  const SRC_DIR = path.join(ROOT, "src");

  function collectFiles(dir: string): string[] {
    return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) return collectFiles(full);
      // Test files excluded for the same reason the sweep above excludes them: this very guard
      // (and CLOCK_TIME's guard below) legitimately contains the literal string "<iframe" inside
      // its own regex/description text, which is a false positive against real markup, not an
      // embedded frame.
      if (/\.(ts|tsx|css)$/.test(entry.name) && !entry.name.includes(".test.")) return [full];
      return [];
    });
  }

  test("no iframe element exists in any .ts, .tsx or .css file under src/", () => {
    for (const file of collectFiles(SRC_DIR)) {
      const content = readFileSync(file, "utf8");
      expect(
        content,
        `${path.relative(ROOT, file)} must not embed an iframe (LOCAL-01)`,
      ).not.toMatch(/<iframe/i);
    }
  });
});

describe("no invented clock time (LOCAL-03, D-07)", () => {
  // This is the mechanical backstop behind the content-integrity rule: no operating hour is
  // confirmed, so any time literal in a component or in the copy is either one of the two
  // contradictory Instagram-story schedules or something somebody made up. Test files stay
  // excluded — Location.test.ts's populated-schedule fixture legitimately holds times, the same
  // reason eslint.config.mjs already exempts test files from the data-import boundary.
  const copy = read("src", "content", "home-copy.ts");

  test("no clock-time literal exists in any swept non-test home/ component or in page.tsx", () => {
    for (const file of sweep) {
      expect(
        CLOCK_TIME.test(file.stripped),
        `${file.label} must contain no clock-time literal — no operating hour is confirmed, so none may be shipped`,
      ).toBe(false);
    }
  });

  test("no clock-time literal exists in the copy module", () => {
    expect(
      CLOCK_TIME.test(stripComments(copy)),
      "home-copy.ts must contain no invented hour",
    ).toBe(false);
  });
});

// T-02-16 — the mechanical half of tone-of-voice.md §5, run over the whole copy module now that
// this phase's brand-story and FAQ prose has landed there too. One named test per rule, so a
// failure says exactly which rule broke. The judgement half — whether each sentence is defensible
// from PROJECT.md alone — is a recorded prohibition in 02-03-PLAN.md plus a line-by-line human
// read, not pretended into a test here. Reuses the existing `read`/`stripComments` helpers and the
// `CLOCK_TIME` constant above rather than redefining them.
describe("content-integrity gate over home-copy.ts (T-02-16)", () => {
  const copy = stripComments(read("src", "content", "home-copy.ts"));

  test("home-copy.ts contains no currency marker or price-shaped decimal amount", () => {
    expect(copy, "no price is confirmed for this project").not.toMatch(/R\$|\b\d+[.,]\d{2}\b/);
  });

  test("home-copy.ts contains no award claim, rating, or star count", () => {
    expect(
      copy,
      "no award, rating or testimonial is confirmed for this project",
    ).not.toMatch(/premiad|pr[eê]mio|avalia[cç][aã]o|\bestrela/i);
  });

  test("home-copy.ts contains no forbidden superlative or urgency construction (tone-of-voice.md §5)", () => {
    expect(copy, "the superlative register tone-of-voice.md §5 forbids by name").not.toMatch(
      /imperd[ií]vel|garantid[oa]/i,
    );
    expect(copy, "the guilt/urgency register tone-of-voice.md §5 forbids by name").not.toMatch(
      /voc[eê] vai se arrepender|[uú]ltima chance/i,
    );
  });

  test("home-copy.ts contains no cart or checkout affordance phrase (INTEGRA-05 extended to copy)", () => {
    expect(
      copy,
      "a checkout expectation can be introduced by a sentence as easily as by markup",
    ).not.toMatch(/\bcart\b|\bcheckout\b|\bcarrinho\b/i);
  });

  test("home-copy.ts contains no clock-time literal", () => {
    expect(CLOCK_TIME.test(copy), "no operating hour is confirmed").toBe(false);
  });
});

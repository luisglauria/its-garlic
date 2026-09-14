// INTEGRA-01, G-02-2 — the persistent fold-contract guard that did not exist when this defect
// shipped (.planning/debug/DEBUG-cta-row-stacked-below-fold.md `why_not_caught`: the only
// machine-checkable criterion before this file asserted SOURCE ADJACENCY — "renders CtaGroup
// immediately after Hero" — which the failing layout satisfied literally). Every assertion below
// is about co-visibility mechanics (what precedes the row, how wide it can get, which breakpoint
// governs it), never about the order of two JSX siblings. Renders the real Hero with real
// builder results via `renderToStaticMarkup` (proven working in this node environment for a
// next/image-using Server Component — 02-01-PLAN.md assumption A-03).
import { readFileSync } from "node:fs";
import path from "node:path";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Hero } from "./Hero";
import { ORDER_ROW_CLASS } from "./OrderCtaRow";
import { TIER_CLASS } from "./OrderCta";
import { ctaCopy } from "@/content/home-copy";
import { buildIFoodUrl } from "@/lib/integrations/ifood";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp";

const ROOT = process.cwd();

// The two target mobile viewports — the exact sizes 02-UAT.md Test 2 reported as failing
// (INTEGRA-01's fold criterion: both order CTAs visible pre-scroll).
const VIEWPORT_375 = { width: 375, height: 667 };
const VIEWPORT_390 = { width: 390, height: 844 };

// Hero's own mobile-base horizontal page gutter (Hero.tsx's outer div: `px-4`, the project's
// spacing-scale "md" step, 16px per side) — a named constant since it is a single fixed
// Tailwind utility declared once on the hero's own container, not something this test re-derives
// from source text on every run.
const PAGE_GUTTER_PX = 16;

describe("hero fold contract (INTEGRA-01, G-02-2)", () => {
  const rawMarkup = renderToStaticMarkup(
    createElement(Hero, { ifood: buildIFoodUrl(), whatsapp: buildWhatsAppUrl() }),
  );
  // Discard anything React emits before the hero's own <section> — specifically the next/image
  // preload <link>, which repeats the illustration's asset path *outside* the hero content
  // itself. The ordering facts below are about what's inside the hero section, not about
  // resource hints that happen to share a substring with the asset path.
  const heroMarkup = rawMarkup.slice(rawMarkup.indexOf("<section"));

  test("nothing taller than text precedes the order row inside the hero", () => {
    const rowIndex = heroMarkup.indexOf(ORDER_ROW_CLASS);
    const illustrationIndex = heroMarkup.indexOf("hero-illustration");
    const aspectRatioIndex = heroMarkup.indexOf("aspect-square");

    expect(rowIndex, "the order row's own class string must appear inside the rendered hero").toBeGreaterThan(-1);
    expect(illustrationIndex, "the hero illustration asset must still render").toBeGreaterThan(-1);
    expect(
      aspectRatioIndex,
      "the hero illustration's aspect-ratio container must still render",
    ).toBeGreaterThan(-1);

    expect(
      rowIndex,
      "the order row must render before the illustration asset — a full-width square media block between the headline and the row is what pushed the row below the fold even when the row was nested inside the hero",
    ).toBeLessThan(illustrationIndex);
    expect(
      rowIndex,
      "the order row must render before the illustration's aspect-ratio container",
    ).toBeLessThan(aspectRatioIndex);
  });

  test("the order row reaches the document only through the hero", () => {
    const page = readFileSync(path.join(ROOT, "src", "app", "page.tsx"), "utf8");
    expect(page, "page.tsx must pass the iFood link to Hero").toMatch(/<Hero\b[^>]*ifood=/);
    expect(page, "page.tsx must pass the WhatsApp link to Hero").toMatch(
      /<Hero\b[^>]*whatsapp=/,
    );
    expect(
      page,
      "page.tsx must never render the order row itself — it must reach the document only through Hero, which is what makes the fold contract enforceable",
    ).not.toMatch(/OrderCtaRow/);
  });

  test("the row is side by side at the mobile base, with no breakpoint gating the column count", () => {
    expect(ORDER_ROW_CLASS, "the row must declare a two-column grid").toMatch(/\bgrid-cols-2\b/);
    expect(
      ORDER_ROW_CLASS,
      "no responsive prefix may gate the column count — the previous sm:flex-row only applied at 640px, 250px wider than the wider of the two target viewports, which is the direct cause this test guards against",
    ).not.toMatch(/\b(sm|md|lg|xl|2xl):/);
  });

  test("the label is allowed to wrap — no tier class suppresses it", () => {
    for (const tier of Object.keys(TIER_CLASS) as (keyof typeof TIER_CLASS)[]) {
      expect(
        TIER_CLASS[tier],
        `the ${tier} tier must not declare whitespace-nowrap — a narrow track plus a non-wrapping label is exactly the overflow failure mode the debug session warned about`,
      ).not.toMatch(/whitespace-nowrap/);
    }
  });

  test("two buttons fit one track each at both mobile targets (343px/358px content width)", () => {
    // Resolve the real horizontal padding step from the exported tier class — Tailwind's
    // spacing scale is `n * 4px` (e.g. `px-4` = 16px per side).
    const paddingMatch = TIER_CLASS.primary.match(/\bpx-(\d+)\b/);
    expect(
      paddingMatch,
      "TIER_CLASS.primary must declare a horizontal padding step",
    ).not.toBeNull();
    const paddingStepPx = Number(paddingMatch![1]) * 4;
    const horizontalPaddingPx = paddingStepPx * 2;

    // Resolve the real type-size token from the exported tier class back to a px value via
    // design-tokens.css, rather than assuming the Label role's 14px never changes.
    const tokenMatch = TIER_CLASS.primary.match(/text-\[length:var\((--[\w-]+)\)\]/);
    expect(
      tokenMatch,
      "TIER_CLASS.primary must reference a design-token type-size variable",
    ).not.toBeNull();
    const tokensCss = readFileSync(
      path.join(ROOT, "src", "styles", "design-tokens.css"),
      "utf8",
    );
    const remMatch = tokensCss.match(new RegExp(`${tokenMatch![1]}:\\s*([\\d.]+)rem`));
    expect(remMatch, `design-tokens.css must declare ${tokenMatch![1]}`).not.toBeNull();
    const fontSizePx = Number(remMatch![1]) * 16;

    // Resolve the row gap the same way.
    const gapMatch = ORDER_ROW_CLASS.match(/\bgap-(\d+)\b/);
    expect(gapMatch, "ORDER_ROW_CLASS must declare a gap step").not.toBeNull();
    const gapPx = Number(gapMatch![1]) * 4;

    // A documented, deliberately conservative (wide) average character width for the semibold
    // Manrope body face at this size — an approximation named here as one, not a measured font
    // metric. It exists only to keep this budget honest against real copy, not to model font
    // rendering precisely.
    const AVG_CHAR_WIDTH_EM = 0.6;
    const avgCharWidthPx = fontSizePx * AVG_CHAR_WIDTH_EM;

    for (const viewport of [VIEWPORT_375, VIEWPORT_390]) {
      const contentWidth = viewport.width - PAGE_GUTTER_PX * 2;
      const trackWidth = (contentWidth - gapPx) / 2;
      const trackInteriorWidth = trackWidth - horizontalPaddingPx;

      // Because the label is allowed to wrap, the unbreakable unit is the longest WORD in
      // either label or in the pending suffix — not the whole label.
      const words = [
        ...ctaCopy.ifoodLabel.split(" "),
        ...ctaCopy.whatsappLabel.split(" "),
        ...ctaCopy.pendingSuffix.split(" "),
      ];
      const longestWord = words.reduce((a, b) => (b.length > a.length ? b : a), "");
      const longestWordWidthPx = longestWord.length * avgCharWidthPx;
      expect(
        longestWordWidthPx,
        `at ${viewport.width}px, the longest unbreakable word ("${longestWord}") must fit inside one track's interior width (${trackInteriorWidth.toFixed(1)}px available after padding)`,
      ).toBeLessThanOrEqual(trackInteriorWidth);

      // The whole label, wrapped across up to two lines, must also fit — covering the future
      // confirmed-link labels, which carry no "(em breve)" suffix.
      for (const label of [ctaCopy.ifoodLabel, ctaCopy.whatsappLabel]) {
        const perLineWidthPx = (label.length * avgCharWidthPx) / 2;
        expect(
          perLineWidthPx,
          `at ${viewport.width}px, "${label}" wrapped across two lines must fit inside one track's interior width (${trackInteriorWidth.toFixed(1)}px available after padding)`,
        ).toBeLessThanOrEqual(trackInteriorWidth);
      }
    }
  });
});

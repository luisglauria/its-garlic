// LOCAL-01..04 — rendered-output tests for the location section, exercising the zero/one/many
// modalities branches and the empty/populated hours branches against real markup, the same
// `renderToStaticMarkup` pattern plan 02-01's OrderCta.test.ts already established (no jsdom/RTL).
//
// Every fixture below spreads the real record from `getStoreInfo()` and overrides only the field
// under test, so a fixture can never drift from the schema's actual shape (02-02-PLAN.md Task 1
// <behavior>).
//
// Written first and watched failing (Location.tsx / locationCopy don't exist yet) — this task's
// TDD RED step.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { Location } from "./Location";
import { getStoreInfo } from "@/lib/repositories/store-repository";
import { locationCopy, provisionalBadgeLabel } from "@/content/home-copy";
import type { StoreInfo } from "@/lib/schemas/store.schema";
import type { IntegrationLink } from "@/lib/integrations/types";

const REAL_STORE = getStoreInfo();

const MAPS_FIXTURE: IntegrationLink = {
  url: "https://example.test/maps-destination",
  confirmed: true,
};

describe("Location — modalities (LOCAL-02)", () => {
  test("all three modalities render as three list items with their Portuguese labels", () => {
    const fixture: StoreInfo = {
      ...REAL_STORE,
      modalities: ["balcao", "delivery", "take-away"],
    };
    const markup = renderToStaticMarkup(
      createElement(Location, { store: fixture, maps: MAPS_FIXTURE }),
    );
    const items = markup.match(/<li\b/g) ?? [];
    expect(items.length, "three modalities should render exactly three list items").toBe(3);
    expect(markup).toContain("Balcão");
    expect(markup).toContain("Delivery");
    expect(markup).toContain("Take away");
  });

  test("one modality renders exactly one list item", () => {
    const fixture: StoreInfo = { ...REAL_STORE, modalities: ["delivery"] };
    const markup = renderToStaticMarkup(
      createElement(Location, { store: fixture, maps: MAPS_FIXTURE }),
    );
    const items = markup.match(/<li\b/g) ?? [];
    expect(items.length).toBe(1);
  });

  test("zero modalities renders no list element and no empty-state sentence", () => {
    const fixture: StoreInfo = { ...REAL_STORE, modalities: [] };
    const markup = renderToStaticMarkup(
      createElement(Location, { store: fixture, maps: MAPS_FIXTURE }),
    );
    expect(
      markup,
      "an empty modalities array must render no <ul>/<li> at all, not an empty-state message",
    ).not.toMatch(/<ul\b|<li\b/);
  });
});

describe("Location — hours (LOCAL-03, D-07)", () => {
  test("empty schedule renders the hours heading and the pending body", () => {
    const fixture: StoreInfo = {
      ...REAL_STORE,
      hours: { ...REAL_STORE.hours, schedule: [] },
    };
    const markup = renderToStaticMarkup(
      createElement(Location, { store: fixture, maps: MAPS_FIXTURE }),
    );
    expect(markup).toContain(locationCopy.hoursHeading);
    expect(markup).toContain(locationCopy.hoursPendingBody);
  });

  test("populated schedule renders day/open/close rows and omits the pending body", () => {
    const fixture: StoreInfo = {
      ...REAL_STORE,
      hours: {
        ...REAL_STORE.hours,
        schedule: [
          { days: "Segunda a quinta", open: "12h", close: "22h" },
          { days: "Sexta a domingo", open: "12h", close: "23h" },
        ],
      },
    };
    const markup = renderToStaticMarkup(
      createElement(Location, { store: fixture, maps: MAPS_FIXTURE }),
    );
    expect(markup).toContain("Segunda a quinta");
    expect(markup).toContain("12h");
    expect(markup).toContain("22h");
    expect(markup).toContain("Sexta a domingo");
    expect(markup).toContain("23h");
    expect(
      markup,
      "a populated schedule must not also render the pending body",
    ).not.toContain(locationCopy.hoursPendingBody);
  });

  test("both hours fixtures render the shared provisional badge label, because the record reports hours provisional in each", () => {
    const emptyFixture: StoreInfo = {
      ...REAL_STORE,
      hours: { ...REAL_STORE.hours, schedule: [] },
    };
    const populatedFixture: StoreInfo = {
      ...REAL_STORE,
      hours: {
        ...REAL_STORE.hours,
        schedule: [{ days: "Todos os dias", open: "12h", close: "22h" }],
      },
    };
    const emptyMarkup = renderToStaticMarkup(
      createElement(Location, { store: emptyFixture, maps: MAPS_FIXTURE }),
    );
    const populatedMarkup = renderToStaticMarkup(
      createElement(Location, { store: populatedFixture, maps: MAPS_FIXTURE }),
    );
    expect(emptyMarkup).toContain(provisionalBadgeLabel);
    expect(populatedMarkup).toContain(provisionalBadgeLabel);
  });
});

describe("Location — address (LOCAL-01)", () => {
  test("renders the street address, neighbourhood, city and state from the real store record", () => {
    const markup = renderToStaticMarkup(
      createElement(Location, { store: REAL_STORE, maps: MAPS_FIXTURE }),
    );
    expect(markup).toContain(REAL_STORE.address);
    expect(markup).toContain(REAL_STORE.neighborhood);
    expect(markup).toContain(REAL_STORE.city);
    expect(markup).toContain(REAL_STORE.state);
  });
});

describe("Location — directions link (LOCAL-04)", () => {
  test("renders an anchor whose href is exactly the fixture maps url, opening in a new tab with the safe rel value", () => {
    const markup = renderToStaticMarkup(
      createElement(Location, { store: REAL_STORE, maps: MAPS_FIXTURE }),
    );
    expect(markup, "href should equal the fixture url exactly").toContain(
      `href="${MAPS_FIXTURE.url}"`,
    );
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
  });
});

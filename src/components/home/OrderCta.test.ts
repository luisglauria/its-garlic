// INTEGRA-01/02/03 — rendered-output tests for the shared OrderCta/PendingCta primitive,
// exercising both branches of the confirmed/disabled gate against real markup rather than
// source-text regex. `renderToStaticMarkup` from `react-dom/server` (already installed) renders
// a `.tsx` Server Component from this repo's `node` test environment, including one using
// `next/image` — proven working during planning (02-01-PLAN.md assumption A-03; 02-VALIDATION.md
// planner note). No new dependency, no jsdom.
//
// Written first and watched failing (the components this file exercises didn't exist yet) —
// this task's TDD RED step.
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, test } from "vitest";
import { OrderCta, PendingCta } from "./OrderCta";
import { CtaGroup } from "./CtaGroup";
import { ctaCopy } from "@/content/home-copy";
import { buildIFoodUrl } from "@/lib/integrations/ifood";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp";
import { buildMapsUrl } from "@/lib/integrations/maps";
import type { IntegrationLink } from "@/lib/integrations/types";

const CONFIRMED_FIXTURE: IntegrationLink = {
  url: "https://example.test/x",
  confirmed: true,
};

const PENDING_FIXTURE: IntegrationLink = {
  url: "https://example.test/pending-target",
  confirmed: false,
  pendingConfirmation: "Ainda não confirmado pelo cliente.",
};

describe("OrderCta — confirmed branch", () => {
  const markup = renderToStaticMarkup(
    createElement(OrderCta, { link: CONFIRMED_FIXTURE, label: "Rótulo de teste" }),
  );

  test("renders an anchor whose href is exactly the fixture url", () => {
    expect(markup, "confirmed branch should render an <a>").toMatch(/<a\b/);
    expect(markup, "href should equal the fixture url exactly").toContain(
      `href="${CONFIRMED_FIXTURE.url}"`,
    );
  });

  test("opens in a new tab with the safe rel value", () => {
    expect(markup).toContain('target="_blank"');
    expect(markup).toContain('rel="noopener noreferrer"');
  });

  test("text is exactly the label, with no pending suffix", () => {
    expect(markup).toContain(">Rótulo de teste<");
    expect(
      markup,
      "confirmed branch must never append the pending suffix",
    ).not.toContain(ctaCopy.pendingSuffix);
  });
});

describe("OrderCta — unconfirmed branch", () => {
  const markup = renderToStaticMarkup(
    createElement(OrderCta, { link: PENDING_FIXTURE, label: "Rótulo de teste" }),
  );

  test("renders a natively disabled button, never an anchor", () => {
    expect(markup, "unconfirmed branch should render a <button>").toMatch(/<button\b/);
    expect(markup, "the button must carry the disabled attribute").toMatch(/\bdisabled\b/);
    expect(markup, "unconfirmed branch must never render an <a>").not.toMatch(/<a\b/);
  });

  test("renders no href attribute at all", () => {
    expect(markup, "an inert control must carry no href").not.toContain("href=");
  });

  test("does not render the fixture url anywhere in its output", () => {
    expect(
      markup,
      "an unconfirmed destination must never reach the rendered document",
    ).not.toContain(PENDING_FIXTURE.url);
  });

  test("rendered text contains both the label and the pending suffix", () => {
    expect(markup).toContain("Rótulo de teste");
    expect(markup).toContain(ctaCopy.pendingSuffix);
  });
});

describe("OrderCta — CR-01 regression guard", () => {
  test("neither branch renders an ARIA disabled attribute on an anchor", () => {
    const confirmed = renderToStaticMarkup(
      createElement(OrderCta, { link: CONFIRMED_FIXTURE, label: "X" }),
    );
    const pending = renderToStaticMarkup(
      createElement(OrderCta, { link: PENDING_FIXTURE, label: "X" }),
    );
    expect(
      confirmed,
      "aria-disabled must never appear — this exact defect class was already fixed once (CR-01)",
    ).not.toContain("aria-disabled");
    expect(pending, "aria-disabled must never appear on the inert control either").not.toContain(
      "aria-disabled",
    );
  });
});

describe("PendingCta", () => {
  test("renders the same disabled-button shape from a bare label, with no link input", () => {
    const markup = renderToStaticMarkup(createElement(PendingCta, { label: "Rótulo avulso" }));
    expect(markup).toMatch(/<button\b/);
    expect(markup).toMatch(/\bdisabled\b/);
    expect(markup).toContain("Rótulo avulso");
    expect(markup).toContain(ctaCopy.pendingSuffix);
  });
});

describe("CtaGroup — real builder results", () => {
  const markup = renderToStaticMarkup(
    createElement(CtaGroup, {
      ifood: buildIFoodUrl(),
      whatsapp: buildWhatsAppUrl(),
      maps: buildMapsUrl(),
    }),
  );

  test("renders all three locked CTA labels verbatim", () => {
    expect(markup).toContain(ctaCopy.menuLabel);
    expect(markup).toContain(ctaCopy.ifoodLabel);
    expect(markup).toContain(ctaCopy.mapsLabel);
  });

  test("renders the confirmed directions url", () => {
    // renderToStaticMarkup HTML-entity-escapes "&" inside attribute values (React DOM server's
    // correct, expected behaviour) — compare against the escaped form, not the raw fixture url.
    expect(markup).toContain(buildMapsUrl().url.replace(/&/g, "&amp;"));
  });

  test("renders the unavailability notice text", () => {
    expect(markup).toContain(ctaCopy.ifoodUnavailableNotice);
  });

  test("renders neither the iFood host nor the WhatsApp host as an href", () => {
    expect(markup, "an unconfirmed iFood destination must never reach the rendered document").not.toContain(
      "ifood.com.br",
    );
    expect(
      markup,
      "an unconfirmed WhatsApp destination must never reach the rendered document",
    ).not.toContain("wa.me");
  });
});

#!/usr/bin/env node
/**
 * scripts/check-brand-css.mjs
 *
 * Compiled-artifact checker for MARCA-02/MARCA-03/PERF-01 (gap G-02-5). The source-level guard
 * in src/styles/design-tokens.test.ts catches the two AUTHORING conditions that caused the
 * total brand-palette + focus-ring outage
 * (.planning/debug/DEBUG-focus-ring-invisible-faq-directions.md), but a source guard cannot see
 * what Tailwind actually emits. This script reads the REAL built stylesheet under
 * `.next/static/chunks` and proves every brand token still resolves to its official literal
 * there — the artifact a visitor's browser actually receives.
 *
 * It reads the seven official hex values from src/styles/design-tokens.json (never a hex typed
 * into this script), so the checker cannot itself drift from the brand.
 *
 * Checks:
 *   1. Zero self-referential custom-property declarations survive anywhere in the compiled CSS.
 *   2. For each of the seven colour tokens, the LAST declaration in source order (the one that
 *      wins the cascade) is a literal hex equal, case-insensitively, to the JSON value. This is
 *      the check that would have caught the original outage: the literal was present in the
 *      broken build, it simply lost the cascade to the self-referential mirror declared after
 *      it — so a mere-presence check passes on the defect and only a last-wins check catches it.
 *   3. The Tailwind theme layer is emitted populated (`@layer theme{...}`), not as a bare empty
 *      `@layer theme;` statement — proof the token sheet is processed as a theme, not landing
 *      unlayered after the literals.
 *   4. The global :focus-visible rule survives into the compiled output.
 *   5. The display-font utility resolves through the next/font variable name, not a bare
 *      fallback stack.
 *
 * Run with: `node scripts/check-brand-css.mjs` (wired as `npm run verify:css`). Requires a prior
 * `npm run build` — exits non-zero with a clear message if no compiled CSS is found.
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const REPO_ROOT = process.cwd();
const TOKENS_JSON_PATH = path.join(REPO_ROOT, "src", "styles", "design-tokens.json");
const CHUNKS_DIR = path.join(REPO_ROOT, ".next", "static", "chunks");

/** Recursively collects every `.css` file under `dir`. */
function collectCssFiles(dir) {
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectCssFiles(full);
    return entry.name.endsWith(".css") ? [full] : [];
  });
}

function loadOfficialColours() {
  const json = JSON.parse(readFileSync(TOKENS_JSON_PATH, "utf8"));
  const colours = json.colors ?? json.colours ?? json.color;
  if (!colours || typeof colours !== "object") {
    throw new Error(`${TOKENS_JSON_PATH} has no colour section`);
  }
  // Map JSON camelCase keys (accentPurple) to the CSS kebab-case token name (accent-purple).
  return Object.fromEntries(
    Object.entries(colours).map(([key, value]) => [
      key.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(),
      String(value).toUpperCase(),
    ]),
  );
}

/**
 * Normalizes a hex colour literal to 6-digit, uppercase form. Minifiers legitimately shorten a
 * hex colour to its 3-digit shorthand when every channel pair repeats (e.g. #000000 -> #000,
 * #ffffff -> #fff) — that is still the same literal colour, not a defect, so the comparison
 * below must normalize before comparing rather than reject the shorthand outright.
 */
function normalizeHex(hex) {
  const bare = hex.replace(/^#/, "");
  const expanded =
    bare.length === 3
      ? bare
          .split("")
          .map((ch) => ch + ch)
          .join("")
      : bare;
  return `#${expanded.toUpperCase()}`;
}

function fail(message) {
  console.error(`[check-brand-css] FAILED: ${message}`);
  process.exit(1);
}

function main() {
  const cssFiles = collectCssFiles(CHUNKS_DIR);
  if (cssFiles.length === 0) {
    fail(
      `no compiled CSS found under ${path.relative(REPO_ROOT, CHUNKS_DIR)} - run "npm run build" first`,
    );
  }

  const officialColours = loadOfficialColours();
  const css = cssFiles.map((file) => readFileSync(file, "utf8")).join("\n");
  const flat = css.replace(/\s+/g, "");

  // 1. Zero self-referential custom properties anywhere in the compiled output. Same
  // negative-lookahead reasoning as the source-level guard: without it, a prefix collision like
  // `--font-display:var(--font-display-anton,...)` would false-positive.
  const selfReferences = [
    ...flat.matchAll(/--([a-z0-9-]+):var\(--\1(?![a-z0-9-])/g),
  ].map((m) => m[1]);
  if (selfReferences.length > 0) {
    fail(
      `self-referential custom properties survive in the compiled CSS: ${[...new Set(selfReferences)].join(", ")}`,
    );
  }

  // 2. For each brand colour, the LAST declaration in source order must be the literal hex.
  const checkedTokens = [];
  for (const [name, officialHex] of Object.entries(officialColours)) {
    const declRe = new RegExp(`--color-${name}:([^;]+);`, "g");
    const values = [...flat.matchAll(declRe)].map((m) => m[1]);
    if (values.length === 0) {
      fail(`--color-${name} does not appear anywhere in the compiled CSS`);
    }
    const lastValue = values[values.length - 1];
    const isLiteral = /^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(lastValue);
    if (!isLiteral) {
      fail(
        `--color-${name}'s LAST (cascade-winning) declaration is "${lastValue}", not a literal hex - it is being shadowed by a non-literal declaration later in the stylesheet`,
      );
    }
    if (normalizeHex(lastValue) !== officialHex) {
      fail(
        `--color-${name} resolves to ${lastValue}, expected the official ${officialHex} (design-tokens.json)`,
      );
    }
    checkedTokens.push(name);
  }

  // 3. The theme layer must be populated, not emitted empty.
  if (/@layertheme;/.test(flat)) {
    fail("the theme layer is emitted empty (@layer theme;) - the token sheet is landing unlayered");
  }
  if (!/@layertheme\{/.test(flat)) {
    fail("no populated theme layer (@layer theme{...}) found in the compiled CSS");
  }

  // 4. The global focus rule must survive into the compiled output.
  if (!/:focus-visible\{outline:3pxsolidvar\(--color-accent\)/.test(flat)) {
    fail("the :focus-visible outline rule is missing (or altered) in the compiled CSS");
  }

  // 5. The display-font utility must resolve through the next/font variable name, not just the
  // bare fallback stack — proof the theme key is wired to next/font, not silently falling back.
  if (!/--font-display:var\(--font-display-anton/.test(flat)) {
    fail(
      "the display-font utility does not resolve through --font-display-anton - it may be falling back to the literal stack, which means next/font is not actually wired",
    );
  }

  console.log(
    `[check-brand-css] compiled CSS clean: ${cssFiles.length} file(s) checked, ${checkedTokens.length} brand colour tokens resolve to their official literals, theme layer populated, focus rule present, display font wired through next/font.`,
  );
}

main();

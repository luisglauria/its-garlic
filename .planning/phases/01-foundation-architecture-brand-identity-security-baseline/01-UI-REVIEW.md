# Phase 1 — UI Review

**Audited:** 2026-09-13
**Baseline:** Abstract 6-pillar standards (no UI-SPEC.md — Phase 1 is foundational/architectural), cross-checked against `docs/brand-guidelines.md` (written in this same phase, plan 01-06)
**Screenshots:** Not captured — no dev server running on localhost:3000/5173/8080. Code-only audit.

---

## Pillar Scores

| Pillar | Score | Key Finding |
|--------|-------|-------------|
| 1. Copywriting | 3/4 | Minimal but clean; no generic labels; no real marketing copy shipped yet (expected at this phase) |
| 2. Visuals | 2/4 | Shell (Header/Footer) is on-brand; the only rendered page content (`page.tsx`) shows zero brand visual language |
| 3. Color | 2/4 | Header/Footer correctly use design tokens; `page.tsx`'s CTA button directly inverts the brand guide's own documented CTA color rule, using hardcoded non-palette colors |
| 4. Typography | 2/4 | `page.tsx`'s heading and sizes bypass both the declared type-scale tokens and the display typeface entirely |
| 5. Spacing | 3/4 | Standard Tailwind scale throughout, no arbitrary bracket values; minor container-pattern inconsistency between shell and page |
| 6. Experience Design | 3/4 | Skip link + global focus-visible implemented correctly; no error/not-found route yet, acceptable for a static-data foundational phase |

**Overall: 15/24**

---

## Top 3 Priority Fixes

1. **`src/app/page.tsx`'s CTA button contradicts the brand guide it ships alongside** — `bg-black px-6 py-3 ... text-white ... hover:bg-zinc-800` (page.tsx:22) is the exact inverse of the rule `docs/brand-guidelines.md` states in the same phase: *"Botão primário (CTA): fundo `--color-accent` (lima), texto `--color-surface-deep`... nunca texto branco sobre lima."* Today's homepage shows a plain black-and-white rounded button with zero relation to the lime-green brand identity a visitor would associate with "It's Garlic." **Fix:** change the anchor's classes to `bg-accent text-surface-deep hover:bg-accent/90` (or equivalent token utility), matching the documented CTA rule and the Header/Footer's existing correct usage of `bg-surface-deep`/`text-accent`.

2. **Homepage has no brand visual identity at all** — no logo repetition beyond the header, no dark surface tokens (uses default white background via unstyled `<div>` — actually inherits `bg-surface-deep` from `<body>`, but none of the diagonal shapes / garlic line-art / vibrant-block visual language documented in `docs/brand-guidelines.md`'s "Linguagem visual" section appears anywhere in `page.tsx`). A first-time visitor today sees only a centered heading, address text, and a black pill button — nothing that reads as "mais que um pão de alho." **Fix:** either flag `page.tsx` explicitly as a non-shippable placeholder (e.g. a comment, or gate it behind a feature flag) until Phase 2 replaces it with the real hero, or apply minimal token-based styling now (`font-display` on the h1, `text-accent` accents) so the interim state isn't actively off-brand if screenshotted or demoed.

3. **`page.tsx`'s type sizes and h1 font bypass the declared design system** — `text-3xl`/`text-lg`/`text-base` (page.tsx:14-22) don't correspond to any of the five declared scale tokens (`--text-heading-1` through `--text-body-sm`), and the `<h1>` uses `font-semibold` with no `font-display` class, so it renders in Manrope (body font) instead of the brand's Anton display face the guide mandates for "Títulos e destaques." **Fix:** apply `font-display` (or the equivalent Tailwind class bound to `--font-display`) to the `<h1>`, and swap the raw `text-*` utilities for ones matching the documented scale (or extend Tailwind's theme so `text-heading-1` etc. are usable class names, keeping page-level markup traceable to the token table).

---

## Detailed Findings

### Pillar 1: Copywriting (3/4)
- No generic labels found (`grep` for "Submit/Click Here/OK/Cancel/Save/No data/went wrong/try again" across `src/` returned zero matches).
- `SkipLink.tsx:12` — "Pular para o conteúdo" is a correct, specific PT-BR skip-link label.
- `page.tsx:24` — "Pedir no iFood" is a specific, on-task CTA label (not "Clique aqui" or "Saiba mais").
- `Footer.tsx:27` — "Siga a It's Garlic no Instagram (@itsgarlicrecife)" is specific and descriptive, good practice for a link opening a new tab.
- Docked one point because the homepage carries no real marketing copy yet — this is explicitly expected at this phase per `01-CONTEXT.md` (D-04: copy skeleton is Phase 2/3 scope), so this is a scope gap rather than a quality defect, but the pillar reflects what currently ships.

### Pillar 2: Visuals (2/4)
- `Header.tsx` and `Footer.tsx` are genuinely on-brand: real vectorized logo via `next/image` with `priority` + explicit dimensions, correct dark-surface tokens, accent-colored Instagram link, no icon-only buttons lacking labels.
- `page.tsx` — the only page content in the repository today — has no focal point tied to the brand (no logo, no garlic illustration, no diagonal block, no vibrant lime accent anywhere in the visible content area beyond inherited body background). It reads as a generic centered-hero placeholder with a black pill button, not "It's Garlic."
- No icon-only interactive elements exist yet, so no aria-label gap to report — but also no visual hierarchy differentiation beyond browser-default heading/paragraph/button sizing once the token-scale mismatch (see Pillar 4) is accounted for.
- Scored 2/4 because the shell components alone would score close to 4, but the page content that actually renders inside that shell undermines the pillar's "clear focal point / visual hierarchy" bar for the site as it stands today.

### Pillar 3: Color (2/4)
- Header/Footer/SkipLink/globals.css: zero hardcoded hex or `rgb()` literals found in any `.tsx` file (`grep` confirmed) — all color usage goes through `bg-accent`, `bg-surface-deep`, `bg-surface-primary`, `text-accent`, `text-text-on-dark` token classes, exactly per the brand guide's own rule ("nunca um hex literal").
- `page.tsx:22` is the exception and the most serious finding of this audit: `bg-black`, `text-white`, `hover:bg-zinc-800` are Tailwind's built-in gray/black palette, not the seven official brand tokens, and `zinc-800` in particular has no equivalent anywhere in `design-tokens.css`. Beyond being off-token, the color pairing is the *literal inverse* of what `docs/brand-guidelines.md` (line 159-161) prescribes for a primary CTA: lime background with dark text, never a black/white pairing.
- No accent-overuse problem (accent color usage is sparse, arguably under-used given the CTA doesn't use it at all).

### Pillar 4: Typography (2/4)
- Distinct sizes in use: `text-3xl`, `text-lg`, `text-base`, `text-sm` — 4 sizes, within the "no more than 4" abstract guideline, but none map to the five tokens (`--text-heading-1` 2rem, `--text-heading-2` 1.5rem, `--text-heading-3` 1.25rem, `--text-body` 1rem, `--text-body-sm` 0.875rem) `design-tokens.css` declares and `docs/brand-guidelines.md` documents as the mobile-first scale. Tailwind's `text-3xl` (1.875rem) and `text-lg` (1.125rem) are close-but-not-equal substitutes that will silently drift from the documented scale over time.
- Two font weights in use (`font-semibold`, `font-medium`) — within the abstract 2-weight guideline.
- More serious: `page.tsx:14`'s `<h1>` has no `font-display` class, so — despite Anton being self-hosted and correctly bound in `layout.tsx` — the page's only heading renders in the body typeface (Manrope), contradicting the brand guide's explicit "Títulos e destaques (`font-display` no Tailwind)" rule. Header/Footer correctly apply `font-display` where used (`Footer.tsx:17`), making `page.tsx`'s omission a clear, isolated regression rather than a systemic gap.

### Pillar 5: Spacing (3/4)
- Spacing classes found across the shell are all standard Tailwind scale values (`p-4`, `p-8`, `py-4`, `py-8`, `px-6`, `gap-6`, `gap-2`) — no arbitrary bracket values (`grep` for `\[.*px\]|\[.*rem\]` found none in any `.tsx`).
- Header/Footer share a consistent `mx-auto max-w-5xl px-4 sm:px-6` container pattern. `page.tsx` uses a different, unrelated `min-h-screen ... p-8` full-viewport-centering pattern with no `max-w-5xl` container — a minor structural inconsistency between the shared shell's established container convention and the one page that currently renders inside it. Not a hard failure (both are internally consistent, mobile-first, and use standard scale values), but worth aligning once Phase 2 replaces this content.

### Pillar 6: Experience Design (3/4)
- Skip link (`SkipLink.tsx`) is correctly implemented: `sr-only` (not `display:none`, preserving focusability) with a `focus:not-sr-only` visible state, targeting `#main-content`, which matches the `id` on `layout.tsx`'s `<main>`.
- Global `:focus-visible` ring (`globals.css:21-24`) applies a 3px brand-accent outline to every focusable element site-wide, replacing rather than removing the browser default — computed contrast ≈12.8:1/≈17.3:1 against both dark surfaces per the brand guide's own table.
- No loading/error/empty states exist anywhere in `src/` — appropriate for this phase, since all data (`getStoreInfo()`, `buildIFoodUrl()`) is synchronous local/typed data with no network calls, no user input, and no destructive actions to confirm.
- No `not-found.tsx` or `error.tsx` route exists yet under `src/app/`. Not a defect against this phase's stated scope (REQUIREMENTS.md's block-1 items don't mandate these routes in Phase 1), but flagged as a gap to close before a production launch — Next.js's default fallback pages are not on-brand.
- `target="_blank"` links (`Footer.tsx`, `page.tsx`) correctly pair with `rel="noopener noreferrer"`, a real security/UX good practice, not just a cosmetic pass.

---

## Registry Safety

`components.json` not found — shadcn not initialized in this project. Registry audit skipped.

---

## Files Audited

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/globals.css`
- `src/components/layout/Header.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/SkipLink.tsx`
- `src/styles/design-tokens.css`
- `docs/brand-guidelines.md`
- `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-CONTEXT.md`
- `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-02-SUMMARY.md`
- `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-05-SUMMARY.md`
- `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-06-SUMMARY.md`

// The ONE section-boundary device in this codebase (G-02-4). It marks a seam between two
// adjacent sections that share the same dark surface — a later phase that adds a new charcoal
// (bg-surface-primary) section next to an existing one must render this component at each of its
// own same-surface edges rather than inventing a local divider; src/components/home/
// section-boundaries.test.ts sweeps all of src/ and fails if a second hand-rolled boundary shape
// appears anywhere else.
//
// Salience, not just shape, is what makes the band readable. The one-off wedge this replaces
// (previously inside BrandStory.tsx) was Preto on Carvão — a 1.35:1 contrast — and the brand's
// two dark surfaces only differ from each other by that same 1.35:1, so a taper between them
// cannot carry a boundary on its own
// (.planning/debug/DEBUG-charcoal-sections-no-separator.md, Evidence 2026-09-13T23:52). Oliva
// (`--color-accent-olive`) is the one brand value that clears the 3:1 non-text contrast minimum
// against Carvão, measured at 3.74:1 — that is why the rule on both edges of this band is olive,
// not another dark-on-dark taper.
//
// The band's height is the UI-SPEC Spacing Scale's `2xl` value (48px) at the mobile base,
// stepping up one scale step to `3xl` (64px) at the `sm` breakpoint — this band IS the declared
// inter-section gap, not an extra element added on top of it.
//
// Purely decorative: aria-hidden, no text, no children other than its own shape, no interactive
// element, no tab stop.
export const SEPARATOR_CLASS =
  "relative h-12 overflow-hidden border-t border-b border-accent-olive bg-surface-deep sm:h-16";

export function SectionSeparator() {
  return (
    <div aria-hidden="true" className={SEPARATOR_CLASS}>
      <div className="absolute inset-0 bg-surface-primary [clip-path:polygon(0_0,100%_0,0_100%)]" />
    </div>
  );
}

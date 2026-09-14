// D-01/D-02 — final brand-story section (CONT-02, `writtenInPhase: 2`). Server Component, no
// client directive, no read of the wall clock. Renders brandStoryCopy.heading as an H2 and maps
// over brandStoryCopy.paragraphs as body copy — the prose lives in the copy module, not inline,
// so a wording change is a one-file diff. Reuses Footer.tsx's section-container shape (charcoal
// surface + max-width wrapper) on the surface the 02-UI-SPEC.md Color table assigns to this
// section.
//
// Section boundaries are owned by the shared `SectionSeparator` component
// (src/components/layout/SectionSeparator.tsx) — this section no longer draws its own (G-02-4).
// The one-off diagonal wedge that used to live at this section's bottom edge was the only
// separator in the whole page while the charcoal surface it shares repeats across three more
// sections (Location, FAQ, the footer); see
// .planning/debug/DEBUG-charcoal-sections-no-separator.md. `src/app/page.tsx` now renders the
// shared device at this section's own boundary instead, so the `relative overflow-hidden`
// utilities that only existed to host the local wedge are gone too.
import { brandStoryCopy } from "@/content/home-copy";

export function BrandStory() {
  return (
    <section className="bg-surface-primary text-text-on-dark">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
        <h2 className="font-display text-[length:var(--text-heading-2)]">
          {brandStoryCopy.heading}
        </h2>
        {brandStoryCopy.paragraphs.map((paragraph, index) => (
          <p key={index} className="text-[length:var(--text-body)]">
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}

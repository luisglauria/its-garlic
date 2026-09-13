// D-01/D-02 — final brand-story section (CONT-02, `writtenInPhase: 2`). Server Component, no
// client directive, no read of the wall clock. Renders brandStoryCopy.heading as an H2 and maps
// over brandStoryCopy.paragraphs as body copy — the prose lives in the copy module, not inline,
// so a wording change is a one-file diff. Reuses Footer.tsx's section-container shape (charcoal
// surface + max-width wrapper) on the surface the 02-UI-SPEC.md Color table assigns to this
// section.
//
// The UI-SPEC assigns that same charcoal surface to this section, Location and the FAQ, so the
// three sit adjacent on the same background. Rather than substitute a colour the spec did not
// assign, a decorative diagonal wedge at this section's bottom edge (docs/brand-guidelines.md's
// "formas diagonais... entre seções") reveals the page's black <body> background (layout.tsx),
// separating this section visually from Location without touching Location.tsx (02-03's scope is
// this file, Faq.tsx and page.tsx only — the wedge is achieved entirely from inside this section's
// own box). aria-hidden: purely decorative, carries no content of its own.
import { brandStoryCopy } from "@/content/home-copy";

export function BrandStory() {
  return (
    <section className="relative overflow-hidden bg-surface-primary text-text-on-dark">
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
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-surface-deep [clip-path:polygon(0_100%,100%_40%,100%_100%)] sm:h-10"
      />
    </section>
  );
}

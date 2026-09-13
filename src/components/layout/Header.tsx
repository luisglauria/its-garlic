// MARCA-05 — the vectorized primary logo, rendered on the brand's own black surface token
// (surface-deep), which is the exact same black the logo-principal SVG's own embedded
// background already uses, so there is no visible seam between the two.
// This component renders only the header's inner content — src/app/layout.tsx (Task 1) already
// wraps it in the page's single <header> landmark.
import Image from "next/image";

export function Header() {
  return (
    <div className="bg-surface-deep">
      <div className="mx-auto flex max-w-5xl items-center px-4 py-4 sm:px-6">
        {/* Above-the-fold on every page — marked priority so it preloads instead of lazy-loading,
            per the project's LCP budget (RESEARCH.md, CLAUDE.md "What NOT to Use"). Explicit
            width/height reserve the image's box and prevent layout shift (CLS). The SVG's own
            square viewBox (1254x1254) sets the 1:1 aspect ratio these numbers describe. */}
        <Image
          src="/brand/logo-principal.svg"
          alt="It's Garlic — mais que um pão de alho"
          width={160}
          height={160}
          priority
          className="h-14 w-14 sm:h-16 sm:w-16"
        />
      </div>
    </div>
  );
}

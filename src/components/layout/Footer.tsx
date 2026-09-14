// Store identity, read only through the plan 01-02 repository/integration seams — never a
// hardcoded address or URL literal. Renders no operating-hours block: src/data/store.ts ships
// hours.provisional = true with an empty schedule, and LOCAL-03 (Phase 2) owns the labelled
// provisional display; an empty hours block here would be a worse outcome than omitting it.
// This component renders only the footer's inner content — src/app/layout.tsx (Task 1) already
// wraps it in the page's single <footer> landmark.
import { getStoreInfo } from "@/lib/repositories/store-repository";
import { buildInstagramUrl } from "@/lib/integrations/instagram";
import { SectionSeparator } from "./SectionSeparator";

export function Footer() {
  const store = getStoreInfo();
  const instagram = buildInstagramUrl();

  return (
    <div className="bg-surface-primary text-text-on-dark">
      {/* The footer sits on the same charcoal surface (bg-surface-primary) as the FAQ section
          above it, so it needs its own top separator — the third of three same-surface seams
          this plan closes, and the one the user never reported (G-02-4). */}
      <SectionSeparator />
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-4 py-8 sm:px-6">
        <p className="font-display text-lg tracking-wide text-accent uppercase">{store.name}</p>
        <p className="text-sm">
          {store.address} — {store.neighborhood}, {store.city} - {store.state}
        </p>
        <a
          href={instagram.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-accent underline decoration-accent underline-offset-4 hover:text-text-on-dark"
        >
          Siga a It&apos;s Garlic no Instagram (@itsgarlicrecife)
        </a>
      </div>
    </div>
  );
}

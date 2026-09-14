// LOCAL-01..04 — the location section: address, service modalities, honest hours, and the one
// confirmed outbound link in this phase. Reads its data as props (`{ store, maps }`) rather than
// self-fetching (RESEARCH.md Pattern 1) — that is what makes the empty-versus-populated schedule
// and the zero-one-many modalities branches testable with fixtures, since real data only ever
// produces one branch of each pair. Reuses Footer.tsx's address/anchor shape (02-PATTERNS.md
// Location analog) and the shared ProvisionalBadge (plan 02-01, D-03).
import type { StoreInfo } from "@/lib/schemas/store.schema";
import type { IntegrationLink } from "@/lib/integrations/types";
import { ctaCopy, locationCopy } from "@/content/home-copy";
import { ProvisionalBadge } from "./ProvisionalBadge";

// Typed against the schema's own modality enum (`StoreInfo["modalities"][number]`) — adding a
// fourth modality to the schema becomes a compile error here rather than a silently missing chip
// (LOCAL-02, T-02-13).
const MODALITY_LABEL: Record<StoreInfo["modalities"][number], string> = {
  balcao: "Balcão",
  delivery: "Delivery",
  "take-away": "Take away",
};

const SUBHEADING_CLASS =
  "font-body text-[length:var(--text-body-sm)] font-semibold uppercase tracking-wide text-accent";

export function Location({ store, maps }: { store: StoreInfo; maps: IntegrationLink }) {
  return (
    <section className="bg-surface-primary text-text-on-dark">
      <div className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 sm:px-6">
        <h2 className="font-display text-[length:var(--text-heading-2)]">{locationCopy.heading}</h2>

        <div className="flex flex-col gap-2">
          <h3 className={SUBHEADING_CLASS}>{locationCopy.addressHeading}</h3>
          {/* Address shape reused verbatim from Footer.tsx — never a literal in this file, always
              the record the page passed down from getStoreInfo(). */}
          <p className="text-[length:var(--text-body)]">
            {store.address} — {store.neighborhood}, {store.city} - {store.state}
          </p>
        </div>

        {/* LOCAL-02 backstop: a zero-item modalities array renders no row and no empty-state
            sentence at all — a visible "sem modalidades" message would be a worse answer than
            silence (02-UI-SPEC.md UI Considerations, Empty/backstop row). */}
        {store.modalities.length > 0 && (
          <div className="flex flex-col gap-2">
            <h3 className={SUBHEADING_CLASS}>{locationCopy.modalitiesHeading}</h3>
            <ul className="flex flex-wrap gap-2">
              {store.modalities.map((modality) => (
                <li
                  key={modality}
                  className="rounded-full bg-surface-deep px-3 py-1 text-[length:var(--text-body-sm)] font-body"
                >
                  {MODALITY_LABEL[modality]}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className={SUBHEADING_CLASS}>{locationCopy.hoursHeading}</h3>
            {/* Driven by the record's own provisional flag, not by whether the schedule is
                empty — the day the client sends real hours the schedule becomes populated while
                the data may still await confirmation; a marker wired to emptiness would silently
                vanish at exactly the wrong moment (T-02-10). */}
            {store.hours.provisional && <ProvisionalBadge />}
          </div>
          {store.hours.schedule.length === 0 ? (
            // No operating hour is confirmed — the honest answer is the pending body, never a
            // guessed time (tone-of-voice.md §5, D-07).
            <p className="text-[length:var(--text-body)]">{locationCopy.hoursPendingBody}</p>
          ) : (
            // Both branches exist from the start, so the client's eventual real-hours delivery
            // is a data edit against this shape, not a component rewrite (LOCAL-03).
            <ul className="flex flex-col gap-1">
              {store.hours.schedule.map((row, index) => (
                // 02-REVIEW.md WR-02: `days` isn't schema-guaranteed unique (e.g. a future split
                // into separate lunch/dinner windows for the same day) — index-suffixed to avoid
                // a silent React-key collision.
                <li key={`${row.days}-${index}`} className="text-[length:var(--text-body)]">
                  <span className="font-semibold">{row.days}:</span> {row.open} – {row.close}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* LOCAL-04: buildMapsUrl() reports confirmed: true today — a live anchor, no pending
            branch needed, reusing Footer.tsx's external-anchor shape verbatim and the hero CTA
            row's own "Como chegar" label rather than a second vocabulary. */}
        <a
          href={maps.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 w-fit items-center text-[length:var(--text-body)] text-accent underline decoration-accent underline-offset-4 hover:text-text-on-dark"
        >
          {ctaCopy.mapsLabel}
        </a>
      </div>
    </section>
  );
}

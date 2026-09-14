// The FAQ section (CONT-02, `writtenInPhase: 2`) — the four practical questions the content
// skeleton assigns, answered by the browser's own disclosure element. Server Component, no client
// directive. Each entry maps to a native <details>/<summary> pair (RESEARCH.md Don't Hand-Roll):
// the browser already exposes its own open/closed state to assistive tech, already behaves as a
// button, and already responds to Enter/Space — zero JavaScript, no state hook, no click handler,
// and no hand-wired accessibility attributes duplicating what the native element already provides.
import { faqs } from "@/content/home-copy";

export function Faq() {
  return (
    <section className="bg-surface-primary text-text-on-dark">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:px-6 sm:py-10">
        <h2 className="font-display text-[length:var(--text-heading-2)]">Perguntas frequentes</h2>
        <div className="flex flex-col gap-2">
          {faqs.map((entry) => (
            <details key={entry.question} className="group border-b border-accent-olive/40 py-3">
              {/* --text-heading-3 is the existing sub-heading token the UI-SPEC reserves for FAQ
                  question text, one level below this section's own H2 — not a new size. The
                  min-h-11 floor meets the 44px touch-target minimum (UI-SPEC Spacing Scale). */}
              <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-display text-[length:var(--text-heading-3)] marker:content-none">
                <span>{entry.question}</span>
                <span aria-hidden="true" className="text-accent group-open:rotate-180">
                  ▾
                </span>
              </summary>
              <p className="pt-2 text-[length:var(--text-body)]">{entry.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

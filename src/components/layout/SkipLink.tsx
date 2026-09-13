// PERF-01 — skip link. Visually hidden via Tailwind's `sr-only` utility (clipped via absolute
// positioning, which stays focusable — never the CSS display-none technique, which would not),
// until it receives keyboard focus, at which point `focus:not-sr-only` restores it as a
// high-contrast, fixed-position link. Its fragment target (`#main-content`) must always match
// the `id` on the `<main>` landmark in `src/app/layout.tsx`.
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-surface-deep focus:font-body focus:text-sm focus:font-semibold"
    >
      Pular para o conteúdo
    </a>
  );
}

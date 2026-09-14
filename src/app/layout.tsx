// Root layout — stays a plain Server Component (no client-only directive, no client hooks,
// and it never reads the wall clock anywhere, so it carries no hydration-mismatch risk).
// Wraps every page in one semantic shell: skip link, header landmark, single main landmark,
// footer landmark. Both type families are self-hosted through next/font/google and bound to
// --font-display-anton / --font-body-manrope — names deliberately DISTINCT from the
// --font-display / --font-body Tailwind theme keys that consume them in
// src/styles/design-tokens.css (a same-name binding is the self-reference bug this plan fixes;
// see .planning/debug/DEBUG-focus-ring-invisible-faq-directions.md) — no runtime request ever
// reaches a font CDN.
import type { Metadata } from "next";
import { Anton, Manrope } from "next/font/google";
import "./globals.css";
import { SkipLink } from "@/components/layout/SkipLink";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display-anton",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body-manrope",
});

// Placeholder title/description drawn from the `seo-metadata` slot description in
// src/content/skeleton.ts (target terms: Recife, Mercado da Torre) — that entry defines the
// slot, not final wording; it states no product, price, or hour, so neither does this.
// Phase 5 (SEO-01) owns the final, optimised metadata.
export const metadata: Metadata = {
  title: "It's Garlic | Mais que um pão de alho — Mercado da Torre, Recife",
  description:
    "It's Garlic, no Mercado da Torre, em Recife: pão de alho recheado, sanduíches, petiscos, espetinhos, almoço e happy hour. Peça pelo iFood ou fale no WhatsApp.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${manrope.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-surface-deep font-body text-text-on-dark">
        <SkipLink />
        <header>
          <Header />
        </header>
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <footer>
          <Footer />
        </footer>
      </body>
    </html>
  );
}

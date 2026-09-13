import { getStoreInfo } from "@/lib/repositories/store-repository";
import { buildIFoodUrl } from "@/lib/integrations/ifood";

export default function Home() {
  const store = getStoreInfo();
  const ifood = buildIFoodUrl();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      {/* A <section>, not a second <main> — src/app/layout.tsx (plan 01-06) already renders
          the page's one <main id="main-content"> landmark; nesting a second <main> here would
          violate PERF-01's single-landmark rule. */}
      <section className="flex flex-col items-center gap-6">
        <h1 className="text-3xl font-semibold tracking-tight">{store.name}</h1>
        <p className="max-w-md text-lg">
          {store.address} — {store.neighborhood}, {store.city} - {store.state}
        </p>
        {ifood.confirmed ? (
          <a
            href={ifood.url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Pedir no iFood
          </a>
        ) : (
          // CR-01: the iFood destination is not yet confirmed (src/data/links.ts) — render a
          // visibly disabled affordance instead of a live-looking link to a placeholder URL.
          // A native disabled <button> needs no client-side JS to be inert or announced
          // correctly by assistive tech.
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-full bg-zinc-300 px-6 py-3 text-base font-medium text-zinc-500"
          >
            Pedido pelo iFood em breve
          </button>
        )}
      </section>
    </div>
  );
}

import { getStoreInfo } from "@/lib/repositories/store-repository";
import { buildIFoodUrl } from "@/lib/integrations/ifood";

export default function Home() {
  const store = getStoreInfo();
  const ifoodUrl = buildIFoodUrl();

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
        <a
          href={ifoodUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full bg-black px-6 py-3 text-base font-medium text-white transition-colors hover:bg-zinc-800"
        >
          Pedir no iFood
        </a>
      </section>
    </div>
  );
}

import { getStoreInfo } from "@/lib/repositories/store-repository";
import { buildIFoodUrl } from "@/lib/integrations/ifood";
import { buildWhatsAppUrl } from "@/lib/integrations/whatsapp";
import { buildMapsUrl } from "@/lib/integrations/maps";
import { Hero } from "@/components/home/Hero";
import { CtaGroup } from "@/components/home/CtaGroup";
import { Location } from "@/components/home/Location";

// Data/integration builders are called once here and passed down as typed props (RESEARCH.md
// Pattern 1) — no `home/` component fetches its own data. Neither this file nor any `home/`
// component constructs a URL literal: every destination goes through a `build*Url()` chokepoint
// (SEC-03), each of which calls `assertAllowedHost()` internally.
export default function Home() {
  const store = getStoreInfo();
  const ifood = buildIFoodUrl();
  const whatsapp = buildWhatsAppUrl();
  const maps = buildMapsUrl();

  return (
    <>
      {/* Neither Hero, CtaGroup nor Location is a second <main> — src/app/layout.tsx (plan
          01-06) already renders the page's one <main id="main-content"> landmark. D-01's fixed
          order: Hero, CtaGroup, (brand story — plan 02-03), Location, (FAQ — plan 02-03); plan
          02-03 only inserts two components without reordering these. */}
      <Hero />
      <CtaGroup ifood={ifood} whatsapp={whatsapp} maps={maps} />
      <Location store={store} maps={maps} />
    </>
  );
}

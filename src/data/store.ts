// Store facts confirmed in PROJECT.md (Business Context / Context sections). `hours` is
// deliberately left provisional — the only references found for operating hours are two
// divergent Instagram stories 2.5-4.8 years old (format references only, never treated as
// current). LOCAL-03 (Phase 2) owns the labelled provisional display of these hours.
import type { StoreInfo } from "@/lib/schemas/store.schema";

const storeData: StoreInfo = {
  name: "It's Garlic",
  address: "Rua José Bonifácio, 747",
  neighborhood: "Mercado da Torre",
  city: "Recife",
  state: "PE",
  modalities: ["balcao", "delivery", "take-away"],
  hours: {
    provisional: true,
    pendingConfirmation:
      "As únicas referências de horário encontradas são stories divergentes do Instagram, " +
      "com 2,5 a 4,8 anos de idade — o horário de funcionamento real ainda aguarda " +
      "confirmação do cliente.",
    schedule: [],
  },
};

export default storeData;

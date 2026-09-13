// Source: RESEARCH.md Pattern 1 — the only sanctioned path from store data to UI (ARQ-02 seam 1).
import { storeInfoSchema } from "@/lib/schemas/store.schema";
import rawStore from "@/data/store";

export function getStoreInfo() {
  // `.parse`, not `.safeParse` — a malformed edit must throw and fail the build (ARQ-03),
  // not degrade into a rendered page with a blank address.
  return storeInfoSchema.parse(rawStore);
}

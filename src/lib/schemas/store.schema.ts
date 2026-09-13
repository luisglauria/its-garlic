// Source: RESEARCH.md Pattern 1 — Zod v4 idioms (z.infer/.parse unchanged from v3;
// shape-spread over `.merge()`; `error.issues` over the v3 `error.errors` name).
import { z } from "zod";

export const storeInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  neighborhood: z.literal("Mercado da Torre"),
  city: z.literal("Recife"),
  state: z.literal("PE"),
  modalities: z.array(z.enum(["balcao", "delivery", "take-away"])),
  hours: z.object({
    // ARQ-03 + CONT-03: cannot ship as `false` until the client confirms real hours —
    // flipping this flag is a deliberate schema edit, not a silent data change.
    provisional: z.literal(true),
    pendingConfirmation: z.string().min(1),
    schedule: z.array(
      z.object({ days: z.string(), open: z.string(), close: z.string() }),
    ),
  }),
});

export type StoreInfo = z.infer<typeof storeInfoSchema>;

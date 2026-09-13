// Source: RESEARCH.md Pattern 2 (Centralized, Allowlisted Integration Links).
// An unconfirmed destination (`confirmed: false`) with no `pendingConfirmation` explanation
// is exactly the state that silently ships a guessed link (CONT-03) — refused via `.refine`.
import { z } from "zod";

export const externalLinkSchema = z
  .object({
    id: z.enum(["ifood", "whatsapp", "instagram", "maps"]),
    url: z.url(),
    confirmed: z.boolean(),
    pendingConfirmation: z.string().min(1).optional(),
  })
  .refine(
    (link) =>
      link.confirmed ||
      (typeof link.pendingConfirmation === "string" &&
        link.pendingConfirmation.length > 0),
    {
      message:
        "An unconfirmed external link must carry a non-empty pendingConfirmation explanation",
      path: ["pendingConfirmation"],
    },
  );

export const externalLinksSchema = z.array(externalLinkSchema);

export type ExternalLink = z.infer<typeof externalLinkSchema>;
export type ExternalLinkId = ExternalLink["id"];

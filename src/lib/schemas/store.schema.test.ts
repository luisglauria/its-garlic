// ARQ-03 — schema behaviours (build gate has teeth); plus one externalLinkSchema case.
import { describe, expect, test } from "vitest";
import { storeInfoSchema } from "./store.schema";
import { externalLinkSchema } from "./link.schema";

const validStore = {
  name: "It's Garlic",
  address: "Rua José Bonifácio, 747",
  neighborhood: "Mercado da Torre",
  city: "Recife",
  state: "PE",
  modalities: ["balcao", "delivery", "take-away"],
  hours: {
    provisional: true,
    pendingConfirmation: "Horário aguardando confirmação do cliente.",
    schedule: [],
  },
} as const;

describe("storeInfoSchema", () => {
  test("rejects an object with the address field removed", () => {
    const withoutAddress: Record<string, unknown> = { ...validStore };
    delete withoutAddress.address;
    const result = storeInfoSchema.safeParse(withoutAddress);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.path.includes("address"))).toBe(
        true,
      );
    }
  });

  test("rejects an object whose address is an empty string", () => {
    const result = storeInfoSchema.safeParse({ ...validStore, address: "" });
    expect(result.success).toBe(false);
  });

  test("accepts hours.schedule as an empty array while hours.provisional is true", () => {
    const result = storeInfoSchema.safeParse(validStore);
    expect(result.success).toBe(true);
  });

  test("rejects hours.provisional set to false", () => {
    const result = storeInfoSchema.safeParse({
      ...validStore,
      hours: { ...validStore.hours, provisional: false },
    });
    expect(result.success).toBe(false);
  });
});

describe("externalLinkSchema", () => {
  test("rejects a record with confirmed: false and no pendingConfirmation", () => {
    const result = externalLinkSchema.safeParse({
      id: "ifood",
      url: "https://www.ifood.com.br/PLACEHOLDER_PENDING_CLIENT_CONFIRMATION",
      confirmed: false,
    });
    expect(result.success).toBe(false);
  });
});

// Final Portuguese copy for the sections this phase writes (CONT-02, `writtenInPhase: 2` per
// src/content/skeleton.ts's `hero` and `ctas` entries). Written against
// src/content/tone-of-voice.md's hard rules (§5) — never against skeleton.ts's structural
// inventory alone — and against only the facts .planning/PROJECT.md already confirms. States no
// product name, no price, no operating hour, no award, no rating and no superlative.
//
// This is a content module, not a data module: it imports nothing from src/data/* and the
// ARQ-02 lint boundary (`no-restricted-imports`, eslint.config.mjs) applies to it like any other
// non-seam file.

export interface HeroCopy {
  readonly kicker: string;
  readonly headline: string;
  readonly subhead: string;
  readonly imageAlt: string;
  readonly imageDisclosure: string;
}

// `kicker` is the locked brand concept line (HERO-01, skeleton.ts's `hero.carries[0]`).
// `headline` and `subhead` restate only facts PROJECT.md already confirms: the house is a
// relaxed restaurant inside the Mercado da Torre in Recife, its stuffed garlic bread is the
// signature and the starting point of the menu rather than its ceiling, and it also serves
// sandwiches on garlic bread, petiscos, espetinhos, almoço and happy hour. Both lines are kept
// short enough to fit a 360px-wide screen inside two lines at the Display size (tone-of-voice.md
// §3's mobile two-line fit rule).
export const heroCopy: HeroCopy = {
  kicker: "Mais que um pão de alho!",
  headline: "O pão de alho é só o começo.",
  subhead:
    "Um restaurante descontraído dentro do Mercado da Torre, em Recife — com sanduíches no pão de alho, petiscos, espetinhos, almoço e happy hour.",
  imageAlt:
    "Ilustração de um alho em traço lima sobre fundo escuro, cercada por blocos diagonais da identidade visual da marca",
  imageDisclosure: "Imagem ilustrativa — foto real em breve",
};

// The one label the shared ProvisionalBadge renders by default (D-03, reused by plan 02-02's
// hours notice). Kept short and generic on purpose — the specific explanation for each use
// (e.g. the hero's `imageDisclosure` above) is rendered as its own adjacent line, not folded
// into the badge text itself.
export const provisionalBadgeLabel = "Provisório";

export interface CtaCopy {
  readonly menuLabel: string;
  readonly ifoodLabel: string;
  readonly whatsappLabel: string;
  readonly mapsLabel: string;
  readonly pendingSuffix: string;
  readonly ifoodUnavailableNotice: string;
}

// `menuLabel`/`ifoodLabel`/`mapsLabel` are the three HERO-02 labels, locked verbatim
// (skeleton.ts's `ctas` entry) — this module does not re-open them. `whatsappLabel` names the
// WhatsApp channel as its own destination (tone-of-voice.md §6). `pendingSuffix` and
// `ifoodUnavailableNotice` keep D-05's "problem + working next step" shape: they name the real
// situation and point at the one action that genuinely works right now ("Como chegar"), and they
// invent no hour, no delivery date, and no pressure (tone-of-voice.md §5).
export const ctaCopy: CtaCopy = {
  menuLabel: "Ver cardápio",
  ifoodLabel: "Pedir no iFood",
  whatsappLabel: "Chamar no WhatsApp",
  mapsLabel: "Como chegar",
  pendingSuffix: "(em breve)",
  ifoodUnavailableNotice:
    "Pedido pelo iFood chegando em breve — enquanto isso, dá uma olhada em como chegar até a loja.",
};

export interface LocationCopy {
  readonly heading: string;
  readonly addressHeading: string;
  readonly modalitiesHeading: string;
  readonly hoursHeading: string;
  readonly hoursPendingBody: string;
}

// LOCAL-01..04 final copy (skeleton.ts's `contact-location` entry, `writtenInPhase: 2`).
// `hoursPendingBody` is the sentence the phase's content-integrity rule turns on: it states
// plainly that the hours are unconfirmed and names the one concrete way to resolve it — checking
// on iFood or on WhatsApp before travelling. No time of day, no day range, no "geralmente", and
// nothing implying the store is probably open (tone-of-voice.md §5, approved rewrite §7 example
// 2). Wording matches 02-UI-SPEC.md's Copywriting Contract empty-state rows verbatim, which are
// themselves the on-tone default per that contract's own note. `mapsLabel` is deliberately not
// duplicated here — the Location directions anchor reuses `ctaCopy.mapsLabel`, the same locked
// "Como chegar" label already rendered by the hero CTA row, rather than a second vocabulary.
export const locationCopy: LocationCopy = {
  heading: "Onde fica a It's Garlic",
  addressHeading: "Endereço",
  modalitiesHeading: "Formas de atendimento",
  hoursHeading: "Horário de funcionamento",
  hoursPendingBody: "Em atualização — confirme no iFood ou no WhatsApp antes de vir.",
};

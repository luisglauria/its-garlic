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
  readonly whatsappUnavailableNotice: string;
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
  // 02-REVIEW.md WR-01: mirrors ifoodUnavailableNotice's "problem + working next step" shape
  // (D-05, tone-of-voice.md §5) — WhatsApp is unconfirmed exactly like iFood (src/data/links.ts)
  // and needs the same explained-disabled treatment, not a silently inert button next to one
  // that explains itself. Deliberately its own brand-voice string, not `IntegrationLink.
  // pendingConfirmation` rendered verbatim — that field is internal build-status text ("URL
  // real da loja... ainda não foi confirmada pelo cliente"), not copy meant for visitors.
  whatsappUnavailableNotice:
    "Atendimento pelo WhatsApp chegando em breve — enquanto isso, dá uma olhada em como chegar até a loja.",
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

export interface BrandStoryCopy {
  readonly heading: string;
  readonly paragraphs: readonly string[];
}

// Final brand-story copy (CONT-02, skeleton.ts's `brand-story` entry, `writtenInPhase: 2`).
// Covers exactly the three points that entry carries — what the house is, where it is, why the
// stuffed garlic bread is the signature — and nothing beyond them. No product name, price, hour,
// award, rating or superlative; every sentence is defensible from PROJECT.md alone
// (tone-of-voice.md §5). Two tight paragraphs rather than an institutional brand manifesto
// (tone-of-voice.md §3): the first sets what the house is and where, the second sets why the
// garlic bread carries the name and names the wider range as the proof of "mais que um pão de
// alho" — the concept line already locked by heroCopy.kicker above.
export const brandStoryCopy: BrandStoryCopy = {
  heading: "Mais que um pão de alho",
  paragraphs: [
    "A It's Garlic é um restaurante descontraído dentro do Mercado da Torre, em Recife — não uma hamburgueria genérica com um item de pão de alho perdido no meio do cardápio.",
    "O pão de alho recheado é o motivo do nome e o ponto de partida da casa, não o teto dela: por aqui também tem sanduíche no pão de alho, petisco, espetinho, almoço e happy hour.",
  ],
};

export interface FaqEntry {
  readonly question: string;
  readonly answer: string;
}

// Final FAQ copy (CONT-02, skeleton.ts's `faqs` entry, `writtenInPhase: 2`) — exactly the four
// questions that entry carries, built only from facts PROJECT.md already confirms. This module
// imports nothing from src/data/* (ARQ-02), so the address/modality answers below are literal
// text, not a read of the record; sections.test.ts reads the real record through getStoreInfo()
// and asserts these answers agree with it, which is what keeps this from becoming a second,
// drifting source of the same facts. The ordering answer names iFood and WhatsApp as destinations
// without promising a working link on this site — both are still unconfirmed (INTEGRA-05) — and
// implies no cart, no checkout and no order form here.
export const faqs: readonly FaqEntry[] = [
  {
    question: "Onde fica a It's Garlic?",
    answer:
      "A It's Garlic fica na Rua José Bonifácio, 747, no Mercado da Torre, em Recife - PE.",
  },
  {
    question: "Como eu peço?",
    answer:
      "Pelo iFood, que é o canal principal de pedido, ou pelo WhatsApp, canal alternativo de atendimento. Os links diretos de cada um ainda estão em confirmação — procure \"It's Garlic\" no aplicativo que preferir enquanto isso.",
  },
  {
    question: "Quais são as formas de atendimento?",
    answer:
      "Balcão, delivery e take away — você escolhe a forma que for melhor pra você.",
  },
  {
    question: "Tem entrega (delivery)?",
    answer:
      "Sim, delivery é uma das formas de atendimento da casa, ao lado do balcão e do take away. Peça pelo iFood ou fale no WhatsApp para confirmar a entrega até você.",
  },
];

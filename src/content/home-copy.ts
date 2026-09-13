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

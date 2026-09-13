// Source: 01-03-PLAN.md Task 2 <action> — the typed inventory of every section the site will
// ship (CONT-02), with what information each carries and whether that information is confirmed
// or pending client confirmation (CONT-03, D-05). This describes structure and information
// carried, not final polished copy — see src/content/tone-of-voice.md's closing note: final
// per-section wording is written by the phase named in `writtenInPhase` (D-04).
//
// Mirrors the `confirmed` / `pendingConfirmation` marker convention already established by
// plan 01-02's src/lib/schemas/store.schema.ts (`hours.provisional` + `hours.pendingConfirmation`)
// rather than inventing a second vocabulary for the same idea.

/** The seven sections every page of the site will ship, per CONT-02. */
export type ContentSectionId =
  | "hero"
  | "brand-story"
  | "product-categories"
  | "ctas"
  | "faqs"
  | "seo-metadata"
  | "contact-location";

export interface ContentSection {
  /** Which of the seven required sections this entry describes. */
  readonly id: ContentSectionId;
  /** Short human-readable name for the section. */
  readonly title: string;
  /** What this section is for — why it exists on the page. */
  readonly purpose: string;
  /** What information this section carries — description of information, not final wording. */
  readonly carries: readonly string[];
  /** Whether every fact this section carries is already confirmed by PROJECT.md. */
  readonly confirmed: boolean;
  /**
   * Required when `confirmed` is false: names precisely which fact is pending and cites where
   * that pendency is tracked (REQUIREMENTS.md bloco 5 / PROJECT.md Pendências).
   */
  readonly pendingConfirmation?: string;
  /** The phase number that writes this section's final, polished copy (D-04). */
  readonly writtenInPhase: number;
}

export const contentSkeleton: readonly ContentSection[] = [
  {
    id: "hero",
    title: "Hero",
    purpose:
      "Primeira tela do site — comunica o conceito da marca em segundos e direciona o visitante para as três ações principais.",
    carries: [
      "A linha do conceito central da marca — 'Mais que um pão de alho!' — como abertura do hero",
      "O foco em fotografia real de produto (o pão de alho recheado) como imagem de destaque",
      "Os três rótulos de CTA do hero: Ver cardápio, Pedir no iFood, Como chegar",
    ],
    confirmed: true,
    writtenInPhase: 2,
  },
  {
    id: "brand-story",
    title: "Apresentação da marca",
    purpose:
      "Explica o que é a It's Garlic, onde fica e por que o pão de alho recheado é a assinatura da casa, não apenas mais um item do cardápio.",
    carries: [
      "O que a It's Garlic é: um restaurante descontraído, não uma hamburgueria genérica",
      "Onde a casa fica: dentro do Mercado da Torre, em Recife",
      "Por que o pão de alho recheado é a assinatura da marca, e não apenas um item entre outros",
    ],
    confirmed: true,
    writtenInPhase: 2,
  },
  {
    id: "product-categories",
    title: "Categorias de produto",
    purpose:
      "Apresenta a estrutura do cardápio pelas dez categorias oficiais, antes do detalhe de cada item — dá ao visitante o mapa do que a casa serve.",
    carries: [
      "As dez categorias oficiais do cardápio: pães de alho, sanduíches no pão de alho, sanduíches tradicionais, sanduíches premium, petiscos, espetinhos, almoço, bebidas, happy hour, combo do dia",
      "A nota de que a categoria sanduíches no pão de alho é o diferencial da casa frente a uma hamburgueria comum",
    ],
    confirmed: true,
    writtenInPhase: 3,
  },
  {
    id: "ctas",
    title: "Chamadas para ação",
    purpose:
      "Define os rótulos e a intenção de cada ação que leva o visitante a pedir ou a encontrar a casa — nunca a construção do link em si (isso é INTEGRA-04).",
    carries: [
      "As três ações do hero: Ver cardápio, Pedir no iFood, Como chegar",
      "O canal de atendimento e pedido alternativo via WhatsApp",
      "A regra de que nenhum CTA do site leva a um checkout — todo pedido é redirecionado para o iFood ou para o WhatsApp",
    ],
    confirmed: true,
    writtenInPhase: 2,
  },
  {
    id: "faqs",
    title: "Perguntas frequentes",
    purpose:
      "Responde às dúvidas mais prováveis de quem ainda não conhece a casa, a partir apenas de fatos já confirmados.",
    carries: [
      "Onde o restaurante fica (endereço, bairro, cidade)",
      "Como pedir (iFood como canal principal, WhatsApp como canal alternativo de atendimento)",
      "Quais são as modalidades de atendimento (balcão, delivery, take away)",
      "Se há entrega (delivery) e em que modalidade ela acontece",
    ],
    confirmed: true,
    writtenInPhase: 2,
  },
  {
    id: "seo-metadata",
    title: "Metadados de SEO",
    purpose:
      "Define o título e a meta description da página, direcionados à busca local por Recife e Mercado da Torre.",
    carries: [
      "O slot de título (title) da página, incluindo os termos-alvo Recife e Mercado da Torre",
      "O slot de meta description da página, também direcionado aos termos Recife e Mercado da Torre",
    ],
    confirmed: true,
    writtenInPhase: 5,
  },
  {
    id: "contact-location",
    title: "Contato e localização",
    purpose:
      "Reúne endereço, modalidades, mapa, rede social e horário para quem quer visitar a casa ou confirmar como chegar.",
    carries: [
      "O endereço completo: Rua José Bonifácio, 747, Mercado da Torre, Recife-PE",
      "As modalidades de atendimento: balcão, delivery e take away",
      "O link do Maps para a localização",
      "O perfil do Instagram: @itsgarlicrecife",
      "O horário de funcionamento",
    ],
    confirmed: false,
    pendingConfirmation:
      "Horário de funcionamento ainda não confirmado pelo cliente — as únicas referências encontradas (stories antigos do Instagram) têm entre 2,5 e 4,8 anos e divergem entre si; ver REQUIREMENTS.md bloco 5 (Pendências) e PROJECT.md Pendências.",
    writtenInPhase: 2,
  },
];

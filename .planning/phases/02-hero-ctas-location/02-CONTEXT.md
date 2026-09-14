# Phase 2: Hero, CTAs & Location - Context

**Gathered:** 2026-09-13
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega a home page navegável do site: um visitante chega, entende em segundos o
conceito "Mais que um pão de alho!", vê os três CTAs do hero (Ver cardápio / Pedir no iFood /
Como chegar) e encontra a localização real da loja (endereço, modalidades, mapa, horário). Por
decisão desta discussão, o escopo de conteúdo desta fase foi ampliado além do estritamente listado
nos Success Criteria do ROADMAP.md: além de Hero + Localização, esta fase também escreve e
constrói as seções de Apresentação da marca e FAQs, seguindo a atribuição já feita pelo esqueleto
de conteúdo da Fase 1 (`src/content/skeleton.ts`, campo `writtenInPhase: 2` em `hero`,
`brand-story`, `ctas` e `faqs`).

Cobre os requisitos: HERO-01, HERO-02, HERO-03, LOCAL-01, LOCAL-02, LOCAL-03, LOCAL-04,
INTEGRA-01, INTEGRA-02, INTEGRA-03, INTEGRA-05 (ROADMAP.md), mais a copy final de brand-story e
faqs (CONT-02, já com `writtenInPhase: 2` fixado na Fase 1).

Não cobre: cardápio/categorias de produto (Fase 3), promoções/almoço/happy hour com prioridade
por horário (Fase 4), SEO estruturado/sitemap/robots (Fase 5), verificação de produção de
Lighthouse/CWV/CSP (Fase 5).

</domain>

<decisions>
## Implementation Decisions

### Escopo de seções da Home
- **D-01:** A home desta fase inclui cinco seções, não só Hero + Localização: **Hero → CTAs →
  Marca (apresentação da It's Garlic) → Localização → FAQ**. Essa ordem prioriza a ação (pedir/ver
  cardápio) logo após o hero, antes do texto institucional — alinhado ao Core Value de tirar o
  visitante do site com um pedido feito o mais rápido possível. — **Reversibility:** reversible —
  reordenar seções de uma landing page é uma mudança de layout local, sem custo de migração.

- **D-01a (amendment, 2026-09-13, G-02-2):** A ordem das cinco seções da home permanece a mesma
  (D-01), mas o bloco de CTAs de pedido (iFood e WhatsApp) e os dois avisos coral de
  indisponibilidade passam a renderizar DENTRO da seção Hero — entre o subhead e a ilustração —
  em vez de como uma seção separada logo depois dela. Três razões, uma por parágrafo:

  1. O critério de "acima da dobra" do INTEGRA-01 é inatingível em 375×667 com a fileira de CTAs
     abaixo de uma ilustração quadrada full-width, mesmo que ela já esteja aninhada dentro do
     Hero — ver `.planning/debug/DEBUG-cta-row-stacked-below-fold.md`, evidências com timestamp
     23:46–23:51 (a própria seção Hero já ultrapassa o viewport antes da fileira de CTAs começar).
  2. D-01 já se documenta como reversível ("reordenar seções de uma landing page é uma mudança de
     layout local, sem custo de migração") — esta é exatamente esse tipo de mudança local, não uma
     revisão estrutural do site.
  3. A justificativa de ação-primeiro que D-01 já dá ("prioriza a ação... logo após o hero") é
     melhor servida com a fileira de CTAs sentada diretamente sob o headline do que por uma seção
     separada mais abaixo, depois de uma ilustração full-width.

  O CTA secundário (Ver cardápio) e o link terciário de direções permanecem no próprio bloco
  logo após o Hero, inalterados.
- **D-02:** Brand-story e FAQ usam o copy final desta fase (não mais tom de voz/esqueleto), com
  base em `src/content/tone-of-voice.md` e nas entradas `brand-story`/`faqs` de
  `src/content/skeleton.ts` — sem inventar fatos além do que já está confirmado em `PROJECT.md`.

### Visual do Hero sem fotos reais ainda (HERO-03)
- **D-03:** Como o cliente ainda não enviou fotos de produto, o hero usa uma **composição
  ilustrada no estilo da marca** (fundo escuro `#202526`/`#000000`, blocos vibrantes em
  verde-limão `#B8FF00`, ilustração de alho em line-art — elementos já documentados em
  `docs/brand-guidelines.md`), claramente rotulada como provisória. Segue o mesmo padrão de
  provisoriedade já usado no logo vetorizado da Fase 1 (D-01/D-02 do `01-CONTEXT.md`). —
  **Reversibility:** reversible — é um asset substituível, não uma decisão estrutural.
- **D-04:** O componente do hero já nasce com um slot de imagem fixo (`next/image` com
  `priority`, dimensões/`sizes` definidos) apontando para o asset ilustrado provisório. Trocar
  pela foto real do produto, quando chegar, deve ser só a substituição do arquivo — sem mexer em
  layout ou arriscar regressão de CLS.

### CTAs de pedido com link ainda não confirmado (INTEGRA-01, INTEGRA-02, INTEGRA-03)
- **D-05:** Enquanto `buildIFoodUrl()` e `buildWhatsAppUrl()` retornarem `confirmed: false` (ver
  `src/data/links.ts`), os botões "Pedir no iFood" e o CTA de WhatsApp aparecem **visualmente no
  lugar certo, mas desabilitados**, com um rótulo do tipo "Pedir no iFood (em breve)" — nunca como
  um link funcional que levaria a um placeholder/404. Isso satisfaz INTEGRA-03 (aviso, sem trocar
  o CTA principal por outro) sem risco de shipping de um link quebrado.
- **D-06:** Os dois CTAs de pedido (iFood e WhatsApp) recebem o **mesmo tratamento visual** de
  "em breve" — nenhuma distinção especial para o WhatsApp nesta fase, mesmo ele sendo canal de
  atendimento humano além de pedido.

### Horário de funcionamento provisório na Localização (LOCAL-03)
- **D-07:** A seção de Localização exibe um texto do tipo "Horário de funcionamento: em
  atualização — confirme no iFood ou WhatsApp antes de vir", com um selo visual de "provisório"
  consistente com o resto do site. Nunca exibe os dois horários encontrados nos stories antigos do
  Instagram (2,5–4,8 anos, divergentes entre si) como se fossem o horário atual — decisão já
  fixada em `PROJECT.md`/`01-CONTEXT.md` e apenas reafirmada aqui.

### Claude's Discretion
- Estrutura de markup/CSS exata da composição ilustrada do hero (quais formas diagonais, exata
  disposição da ilustração de alho) fica a critério de quem planejar/executar, desde que use os
  tokens de `src/styles/design-tokens.css` e siga `docs/brand-guidelines.md`.
- Redação exata do texto "em breve" dos CTAs e do aviso de horário fica a critério de quem
  escreve o copy final, respeitando o tom jovem/descontraído/urbano de
  `src/content/tone-of-voice.md`.
- Se o CTA desabilitado usa `aria-disabled`, `disabled` nativo, ou outro padrão de acessibilidade
  é decisão de implementação — deve manter foco visível e leitura correta por leitor de tela
  (WCAG, PERF-01).

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Roadmap
- `.planning/ROADMAP.md` §Phase 2 — success criteria, requisitos cobertos e as duas pendências
  bloqueadoras carregadas para esta fase (URL iFood/WhatsApp, horário)
- `.planning/REQUIREMENTS.md` bloco 1 — HERO-01/02/03, LOCAL-01..04, INTEGRA-01/02/03/05, CONT-02
- `.planning/PROJECT.md` — paleta oficial, contexto de negócio, threat model resumido (link-swap
  como maior risco real)

### Conteúdo (D-01/D-02)
- `src/content/skeleton.ts` — estrutura e informação de cada seção (hero, brand-story, ctas,
  faqs, contact-location); `writtenInPhase: 2` confirma que brand-story e faqs são copy final
  desta fase
- `src/content/tone-of-voice.md` — tom de voz (jovem/descontraído/urbano) a seguir no copy final

### Identidade Visual (D-03)
- `docs/brand-guidelines.md` — paleta, tipografia, ilustração de alho em line-art, formas
  diagonais, regras de aplicação em componentes
- `src/styles/design-tokens.css` / `.json` — tokens de cor/tipografia a usar, nunca hex literais
- `public/brand/*.svg` — logo vetorizado provisório (6 versões) já disponível para o header/hero

### Dados e Integrações (D-05, D-06, D-07)
- `src/data/store.ts` — `storeInfoSchema`/`getStoreInfo()`, `hours.provisional: true`,
  `hours.schedule: []`
- `src/data/links.ts` — `externalLinks`, iFood e WhatsApp com `confirmed: false` e placeholder
  explícito; Instagram e Maps já `confirmed: true`
- `src/lib/integrations/ifood.ts`, `whatsapp.ts`, `maps.ts`, `types.ts` — builders que retornam
  `IntegrationLink { url, confirmed, pendingConfirmation }`; toda renderização de CTA deve checar
  `confirmed` antes de tratar o link como ativo
- `src/lib/integrations/allowlist.ts` — `assertAllowedHost()`, chokepoint único de validação de
  destino externo (SEC-03)

### Fase 1 (base já construída)
- `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-CONTEXT.md` —
  D-01/D-02 (padrão de provisoriedade do logo, reaplicado ao hero nesta fase)
- `.planning/phases/01-foundation-architecture-brand-identity-security-baseline/01-SKELETON.md` —
  decisões arquiteturais que esta fase consome sem alterar (camada de dados, seam de
  integrações, headers de segurança)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `getStoreInfo()` (via `src/lib/repositories/store-repository.ts`, lendo `src/data/store.ts`) —
  já retorna nome, endereço, bairro, modalidades e `hours` (provisório); é a única fonte de dados
  de localização que o componente de Localização deve consumir.
- `buildIFoodUrl()`, `buildWhatsAppUrl()`, `buildMapsUrl()` (`src/lib/integrations/*.ts`) — já
  implementados e testados; retornam `{ url, confirmed, pendingConfirmation }` prontos para
  gatear a renderização do CTA (D-05).
- `src/components/layout/Header.tsx` / `Footer.tsx` — shell existente da Fase 1; o hero e as
  novas seções entram como conteúdo de `src/app/page.tsx`, dentro desse shell.
- `public/brand/*.svg` — logo provisório em 6 versões, pronto para uso no header/hero sem nova
  vetorização.

### Established Patterns
- Componentes nunca importam `src/data/*.json`/`.ts` diretamente — sempre passam pelo repositório
  (`ARQ-02`, regra de ESLint `no-restricted-imports` já configurada).
- Todo link externo passa por `assertAllowedHost()` dentro do módulo de integrações — nenhum
  componente deve montar uma URL de iFood/WhatsApp/Maps na mão.
- Convenção `confirmed` / `pendingConfirmation` já estabelecida em `store.schema.ts` e
  `link.schema.ts` — a mesma convenção deve orientar como o hero/CTAs/localização tratam dado
  provisório (D-05, D-07), em vez de inventar um vocabulário novo.
- Server Components por padrão; único island client-side já previsto no roadmap desta fase é o
  CTA desabilitado com estado de "em breve" (interação mínima, sem necessidade de client
  component se for só `disabled`/`aria-disabled` estático).

### Integration Points
- `src/app/page.tsx` é onde as cinco seções desta fase (hero, ctas, brand-story, localização,
  faq) entram, consumindo `getStoreInfo()` e os builders de integração sem alterar o contrato
  desses módulos.

</code_context>

<specifics>
## Specific Ideas

- Ordem final da home: Hero → CTAs → Marca → Localização → FAQ (D-01).
- Hero usa composição ilustrada (não foto real) com slot de imagem fixo, pronto para troca futura
  (D-03/D-04).
- CTAs de pedido (iFood e WhatsApp) desabilitados com rótulo "em breve" enquanto
  `confirmed: false` (D-05/D-06).
- Seção de Localização mostra "Horário de funcionamento: em atualização — confirme no iFood ou
  WhatsApp antes de vir" em vez de qualquer horário fixo (D-07).

</specifics>

<deferred>
## Deferred Ideas

Nenhuma nova — a discussão ficou dentro do escopo da fase (o único ajuste de escopo, incluir
brand-story e FAQ, já estava atribuído a esta fase pelo esqueleto de conteúdo da Fase 1, não é
uma capacidade nova).

### Reviewed Todos (not folded)
None — no pending todos matched Phase 2 during discussion.

</deferred>

---

*Phase: 2-Hero, CTAs & Location*
*Context gathered: 2026-09-13*

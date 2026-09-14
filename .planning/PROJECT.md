# It's Garlic

## What This Is

O site oficial da It's Garlic, marca de alimentação do Mercado da Torre, em Recife, conhecida
pelo conceito "Mais que um pão de alho!". Não é um site de hamburgueria genérica: o pão de alho
é o produto central e a assinatura da marca, e o site apresenta a It's Garlic como um restaurante
descontraído que também oferece sanduíches no pão de alho, petiscos, espetinhos, almoço e happy
hour. O objetivo é comunicar a identidade da marca, despertar desejo pelos produtos e direcionar
o visitante para o cardápio e para o pedido no iFood (ou WhatsApp, como canal de atendimento).

## Core Value

Fazer o visitante entender em segundos que a It's Garlic é "mais que um pão de alho" e sair do
site com um pedido feito no iFood ou uma conversa iniciada no WhatsApp — sem fricção, mobile-first.

## Business Context

- **Cliente**: It's Garlic — Rua José Bonifácio, 747, Mercado da Torre, Recife-PE (@itsgarlicrecife)
- **Modelo**: Site institucional/vitrine — não processa pagamento; direciona pedidos para o iFood
  (canal principal) e atendimento/pedido alternativo para o WhatsApp
- **Métrica de sucesso**: Não rastreada no MVP (decisão explícita: sem analytics na v1)
- **Notas de estratégia**: Bot de IA no WhatsApp para pedidos é visão de v2, condicionada a uma
  nova revisão de threat model antes de implementar

## Requirements

### Validated

- ✓ Hero com identidade forte da marca, conceito "Mais que um pão de alho!" e CTAs (Ver cardápio / Pedir no iFood / Como chegar) — Phase 2 (CTAs iFood/WhatsApp lado a lado corrigido em gap closure G-02-2/02-05; paleta e foco corrigidos em G-02-5/02-04)
- ✓ Seção de localização e atendimento (endereço, modalidades, horários, link de mapa e Instagram) — Phase 2. Avaliações intencionalmente não implementadas (nenhuma avaliação real confirmada; ver constraint "nunca inventar avaliações"); mapa é link direto ao Google Maps, sem iframe embutido (decisão de performance/privacidade)

### Active

- [ ] Cardápio digital completo, organizado nas 10 categorias oficiais (pães de alho, sanduíches no pão de alho, sanduíches tradicionais, sanduíches premium, petiscos, espetinhos, almoço, bebidas, happy hour, combo do dia)
- [ ] Área de almoço representando a variedade real (saladas, parmegiana, picadinho, "monte o seu prato")
- [ ] Área de promoções com regras de horário configuráveis (combo do dia, happy hour, promoções por dia da semana)
- [ ] Cards de produto com foto, nome, descrição, categoria, preço editável e destaques opcionais
- [ ] CTAs de iFood e WhatsApp com prioridade de jornada (almoço/happy hour) variando por horário — lado a lado já entregue na Phase 2; a parte de prioridade time-aware é escopo da Phase 4
- [ ] Filtro por categoria e busca por produto no cardápio
- [ ] Identidade visual reconstruída a partir dos materiais reais da marca (logo vetorial, paleta, tipografia, guia de estilo)
- [ ] Arquitetura orientada a dados, com separação clara entre apresentação, dados e integrações — pronta para receber um backend no futuro sem reescrita total
- [ ] Conjunto completo de requisitos de segurança SEC-01 a SEC-17 (ver Constraints)
- [ ] SEO local para Recife/Mercado da Torre e metas de performance (Lighthouse ≥ 90, Core Web Vitals dentro da meta) em produção

### Out of Scope

- Sistema próprio de pedidos — [pedido é sempre redirecionado para iFood ou WhatsApp]
- Pagamento online — [fora do MVP, iFood processa o pagamento]
- Login de clientes / painel administrativo / banco de dados — [MVP é site estático orientado a dados, sem CMS]
- Sistema de delivery próprio, rastreamento de pedidos, gestão de estoque — [iFood já cobre essas funções]
- Bot de IA no WhatsApp — [confirmado como visão de v2; exige nova revisão de threat model antes de implementar]
- Analytics / rastreamento de eventos de conversão — [decisão explícita do usuário: não no MVP]
- Marcação de produtos esgotados no site — [decisão adiada pelo usuário; ver Pendências]

## Context

- **Localização e modalidades**: Rua José Bonifácio, 747, Mercado da Torre, Recife-PE. Atende
  balcão, delivery e take away. Instagram: @itsgarlicrecife. iFood é o canal principal de pedido.
- **Público-alvo**: pessoas de Recife buscando opção informal para comer; fãs de pão de alho
  recheado e sanduíches diferenciados; público de almoço, petiscos, espetinhos e happy hour;
  majoritariamente acessando via celular; precisam achar rápido cardápio, localização, horário
  e como pedir.
- **Materiais de marca reais disponíveis**: arquivo de logo em `img/logo.png` (raiz do projeto),
  a ser reconstruído como SVG vetorial (6 versões: principal, invertido, mono preto, mono branco,
  ícone isolado, favicon), mais guia de marca completo (`docs/brand-guidelines.md`) e design
  tokens (`src/styles/design-tokens.css`/`.json`). Paleta oficial: verde-limão `#B8FF00`, carvão
  `#202526`, preto `#000000`, roxo `#31266B`, coral `#FF3B30`, branco `#FFFFFF`, oliva `#7D804D`.
  Tipografia: títulos estilo Anton/Archivo Black, corpo Manrope/Inter, script só em frases
  promocionais.
- **Fotos de produto**: o usuário vai fornecer fotos reais da marca (não usar stock/placeholder
  genérico como versão final).
- **Referências reais encontradas em `img/`** (anexos do cliente): logo oficial (`logo.png`,
  confirma fundo preto, lettering branco arredondado, ícone de alho verde-limão com carinha —
  bate com a descrição da identidade); prints de stories do Instagram confirmando a linguagem
  visual (fundo carvão/roxo, tipografia manuscrita para "Happy Hour", ilustração de alho em
  line-art branco, botão "PEDIR AQUI 🔥"). Também trazem **dois conjuntos de horário
  divergentes e antigos** — story de ~249 semanas atrás: Seg-Qua 12h–22h, Qui-Sáb 12h–23h,
  Domingo 12h–22h; story de ~130 semanas atrás (específico do iFood): Dom-Qua 11h15–21h30,
  Qui-Sáb 11h15–22h30. Ambos têm ~2,5 a 4,8 anos e **não podem ser tratados como horário atual**
  — usar apenas como referência de formato, marcar no site como provisório até o cliente
  confirmar o horário vigente.
- **Dados do cardápio**: sem PDF/planilha oficial fornecida ainda — a pesquisa deve usar o iFood
  e o Instagram (@itsgarlicrecife) como fonte, e qualquer produto/preço/horário sem confirmação
  direta do cliente deve ser marcado como provisório, nunca inventado.
- **Textos do site**: a primeira versão de todo o copy (hero, categorias, CTAs, FAQs, SEO,
  contato) é escrita pelo Claude, em português, tom jovem/descontraído/urbano, sem inventar
  produtos, avaliações, prêmios ou promessas comerciais — e apresentada para revisão do cliente
  antes de publicar. Isso é entregável de uma fase de conteúdo, não do PROJECT.md.
- **Threat model resumido**: ativos críticos são a integridade do conteúdo publicado e,
  principalmente, a integridade dos links externos (iFood/WhatsApp/Instagram/Maps) — o maior
  risco real é troca de um desses links por um destino fraudulento. Sem backend no MVP, então
  sem SQLi/auth bypass/RCE server-side. Ameaças relevantes: dependência vulnerável, XSS refletido
  via busca/parâmetros de URL, exposição de segredos no bundle, comprometimento de conta de
  hospedagem/domínio, clickjacking, ausência de HTTPS/HSTS. Detalhe completo em
  `ask_questions/QA-LOG.md`.
- **Histórico completo de descoberta**: todas as perguntas e respostas da fase de questionamento
  estão registradas em `ask_questions/QA-LOG.md` e devem ser consultadas para contexto adicional
  ao planejar fases.

## Constraints

- **Escopo técnico**: Next.js (App Router) + TypeScript + Tailwind CSS, salvo se a pesquisa
  indicar alternativa melhor — sem banco de dados, autenticação, painel administrativo ou
  pagamento online no MVP.
- **Arquitetura**: separação clara entre apresentação, dados e integrações externas — para
  permitir adicionar um backend no futuro (ex: bot de WhatsApp com IA) sem reescrever o frontend.
  Qualquer adição de login, CMS, banco de dados, checkout ou chatbot com IA exige nova revisão de
  threat model e atualização dos requisitos de segurança **antes** da implementação (SEC-17).
- **Segurança (SEC-01 a SEC-17)**: entradas não confiáveis tratadas como texto puro; XSS testado
  manualmente; links externos validados contra lista de destinos oficiais; nenhum segredo no
  repo/bundle; `NEXT_PUBLIC_*` só para dados públicos; nada sensível em localStorage; HTTPS +
  headers de segurança + CSP verificados em produção; dependências auditadas com lockfile
  versionado; MFA obrigatório em GitHub/hospedagem/domínio; branch `main` protegida com PR
  obrigatório; secret scanning ativo; DNS protegido (registrar lock); rollback documentado.
  Nenhuma alegação de "100% seguro" — scanner limpo é evidência parcial, não prova. Detalhe
  completo em `ask_questions/QA-LOG.md`.
- **Performance/Acessibilidade**: Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas
  Práticas e SEO; LCP ≤ 2,5s, CLS ≤ 0,1, INP ≤ 200ms — todos verificados em produção real, não
  apenas local. WCAG (contraste, navegação por teclado, foco visível).
- **Conteúdo**: nunca inventar produtos, preços, horários, avaliações ou promessas comerciais —
  todo dado não confirmado deve ser marcado como provisório/pendente de confirmação.
- **MVP "pronto"**: definido pelo usuário como "versão mínima navegável" — hero + cardápio
  funcionando já é lançável; o restante evolui em fases seguintes (não é preciso 100% do roadmap
  completo para o primeiro lançamento).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| MVP estático (sem backend/DB/auth/admin), com arquitetura pronta para evoluir | Reduz drasticamente a superfície de ataque; site é vitrine, não plataforma de pedidos | — Pending |
| iFood como canal principal de pedido; WhatsApp como canal de atendimento/pedido alternativo (humano) | iFood já resolve pagamento/logística; WhatsApp cobre o que o iFood não atende | — Pending |
| Bot de IA no WhatsApp adiado para v2 | Exige backend e nova revisão de threat model; não bloqueia o MVP | — Pending |
| Prioridade de jornada (almoço/happy hour) na home varia por horário | Reflete o uso real do cardápio ao longo do dia | — Pending |
| Cardápio pesquisado via iFood/Instagram como fonte inicial, marcado como provisório até confirmação | Cliente ainda não enviou PDF/planilha oficial | — Pending |
| Textos do site escritos pelo Claude, revisados pelo cliente antes de publicar | Cliente pediu explicitamente; garante tom de marca consistente | — Pending |
| Conjunto de 17 requisitos de segurança (SEC-01–17) fechado nesta fase de descoberta | Cliente conduziu um threat model dedicado e pediu cobertura explícita (MFA, branch protection, secret scanning, etc.) | — Pending |
| Meta de performance: Lighthouse ≥ 90 + Core Web Vitals (LCP/CLS/INP), testado em produção | Cliente pediu critério de aceite numérico e testável | — Pending |
| Sem analytics/rastreamento de eventos no MVP | Decisão explícita do cliente, alinhada à postura de privacidade mínima | — Pending |
| Stack: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind v4 + Zod | Confirmado pela pesquisa de mercado como escolha atual e adequada; Zod valida dados editáveis em build-time | — Pending |
| Hospedagem: Vercel | Suporte nativo a `next/image` (crítico para LCP com fotos de comida) e configuração simples de headers CSP/HSTS | — Pending |
| Phase 2: CTAs de pedido (iFood/WhatsApp) renderizam dentro do Hero, acima da ilustração, em grid de 2 colunas sem breakpoint responsivo | UAT encontrou os CTAs empilhados e fora da dobra em 375/390px (G-02-2); causa raiz era tripla (breakpoint 640px, seção irmã fora do Hero, largura insuficiente) | ✓ Shipped — Phase 2 (02-05-PLAN.md), guardado por `hero-fold.test.ts` |
| Phase 2: paleta de marca e fontes usam blocos `@theme` Tailwind v4 separados (`static` para cores literais, `inline` com nomes de variável distintos das theme keys) | Um ciclo de auto-referência CSS (`--color-accent: var(--color-accent)`) + ordem de import trocada matava a paleta inteira e todo o focus ring do site, não só o botão relatado (G-02-5) | ✓ Shipped — Phase 2 (02-04-PLAN.md), guardado por `design-tokens.test.ts` + `npm run verify:css` |
| Phase 2: um único componente `SectionSeparator` compartilhado (régua oliva + recorte diagonal) aplicado nas 3 costuras de mesma superfície (incl. FAQ→footer, nunca reportada) | UAT relatou seções sem separação visual (G-02-4); único wedge existente tinha contraste 1.35:1 (abaixo do mínimo 3:1 WCAG); oliva é o único valor da marca que passa | ✓ Shipped — Phase 2 (02-06-PLAN.md), guardado por `section-boundaries.test.ts` |

## Pendências (não bloqueiam o início do desenvolvimento, mas precisam de resposta)

- Responsável e processo de atualização de cardápio/preços/horários pós-lançamento
- Se produtos esgotados serão marcados no site, ou só controlados no iFood
- Domínio definitivo (hospedagem já decidida: Vercel — ver Key Decisions)
- Existência de um perfil no Google Meu Negócio (para SEO local/NAP)
- Horário de funcionamento atual — únicas referências encontradas são stories antigas (2,5 a
  4,8 anos) e divergentes entre si

## Evolution

Este documento evolui em transições de fase e marcos do projeto.

**Após cada transição de fase** (via `/gsd-transition`):
1. Requisitos invalidados? → Mover para Out of Scope com o motivo
2. Requisitos validados? → Mover para Validated com referência à fase
3. Novos requisitos surgiram? → Adicionar em Active
4. Decisões a registrar? → Adicionar em Key Decisions
5. "What This Is" continua preciso? → Atualizar se houver desvio

**Após cada marco** (via `/gsd-complete-milestone`):
1. Revisão completa de todas as seções
2. Core Value ainda é a prioridade certa?
3. Auditar Out of Scope — motivos ainda válidos?
4. Atualizar Context com o estado atual

---
*Last updated: 2026-09-14 after Phase 2*

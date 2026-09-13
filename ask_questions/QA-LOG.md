# It's Garlic — Log de Perguntas e Respostas (descoberta do projeto)

Registro completo de todas as perguntas feitas e respostas dadas durante a etapa de
questionamento do `/gsd-new-project`, antes da criação do `PROJECT.md`. Este arquivo é
atualizado continuamente enquanto a descoberta estiver em andamento — inclui perguntas
já feitas e continuará recebendo as próximas.

**Início da descoberta:** 2026-09-12

---

## 0. Entrada inicial (brief livre do usuário)

O usuário abriu a conversa com um briefing completo cobrindo: objetivo do site, público-alvo,
dados reais da marca (nome, slogan, endereço, Instagram, modalidades), estrutura proposta
(hero, cardápio digital, área de almoço, promoções, cards de produto, localização/atendimento),
identidade visual (cores, tipografia, linguagem visual), experiência de usuário (mobile-first,
sem checkout próprio, CTA para iFood), preferências técnicas (Next.js + App Router + TypeScript
+ Tailwind, arquitetura orientada a dados, sem banco/auth/admin no MVP, SEO local, acessibilidade
WCAG, testes, README) e itens fora do escopo do MVP (pedidos próprios, pagamento, login, admin,
banco de dados, delivery próprio, rastreamento de pedidos, gestão de estoque). Também pediu
pesquisa prévia, diferenciação entre fatos confirmados/provisórios/pendentes, geração de
PROJECT.md/requisitos/roadmap antes do código, MVP vertical por fases, e aprovação do roadmap
antes de implementar.

---

## 1. Fonte de dados do cardápio e fotos

**P:** Como vamos obter os dados reais do cardápio (produtos, categorias, preços)?
Opções: Vou enviar PDF/planilha · Pesquisar no iFood/Instagram · Usar dados provisórios por ora · Deixa eu explicar
**R:** Pesquisar no iFood/Instagram

**P:** Como vamos obter as fotos dos produtos para o site?
Opções: Vou enviar fotos reais · Usar placeholders por ora · Pesquisar referências públicas · Deixa eu explicar
**R:** Vou enviar fotos reais

**Gate — Pronto para criar PROJECT.md?**
**R:** Continuar explorando

---

## 2. Conversa guiada (pedida pelo usuário): objetivo, jornadas, pedidos, cardápio, visual, conteúdo, escopo

### 2.1 CTA e jornadas

**P:** Qual é a ação mais importante que o visitante deve tomar no site?
Opções: Pedir no iFood · Ver o cardápio primeiro · Ir até a loja · Deixa eu explicar
**R (texto livre):** "pedir no ifood ou pedir pelo whatsapp com um bot de IA"

**P:** As jornadas de almoço, pão de alho e petiscos/happy hour têm a mesma prioridade na home, ou uma deve vir primeiro?
Opções: Pão de alho em 1º lugar · Depende do horário · Mesma prioridade · Deixa eu explicar
**R:** Depende do horário

**P:** O WhatsApp tem algum papel no fluxo de pedidos, além do iFood?
Opções: Sim, para pedidos/reservas · Só para atendimento · Não usamos WhatsApp · Deixa eu explicar
**R:** Para pedidos/dúvidas/atendimento

### 2.2 Esclarecimento sobre bot de IA no WhatsApp (freeform, fora do AskUserQuestion)

**P:** O bot de IA no WhatsApp é algo que vocês já têm hoje (ou terceirizado) e o site só linka para o número,
ou é algo que devo construir como parte deste projeto? Se for construir, entra no MVP ou fica para v2?
**R:** "ainda nao temos hoje, so precisa linkar para o numero mesmo, e pode ficar para a v2 por enquanto"

**Decisão registrada:** MVP linka direto para o número do WhatsApp (atendimento humano manual).
Bot de IA no WhatsApp fica marcado como v2 — fora do escopo do MVP.

### 2.3 Edição do cardápio, materiais de marca, textos, critério de "pronto"

**P:** Depois que o site estiver no ar, quem vai atualizar preços, promoções e itens do cardápio?
Opções: Eu mesmo, sem código · Você, via código · Ainda não sei · Deixa eu explicar
**R:** Ainda não sei *(pendente de confirmação)*

**P:** Você tem arquivos oficiais da marca (logo em vetor, cores em hex, guia de estilo) para eu usar como referência exata?
Opções: Sim, vou enviar · Só o Instagram · Não tenho, você define · Deixa eu explicar
**R (texto livre, guia de marca completo):** Usar os anexos enviados como referência visual oficial
(sem copiar literalmente elementos de interface do Instagram). Documento incluiu: nome/segmento/
personalidade da marca; especificação completa de reconstrução do logo em SVG vetorial (a partir
de `logo.jpg`/`logo.png`), com 6 versões (principal, invertido, mono preto, mono branco, ícone
isolado, favicon) e arquivos esperados em `public/brand/`; paleta de cores em hex (verde-limão
`#B8FF00`, carvão `#202526`, preto `#000000`, roxo `#31266B`, coral `#FF3B30`, branco `#FFFFFF`,
oliva `#7D804D`) com regras de uso e contraste/acessibilidade; tipografia (títulos tipo
Anton/Archivo Black, corpo Manrope/Inter, script só em frases promocionais); linguagem visual
(fundos escuros, blocos vibrantes, ilustrações lineares de alho, formas diagonais, texturas,
fotografia apetitosa); direção do site (extensão digital dos materiais promocionais, não
hamburgueria genérica); e pedido de um `docs/brand-guidelines.md` completo + tokens CSS/JSON
(`src/styles/design-tokens.css` e `.json`).
Arquivo de logo localizado pelo Claude em: `img/logo.png` (raiz do projeto).

**P:** Quem escreve os textos do site (descrições de produtos, sobre a marca, etc.)?
Opções: Eu escrevo/envio · Você rascunha, eu reviso · Misto · Deixa eu explicar
**R (texto livre):** O Claude deve escrever a primeira versão de todos os textos (hero, marca,
categorias de produto, CTAs, FAQs, SEO title/meta description, contato/localização), em
português brasileiro, tom jovem/descontraído/urbano, destacando "Mais que um pão de alho!",
sem inventar produtos/avaliações/prêmios/promessas. Preços, horários, ingredientes,
disponibilidade e promoções tratados como dados editáveis marcados para validação. Textos devem
ser apresentados organizados para revisão antes da publicação (entregável de uma fase futura,
não do PROJECT.md).

**P:** O que define que o MVP está pronto para lançar?
Opções: Roadmap 100% completo · Versão mínima navegável · Data específica · Deixa eu explicar
**R:** Versão mínima navegável (hero + cardápio funcionando já é lançável; resto evolui em fases seguintes)

**Gate — Pronto para criar PROJECT.md?**
**R:** Continuar explorando

---

## 3. Threat model e requisitos de segurança (pedido pelo usuário)

O usuário pediu um threat model simples cobrindo: o que proteger, por onde entram dados externos,
quais serviços de terceiros, quem pode alterar cardápio/links/publicação, e quais ameaças são
relevantes — com atenção especial a alteração indevida de conteúdo, troca do link de pedido por
destino fraudulento, XSS, exposição de credenciais e dependências vulneráveis. Também pediu
requisitos de MVP cobrindo arquitetura, conteúdo/entradas, segredos/privacidade, publicação,
dependências/manutenção e verificação — apresentados como decisões e trade-offs, sem alegar
segurança absoluta.

**Threat model apresentado** (resumo): ativos a proteger = integridade do conteúdo, integridade
dos links externos (iFood/WhatsApp/Instagram/Maps), disponibilidade, credenciais de infra (sem
dados pessoais de cliente coletados); entradas não confiáveis = parâmetros de URL, busca,
armazenamento do navegador, embeds de terceiros; serviços de terceiros = iFood, WhatsApp,
Instagram, Google Maps, hospedagem, registrador de domínio, analytics (se usado); controle de
alteração = só quem tem acesso de escrita ao repositório/deploy (sem CMS no MVP); ameaças
relevantes = dependência vulnerável, troca de link de pedido, XSS refletido, exposição de
segredos no bundle, comprometimento de conta de hospedagem/domínio, clickjacking, ausência de
HTTPS/HSTS.

**P:** Esses 11 requisitos SEC capturam bem o que você quer, ou tem algo a ajustar antes de eu incluir no REQUIREMENTS.md?
Opções: Está bom, seguir assim · Ajustar alguns itens · Deixa eu explicar
**R (texto livre):** Pediu cobertura adicional para: MFA no GitHub/hospedagem/domínio; proteção
da branch principal; revisão obrigatória antes do deploy; validação automatizada dos links do
iFood e WhatsApp; CSP e headers testados no domínio real; auditoria de dependências; secret
scanning; HTTPS e DNS protegidos; procedimento de rollback; teste manual de XSS na busca e
parâmetros de URL.

**Lista final de requisitos de segurança (SEC-01 a SEC-16):**
| ID | Requisito |
|---|---|
| SEC-01 | Entradas não confiáveis (busca, parâmetros de URL, dados externos) renderizadas como texto puro por padrão |
| SEC-02 | Payloads XSS comuns testados manualmente na busca/parâmetros de URL — não executam HTML/JS |
| SEC-03 | Links de pedido/contato (iFood, WhatsApp, Instagram, Maps) só apontam para destinos oficiais pré-aprovados; validação automatizada |
| SEC-04 | Nenhuma credencial/chave/token commitado no repo, em `public/` ou exposto no bundle do navegador |
| SEC-05 | `NEXT_PUBLIC_*` contém só dados genuinamente públicos |
| SEC-06 | Nenhum dado pessoal, credencial ou token em localStorage/sessionStorage |
| SEC-07 | HTTPS obrigatório com redirect de HTTP; headers de segurança configurados em produção |
| SEC-08 | CSP compatível com os recursos efetivamente usados, sem `unsafe-inline`/`unsafe-eval` desnecessários |
| SEC-09 | Dependências em versões suportadas, lockfile versionado, auditoria de vulnerabilidades antes de cada release |
| SEC-10 | MFA obrigatório nas três contas críticas: GitHub, hospedagem e registrador de domínio |
| SEC-11 | Headers de segurança/CSP verificados no domínio real de produção, não só local |
| SEC-12 | Branch principal (`main`) protegida — sem push direto, só via Pull Request |
| SEC-13 | PR obrigatório com revisão/aprovação antes de merge que dispare deploy em produção |
| SEC-14 | Secret scanning automatizado ativo no repositório |
| SEC-15 | DNS protegido: registrar lock + MFA no registrador; avaliar DNSSEC |
| SEC-16 | Procedimento de rollback documentado |

**P:** Essa lista de 16 requisitos SEC está completa para o MVP, ou falta algo ainda?
Opções: Está completo · Ajustar mais alguma coisa
**R:** Está completo

**Gate — Pronto para criar PROJECT.md?**
**R (texto livre — nova decisão arquitetural):** "O MVP será estático, mas a arquitetura deve
permitir a adição futura de um backend sem reescrever completamente o frontend. Não implementar
backend agora. Apenas manter uma separação clara entre componentes de apresentação, dados e
integrações externas. Quando login, CMS, banco de dados, checkout ou chatbot com IA forem
adicionados, criar uma nova threat model review e revisar os requisitos de segurança antes da
implementação."

**Decisão de arquitetura registrada:** MVP estático com separação clara entre apresentação,
dados e integrações (ex: `src/data/`, `src/components/`, `src/lib/integrations/`), para permitir
evolução futura sem reescrita total.

**Novo requisito — SEC-17:** Antes de adicionar login, CMS, banco de dados, checkout ou chatbot
com IA, uma nova revisão de threat model deve ser feita e os requisitos de segurança atualizados
antes da implementação.

**Gate — Pronto para criar PROJECT.md?**
**R:** Continuar explorando

---

## 4. Rodada final de descoberta (10 tópicos, pedida pelo usuário)

Tópicos pedidos: (1) público/ocasiões de consumo, (2) CTA prioritário, (3) fallback iFood
indisponível, (4) responsável/processo de atualização do cardápio, (5) regras de esgotado/horário,
(6) endereço/mapa/modalidades, (7) SEO local, (8) performance/acessibilidade/imagens,
(9) métricas de conversão, (10) hospedagem/domínio/manutenção. Instrução: não inventar
informações comerciais; marcar como "pendente de confirmação" o que não for fornecido; depois
transformar em requisitos funcionais, não funcionais e critérios de aceite.

**Itens 1, 2 e 6 não reperguntados** — já cobertos pelo brief inicial e pela conversa guiada
(público-alvo, CTA iFood+WhatsApp por horário, endereço/modalidades no Mercado da Torre).

**P:** Se o iFood estiver indisponível/fechado, o que deve acontecer no site?
Opções: WhatsApp vira CTA principal · Mostrar aviso, sem trocar CTA · Nada automático por ora · Deixa eu explicar
**R (texto livre):** "para o mvp, pode mostrar o aviso, sem trocar o CTA, mas quando a gente for
começar a implementar o back-end o whatsapp sera o CTA principal"

**P:** Precisamos de um jeito de marcar produtos como 'esgotado' no site do MVP, ou isso fica só no iFood?
Opções: Sim, no site também · Não, só no iFood · Decidir depois · Deixa eu explicar
**R:** Decidir depois *(pendente de confirmação)*

**P:** Quer rastrear eventos de conversão no site (ex: cliques em 'Pedir no iFood', WhatsApp, Como Chegar)?
Opções: Sim, com analytics · Não no MVP · Decidir depois · Deixa eu explicar
**R:** Não no MVP

**P:** Vocês já têm domínio e hospedagem definidos, ou isso ainda está em aberto?
Opções: Já tenho domínio · Ainda não tenho · Vou definir depois · Deixa eu explicar
**R:** Vou definir depois *(pendente de confirmação)*

**P:** Vocês já têm um perfil no Google Meu Negócio (Google Business Profile) para a It's Garlic no Mercado da Torre?
Opções: Sim, já tenho · Não tenho ainda · Não sei · Deixa eu explicar
**R:** Não sei *(pendente de confirmação)*

**P:** Quer uma meta numérica de performance (ex: Lighthouse mobile ≥ 90) como critério de aceite, ou só seguir boas práticas sem número fixo?
Opções: Sim, meta numérica · Só boas práticas · Deixa eu explicar
**R:** Sim, meta numérica

**P:** Proponho como critério de aceite: Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas Práticas e SEO. Serve?
Opções: Sim, serve · Quero ajustar
**R (texto livre, refinado):**
- Lighthouse Performance mobile ≥ 90
- Lighthouse Accessibility ≥ 90
- Lighthouse Best Practices ≥ 90
- Lighthouse SEO ≥ 90
- LCP ≤ 2,5 segundos
- CLS ≤ 0,1
- INP ≤ 200 ms
- Testar em produção, não apenas no ambiente local

### Síntese apresentada (RF + RNF + Critérios de Aceite)

Compilada e apresentada ao usuário cobrindo RF-01 a RF-12 (2 pendentes: RF-11 esgotado, RF-12
processo de atualização), RNF-01 a RNF-08 + SEC-01 a SEC-17 como RNF-09...RNF-25, e uma lista
de critérios de aceite do MVP ("versão mínima navegável"). Ver corpo da conversa para o detalhe
completo — será refletido integralmente no `REQUIREMENTS.md`.

**Gate — Posso criar o PROJECT.md agora?**
**R:** Pediu primeiro para armazenar todo este histórico de perguntas e respostas em
`ask_questions/` (este arquivo) antes de prosseguir.

---

## 5. Anexos de marca encontrados em `img/` (após criação do PROJECT.md)

Ao preparar o commit do PROJECT.md, novos arquivos apareceram em `img/` (anexos do cliente
mencionados na rodada de identidade visual):

- `logo.png` — logo oficial confirmado: fundo preto, lettering "it's garlic" branco e
  arredondado, ícone de alho verde-limão com carinha.
- `Screenshot 2026-09-12 151659.png` — story "PROMO" (93 semanas atrás): "Hoje é dia de Happy
  Hour", fundo carvão, tipografia script verde-limão/branca, ilustrações de alho em line-art.
- `Screenshot 2026-09-12 151751.png` — story "Horário" (130 semanas atrás), específico do iFood:
  "NOVOS HORÁRIOS NO IFOOD — Domingo a quarta-feira 11h15 às 21h30 / Quinta-feira a sábado 11h15
  às 22h30", fundo roxo profundo, botão "PEDIR AQUI 🔥".
- `Screenshot 2026-09-12 151841.png` — story "Horário" (249 semanas atrás), só um ícone de
  relógio em fundo verde-limão, sem dado textual útil.
- `212321.png` — story "Horário" (248 semanas atrás): "NOSSOS HORÁRIOS: Seg-Qua 12h às 22h,
  Qui-Sáb 12h às 23h, Domingo 12h às 22h" (horário geral, não específico de iFood).

**Observação:** os dois conjuntos de horário são antigos (2,5 a 4,8 anos) e **divergem entre
si** — não devem ser usados como horário atual do site. Registrados no PROJECT.md como
referência de formato, marcados como provisórios até confirmação do cliente.

Também apareceu um arquivo vazio `ask_questions.txt` (0 bytes) na raiz do projeto — não usado;
o log real ficou em `ask_questions/QA-LOG.md` (este arquivo), conforme pedido pelo usuário.

---

## Pendências em aberto (a resolver antes ou durante o roadmap)

- [ ] Responsável e processo de atualização de cardápio/preços/horários pós-lançamento
- [ ] Se produtos esgotados serão marcados no site (ou só no iFood)
- [ ] Domínio e hospedagem definitivos
- [ ] Existência de perfil no Google Meu Negócio (para consistência de NAP/SEO local)
- [ ] Horário de funcionamento atual — os únicos dados encontrados (`img/`) são stories antigas
      (2,5 a 4,8 anos) e divergentes entre si; precisa confirmação do cliente

---

*Este arquivo continua sendo atualizado com novas perguntas e respostas até o fechamento da
etapa de descoberta (`Ready?` → "Criar PROJECT.md").*

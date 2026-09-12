# Requirements: It's Garlic

**Defined:** 2026-09-12
**Core Value:** Fazer o visitante entender em segundos que a It's Garlic é "mais que um pão de
alho" e sair do site com um pedido feito no iFood ou uma conversa iniciada no WhatsApp — sem
fricção, mobile-first.

Este documento está organizado em cinco blocos, a pedido do cliente: (1) requisitos obrigatórios
do MVP, (2) requisitos opcionais/pós-MVP, (3) requisitos de segurança, (4) critérios de aceite
testáveis, (5) informações pendentes de confirmação. Duplicidades entre categorias foram
removidas; detalhes puramente técnicos/numéricos foram movidos para o bloco 4 (critérios de
aceite) em vez de aparecer como "requisito" solto.

---

## 1. Requisitos Obrigatórios do MVP

MVP **estático**: sem backend, sem CMS, sem login, sem checkout, sem analytics (ver Out of Scope).

### Hero

- [ ] **HERO-01**: Hero comunica a marca e o conceito "Mais que um pão de alho!" usando a identidade visual oficial (ver seção Identidade Visual)
- [ ] **HERO-02**: Hero inclui os CTAs "Ver cardápio", "Pedir no iFood" e "Como chegar"
- [ ] **HERO-03**: Foco visual do hero é fotografia real de pão de alho/produtos (fornecida pelo cliente) — não uma hamburgueria genérica

### Cardápio

- [ ] **CARD-01**: Cardápio organizado nas 10 categorias oficiais (pães de alho, sanduíches no pão de alho, sanduíches tradicionais, sanduíches premium, petiscos, espetinhos, almoço, bebidas, happy hour, combo do dia)
- [ ] **CARD-02**: Cada produto exibido como card com foto, nome, descrição curta, categoria, preço editável e destaques opcionais (mais pedido, promoção, premium, vegano, combo)
- [ ] **CARD-03**: Filtro por categoria disponível no cardápio
- [ ] **CARD-04**: Busca por produto disponível no cardápio
- [ ] **CARD-05**: Sanduíches no pão de alho tratados como categoria principal e diferenciadora (tradicionais e premium) — o cardápio não pode parecer o de uma hamburgueria comum

### Almoço

- [ ] **ALMO-01**: Seção de almoço exibe pratos reais pesquisados (ex: Salada Chicão, Salada It's Garlic, Parmegiana de frango, Picadinho carioca), marcados como provisórios até confirmação do cliente
- [ ] **ALMO-02**: Seção "Monte o seu prato" com escolha de 1 proteína + 3 acompanhamentos, listando os acompanhamentos conhecidos (arroz, feijão, farofas, saladas, legumes, banana da terra, batata frita)

### Promoções

- [ ] **PROMO-01**: Seção de promoções exibe combo do dia, promoções por dia da semana e happy hour
- [ ] **PROMO-02**: Regras de horário de promoção são configuráveis via dados (não hardcoded no componente)
- [ ] **PROMO-03**: Prioridade visual das jornadas (almoço / pão de alho / happy hour) na home varia conforme o horário do dia

### Localização

- [ ] **LOCAL-01**: Seção exibe endereço completo (Rua José Bonifácio, 747, Mercado da Torre, Recife-PE) com link/botão para o Google Maps — **sem mapa incorporado (iframe) no MVP**, para manter as metas de Lighthouse/Core Web Vitals independentes da estabilidade de um script de terceiro
- [ ] **LOCAL-02**: Seção informa as modalidades de atendimento (balcão, delivery, take away)
- [ ] **LOCAL-03**: Horário de funcionamento exibido em formato editável, marcado como provisório até confirmação do cliente — vale para toda exibição de horário do site, incluindo a lógica de promoções (PROMO-02/03)
- [ ] **LOCAL-04**: Botão "Como chegar" direciona para o Google Maps

### Integrações Externas

- [ ] **INTEGRA-01**: Botão "Pedir no iFood" visível de forma proeminente (fixo ou facilmente acessível), mobile-first
- [ ] **INTEGRA-02**: Botão/link do WhatsApp disponível como canal de atendimento e pedido alternativo (humano — sem bot no MVP)
- [ ] **INTEGRA-03**: Se o iFood estiver indisponível, o site exibe um aviso, sem trocar o CTA principal
- [ ] **INTEGRA-04**: Todos os links externos (iFood, WhatsApp, Instagram, avaliações, Maps) centralizados em um único módulo de configuração, nunca duplicados entre componentes
- [ ] **INTEGRA-05**: Nenhum checkout próprio — todo pedido é redirecionado para iFood ou WhatsApp

### Identidade Visual

- [ ] **MARCA-01**: Logo reconstruído como SVG vetorial a partir de `img/logo.png`, com 6 versões (principal, invertido, mono preto, mono branco, ícone isolado, favicon)
- [ ] **MARCA-02**: Paleta de cores oficial documentada como design tokens reutilizáveis (`src/styles/design-tokens.css` e `.json`)
- [ ] **MARCA-03**: Tipografia definida (títulos estilo Anton/Archivo Black, corpo Manrope/Inter, script só em frases promocionais)
- [ ] **MARCA-04**: Guia de estilo completo em `docs/brand-guidelines.md`
- [ ] **MARCA-05**: Linguagem visual do site reflete os materiais reais da marca (fundos escuros, blocos vibrantes, ilustrações de alho, formas diagonais)

> Instagram é referenciado só por link de perfil (ver INTEGRA-04) — sem embed de feed ao vivo no MVP, pelo mesmo motivo do LOCAL-01: manter Lighthouse/CWV fora do controle de um script de terceiro.

### Conteúdo

- [ ] **CONT-01**: Primeira versão de todos os textos do site escrita em português, tom jovem/descontraído/urbano, sem inventar produtos/avaliações/promessas comerciais
- [ ] **CONT-02**: Textos cobrem hero, apresentação da marca, categorias de produto, CTAs, FAQs, SEO title/meta description e contato/localização
- [ ] **CONT-03**: Todo dado sensível (preço, horário, ingrediente, disponibilidade) tratado como editável e marcado para validação do cliente antes de publicar

### SEO Local

- [ ] **SEO-01**: Meta tags e conteúdo otimizados para "Recife" e "Mercado da Torre"
- [ ] **SEO-02**: Dados estruturados (schema.org LocalBusiness/Restaurant/Menu via JSON-LD)
- [ ] **SEO-03**: Sitemap e robots.txt configurados

> Consistência de NAP com o Google Meu Negócio depende de uma confirmação do cliente — ver bloco 5 (Pendências).

### Performance e Acessibilidade

- [ ] **PERF-01**: HTML semântico e acessibilidade WCAG (contraste, navegação por teclado, foco visível)
- [ ] **PERF-02**: Imagens otimizadas (formatos modernos, tamanhos responsivos, lazy-load abaixo da dobra)
- [ ] **PERF-03**: Layout mobile-first, totalmente responsivo

> Metas numéricas de performance (Lighthouse, Core Web Vitals) estão no bloco 4 (Critérios de Aceite), por serem testáveis por número, não por presença/ausência.

### Arquitetura

- [ ] **ARQ-01**: Site estático orientado a dados — sem banco de dados, autenticação, painel administrativo ou pagamento online
- [ ] **ARQ-02**: Separação clara entre apresentação, dados e integrações externas, permitindo adicionar um backend no futuro sem reescrever o frontend
- [ ] **ARQ-03**: Dados de produto, categoria, promoção, horário e loja validados automaticamente antes do build, para impedir que dado malformado vá ao ar

---

## 2. Requisitos Opcionais / Pós-MVP (v2)

Reconhecidos, mas **não fazem parte do roadmap atual**.

- **INTEGRA-V2-01**: Bot de IA no WhatsApp para pedidos — exige backend e uma nova revisão de threat model (SEC-17) antes de implementar
- **INTEGRA-V2-02**: WhatsApp assume o papel de CTA principal quando o backend/bot for implementado
- **CARD-V2-01**: Marcação de produtos esgotados diretamente no site — decisão adiada pelo cliente ("decidir depois"; ver bloco 5)
- **ANALYTICS-V2-01**: Rastreamento de eventos de conversão (cliques em CTAs) — decisão explícita do cliente de não incluir no MVP; pode ser reavaliado depois respeitando os requisitos de privacidade (SEC-04/05/06)

---

## 3. Requisitos de Segurança

Resultado da rodada de threat model dedicada (ver `ask_questions/QA-LOG.md` para o racional completo). Nenhuma alegação de "100% seguro" — estes são critérios verificáveis, não garantias absolutas.

- [ ] **SEC-01**: Entradas não confiáveis (busca, parâmetros de URL, dados externos) renderizadas como texto puro por padrão
- [ ] **SEC-02**: Payloads XSS comuns testados manualmente na busca/parâmetros de URL — não executam HTML/JS
- [ ] **SEC-03**: Links de pedido/contato (iFood, WhatsApp, Instagram, Maps) só apontam para destinos oficiais pré-aprovados; validação automatizada dos destinos
- [ ] **SEC-04**: Nenhuma credencial/chave/token commitado no repositório, em `public/` ou exposto no bundle do navegador
- [ ] **SEC-05**: `NEXT_PUBLIC_*` contém só dados genuinamente públicos
- [ ] **SEC-06**: Nenhum dado pessoal, credencial ou token em localStorage/sessionStorage
- [ ] **SEC-07**: HTTPS obrigatório com redirect de HTTP; headers de segurança (CSP, anti-clickjacking, X-Content-Type-Options, Referrer-Policy) configurados em produção
- [ ] **SEC-08**: CSP compatível com os recursos efetivamente usados, sem `unsafe-inline`/`unsafe-eval` desnecessários
- [ ] **SEC-09**: Dependências em versões suportadas, lockfile versionado, auditoria de vulnerabilidades antes de cada release, com revisão manual dos resultados
- [ ] **SEC-10**: MFA obrigatório nas três contas críticas: GitHub, hospedagem (Vercel) e registrador de domínio
- [ ] **SEC-11**: Headers de segurança e CSP verificados no domínio real de produção, não apenas local
- [ ] **SEC-12**: Branch principal (`main`) protegida — sem push direto, só via Pull Request
- [ ] **SEC-13**: PR obrigatório com revisão/aprovação antes de qualquer merge que dispare deploy em produção
- [ ] **SEC-14**: Secret scanning automatizado ativo no repositório
- [ ] **SEC-15**: DNS protegido: registrar lock + MFA na conta do registrador; avaliar DNSSEC se suportado
- [ ] **SEC-16**: Procedimento de rollback documentado
- [ ] **SEC-17**: Antes de adicionar login, CMS, banco de dados, checkout ou chatbot com IA, uma nova revisão de threat model deve ser feita e os requisitos de segurança atualizados antes da implementação

---

## 4. Critérios de Aceite Testáveis

Critérios objetivos, verificáveis por número ou por teste pass/fail — usados para validar o MVP
antes do lançamento. Separados em (4a) testes automatizados rodados contra o site publicado e
(4b) verificações operacionais/de processo, que são checklist de configuração de conta/repo, não
teste de software.

### 4a. Testes automatizados do site (produção real, não local)

- [ ] Lighthouse mobile ≥ 90 em Performance, Acessibilidade, Boas Práticas e SEO
- [ ] LCP ≤ 2,5 segundos
- [ ] CLS ≤ 0,1
- [ ] INP ≤ 200 ms
- [ ] Payloads XSS comuns injetados via busca/parâmetros de URL não executam HTML/JS (teste manual documentado)
- [ ] Todos os links de pedido/contato (iFood, WhatsApp, Instagram, Maps) validados contra a lista de destinos oficiais (teste automatizado)
- [ ] Nenhuma credencial/chave exposta no repositório, em `public/` ou no bundle do navegador (scan de segredo)
- [ ] Headers de segurança (HTTPS, CSP, X-Content-Type-Options, Referrer-Policy, anti-clickjacking) presentes e corretos no domínio de produção
- [ ] Todo dado provisório (cardápio pesquisado, horários, textos) claramente identificado como "provisório" na interface até confirmação do cliente
- [ ] Lógica de horário/promoção calculada corretamente no fuso `America/Recife`, sem depender de um "agora" fixado em build-time
- [ ] Hero + cardápio navegáveis e funcionais — critério mínimo de lançamento ("versão mínima navegável", definido pelo cliente); o restante do roadmap pode evoluir após esse ponto

### 4b. Verificações operacionais / de processo (configuração de conta e repositório, não teste de código)

- [ ] Branch `main` protegida e PR obrigatório configurados no GitHub
- [ ] MFA ativo em GitHub, Vercel e no registrador de domínio
- [ ] Auditoria de dependências sem vulnerabilidades críticas/altas não tratadas
- [ ] Procedimento de rollback documentado e testado ao menos uma vez

---

## 5. Informações Pendentes de Confirmação

Não inventadas — marcadas explicitamente como pendentes, conforme pedido pelo cliente. Cada uma
diz se **bloqueia** alguma fase (o código não pode ficar correto sem o dado real) ou é apenas
**conteúdo a confirmar** (o código funciona com dado provisório rotulado, sem travar nada).

- [ ] **[BLOQUEADOR de fase]** Horário de funcionamento atual — as únicas referências encontradas (`img/`) são stories antigas do Instagram (2,5 a 4,8 anos) e **divergentes entre si**. Bloqueia a versão *real* de PROMO-02/03 (happy hour, prioridade por horário) e LOCAL-03 (exibição de horário) — essas features vão ao ar com dado provisório rotulado, e ficam pendentes de uma segunda passada assim que o cliente confirmar
- [ ] **[BLOQUEADOR de fase]** URL exata da loja no iFood e número oficial do WhatsApp — INTEGRA-01/02/04 não podem apontar para um destino real sem essa confirmação; até lá, usar placeholder claramente marcado, nunca um link adivinhado
- [ ] *(conteúdo a confirmar, não bloqueia código)* Responsável e processo de atualização de cardápio/preços/horários pós-lançamento
- [ ] *(decisão de escopo, não bloqueia código)* Se produtos esgotados serão marcados no site, ou só controlados no iFood (CARD-V2-01)
- [ ] *(conteúdo a confirmar, não bloqueia código)* Domínio definitivo (hospedagem já decidida: Vercel)
- [ ] *(conteúdo a confirmar, não bloqueia código)* Existência de um perfil no Google Meu Negócio — bloqueia apenas a consistência de NAP (SEO-04), não o restante do site

---

## Out of Scope

Excluído explicitamente do MVP. Documentado para prevenir scope creep.

| Feature | Motivo |
|---------|--------|
| Sistema próprio de pedidos | Todo pedido é redirecionado para iFood ou WhatsApp |
| Pagamento online / checkout próprio | iFood processa o pagamento; fora do MVP por decisão do cliente |
| Login de clientes / painel administrativo / CMS | MVP é site estático orientado a dados, sem necessidade de autenticação |
| Banco de dados | Arquitetura MVP é 100% estática, dados em arquivos versionados |
| Sistema de delivery próprio / rastreamento de pedidos / gestão de estoque | iFood já cobre essas funções |
| Analytics / rastreamento de eventos | Decisão explícita do cliente: privacidade mínima no MVP |

## Traceability

Quais fases cobrem quais requisitos. Atualizado durante a criação do roadmap.

| Requirement | Phase | Status |
|-------------|-------|--------|
| HERO-01 | Phase 2 | Pending |
| HERO-02 | Phase 2 | Pending |
| HERO-03 | Phase 2 | Pending |
| CARD-01 | Phase 3 | Pending |
| CARD-02 | Phase 3 | Pending |
| CARD-03 | Phase 3 | Pending |
| CARD-04 | Phase 3 | Pending |
| CARD-05 | Phase 3 | Pending |
| ALMO-01 | Phase 4 | Pending |
| ALMO-02 | Phase 4 | Pending |
| PROMO-01 | Phase 4 | Pending |
| PROMO-02 | Phase 4 | Pending |
| PROMO-03 | Phase 4 | Pending |
| LOCAL-01 | Phase 2 | Pending |
| LOCAL-02 | Phase 2 | Pending |
| LOCAL-03 | Phase 2 | Pending |
| LOCAL-04 | Phase 2 | Pending |
| INTEGRA-01 | Phase 2 | Pending |
| INTEGRA-02 | Phase 2 | Pending |
| INTEGRA-03 | Phase 2 | Pending |
| INTEGRA-04 | Phase 1 | Pending |
| INTEGRA-05 | Phase 2 | Pending |
| MARCA-01 | Phase 1 | Pending |
| MARCA-02 | Phase 1 | Pending |
| MARCA-03 | Phase 1 | Pending |
| MARCA-04 | Phase 1 | Pending |
| MARCA-05 | Phase 1 | Pending |
| CONT-01 | Phase 1 | Pending |
| CONT-02 | Phase 1 | Pending |
| CONT-03 | Phase 1 | Pending |
| SEO-01 | Phase 5 | Pending |
| SEO-02 | Phase 5 | Pending |
| SEO-03 | Phase 5 | Pending |
| PERF-01 | Phase 1 | Pending |
| PERF-02 | Phase 3 | Pending |
| PERF-03 | Phase 1 | Pending |
| ARQ-01 | Phase 1 | Pending |
| ARQ-02 | Phase 1 | Pending |
| ARQ-03 | Phase 1 | Pending |
| SEC-01 | Phase 3 | Pending |
| SEC-02 | Phase 5 | Pending |
| SEC-03 | Phase 1 | Pending |
| SEC-04 | Phase 1 | Pending |
| SEC-05 | Phase 1 | Pending |
| SEC-06 | Phase 1 | Pending |
| SEC-07 | Phase 1 | Pending |
| SEC-08 | Phase 5 | Pending |
| SEC-09 | Phase 1 | Pending |
| SEC-10 | Phase 1 | Pending |
| SEC-11 | Phase 5 | Pending |
| SEC-12 | Phase 1 | Pending |
| SEC-13 | Phase 1 | Pending |
| SEC-14 | Phase 1 | Pending |
| SEC-15 | Phase 5 | Pending |
| SEC-16 | Phase 5 | Pending |
| SEC-17 | Phase 1 | Pending |

**Coverage:**
- Requisitos obrigatórios (bloco 1 + bloco 3 segurança): 56 total (39 funcionais + 17 segurança)
- Critérios de aceite testáveis (bloco 4): 15 (11 testes automatizados + 4 verificações operacionais) — não mapeados a uma fase única; informam os Success Criteria de cada fase (Lighthouse/CWV/segurança de produção concentrados na Phase 5)
- Mapeados para fases: 56/56 (100% — Phase 1: 25, Phase 2: 11, Phase 3: 7, Phase 4: 5, Phase 5: 8)

---
*Requirements defined: 2026-09-12*
*Last updated: 2026-09-12 after roadmap creation — traceability filled, 56/56 requirements mapped across 5 phases*

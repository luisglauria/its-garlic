# SECURITY.md — It's Garlic

Este documento é a linha de base de segurança do projeto (D-06). É um checklist de critérios
verificáveis, não uma garantia. Nenhuma linha aqui — nem quando marcada como satisfeita — afirma
que o site é "100% seguro". Um scan limpo, uma suíte de testes verde ou uma configuração de
branch protection ativa são **evidência parcial**, não prova de ausência de vulnerabilidades.
Qualquer leitor futuro que tratar este documento como uma garantia absoluta está lendo errado —
essa é exatamente a leitura que este parágrafo existe para impedir (PROJECT.md, `## Constraints`).

## Parte 1 — Escopo e limites

O MVP da It's Garlic é um site estático: sem backend, sem autenticação, sem banco de dados, sem
processamento de pagamento (ARQ-01). Isso tira do escopo, **por construção e não por mitigação**,
as classes de ataque mais caras de defender em uma aplicação com servidor: injeção em consulta
(SQLi), bypass de autenticação, execução remota de código no servidor. Não há o que mitigar
porque não há a superfície que essas classes exploram.

Os ativos que importam de fato, segundo o threat model registrado em `ask_questions/QA-LOG.md`
(seção 3):

- **Integridade do conteúdo publicado** — cardápio, preços, horários e textos do site não podem
  ser alterados por alguém sem acesso de escrita ao repositório/deploy.
- **Integridade dos links externos de saída** (iFood, WhatsApp, Instagram, Google Maps) — este é
  o risco mais provável e mais barato de explorar: a troca de um desses links por um destino
  fraudulento redireciona um pedido real ou uma conversa real para outro lugar, sem que o
  visitante perceba. É o motivo de existir um módulo de allowlist dedicado
  (`src/lib/integrations/allowlist.ts`), testado, em vez de strings de URL soltas nos
  componentes.
- **Disponibilidade** — o site precisa continuar no ar; não há dados pessoais de cliente
  coletados que precisem de proteção de confidencialidade além do que já é público.
- **Credenciais de infraestrutura** — as contas GitHub, Vercel e do futuro registrador de domínio
  são o ponto de alavancagem mais alto: quem controla uma delas controla o que o visitante vê ou
  para onde o DNS aponta.

Ameaças relevantes reconhecidas no threat model: dependência vulnerável, troca de link de pedido,
XSS refletido via busca/parâmetros de URL, exposição de segredos no bundle do navegador,
comprometimento de conta de hospedagem/domínio, clickjacking, ausência de HTTPS/HSTS. Detalhe
completo em `ask_questions/QA-LOG.md`.

## Parte 2 — Itens de código/configuração (implementáveis neste repositório)

Cada linha nesta parte é algo que o próprio código garante, verificado por um comando executável.
Marcar uma caixa aqui significa "o código atualmente cumpre isso, e há um teste que provaria o
contrário se deixasse de cumprir" — não "está perfeito para sempre".

- [x] **SEC-07 — Headers de segurança e Content-Security-Policy.** Implementado em
      `src/lib/security/headers.ts` (`buildCsp` + `securityHeaders`), aplicado em toda rota via
      `next.config.ts` `headers()`. A política de produção não contém as duas palavras-chave de
      relaxamento de script (`unsafe-eval`/`unsafe-inline` em `script-src`); a política de
      desenvolvimento relaxa `script-src` apenas porque o servidor de dev exige, e um teste
      automatizado prova que as duas políticas diferem exatamente nesse ponto. Verificado por:
      `npx vitest run src/lib/security/headers.test.ts`. A verificação no domínio real de
      produção é **SEC-11, escopo da Fase 5** — este item cobre a configuração, não a checagem
      contra o domínio publicado.
- [x] **SEC-09 — Dependências, lockfile e auditoria.** `package-lock.json` é versionado; o
      workflow de CI (`.github/workflows/ci.yml`) instala estritamente do lockfile via `npm ci`
      (nunca `npm install`) e roda `npm audit --audit-level=high` a cada push e pull request, com
      falha do job em qualquer achado de severidade alta ou crítica. A revisão manual dos
      resultados continua sendo responsabilidade humana — o gate automatizado impede o merge
      silencioso de uma dependência com vulnerabilidade conhecida, mas não substitui a leitura do
      relatório.
- [x] **SEC-06 — Nenhum dado sensível em armazenamento do navegador.** Nenhum código deste
      repositório escreve em `localStorage` ou `sessionStorage`. Este não é um comportamento
      testável por unidade da forma usual — é uma ausência, verificada por uma checagem
      estrutural sobre a árvore de código-fonte: `git grep -l -e localStorage -e sessionStorage --
      src` deve retornar vazio. Isso é registrado aqui como **regra de code review permanente**:
      qualquer PR futuro que introduza `localStorage`/`sessionStorage` precisa justificar
      explicitamente por que o dado ali não é sensível, antes do merge — a checagem automatizada
      pega o caso óbvio, não substitui a revisão humana da exceção.
- [x] **SEC-04/SEC-05 — Segredos fora do repositório e do bundle.** `.gitignore` exclui
      `.env*` (mantendo apenas `.env.example` versionado); nenhuma chave, token ou credencial está
      commitada. A convenção do projeto é que qualquer variável `NEXT_PUBLIC_*` só pode conter
      dado genuinamente público — não há hoje nenhuma variável de ambiente no projeto, então esta
      linha é, por ora, uma regra a seguir quando a primeira for introduzida, não uma verificação
      ativa contra um valor real. `server-only` está instalado e pronto para marcar qualquer
      módulo futuro que não deva ser incluído no bundle do cliente.
- [x] **SEC-03 — Allowlist de destinos externos.** `src/lib/integrations/allowlist.ts`, com
      cobertura de teste em `src/lib/integrations/allowlist.test.ts` e
      `src/lib/integrations/integrations.test.ts`: todo link de pedido/contato (iFood, WhatsApp,
      Instagram, Maps) passa por essa lista central, nunca por uma string solta em um componente.
      Isso implementa diretamente a mitigação do risco identificado como mais provável em
      `ask_questions/QA-LOG.md`.
- [x] **ARQ-03 — Validação de dados na fronteira do repositório.** Schemas Zod em
      `src/lib/schemas/*` (ex.: `store.schema.ts`, `link.schema.ts`) validam produto, categoria,
      promoção, horário e loja antes do build — um dado malformado falha o build em vez de ir ao
      ar silenciosamente.
- [x] **Lockfile e instalação reprodutível em CI.** `.github/workflows/ci.yml` usa `npm ci`
      exclusivamente; o job falha em caso de divergência entre `package.json` e
      `package-lock.json` em vez de resolver uma árvore de dependências diferente da que foi
      revisada.
- [x] **Secret scanning automatizado no repositório (metade code-level de SEC-14).** O passo
      `gitleaks` do workflow de CI varre o histórico completo de commits a cada push e pull
      request. Este é o controle que roda **dentro** deste repositório, independente do plano do
      GitHub escolhido. A metade nativa do GitHub (push protection) depende da visibilidade do
      repositório — ver Parte 3.

## Ações manuais do dono das contas (fora do repositório) — Parte 3

Nenhuma linha desta parte está marcada como concluída. Nenhuma pode ser executada de dentro deste
repositório — todas dependem de uma pessoa com acesso às respectivas contas (GitHub, Vercel,
registrador de domínio) entrando nos painéis e mudando uma configuração. Uma caixa marcada aqui
sem a ação real ter sido feita criaria uma crença falsa e documentada de que o `main` está
protegido quando não está — por isso permanecem todas desmarcadas até o dono das contas confirmar.

**Decisão de visibilidade do repositório (Task 2 deste plano): repositório público no GitHub
Free.** Não existe remoto Git configurado ainda (`git remote -v` não retorna nada) — a criação e
publicação do repositório no GitHub são, elas mesmas, ações manuais listadas abaixo, e não serão
executadas a partir deste plano de execução. Com essa escolha, os controles nativos do GitHub
abaixo (SEC-12, SEC-13, SEC-14) estão **totalmente disponíveis sem custo**, porque branch
protection completo, revisão de PR obrigatória e secret scanning com push protection são
gratuitos em repositórios públicos — diferente de um repositório privado no plano Free, onde
branch protection clássico e secret scanning não estão disponíveis (RESEARCH.md, `### Pitfall D`,
confiança MÉDIA — confirmar contra a página de preços vigente no momento da execução real, já que
ela muda sem changelog).

- [ ] **SEC-10 — MFA nas três contas críticas.**
  - GitHub: `Settings → Password and authentication → Two-factor authentication` na conta do
    dono do repositório. **Confirmado ativo pelo dono da conta em 2026-09-13** — não verificado
    de forma independente por este agente (sem acesso ao painel; ver nota de auditoria abaixo).
  - Vercel: `Account Settings → Security → Two-Factor Authentication`. **Confirmado ativo pelo
    dono da conta em 2026-09-13** — mesma ressalva de verificação independente.
  - Registrador de domínio: a decidir — `PROJECT.md` lista o domínio definitivo como pendência
    (`Pendências`); esta linha só pode ser confirmada depois que o registrador for escolhido.
  - Quem executa: o dono das contas (cliente/responsável pela infraestrutura), não o agente.
  - Como confirmar: revisão visual de cada painel mostrando 2FA "Enabled"/"Ativo".
  - **Status:** parcialmente satisfeito — GitHub e Vercel confirmados pelo dono da conta; a
    perna do registrador de domínio permanece pendente até o registrador ser escolhido. A caixa
    permanece desmarcada até as três pernas estarem confirmadas, para não registrar uma
    satisfação parcial como total.
  - **Decisão de adiamento (2026-09-13):** o dono do projeto decidiu explicitamente não
    escolher/comprar um registrador de domínio nesta fase — a perna do registrador de SEC-10
    fica **adiada** até a compra do domínio acontecer (sem previsão; ver `PROJECT.md`
    `## Pendências`). Registrado como pendência operacional adiada, não como defeito — ver
    `01-SECURITY.md` AR-08. A Fase 2 foi autorizada a começar mesmo com este item em aberto.

- [x] **SEC-12 — Branch `main` protegida, sem push direto.**
  - Onde: `Settings → Branches → Branch protection rules` no repositório GitHub, regra sobre
    `main`, com "Require a pull request before merging" ativado.
  - Disponível gratuitamente porque o repositório é público (ver decisão acima).
  - Quem executa: o dono do repositório, depois que o repositório for criado e publicado no
    GitHub — ação também fora deste plano.
  - Como confirmar: tentar um push direto para `main` e observar a rejeição pelo GitHub, ou
    inspecionar a regra na tela de configurações.
  - **Confirmado pelo dono da conta em 2026-09-13:** regra de proteção criada em `main` com PR
    obrigatório, push direto bloqueado, force push bloqueado, e exclusão da branch `main`
    bloqueada. Não verificado de forma independente por este agente (sem acesso ao painel).

- [ ] **SEC-13 — PR obrigatório com revisão/aprovação antes de merge.**
  - Onde: mesma tela de `Branch protection rules`, opção "Require approvals" com no mínimo 1
    aprovação exigida, dentro da mesma regra de SEC-12.
  - Disponível gratuitamente porque o repositório é público.
  - Quem executa: o dono do repositório.
  - Como confirmar: abrir um PR de teste e verificar que o botão de merge fica bloqueado até uma
    aprovação.
  - **Questão operacional resolvida em 2026-09-13 — mantenedor único:** o dono das contas
    confirmou ser o único mantenedor do repositório. Das duas leituras nomeadas abaixo, optou
    pela primeira:
    1. **Permitir auto-aprovação em uma branch protegida.** Preserva a garantia de "nenhum push
       direto sem passar por PR", mas **não** preserva a garantia de "um segundo par de olhos
       revisou a mudança" — o autor e o aprovador são a mesma pessoa.
    2. **Adicionar um segundo revisor** (outra pessoa com acesso ao repositório, mesmo que não
       escreva código regularmente). Preserva as duas garantias, mas introduz uma dependência de
       disponibilidade de terceiro em todo merge.
  - **Status:** a exigência de segundo revisor está **temporariamente não aplicável** enquanto
    houver um único mantenedor. Isto é registrado como **risco residual aceito** (ver Accepted
    Risks Log de `01-SECURITY.md`, AR-07), **não como requisito satisfeito** — a caixa permanece
    desmarcada porque a garantia de "segundo par de olhos" continua ausente por construção,
    mesmo com auto-aprovação em branch protegida ativa. Reavaliar se um segundo mantenedor
    entrar no projeto.

- [x] **SEC-14 — Secret scanning com push protection (metade nativa do GitHub).**
  - Onde: `Settings → Code security and analysis → Secret scanning → Push protection`.
  - Disponível gratuitamente porque o repositório é público.
  - Quem executa: o dono do repositório.
  - Como confirmar: a tela de configurações mostra "Push protection: Enabled"; o passo `gitleaks`
    do CI (Parte 2) já roda hoje, independentemente desta ativação — esta linha adiciona a camada
    que bloqueia o **push** em si, antes mesmo de chegar a um PR.
  - **Confirmado pelo dono da conta em 2026-09-13:** secret scanning e push protection ativos.
    Não verificado de forma independente por este agente (sem acesso ao painel).

- [ ] **SEC-15 — DNS registrar lock + MFA no registrador de domínio.**
  - Escopo: Fase 5, conforme `ROADMAP.md`. Listado aqui apenas para rastreabilidade — o
    registrador de domínio ainda não foi escolhido (`PROJECT.md`, `## Pendências`), então esta
    linha não pode ser executada nem avaliada (DNSSEC incluso) até essa decisão existir.
  - Quem executa: o dono da conta do registrador, quando escolhido.

## Parte 4 — SEC-17, restrição permanente

Antes de adicionar qualquer uma das cinco funcionalidades abaixo, uma nova revisão de threat
model **deve** ser feita e os requisitos de segurança (`REQUIREMENTS.md`, bloco 3) atualizados —
**antes** de começar a implementação, não em paralelo com ela nem depois:

1. **Login** de clientes ou qualquer forma de autenticação de usuário.
2. **CMS** — qualquer painel de administração de conteúdo.
3. **Banco de dados** — qualquer armazenamento persistente além dos arquivos versionados atuais.
4. **Checkout** — qualquer processamento de pagamento próprio.
5. **Chatbot com IA** — incluindo, nominalmente, o **bot de IA no WhatsApp para pedidos** já
   registrado como visão de v2 em `PROJECT.md` (`INTEGRA-V2-01`/`INTEGRA-V2-02`) e em
   `.planning/STATE.md` (`Deferred Items`). Essa funcionalidade específica é o exemplo mais
   concreto desta regra: ela está desenhada, mas não pode ser implementada sem passar primeiro
   por esta revisão.

Esta restrição está registrada como constraint permanente em `PROJECT.md` (`## Constraints`,
`Arquitetura`) e como requisito formal `SEC-17` em `.planning/REQUIREMENTS.md`. Nenhuma dessas
cinco adições é bloqueada tecnicamente por este documento — a barreira é de processo: a revisão
tem que acontecer antes do código.

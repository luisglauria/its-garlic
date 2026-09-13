---
status: complete
phase: 01-foundation-architecture-brand-identity-security-baseline
source: [01-VERIFICATION.md]
started: 2026-09-13T18:02:32.259Z
updated: 2026-09-13T19:27:49.388Z
---

## Current Test

[testing complete]

## Tests

### 1. Aprovação do cliente sobre o copy PT-BR de primeira versão
expected: Registro explícito (mensagem do cliente, ata de reunião, ou item equivalente) de que o cliente revisou e aprovou o tom/estrutura de conteúdo produzidos nesta fase. ROADMAP.md Success Criterion #4 da Fase 1 exige literalmente isso — fato externo que nenhuma leitura de código pode provar.
result: pass
reported: |
  [2026-09-13] Aprovação verbal atestada pelo usuário: a responsável pela marca It's Garlic
  (irmã do usuário) aprovou verbalmente o tom de voz (src/content/tone-of-voice.md) e o
  esqueleto de conteúdo (src/content/skeleton.ts) como base de trabalho em PT-BR. Não é um
  registro escrito (mensagem/ata) — é aprovação verbal relatada pelo usuário em nome da
  responsável pela marca. Escopo explícito: cobre tom/estrutura como base de trabalho; NÃO
  cobre o copy final de cada seção, que continua sendo escrito nas fases indicadas por
  `writtenInPhase` em skeleton.ts (Fase 2, 3, ou 5 conforme a seção).

### 2. Criação do repositório GitHub e ações manuais de segurança
expected: |
  `git remote -v` resolve para um repositório GitHub real (público, conforme decisão do
  checkpoint da Task 2 do plano 01-04), e as 5 linhas da Parte 3 de `SECURITY.md` marcadas como
  concluídas somente depois que a ação real foi executada no painel de cada serviço:
  - MFA ativado em GitHub e Vercel (SEC-10)
  - Branch protection em `main` (SEC-12)
  - Revisão de PR obrigatória (SEC-13)
  - Secret scanning + push protection (SEC-14)
  - Registrar lock (SEC-15 — escopo da Fase 5, listado aqui só para rastreabilidade)
result: issue
reported: "issue: o remote origin e a branch phase-01-foundation estão confirmados. SEC-12 e SEC-14 estão completos. Porém, SEC-10 continua pendente, SEC-13 está documentado como risco aceito e SEC-15 pertence à Fase 5. Registre o Teste 2 como parcial/pendente e não marque a Fase 1 como concluída por este teste."
severity: minor
note: |
  Progresso confirmado nesta sessão: `origin` criado (https://github.com/luisglauria/its-garlic,
  auditado antes do push), branch `phase-01-foundation` enviada (sem tocar `main`, sem --force).
  SEC-12 e SEC-14: Complete. SEC-10: perna do registrador de domínio pendente (registrador ainda
  não escolhido). SEC-13: risco residual aceito (AR-07 em 01-SECURITY.md), não é requisito
  satisfeito. SEC-15: fora de escopo desta fase (Fase 5). Este NÃO é um defeito de código — é
  uma combinação de ações externas do dono da conta (SEC-10) e uma decisão operacional já
  documentada como risco aceito (SEC-13), não algo que um plano de execução possa corrigir.

## Summary

total: 2
passed: 1
issues: 1
pending: 0
skipped: 0
blocked: 0

## Gaps

- gap_id: G-01-2
  truth: "As 5 linhas da Parte 3 de SECURITY.md (SEC-10, SEC-12, SEC-13, SEC-14, SEC-15) estão marcadas como concluídas somente após a ação real ter sido executada no painel de cada serviço"
  status: accepted_deferred  # Decisão explícita do usuário em 2026-09-13 — não é "failed" (defeito), é adiamento operacional deliberado.
  reason: "User reported: SEC-10 (perna do registrador de domínio) continua pendente; SEC-13 é risco residual aceito (AR-07), não requisito satisfeito; SEC-15 é escopo da Fase 5. SEC-12 e SEC-14 já estão Complete. Usuário decidiu (2026-09-13): não vai escolher/configurar registrador de domínio nesta fase — SEC-10 fica adiado até a compra do domínio. Nenhum diagnóstico de código executado (não solicitado, não seria aplicável)."
  severity: minor
  test: 2
  artifacts: []
  missing: []
  external: true  # Não é um defeito de código — SEC-10 depende de o dono da conta escolher e comprar um registrador de domínio (pendência de PROJECT.md, adiada explicitamente pelo usuário); SEC-13 é uma decisão operacional já documentada como risco aceito; SEC-15 é escopo da Fase 5 por definição do ROADMAP. Nenhum plano de gap-closure gerado — não há código a mudar.
  deferred_until: "Compra/escolha do registrador de domínio (sem previsão — PROJECT.md Pendências)"
  user_override: "Usuário autorizou explicitamente avançar para a Fase 2 com a Fase 1 parcialmente verificada (2026-09-13)."

Achado adicional (não é gap desta fase, apenas nota de progresso): `git remote -v` agora resolve
para um repositório GitHub real (https://github.com/luisglauria/its-garlic), e a branch
`phase-01-foundation` foi enviada com sucesso (sem tocar `main`, sem --force) — o item de
"criação do repositório" do teste 2 está tecnicamente satisfeito; o que resta pendente é
completar as configurações de segurança que ainda faltam.

Seis achados menores do code review (WR-01/02/03, IN-01/02/03) seguem abertos por decisão de
escopo anterior (correção só do CR-01) — ver `01-REVIEW-FIX.md`. Não bloqueiam esta fase.

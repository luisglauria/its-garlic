# Phase 1: Foundation, Architecture, Brand Identity & Security Baseline - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-12
**Phase:** 1-Foundation, Architecture, Brand Identity & Security Baseline
**Areas discussed:** Vetorização do logo, Guia de marca, Escopo do copy, Baseline de segurança operacional

---

## Vetorização do logo (MARCA-01)

| Option | Description | Selected |
|--------|-------------|----------|
| Vetorização do logo | Quem faz a vetorização e com que fidelidade — usuário traça manualmente vs. Claude gera aproximação vetorial via código | ✓ (elaborado em texto livre) |

**User's choice:** "O SVG do logo deve ser uma aproximação fiel e provisória, sem substituir o arquivo original."
**Notes:** `img/logo.png` continua sendo a fonte oficial. As 6 versões SVG derivadas são explicitamente provisórias, para substituição futura quando houver vetorização profissional.

---

## Guia de marca (MARCA-04)

| Option | Description | Selected |
|--------|-------------|----------|
| Guia de marca | Documento enxuto (paleta/tipografia/uso do logo) vs. brand book completo (tom de voz, fotografia, exemplos de aplicação) | ✓ (elaborado em texto livre) |

**User's choice:** "O guia de marca deve ser completo para uso no site."
**Notes:** Interpretado como completo o suficiente para orientar a implementação prática dos componentes do site (paleta, tipografia, uso do logo, linguagem visual, regras de aplicação) — não um brand book editorial de marketing.

---

## Escopo do copy nesta fase (CONT-01, CONT-02)

| Option | Description | Selected |
|--------|-------------|----------|
| Escopo do copy | Escrever já o copy específico de cada seção (hero, cardápio) vs. fixar apenas tom de voz + estrutura, deixando o texto final para a fase que constrói cada seção | ✓ (elaborado em texto livre) |

**User's choice:** "A copy deve definir tom e estrutura sem inventar dados comerciais."
**Notes:** Fase 1 entrega guia de tom de voz + esqueleto de conteúdo (que seções existem, que informação cada uma carrega). O texto final e específico de hero/cardápio/etc. é escrito na fase que constrói aquela seção (Fase 2/3). Nenhum produto/preço/avaliação pode ser inventado nesse esqueleto.

---

## Baseline de segurança operacional (SEC-10, SEC-12, SEC-13, SEC-14, SEC-15)

| Option | Description | Selected |
|--------|-------------|----------|
| Segurança operacional | Executar interativamente com o usuário nesta sessão (MFA, branch protection, etc.) vs. documentar um checklist para execução posterior | ✓ (elaborado em texto livre) |

**User's choice:** "A segurança operacional deve ser documentada e separada das configurações que precisam ser executadas manualmente pelo proprietário das contas."
**Notes:** O checklist final deve distinguir claramente entre itens que são código/config versionável (headers, CSP, workflow de secret scanning) e itens que são ação manual fora do repositório (MFA em contas, toggles de branch protection no GitHub, DNS registrar lock).

---

## Additional Q&A During This Session

**Q:** O usuário perguntou se as perguntas/respostas desta fase estavam sendo armazenadas em `ask_questions/QA-LOG.md` (o log criado durante a descoberta inicial do projeto).
**A:** Esclarecido que `ask_questions/QA-LOG.md` foi definido, pelo próprio cabeçalho/rodapé do arquivo, como escopo fechado à etapa de descoberta do `/gsd-new-project` (antes do `PROJECT.md`). Perguntado ao usuário se ele queria estender esse arquivo para cobrir todas as fases futuras.
**Decisão:** Não estender — `ask_questions/QA-LOG.md` permanece fechado na descoberta inicial. Cada fase mantém seu próprio `{padded_phase}-DISCUSSION-LOG.md` (este arquivo), que é o mecanismo padrão do workflow GSD.

## Claude's Discretion

- Técnica exata de vetorização do logo (trace automático vs. redesenho manual aproximado).
- Formato exato do checklist de segurança (arquivo dedicado vs. seção em outro doc).

## Deferred Ideas

Nenhuma — a discussão ficou dentro do escopo da fase.

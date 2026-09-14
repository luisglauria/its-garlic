# Phase 2: Hero, CTAs & Location - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-09-13
**Phase:** 2-Hero, CTAs & Location
**Areas discussed:** Escopo de seções da Home, Visual do Hero sem fotos reais ainda, CTAs de pedido com link ainda não confirmado, Horário de funcionamento provisório na Localização

---

## Escopo de seções da Home

| Option | Description | Selected |
|--------|-------------|----------|
| Hero + Localização apenas | Segue literalmente os critérios de sucesso do ROADMAP.md para a Fase 2 | |
| Hero + Localização + Marca + FAQ | Segue o esqueleto de conteúdo da Fase 1 (writtenInPhase: 2 para brand-story/faqs) | ✓ |

**User's choice:** Hero + Localização + Marca + FAQ (recomendado)
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Hero → Marca → CTAs → Localização → FAQ | Ordem narrativa clássica | |
| Hero → CTAs → Marca → Localização → FAQ | Prioriza a ação logo após o hero | ✓ |
| Você decide | — | |

**User's choice:** Hero → CTAs → Marca → Localização → FAQ
**Notes:** —

---

## Visual do Hero sem fotos reais ainda

| Option | Description | Selected |
|--------|-------------|----------|
| Composição ilustrada no estilo da marca | Fundo escuro, blocos verde-limão, ilustração de alho line-art, rotulada provisória | ✓ |
| Hero só com tipografia/cor, sem espaço de imagem | Mais simples, mas HERO-03 não atendido até segunda passada | |
| Você decide | — | |

**User's choice:** Composição ilustrada no estilo da marca (recomendado)
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Slot de imagem fixo, componente pronto para receber a foto | `next/image` com `priority`/dimensões já definidos | ✓ |
| Deixar para decidir a estrutura quando a foto chegar | — | |

**User's choice:** Slot de imagem fixo, componente pronto para receber a foto (recomendado)
**Notes:** Usuário reenviou essas duas respostas explicitamente confirmando que eram as opções "(recomendado)" — sem mudança de decisão.

---

## CTAs de pedido com link ainda não confirmado

| Option | Description | Selected |
|--------|-------------|----------|
| Botão desabilitado com "em breve" | Aparece no lugar certo, mas desabilitado/acinzentado | ✓ |
| Botão clicável que abre um aviso/modal | Mantém interação, exige componente extra | |
| Você decide | — | |

**User's choice:** Botão desabilitado com "em breve" (recomendado)
**Notes:** —

| Option | Description | Selected |
|--------|-------------|----------|
| Mesmo tratamento do iFood (desabilitado/aviso) | Consistência visual entre os dois CTAs de pedido | ✓ |
| Você decide | — | |

**User's choice:** Mesmo tratamento do iFood (desabilitado/aviso)
**Notes:** —

---

## Horário de funcionamento provisório na Localização

| Option | Description | Selected |
|--------|-------------|----------|
| Texto "Horário a confirmar" + sugestão de canal | Sugere confirmar no iFood/WhatsApp antes de ir | ✓ |
| Só o selo "provisório", sem sugerir canal alternativo | Mais simples, menos ajuda prática | |
| Você decide | — | |

**User's choice:** Texto "Horário a confirmar" + sugestão de canal (recomendado)
**Notes:** —

---

## Claude's Discretion

- Estrutura de markup/CSS exata da composição ilustrada do hero.
- Redação exata do texto "em breve" dos CTAs e do aviso de horário.
- Padrão de acessibilidade exato para o CTA desabilitado (`aria-disabled` vs `disabled` nativo).

## Deferred Ideas

Nenhuma — o único ajuste de escopo (incluir brand-story e FAQ) já estava atribuído a esta fase
pelo esqueleto de conteúdo da Fase 1, não é uma capacidade nova.

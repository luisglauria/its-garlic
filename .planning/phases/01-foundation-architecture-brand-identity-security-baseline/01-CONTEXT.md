# Phase 1: Foundation, Architecture, Brand Identity & Security Baseline - Context

**Gathered:** 2026-09-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Esta fase entrega a base técnica, visual e de conteúdo do site — nada disso é visível como
página final ao público, é o que toda página futura vai usar. Escopo: projeto Next.js
scaffolded do zero (o repositório hoje não tem `src/` nem `docs/` — só `img/`,
`ask_questions/`, `.planning/`, `.claude/`); camada de dados tipada e validada por Zod
(produto, categoria, promoção, horário, loja); um único módulo centralizado de integrações
externas (iFood, WhatsApp, Instagram, Maps) com allowlist de destinos; sistema de identidade
visual (logo vetorizado em 6 versões, design tokens, guia de marca); primeira versão de tom
de voz e estrutura de conteúdo; e a linha de base de segurança de conta/repositório
documentada (branch protection, MFA, secret scanning, headers).

</domain>

<decisions>
## Implementation Decisions

### Identidade Visual — Vetorização do logo (MARCA-01)
- **D-01:** O SVG vetorizado do logo é uma **aproximação fiel, mas explicitamente provisória**
  — não substitui `img/logo.png` como fonte oficial do logo. — **Reversibility:** reversible —
  pode ser refeito/substituído quando um vetor profissional for entregue, sem quebrar nada que
  dependa dos nomes/paths dos arquivos SVG.
- **D-02:** As 6 versões (principal, invertido, mono preto, mono branco, ícone isolado,
  favicon) derivam dessa aproximação e devem ser claramente marcadas como provisórias no guia
  de marca, para que a substituição futura pelo vetor definitivo seja simples.

### Identidade Visual — Guia de marca (MARCA-04)
- **D-03:** `docs/brand-guidelines.md` deve ser **completo o suficiente para uso prático no
  site** — cobre paleta, tipografia, uso do logo (com a nota de que o SVG é provisório), a
  linguagem visual (fundos escuros, blocos vibrantes, formas diagonais, ilustração de alho) e
  regras de aplicação em componentes. Não precisa ser um brand book editorial extenso com tom
  de voz de marketing — isso é coberto no bloco de Conteúdo (ver D-04).

### Conteúdo — Escopo do copy nesta fase (CONT-01, CONT-02)
- **D-04:** Nesta fase, a copy define **tom de voz e estrutura**, não o texto final e polido de
  cada seção. Ou seja: um guia de tom de voz (jovem/descontraído/urbano) + esqueleto de
  conteúdo — que seções existem e que informação cada uma carrega — para hero, apresentação da
  marca, categorias, CTAs, FAQs, SEO title/meta description e contato/localização. O copy final
  e específico de cada seção (texto definitivo do hero, descrições de cada categoria do
  cardápio) é escrito/refinado na fase que constrói aquela seção (Fase 2 para hero/local, Fase
  3 para cardápio). — **Reversibility:** reversible.
- **D-05:** Nenhum dado comercial (produto, preço, avaliação, promessa) pode ser inventado
  neste esqueleto — qualquer exemplo usado vem do que já foi pesquisado/confirmado
  (`PROJECT.md`) ou é marcado como placeholder explícito.

### Segurança — Baseline operacional (SEC-10, SEC-12, SEC-13, SEC-14, SEC-15)
- **D-06:** A baseline de segurança operacional é **documentada** nesta fase (um checklist
  claro), não executada interativamente por Claude durante a sessão. O checklist separa
  explicitamente:
  - **(a) O que é código/config versionável** que pode ser implementado diretamente (ex:
    workflow de secret scanning, headers de segurança em `next.config.ts`, `.gitignore`, CSP);
  - **(b) O que é ação manual do dono das contas**, fora do repositório (MFA no
    GitHub/Vercel/registrador de domínio, ativar branch protection e PR obrigatório nas
    configurações do GitHub, DNS registrar lock).
  — **Reversibility:** reversible — é documentação; a execução real das ações manuais acontece
  quando o usuário decidir.

### Claude's Discretion
- Técnica exata de vetorização do logo (trace automático via script/ferramenta vs. redesenho
  manual aproximado) fica a critério de quem planejar/executar, desde que o resultado seja
  fiel ao original e claramente marcado como provisório.
- Formato exato do checklist de segurança (arquivo dedicado, ex. `SECURITY.md`, vs. seção
  dentro de outro doc) fica a critério do planner.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Stack e Arquitetura (pesquisa de domínio)
- `.planning/research/SUMMARY.md` — síntese consolidada de stack, features, arquitetura e
  armadilhas
- `.planning/research/STACK.md` — decisão de stack: Next.js 16 (App Router), React 19,
  TypeScript, Tailwind v4, Zod
- `.planning/research/ARCHITECTURE.md` — padrões de arquitetura recomendados (camada de dados,
  módulo de integrações, separação apresentação/dados/integrações)
- `.planning/research/PITFALLS.md` — armadilhas conhecidas a evitar (ex: hidratação de
  data/hora, CSP com nonce, `<img>` sem `next/image`)
- `.planning/research/FEATURES.md` — funcionalidades mapeadas pela pesquisa de domínio

### Requisitos e Projeto
- `.planning/PROJECT.md` — contexto de negócio, paleta oficial (`#B8FF00`, `#202526`,
  `#000000`, `#31266B`, `#FF3B30`, `#7D804D`, `#FFFFFF`), tipografia (Anton/Archivo Black +
  Manrope/Inter), constraints completas
- `.planning/REQUIREMENTS.md` — bloco 1 (MARCA-01–05, CONT-01–03, ARQ-01–03, INTEGRA-04,
  PERF-01/03), bloco 3 (SEC-01–17), bloco 4 (critérios de aceite testáveis)
- `.planning/ROADMAP.md` — Phase 1 success criteria e sequenciamento (Phase 1 antecede e
  desbloqueia Phases 2–5)

### Segurança
- `ask_questions/QA-LOG.md` — racional completo do threat model dedicado por trás dos
  requisitos SEC-01–17 (ativos críticos, ameaças relevantes)

### Ativos de Marca
- `img/logo.png` — logo oficial original (fonte da vetorização; fundo preto, lettering branco
  arredondado, ícone de alho verde-limão com carinha)
- `img/Screenshot 2026-09-12 151659.png`, `151751.png`, `151841.png`, `212321.png` — prints de
  stories do Instagram confirmando linguagem visual (fundo carvão/roxo, tipografia manuscrita,
  ilustração de alho line-art, botão "PEDIR AQUI 🔥") — **não usar os horários que aparecem
  neles como dado atual**, são referência de formato apenas (2,5–4,8 anos, divergentes entre
  si)

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
Nenhum — o repositório não tem `src/` nem projeto Next.js scaffolded ainda. Esta fase começa
do zero em termos de código.

### Established Patterns
Nenhum padrão de código existente. A pesquisa de domínio (`ARCHITECTURE.md`) é a única fonte
de padrões recomendados a seguir.

### Integration Points
Não aplicável ainda — esta fase cria os pontos de integração (módulo de integrações,
camada de dados) que as Fases 2–5 vão consumir.

</code_context>

<specifics>
## Specific Ideas

- Logo: aproximação vetorial fiel, mas rotulada como provisória; original (`img/logo.png`)
  permanece a fonte de verdade até uma vetorização profissional futura.
- Guia de marca completo o bastante para orientar a implementação de componentes no site
  (não um brand book editorial).
- Copy desta fase = tom de voz + esqueleto de estrutura, não o texto final de cada seção.
- Checklist de segurança operacional separa claramente "o que é código" de "o que é ação
  manual do dono das contas" — sem tentar executar MFA/branch protection pelo usuário nesta
  sessão.

</specifics>

<deferred>
## Deferred Ideas

Nenhuma — a discussão ficou dentro do escopo da fase.

</deferred>

---

*Phase: 1-Foundation, Architecture, Brand Identity & Security Baseline*
*Context gathered: 2026-09-12*

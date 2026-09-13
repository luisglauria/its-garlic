# Phase 1: Foundation, Architecture, Brand Identity & Security Baseline - Research

**Researched:** 2026-09-12
**Domain:** Next.js 16 project scaffolding, data/repository architecture, centralized external-link integration module, brand-asset vectorization, PT-BR content skeleton, and account/repo security baseline (no application code shipped to the public yet — this is the substrate every later phase builds on)
**Confidence:** HIGH (stack versions, Next.js CSP/headers/icons/font APIs, Zod v4 API, package registry facts — all tool-verified this session); MEDIUM (GitHub plan-tier feature gating, logo-vectorization technique, secret-scanning fallback for private repos — synthesized from official docs/changelogs but time-sensitive and worth a final human click-through before relying on it)

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Identidade Visual — Vetorização do logo (MARCA-01)**
- **D-01:** O SVG vetorizado do logo é uma **aproximação fiel, mas explicitamente provisória** — não substitui `img/logo.png` como fonte oficial do logo. Reversível: pode ser refeito/substituído quando um vetor profissional for entregue, sem quebrar nada que dependa dos nomes/paths dos arquivos SVG.
- **D-02:** As 6 versões (principal, invertido, mono preto, mono branco, ícone isolado, favicon) derivam dessa aproximação e devem ser claramente marcadas como provisórias no guia de marca, para que a substituição futura pelo vetor definitivo seja simples.

**Identidade Visual — Guia de marca (MARCA-04)**
- **D-03:** `docs/brand-guidelines.md` deve ser **completo o suficiente para uso prático no site** — cobre paleta, tipografia, uso do logo (com a nota de que o SVG é provisório), a linguagem visual (fundos escuros, blocos vibrantes, formas diagonais, ilustração de alho) e regras de aplicação em componentes. Não precisa ser um brand book editorial extenso.

**Conteúdo — Escopo do copy nesta fase (CONT-01, CONT-02)**
- **D-04:** Nesta fase, a copy define **tom de voz e estrutura**, não o texto final e polido de cada seção. Um guia de tom de voz (jovem/descontraído/urbano) + esqueleto de conteúdo (que seções existem e que informação cada uma carrega) para hero, apresentação da marca, categorias, CTAs, FAQs, SEO title/meta description e contato/localização. O copy final é escrito na fase que constrói aquela seção (Fase 2 hero/local, Fase 3 cardápio). Reversível.
- **D-05:** Nenhum dado comercial (produto, preço, avaliação, promessa) pode ser inventado neste esqueleto — qualquer exemplo vem do que já foi pesquisado/confirmado (`PROJECT.md`) ou é marcado como placeholder explícito.

**Segurança — Baseline operacional (SEC-10, SEC-12, SEC-13, SEC-14, SEC-15)**
- **D-06:** A baseline de segurança operacional é **documentada** nesta fase (checklist claro), não executada interativamente por Claude durante a sessão. O checklist separa explicitamente:
  - (a) O que é código/config versionável, implementável diretamente (workflow de secret scanning, headers de segurança em `next.config.ts`, `.gitignore`, CSP);
  - (b) O que é ação manual do dono das contas, fora do repositório (MFA no GitHub/Vercel/registrador de domínio, branch protection e PR obrigatório nas configurações do GitHub, DNS registrar lock).
  Reversível — é documentação; a execução real acontece quando o usuário decidir.

### Claude's Discretion
- Técnica exata de vetorização do logo (trace automático via script/ferramenta vs. redesenho manual aproximado) — desde que o resultado seja fiel ao original e claramente marcado como provisório.
- Formato exato do checklist de segurança (arquivo dedicado, ex. `SECURITY.md`, vs. seção dentro de outro doc).

### Deferred Ideas (OUT OF SCOPE)
Nenhuma — a discussão ficou dentro do escopo da fase.
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| ARQ-01 | Site estático orientado a dados — sem DB/auth/admin/pagamento | "Standard Stack" + "Architecture Patterns" — Next.js hybrid rendering (no `output: export`), no backend packages installed |
| ARQ-02 | Separação apresentação/dados/integrações, backend-ready | "Architecture Patterns" — Repository pattern (`lib/repositories/`) + Integration module (`lib/integrations/`) as the two swap seams |
| ARQ-03 | Dados validados automaticamente antes do build | "Code Examples" — Zod v4 schema + `.parse()` inside repository functions, fails build loudly |
| MARCA-01 | Logo SVG vetorial, 6 versões | "Common Pitfalls" Pitfall A (vectorization technique) + "Code Examples" (color-layer trace pipeline) |
| MARCA-02 | Paleta como design tokens (`design-tokens.css`/`.json`) | "Architecture Patterns" Recommended Project Structure + Tailwind v4 `@theme` pattern |
| MARCA-03 | Tipografia (Anton/Archivo Black + Manrope/Inter) | "Code Examples" — `next/font/google` + `next/font/local` setup |
| MARCA-04 | `docs/brand-guidelines.md` completo | "Don't Hand-Roll" + Architecture — content lives outside `src/`, referenced by components |
| MARCA-05 | Linguagem visual (fundos escuros, blocos vibrantes, diagonais, alho) | Design tokens + brand guide content, informed by `img/logo.png` and Instagram screenshots already reviewed |
| INTEGRA-04 | Módulo único de integrações externas, allowlist | "Architecture Patterns" Pattern 2 + "Code Examples" — `lib/integrations/*` + `allowlist.ts` |
| CONT-01 | Primeiro draft de todos os textos, PT-BR, tom jovem/descontraído | "Architecture Patterns" — `content/` directory separate from `data/` |
| CONT-02 | Textos cobrem hero, marca, categorias, CTAs, FAQs, SEO, contato | Same as above — content skeleton scope per D-04 |
| CONT-03 | Todo dado sensível marcado como editável/pendente de validação | "Common Pitfalls" Pitfall D (provisional-data UI convention established here) |
| PERF-01 | HTML semântico e acessibilidade WCAG | "Architecture Patterns" — base layout (header/footer) with semantic landmarks, skip-link |
| PERF-03 | Layout mobile-first, totalmente responsivo | Tailwind v4 mobile-first utility defaults; no code yet to verify, but convention set in base layout |
| SEC-03 | Links só para destinos oficiais, validação automatizada | "Code Examples" — allowlist module + Vitest test |
| SEC-04 | Nenhum segredo no repo/`public/`/bundle | "Common Pitfalls" Pitfall C + `.gitignore` template |
| SEC-05 | `NEXT_PUBLIC_*` só dados públicos | Same as SEC-04 — convention documented, `server-only` package |
| SEC-06 | Nada sensível em localStorage/sessionStorage | Documented as a standing code-review rule (no code yet stores anything client-side) |
| SEC-07 | HTTPS + headers de segurança configurados em produção | "Code Examples" — `next.config.ts` `headers()` CSP + HSTS + X-Content-Type-Options + Referrer-Policy |
| SEC-09 | Dependências em versões suportadas, lockfile, auditoria | "Common Pitfalls" Pitfall E + `npm ci` in CI recommendation |
| SEC-10 | MFA obrigatório GitHub/Vercel/registrador | "Security Domain" — manual checklist (cannot be automated by Claude) |
| SEC-12 | Branch `main` protegida, sem push direto | "Security Domain" — GitHub plan-tier caveat is the key finding here |
| SEC-13 | PR obrigatório com revisão antes de merge | "Security Domain" — same GitHub branch-protection setup |
| SEC-14 | Secret scanning automatizado ativo | "Security Domain" — GitHub native (public repo) vs `gitleaks` CLI fallback (private repo) |
| SEC-17 | Nova threat-model review antes de login/CMS/DB/checkout/IA | Documented as a standing constraint in `SECURITY.md`/checklist, not implemented — a process rule |
</phase_requirements>

## Summary

Phase 1 has no user-visible page yet — its job is to make every later phase safe, on-brand, and backend-ready by construction. Four independent workstreams compose it: (1) scaffold a Next.js 16 / React 19 / TypeScript / Tailwind v4 project with the repository+integration architectural seam already in place before any real content exists; (2) reconstruct the It's Garlic logo as a provisional-but-faithful SVG in 6 variants plus a design-token system and brand guide, sourced from `img/logo.png` (confirmed: black background, white rounded "it's garlic" lettering, lime-green garlic-bulb icon with a simple face) and the four Instagram screenshots (visual-language reference only — their hours data is explicitly stale and must never be treated as current); (3) write a PT-BR tone-of-voice guide and content *skeleton* (section list + what each carries, not final copy) for hero/brand-story/categories/CTAs/FAQs/SEO/contact; (4) document — not execute — the account/repo security baseline (MFA, branch protection, secret scanning, DNS lock) as a checklist split between code-implementable items and manual dashboard actions.

The single most consequential finding this session: **GitHub's classic branch-protection rules (SEC-12/SEC-13) are not available on a private repository under GitHub's Free plan for a personal account** — only on public repos (free) or private repos on GitHub Pro/Team/Enterprise. Since this repo has no remote configured yet, this is a decision the client must make before Phase 1's security checklist can be executed: make the repo public (defensible here — SEC-04 already requires zero secrets in the repo, so nothing sensitive would be exposed) or budget for GitHub Pro (~US$4/month). The same public/private split governs SEC-14 (secret scanning is free only on public repos; private repos need paid GitHub Advanced Security or the free, MIT-licensed `gitleaks` CLI run directly in a CI step as a workaround). This is flagged as an Open Question requiring a checkpoint before Phase 1's security tasks can close.

A second correction to the general (pre-existing) research: `PITFALLS.md`/`STACK.md` speculated about a Google Maps iframe embed needing CSP `frame-src` allowances. **REQUIREMENTS.md already rules this out explicitly** — LOCAL-01 has no embedded map ("sem mapa incorporado (iframe) no MVP") and MARCA-05's note says no live Instagram feed embed either. Because every iFood/WhatsApp/Instagram/Maps interaction in this project is a plain outbound `<a target="_blank">` link (never an iframe, form, or fetch call), the CSP does **not** need those third-party hosts in its allowlist at all — a plain `default-src 'self'` policy (Next.js's own official non-nonce example, extended with `img-src 'self' data: blob:` for `next/image`) is sufficient. This meaningfully simplifies Phase 1's `next.config.ts` work and removes a class of "CSP breaks the embed" pitfall that doesn't actually apply to this project's chosen scope.

**Primary recommendation:** Scaffold with `create-next-app@latest --typescript --tailwind --eslint --app --src-dir`, wire `lib/repositories/*` + `lib/schemas/*` (Zod v4) + `lib/integrations/*` (allowlist-validated) as the two backend-ready seams before writing a single page, set a strict non-nonce static CSP via `next.config.ts` `headers()` (no iframes to allow for), and treat the security account-level checklist (MFA/branch-protection/secret-scanning/DNS lock) as a documented, human-executed checklist — resolving the GitHub public/private repo question with the client first.

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Route composition, base layout (header/footer), metadata | Frontend Server (SSR/RSC) | — | Next.js App Router Server Components render the shell; no client JS needed for static structure |
| Brand design tokens (colors, type scale) | Browser / Client (CSS) | Frontend Server (build-time) | Tailwind v4 `@theme` consumes CSS custom properties at build time; delivered to the browser as static CSS, no runtime JS |
| Menu/promotion/store/link data storage | Database / Storage (file-based v1) | — | `data/*.ts` files are the v1 "storage" — no real DB in MVP per ARQ-01; this is the seam a real DB/CMS would replace in v2 |
| Data validation | API / Backend (repository layer) | — | Zod `.parse()` runs inside `lib/repositories/*`, which is the future API boundary — validation belongs there even though there's no network hop yet |
| External link construction + allowlist | API / Backend (integration layer) | — | `lib/integrations/*` is pure logic with no UI concerns; centralizing it here (not in components) is what makes SEC-03 auditable in one place |
| Security headers / CSP | Frontend Server (`next.config.ts`) | CDN / Static (Vercel edge) | Headers are declared in `next.config.ts` and served by Vercel's edge — no middleware/proxy needed for a static, non-nonce CSP |
| Font loading | Browser / Client | Frontend Server (self-hosting) | `next/font` self-hosts and serves font files from the same origin at build time; zero client-side network calls to Google |
| Repo/account security (MFA, branch protection, secret scanning) | Outside the app entirely (GitHub/Vercel/registrar dashboards) | — | Not a runtime tier — a process/account-configuration concern, documented as a checklist, not code |

## Standard Stack

### Core

| Library | Version (verified) | Purpose | Why Standard |
|---------|---------|---------|--------------|
| next | `16.3.5` | Framework, routing, image pipeline, `headers()` | `[VERIFIED: npm registry]` — confirmed via `npm view next version`, matches `CLAUDE.md`'s stated `^16.0.0` and current per official docs fetched this session (docs pages self-report `version: 16.3.5`, `lastUpdated: 2026-03/08-2026`) |
| react / react-dom | `19.3.0` | UI runtime, Server Components default | `[VERIFIED: npm registry]` — required pairing for Next 16; confirmed current |
| typescript | `7.0.2` | Type safety | `[VERIFIED: npm registry]` — note: this is a major-version jump past the `^5.7` figure in `CLAUDE.md`/`STACK.md` (TypeScript 7, the Go-ported "tsgo" compiler line, is now the published `latest` tag). **Flag for confirmation before pinning** — TS 7's tooling/plugin ecosystem compatibility with Next.js 16's own tooling should be spot-checked at scaffold time; if `create-next-app@latest` still pins TS 5.x as its own devDependency, follow the scaffold's choice rather than force-upgrading. |
| tailwindcss / @tailwindcss/postcss | `4.3.3` | Styling, `@theme` design tokens | `[VERIFIED: npm registry]` — matches `CLAUDE.md`'s `v4` (CSS-first) requirement |
| Node.js | `24.20.0` locally; require `>=20.9` in `engines` | Build/dev runtime | `[VERIFIED: node --version this session]` for local; `[CITED: nextjs.org/docs/app/getting-started/installation]` for the `>=20.9` minimum. Pin `engines.node` in `package.json` to the LTS line actually deployed on Vercel (check Vercel's Node setting at deploy time — don't assume it matches local `24.x`). |

### Supporting

| Library | Version (verified) | Purpose | When to Use |
|---------|---------|---------|-------------|
| zod | `4.6.2` | Runtime validation of `data/*` at build/repository time | `[VERIFIED: npm registry]`. **Zod v4 API notes** `[CITED: zod.dev/v4, dev.to migration guides]`: `z.infer`, `.parse()`, `.safeParse()` are unchanged from v3; prefer top-level `z.email()` over `.string().email()` (the method form is deprecated, still works); extend schemas via shape-spread `z.object({ ...Base.shape, ... })`, not `.merge()`; `z.record(keySchema, valueSchema)` now requires both arguments; `error.issues` replaces the old `error.errors` name. |
| schema-dts | `2.0.0` | Typed JSON-LD objects (used starting Phase 5, but the dependency should be added now if content/schema shapes are being finalized) | `[VERIFIED: npm registry]` — `LocalBusiness` is a subtype of `Organization` in the type defs `[CITED: github.com/google/schema-dts]`. Not strictly required in Phase 1 (SEO-02 is a Phase 5 requirement) — only add if the store-info data shape needs to be JSON-LD-compatible from day one to avoid a Phase 5 rework. |
| vitest | `5.0.0` | Unit tests for pure logic (`lib/schemas`, `lib/integrations` allowlist, `lib/scheduling`) | `[VERIFIED: npm registry]`, setup pattern `[CITED: nextjs.org/docs/app/guides/testing/vitest]` — official Next.js-recommended runner for this project shape. Async Server Components aren't unit-testable under Vitest (use E2E later for those) — irrelevant to Phase 1, which only needs pure-function coverage. |
| potrace | `2.1.8` | Raster→SVG silhouette tracing, one color layer at a time | `[VERIFIED: npm registry]` — see "Code Examples" for the multi-layer technique this logo needs (see Pitfall A). |
| sharp | `0.35.4` | Pre-process `logo.png` into per-color masks before tracing; general image pipeline | `[VERIFIED: npm registry]` |
| svgo | `4.1.0` | Clean/simplify traced or hand-authored SVGs (fewer nodes, no editor cruft) | `[VERIFIED: npm registry]` |
| server-only | `0.0.1` | Fails the build if a server-only module is imported into a Client Component | `[VERIFIED: npm registry]` — legitimate first-party package maintained inside the Next.js monorepo (see Package Legitimacy Audit — the "no-repository" flag is a metadata artifact, not a risk signal, cross-checked against `[CITED: dev.to Next.js secrets-in-bundle article]` recommending exactly this package). |
| clsx | `2.1.1` | Conditional Tailwind class strings (active filter/highlight states) | `[VERIFIED: npm registry]` — only add when a component actually needs conditional classing; per `CLAUDE.md`'s own guidance, don't add speculatively. Phase 1 likely doesn't need it yet (no interactive filter UI in this phase). |
| eslint / eslint-config-next | `10.10.0` / `16.3.5` | Linting, flat config | `[VERIFIED: npm registry]` |
| prettier / prettier-plugin-tailwindcss | `3.9.6` / `0.8.1` | Formatting, auto-sorted Tailwind classes | `[VERIFIED: npm registry]` |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `potrace` per-color-layer trace for the logo | `@neplex/vectorizer` (VTracer bindings) or `imagetracerjs` | Both produce multi-color traces natively (no manual color-mask splitting needed), but are less battle-tested/lower-download than `potrace`; `[ASSUMED]` — not independently verified this session, listed only as a fallback if the `potrace` layered approach (see Code Examples) produces unusably messy paths for the rounded lettering. |
| Vitest for unit tests | Jest | Both are Next.js-officially-documented options `[CITED: nextjs.org/docs/app/guides/testing]`; Vitest chosen for faster ESM-native startup on a project with almost no React-rendering tests to run in Phase 1 (pure logic only). |
| `next.config.ts` static `headers()` CSP | `proxy.ts` (formerly middleware) nonce-based CSP | Nonces require every page to opt into dynamic rendering (`connection()`), disabling static generation/ISR and CDN caching — wrong tradeoff for a static marketing site with no per-request state `[CITED: nextjs.org/docs/app/guides/content-security-policy]`. Revisit only if a future phase adds a genuinely dynamic, request-specific inline script. |

**Installation:**
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Data validation
npm install zod

# Backend-boundary safety net
npm install server-only

# Logo vectorization tooling (dev-time only, not a runtime dependency)
npm install -D potrace sharp svgo

# Unit testing (pure-logic coverage: schemas, integrations allowlist, scheduling)
npm install -D vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/dom vite-tsconfig-paths

# Formatting
npm install -D prettier prettier-plugin-tailwindcss
```

**Version verification:** All versions above were checked via `npm view <pkg> version` against the live npm registry this session (2026-09-12) — see the Standard Stack tables for exact figures. **TypeScript is the one number that moved since `CLAUDE.md`/`STACK.md` were written** (from `^5.7` to `7.0.2` as the published `latest` tag) — treat this as a checkpoint: confirm what `create-next-app@latest` actually scaffolds before deciding whether to force TS 7 or stay on the 5.x line the rest of the ecosystem (type-aware ESLint rules, some IDE tooling) may still expect.

## Package Legitimacy Audit

| Package | Registry | Age (latest publish) | Downloads/wk | Source Repo | Verdict | Disposition |
|---------|----------|-----|-----------|-------------|---------|-------------|
| next | npm | published 2026-09-11 | 43.4M | github.com/vercel/next.js | SUS (`too-new`) | Approved — heuristic false positive: official Vercel framework, tens of millions of weekly downloads, matches official docs. Frequent patch releases (security fixes) are expected and desirable here, not a risk signal. `checkpoint:human-verify` not required in practice, but planner should still gate the initial `npm install` behind a quick `npm view next` sanity check. |
| react / react-dom | npm | published 2026-09-09 | 120–128M | github.com/react/react | SUS (`too-new`) | Approved — same reasoning (Meta/React core team package, no realistic slopsquat risk at this download volume). |
| zod | npm | published 2026-09-10 | 209M | github.com/colinhacks/zod | SUS (`too-new`) | Approved — same reasoning. |
| eslint | npm | published 2026-09-04 | 113M | github.com/eslint/eslint | SUS (`too-new`) | Approved — same reasoning. |
| svgo | npm | published 2026-08-24 | 27.8M | github.com/svg/svgo | SUS (`too-new`) | Approved — same reasoning. |
| sharp | npm | published 2026-08-26 | 74.6M | github.com/lovell/sharp | SUS (`too-new`) | Approved — same reasoning; note `sharp` does ship native binaries via postinstall — confirmed `scripts.postinstall` is `null` in the registry metadata pulled this session (no suspicious install-time script). |
| tailwind-merge | npm | published 2026-09-12 | 60.1M | github.com/dcastil/tailwind-merge | SUS (`too-new`) | Approved (not currently in the install list — only add if a component actually needs it, per `CLAUDE.md`). |
| eslint-config-next | npm | published 2026-09-11 | 24.6M | github.com/vercel/next.js | SUS (`too-new`) | Approved — same reasoning (part of the Next.js monorepo). |
| server-only | npm | published 2022-09-03 | 12.9M | none listed in registry metadata | SUS (`no-repository`) | Approved — this is a known, tiny, first-party Vercel package with no separate repo field (it lives inside the Next.js monorepo); widely recommended by official Next.js security guidance. Not a slopsquat candidate. |
| typescript, tailwindcss, @tailwindcss/postcss, schema-dts, potrace, clsx, prettier, prettier-plugin-tailwindcss | npm | various | high | verified repos | OK | Approved, no flags. |

**Packages removed due to `[SLOP]` verdict:** none.
**Packages flagged as suspicious `[SUS]`:** `next`, `react`, `react-dom`, `zod`, `eslint`, `svgo`, `sharp`, `tailwind-merge`, `eslint-config-next`, `server-only` — all flagged solely by the legitimacy checker's `too-new`/`no-repository` heuristics, which misfire on any actively-maintained, high-download package with a recent patch release. Cross-checked against official docs (Next.js, Zod, ESLint, Tailwind, Sharp, SVGO project sites) and multi-tens-of-millions weekly download counts this session — genuine risk is negligible. Per protocol these are still listed as `[SUS]`; the planner should note this false-positive pattern rather than block installation on it, but may still add a lightweight `checkpoint:human-verify` on the very first `npm install` run as a matter of process discipline.

## Architecture Patterns

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────┐
│  BUILD TIME                                                         │
│                                                                       │
│  data/*.ts (menu, promotions, store, links — hand-authored,          │
│  marked "provisional" where unconfirmed)                             │
│         │                                                             │
│         ▼                                                             │
│  lib/schemas/*.schema.ts  — Zod .parse() —  BUILD FAILS on malformed  │
│  or missing required fields (ARQ-03)                                  │
│         │                                                             │
│         ▼                                                             │
│  lib/repositories/*  — getMenu(), getStoreInfo(), etc. — the ONLY     │
│  sanctioned path from data to UI (ARQ-02 swap seam #1)                │
│         │                                                             │
│         ▼                                                             │
│  app/layout.tsx (Server Component) — brand tokens, fonts, semantic    │
│  header/footer landmarks, security headers already active at the     │
│  Vercel edge (SEC-07)                                                 │
│         │                                                             │
│         ▼                                                             │
│  Static HTML/CSS shipped — no client JS needed for Phase 1's shell    │
└────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────┐
│  OUTBOUND CONVERSION (any later phase that renders a CTA)            │
│                                                                       │
│  <CtaButton> click                                                    │
│         │                                                             │
│         ▼                                                             │
│  lib/integrations/{ifood,whatsapp,instagram,maps}.ts                  │
│  — builds URL from a typed constant, checked against                  │
│    lib/integrations/allowlist.ts (SEC-03) — ARQ-02 swap seam #2       │
│         │                                                             │
│         ▼                                                             │
│  <a target="_blank" rel="noopener noreferrer" href={builtUrl}>        │
│  — plain outbound navigation, NEVER an iframe/fetch/form               │
│  — this is why CSP needs no third-party host allowances (see Summary) │
└────────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure

```
its-garlic/
├── src/
│   ├── app/
│   │   ├── layout.tsx              # Root layout: fonts, design tokens, header/footer, skip-link
│   │   ├── page.tsx                 # Home placeholder (real hero content lands Phase 2)
│   │   ├── icon.svg                 # Modern-browser favicon (from the provisional logo icon)
│   │   ├── apple-icon.png           # 180x180 — .svg NOT supported here, must be raster (see Pitfall B)
│   │   └── favicon.ico              # Legacy fallback — MUST be .ico, only valid at app/ root
│   ├── components/
│   │   ├── ui/                      # Empty scaffolding in Phase 1 (Button, Badge, Card primitives) — real components land Phase 2+
│   │   └── layout/                  # Header, Footer, SkipLink — minimal brand shell only
│   ├── data/
│   │   ├── menu.ts                  # Empty/seed structure matching the Zod schema — real content Phase 3
│   │   ├── promotions.ts
│   │   ├── store.ts                 # Provisional address/hours per PROJECT.md, explicitly flagged
│   │   └── links.ts                 # iFood/WhatsApp/Instagram/Maps destinations — placeholder until client confirms (see Open Questions)
│   ├── lib/
│   │   ├── repositories/            # getMenu(), getStoreInfo(), getActivePromotions() — thin wrappers, Zod-validated
│   │   ├── integrations/            # ifood.ts, whatsapp.ts, instagram.ts, maps.ts, allowlist.ts
│   │   ├── schemas/                 # menu.schema.ts, promotion.schema.ts, store.schema.ts, link.schema.ts
│   │   └── utils/                   # cn()/clsx wrapper if needed, formatPrice(), slugify()
│   ├── content/
│   │   ├── tone-of-voice.md         # CONT-01 guide: jovem/descontraído/urbano, dos and don'ts, example lines
│   │   └── skeleton.ts              # CONT-02 structure: which sections exist, what each carries (typed, no final copy)
│   └── styles/
│       ├── design-tokens.css        # MARCA-02 — CSS custom properties consumed by Tailwind v4 @theme
│       └── design-tokens.json       # MARCA-02 — machine-readable mirror (for any future tooling/backend)
├── public/
│   └── brand/
│       ├── logo-principal.svg       # MARCA-01 — 6 versions, all marked provisional in brand-guidelines.md
│       ├── logo-invertido.svg
│       ├── logo-mono-preto.svg
│       ├── logo-mono-branco.svg
│       ├── logo-icone.svg
│       └── favicon-source.svg
├── docs/
│   └── brand-guidelines.md          # MARCA-04
├── SECURITY.md                       # D-06 — code-implementable vs manual-action checklist (Claude's discretion: dedicated file chosen over embedding in README)
├── vitest.config.mts
├── next.config.ts                   # headers() — CSP + HSTS + X-Content-Type-Options + Referrer-Policy
├── .gitignore                        # confirm .env* excluded (SEC-04)
└── package.json                      # engines.node pinned
```

### Structure Rationale

Full rationale for the `data/` vs `lib/repositories/` boundary and the `lib/integrations/` isolation is already established in `.planning/research/ARCHITECTURE.md` (canonical reference per `01-CONTEXT.md`) — this phase's job is to stand that structure up with real (if empty/seeded) files, not to redesign it. Two additions specific to Phase 1 execution:

- **`content/` vs `data/` split matters even more in Phase 1 than later phases**, because Phase 1's own deliverable IS the content skeleton (CONT-01/02) — keeping it in `content/skeleton.ts` (typed, but prose/structure, not commercial facts) rather than `data/` from day one prevents a later refactor when Phase 2/3 need to separate "what a client reviews as copy" from "what a client edits as price/hours data."
- **`public/brand/` for the provisional SVGs, not `src/`** — these are static assets served as-is, and per D-01/D-02 they must be trivially replaceable later; nesting them under `public/brand/` with stable, predictable filenames (matching what `docs/brand-guidelines.md` documents) is the seam a professional vector delivery replaces without touching any component import path.

### Pattern 1: Zod v4 Schema + Repository (ARQ-02, ARQ-03)

**What:** Every `data/*.ts` file is validated once, inside its repository function, using a Zod v4 schema; components never import `data/*` directly.
**When to use:** Every data shape in this phase (menu item — seed/placeholder only, promotion rule, store info, external link destination).
**Example:**
```typescript
// src/lib/schemas/store.schema.ts
// Source: zod.dev/v4 — z.infer/.parse unchanged from v3; z.email() is the v4-preferred
// top-level form (the .string().email() method form still works but is deprecated).
import { z } from "zod";

export const storeInfoSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  neighborhood: z.literal("Mercado da Torre"),
  city: z.literal("Recife"),
  state: z.literal("PE"),
  modalities: z.array(z.enum(["balcao", "delivery", "take-away"])),
  hours: z.object({
    provisional: z.literal(true), // ARQ-03 + CONT-03: cannot ship as `false` until client confirms
    schedule: z.array(
      z.object({ days: z.string(), open: z.string(), close: z.string() })
    ),
  }),
});

export type StoreInfo = z.infer<typeof storeInfoSchema>;
```
```typescript
// src/lib/repositories/store-repository.ts
import { storeInfoSchema } from "@/lib/schemas/store.schema";
import rawStore from "@/data/store";

export function getStoreInfo() {
  return storeInfoSchema.parse(rawStore); // build fails loudly on a malformed edit (ARQ-03)
}
```

### Pattern 2: Centralized, Allowlisted Integration Links (INTEGRA-04, SEC-03)

**What:** Every outbound URL is built and hostname-validated in one module.
**Example:**
```typescript
// src/lib/integrations/allowlist.ts
// Hostnames confirmed against the actual destinations once the client provides them
// (see Open Questions — iFood store URL / WhatsApp number are both pending confirmation).
export const ALLOWED_HOSTS = [
  "ifood.com.br",
  "www.ifood.com.br",
  "wa.me",
  "api.whatsapp.com",
  "instagram.com",
  "www.instagram.com",
  "google.com",
  "www.google.com",
  "maps.app.goo.gl",
] as const;

export function assertAllowedHost(url: string): string {
  const { hostname } = new URL(url);
  if (!ALLOWED_HOSTS.includes(hostname as (typeof ALLOWED_HOSTS)[number])) {
    throw new Error(`Blocked outbound host not on allowlist: ${hostname}`);
  }
  return url;
}
```
```typescript
// src/lib/integrations/whatsapp.ts
import { assertAllowedHost } from "./allowlist";
import { WHATSAPP_NUMBER_PLACEHOLDER } from "@/data/links"; // flagged provisional per Open Questions

export function buildWhatsAppUrl(message?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER_PLACEHOLDER}`;
  const url = message ? `${base}?text=${encodeURIComponent(message)}` : base;
  return assertAllowedHost(url);
}
```
```typescript
// src/lib/integrations/allowlist.test.ts — Vitest, SEC-03's "validação automatizada" requirement
import { describe, expect, test } from "vitest";
import { assertAllowedHost } from "./allowlist";

describe("assertAllowedHost", () => {
  test("accepts an official WhatsApp destination", () => {
    expect(assertAllowedHost("https://wa.me/5581900000000")).toBeTruthy();
  });
  test("rejects a fraudulent look-alike host", () => {
    expect(() => assertAllowedHost("https://wa.me.evil.example/x")).toThrow();
  });
});
```

### Pattern 3: Static, Non-Nonce CSP (SEC-07) — No Iframes to Allow

**What:** Because this project's MVP has zero embedded third-party content (LOCAL-01 explicitly excludes a Maps iframe; MARCA-05's note excludes a live Instagram embed), a plain `default-src 'self'` policy set via `next.config.ts` covers the whole site — no `frame-src`/`connect-src` exceptions for iFood/WhatsApp/Instagram/Maps are needed, since all four are reached only via `<a target="_blank">`.
**Source:** `[CITED: nextjs.org/docs/app/guides/content-security-policy]` — this is the framework's own official "Without Nonces" example, only the `img-src` line is extended for `next/image`'s `blob:`/`data:` usage.
```typescript
// next.config.ts
import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

const cspHeader = `
  default-src 'self';
  script-src 'self'${isDev ? " 'unsafe-eval'" : ""};
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data:;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  upgrade-insecure-requests;
`;

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspHeader.replace(/\n/g, "") },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" }, // redundant with frame-ancestors 'none' but keeps older browsers covered
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};

export default nextConfig;
```
**Verification note:** SEC-11 (verified on the real production domain, not local) belongs to Phase 5 — Phase 1 only needs the header config to exist and be correct; production verification via securityheaders.com/CSP Evaluator happens once there's a real deployment.

### Pattern 4: Fonts via `next/font` (MARCA-03)

**What:** Self-host Anton/Archivo Black (display) and Manrope/Inter (body) — zero runtime requests to Google Fonts, zero layout shift.
**Source:** `[CITED: nextjs.org/docs/app/getting-started/fonts]`
```typescript
// src/app/layout.tsx
import { Anton, Manrope } from "next/font/google";

const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-display" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-body" });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${anton.variable} ${manrope.variable}`}>
      <body>{children}</body>
    </html>
  );
}
```
If Archivo Black or Manrope/Inter licensing/self-hosting via Google Fonts proves awkward, `next/font/local` accepts local `.woff2` files with the identical API shape — decide per-font at implementation time, not a blocking research gap.

### Anti-Patterns to Avoid

- **Importing `data/*` directly in a component** — breaks the ARQ-02 swap seam the moment a backend is introduced. Enforce via code review / lint rule (`no-restricted-imports` for `@/data/*` outside `lib/repositories/`).
- **Hardcoding an iFood/WhatsApp/Instagram/Maps URL string in a component** — the whole point of INTEGRA-04/SEC-03. Every href goes through `lib/integrations/*`.
- **Reaching for a nonce-based CSP "to be extra secure"** — forces every page into dynamic rendering, killing static generation/ISR for a site with no per-user state and no genuine need for it in Phase 1.
- **Putting the "await client confirms hours" flag anywhere other than the data layer** — `hours.provisional: true` belongs in the Zod schema/data file (Pattern 1), not as a UI-only comment, so a future data update that flips it to confirmed is a one-line diff, not a hunt across components.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|--------------|-----|
| Runtime data validation | A hand-rolled `if (!data.price) throw ...` checker | Zod v4 schemas (`lib/schemas/*`) | Schema doubles as the TypeScript type source (`z.infer`), so schema and type can't drift; battle-tested error messages |
| Security headers | Manually crafting the CSP string from scratch by trial and error | Next.js's own official CSP "Without Nonces" example as the base, extended only where genuinely needed | The official example is already tuned for Next.js's own asset-loading requirements (avoids breaking hydration) |
| Favicon/icon generation | Hand-writing every `<link rel="icon">` tag | Next.js file-based conventions (`favicon.ico`, `icon.svg`, `apple-icon.png`) | Next.js auto-generates the correct `<head>` tags with correct `sizes`/`type` attributes — see Pitfall B for the file-type gotcha |
| Font self-hosting/preloading | Manual `@font-face` + preload `<link>` tags | `next/font/google` or `next/font/local` | Handles self-hosting, subsetting, `size-adjust` (zero layout shift) automatically |
| Secret detection in commits | A custom regex grep script | `gitleaks` (MIT-licensed CLI) or GitHub native secret scanning (public repos) | Maintained detection rules for hundreds of credential formats; a hand-rolled regex will miss patterns and give false confidence |

**Key insight:** Every "don't hand-roll" item above exists because this project's actual complexity is architectural (the two swap seams) and operational (account security), not algorithmic — reach for the framework/library default before writing custom logic, especially for anything touching validation or security headers.

## Common Pitfalls

### Pitfall A: Naive single-pass raster trace produces an unusable multi-color logo

**What goes wrong:** `img/logo.png` has three visually distinct color regions (black background, white lettering, lime-green icon with a darker facial detail). A single call to `potrace.trace()` only produces a black/white **silhouette** at one threshold `[CITED: github.com/tooolbox/node-potrace]` — running it directly on the full-color PNG either loses the green icon entirely or merges it into the white/black mask, producing a wrong-looking "approximation."
**Why it happens:** `potrace` (and most classic tracers) are fundamentally single-channel/threshold tools; multi-color tracing requires either a specialized tool (VTracer-based `@neplex/vectorizer`) or manual color separation first.
**How to avoid:** Use `sharp` to extract three binary masks from `logo.png` (white-lettering mask, green-icon mask, treating black as background/transparent in both), run `potrace.trace()` separately on each mask with its actual brand hex color (`#FFFFFF`, `#B8FF00`) as the `color` param, then combine the two resulting `<path>` elements into one `<svg>` root. Run the result through `svgo` to remove excess nodes. Compare visually against `img/logo.png` before calling it "faithful enough" per D-01 — this is exactly the kind of check that belongs behind a `checkpoint:human-verify` task, since "faithful" is a subjective, client-facing bar.
**Warning signs:** Traced SVG shows only two colors, or the garlic icon disappears/merges with the lettering.

### Pitfall B: `apple-icon` cannot be an SVG — only `favicon` can only be `.ico`

**What goes wrong:** Teams often assume "one SVG, done" for all icon variants. Next.js's file convention table `[CITED: nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons]` is strict: `favicon` accepts `.ico` **only**, and must live at the top-level `app/` (not nested); `apple-icon` accepts `.jpg`/`.jpeg`/`.png` **only** — no SVG. Only the general-purpose `icon` file convention accepts `.svg`.
**How to avoid:** Generate at minimum: `app/favicon.ico` (rasterized from the icon SVG), `app/icon.svg` (for modern browsers, scalable), and `app/apple-icon.png` (180×180 PNG, per Apple's convention) — this satisfies MARCA-01's 6-variant requirement plus Next.js's file-type rules simultaneously. `sharp` can rasterize the SVG to both `.ico` and `.png` outputs in the same build/asset-prep script.
**Warning signs:** Next.js silently ignores an `apple-icon.svg` file (wrong extension) with no build error — the icon variant will simply be missing from `<head>`.

### Pitfall C: `NEXT_PUBLIC_*` bundle leakage — mostly moot in Phase 1, but the convention must be set now

**What goes wrong:** Per `PITFALLS.md` (canonical ref), any `NEXT_PUBLIC_*` var is permanently inlined into the client bundle. This project has close to zero legitimate env secrets in the MVP (no backend), so the risk in Phase 1 specifically is someone reaching for an env var out of habit (e.g., a Maps API key) without realizing there's no code yet that needs one.
**How to avoid:** Install `server-only` now, even though there's no server-only module yet that strictly needs it — it costs nothing and establishes the guard rail before Phase 2+ adds real integration code. Confirm `.gitignore` excludes `.env*` except `.env.example` from the very first commit.
**Warning signs:** Any `NEXT_PUBLIC_` variable appears in a PR diff with "key," "token," or "secret" in its name.

### Pitfall D: GitHub's Free-plan branch-protection gap silently breaks SEC-12/13 if the repo defaults to private

**What goes wrong:** `[CITED: docs.github.com/en/get-started/learning-about-github/githubs-products]` — classic branch-protection rules on a **private** repository are only available starting at GitHub Pro (personal accounts) or Team/Enterprise (organizations); GitHub Free (personal, private repo) does not expose the "Require a pull request before merging" setting at all. Since this repo has no git remote configured yet (`git remote -v` returns nothing this session), whoever creates the GitHub repo could pick "private" by default and only discover the missing settings page once they try to configure it — after MFA/team setup has already assumed a specific plan.
**How to avoid:** Decide repo visibility (public vs. GitHub Pro private) **before** attempting the SEC-12/13/14 checklist — this is now an Open Question requiring client confirmation, not something Claude can silently pick.
**Warning signs:** The "Branches" settings page shows no way to require pull-request reviews; secret-scanning settings show it's available only in "public repositories."

### Pitfall E: `npm audit` clean ≠ safe (carried from canonical `PITFALLS.md`, restated for Phase 1's CI setup)

**What goes wrong/how to avoid:** Already fully documented in the canonical `.planning/research/PITFALLS.md` Pitfall 5 — restated here only to anchor it to Phase 1's concrete deliverable: the CI workflow this phase should scaffold must use `npm ci` (not `npm install`) `[CITED: multiple sources cross-checked against official npm ci vs install semantics]`, and the lockfile must be committed from the very first commit.

## Code Examples

### Vitest config for pure-logic unit tests
```typescript
// vitest.config.mts
// Source: nextjs.org/docs/app/guides/testing/vitest (official Next.js guide)
import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    environment: "node", // Phase 1 only tests pure functions (schemas, allowlist) — no DOM needed yet
  },
});
```

### `.gitignore` baseline (SEC-04)
```gitignore
# Source: standard Next.js create-next-app template + SEC-04 requirement
node_modules/
.next/
.env
.env.local
.env.*.local
!.env.example
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|---------------|--------|
| Tailwind `tailwind.config.js` + `content: []` glob | Tailwind v4 CSS-first `@theme` block in CSS, automatic content detection | v4 GA (Jan 2025), current throughout 2026 | No JS config file to keep in sync; design tokens live as CSS custom properties, directly importable |
| `pages/` Router | App Router (`app/`) | Next.js 13+, now the only actively-developed router | This project's file conventions (icons, `headers()`, Server Components) are App-Router-only |
| Zod v3 `.merge()`/`.string().email()` | Zod v4 shape-spread / top-level `z.email()` | Zod v4 release (per `zod.dev/v4`) | Method forms still work (deprecated) — no forced rewrite, but new code should use v4 idioms |
| GitHub secret scanning as an Advanced-Security add-on everywhere | Free on all public repos since 2023; still paid for private repos | 2023 GitHub changelog, unchanged as of this session | Directly informs the SEC-14 public/private repo decision (see Open Questions) |

**Deprecated/outdated:**
- Nonce-based CSP as a *default* recommendation for this project shape — still fully supported by Next.js, but the wrong tradeoff here (forces dynamic rendering for zero actual benefit given no inline scripts/embeds).

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `@neplex/vectorizer`/`imagetracerjs` are viable fallbacks if the `potrace` layered-trace approach produces a poor result | Standard Stack (Alternatives Considered) | Low — this is an explicitly-flagged fallback, not a load-bearing decision; worst case, hand-drawn SVG paths are used instead (already sanctioned by CONTEXT.md's "Claude's Discretion") |
| A2 | Archivo Black/Manrope/Inter are available and license-clean via `next/font/google` self-hosting without needing `next/font/local` | Code Examples (Pattern 4) | Low — if a font isn't on Google Fonts or has licensing friction, `next/font/local` is a drop-in substitute with the same API; doesn't block the phase |
| A3 | Vercel's Node.js runtime setting will be compatible with whatever `engines.node` gets pinned locally | Standard Stack (Core table) | Low-Medium — a mismatch causes a build failure on first deploy, easily fixed by adjusting the Vercel project's Node version setting; not a design risk |
| A4 | The repository's GitHub visibility (public vs. private) has not yet been decided by the client | Common Pitfalls (D), Security Domain, Open Questions | High if unresolved before Phase 1's security tasks are attempted — SEC-12/13/14 cannot be executed correctly without this decision (see Open Questions) |

**If this table is empty:** N/A — see entries above; none of them block Phase 1's code-level work, only A4 blocks the security-checklist tasks specifically.

## Open Questions

1. **GitHub repository visibility (public vs. private) — blocks SEC-12/13/14 execution, not code**
   - What we know: no git remote is configured yet (`git remote -v` returns nothing); GitHub Free (personal) does not support classic branch-protection on private repos `[CITED: docs.github.com/en/get-started/learning-about-github/githubs-products]`; secret scanning is free only on public repos `[CITED: docs.github.com secret-scanning docs + GitHub 2023 changelog]`.
   - What's unclear: whether the client wants the source public (defensible — SEC-04 already guarantees zero secrets in the repo) or is willing to pay for GitHub Pro (~US$4/month) to keep it private with the same protections.
   - Recommendation: surface this as a `checkpoint:human-verify`/discussion item before the security-baseline plan/tasks are finalized. If public: enable native GitHub secret scanning + push protection for free. If private-on-Pro: same GitHub-native features become available; if private-and-staying-on-Free (accepting the gap): fall back to running the free, MIT-licensed `gitleaks` CLI directly as a CI step (not the GitHub Marketplace Action, which needs a paid license for organization-owned private repos — a personal-account private repo can still use the official Action free per `gitleaks`'s own licensing note `[CITED: github.com/gitleaks/gitleaks-action README via WebSearch digest]`, but running the static Go binary directly sidesteps any ambiguity).

2. **Exact TypeScript version to pin (5.x vs. 7.x)**
   - What we know: `npm view typescript version` returns `7.0.2` as `latest` this session, a jump from the `^5.7` figure in `CLAUDE.md`/`STACK.md`.
   - What's unclear: whether `create-next-app@latest`'s own scaffolded `devDependencies` still target TypeScript 5.x (common for frameworks to lag a major release before validating compatibility), and whether the type-aware ESLint config (`eslint-config-next`) is validated against TS 7 yet.
   - Recommendation: let the scaffold (`create-next-app`) pick the version it ships with rather than manually forcing either number; only override if the scaffolded version conflicts with a specific need.

3. **iFood store URL and WhatsApp number** (carried from `REQUIREMENTS.md` bloco 5, `[BLOQUEADOR de fase]` for Phase 2, not Phase 1)
   - What we know: Phase 1 only builds the `lib/integrations/*` module and its allowlist — it does not need the real destination values yet, only a clearly-labeled placeholder in `data/links.ts`.
   - What's unclear: the actual values, pending client confirmation.
   - Recommendation: Phase 1's `data/links.ts` should use an obviously-fake, clearly-commented placeholder (e.g., `"PLACEHOLDER_PENDING_CLIENT_CONFIRMATION"`) that would visibly fail a real click-test, not a plausible-looking fake number — this prevents an accidental real-looking wrong number from ever making it past Phase 1 into a later phase unnoticed.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Build/dev runtime | ✓ | v24.20.0 | — (verify Vercel's deploy-time Node version separately — see Assumption A3) |
| npm | Package management | ✓ | 11.19.0 | — |
| git | Version control | ✓ | 2.55.0.windows.4 | — |
| gh (GitHub CLI) | Repo creation, branch-protection API calls (optional, for scripting the manual checklist) | ✓ | 2.100.0 | Manual GitHub web UI if `gh` API calls are avoided |
| GitHub remote | Hosting the repo, all SEC-1x checklist items | ✗ (no `git remote` configured) | — | Must be created before any SEC-10/12/13/14 checklist item can be executed — this is the Open Question #1 blocker |
| Vercel account/project | Hosting, headers verification (Phase 5), MFA (SEC-10) | Unknown (not checked this session — outside repo) | — | Client must confirm account exists before SEC-10 checklist item can be marked done |

**Missing dependencies with no fallback:**
- GitHub remote repository — must exist before the account-security portion of this phase (checklist items, not code) can be executed. The code-level deliverables (scaffold, data layer, integrations module, brand assets, content skeleton) do not depend on this and can proceed in parallel.

**Missing dependencies with fallback:**
- None beyond the GitHub remote above — everything else needed for the code-level deliverables (Node/npm/git) is already present.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest `5.0.0` `[VERIFIED: npm registry]`, setup pattern `[CITED: nextjs.org/docs/app/guides/testing/vitest]` |
| Config file | `vitest.config.mts` — none exists yet (Wave 0) |
| Quick run command | `npx vitest run lib/integrations/allowlist.test.ts` |
| Full suite command | `npm run test` (once the `test` script is added to `package.json`) |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| ARQ-03 | Malformed `data/*` entry fails the build | unit | `npx vitest run lib/schemas/*.test.ts` | ❌ Wave 0 |
| SEC-03 | Outbound link hostname validated against allowlist | unit | `npx vitest run lib/integrations/allowlist.test.ts` | ❌ Wave 0 |
| SEC-04 | No secret pattern in `.gitignore`-covered files / committed history | manual + CI (gitleaks) | `gitleaks detect --source . --no-git=false` (or CI step) | ❌ Wave 0 (no CI workflow file yet) |
| SEC-07 | Security headers present in `next.config.ts` | unit/smoke | A simple Vitest test importing `nextConfig` and asserting the `headers()` array shape (full production verification is Phase 5/SEC-11) | ❌ Wave 0 |
| MARCA-01 | 6 logo variants exist at expected `public/brand/` paths | manual/smoke | A small Node script or Vitest `fs.existsSync` check listing the 6 expected filenames | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx vitest run <changed-file>.test.ts`
- **Per wave merge:** `npm run test` (full suite)
- **Phase gate:** Full suite green before `/gsd-verify-work`; production-header verification is explicitly out of scope for Phase 1 (Phase 5/SEC-11 owns that)

### Wave 0 Gaps
- [ ] `vitest.config.mts` — framework install: `npm install -D vitest vite-tsconfig-paths` (no `jsdom`/React Testing Library needed yet — Phase 1 has no interactive components to render-test)
- [ ] `lib/schemas/*.test.ts` — covers ARQ-03
- [ ] `lib/integrations/allowlist.test.ts` — covers SEC-03
- [ ] A minimal CI workflow (`.github/workflows/ci.yml`) running `npm ci` + `npm run test` + `npm audit` — covers SEC-09's "auditoria antes de cada release" as an automated gate, and is the natural home for a `gitleaks` CLI step (SEC-14 fallback)

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-------------------|
| V2 Authentication | No | No user accounts/login in this MVP (explicitly out of scope) |
| V3 Session Management | No | No sessions — static site, no auth |
| V4 Access Control | No | No differentiated access levels in the app itself; access control that matters here is repo/account-level (branch protection, MFA — see checklist below) |
| V5 Input Validation | Yes | Zod v4 schemas at the repository boundary (Pattern 1); untrusted input surfaces are search/URL params, addressed structurally in Phase 3 but the validation *pattern* is established here |
| V6 Cryptography | No | No cryptographic operations in this MVP (no passwords, no tokens to sign) |
| V14 Configuration | Yes | Security headers via `next.config.ts` `headers()` (Pattern 3); `.gitignore`/`server-only` convention (SEC-04/05) |

### Known Threat Patterns for this stack

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|----------------------|
| Link-swap / phishing via a compromised or typo'd outbound URL | Tampering / Spoofing | Centralized `lib/integrations/*` + `allowlist.ts`, unit-tested (Pattern 2) — this project's own threat model names this the top real risk |
| Secret leakage via `NEXT_PUBLIC_*` or a committed `.env` | Information Disclosure | `server-only` package + `.gitignore` baseline + `gitleaks`/GitHub secret scanning (Pitfall C, Open Question 1) |
| Compromised GitHub/Vercel/registrar account pushing malicious content or a DNS change | Tampering / Elevation of Privilege | MFA (SEC-10) + branch protection/required PR review (SEC-12/13) — all manual-checklist items per D-06, blocked on Open Question 1 |
| Missing HTTPS/security headers | Tampering / Information Disclosure | `next.config.ts` `headers()` (Pattern 3) — HSTS, CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options |
| Supply-chain compromise via a malicious dependency version | Tampering | `npm ci` in CI (never `npm install`), committed lockfile, `npm audit` as a gate (Pitfall E, Wave 0 CI workflow) |

### Security Baseline Checklist (D-06 — code vs. manual split)

**(a) Code/config — implementable directly in this phase:**
- [ ] `next.config.ts` `headers()` with CSP + HSTS + X-Content-Type-Options + Referrer-Policy + X-Frame-Options (Pattern 3)
- [ ] `.gitignore` excludes `.env*` except `.env.example`
- [ ] `server-only` installed and ready to guard any future server-only module
- [ ] `lib/integrations/allowlist.ts` + unit tests (Pattern 2)
- [ ] `.github/workflows/ci.yml` running `npm ci`, `npm run test`, `npm audit`, and a `gitleaks` CLI step
- [ ] `SECURITY.md` documenting SEC-17 as a standing constraint (new threat-model review required before login/CMS/DB/checkout/AI features)

**(b) Manual — dashboard actions, outside the repository, blocked on Open Question 1 (repo visibility decision):**
- [ ] Create the GitHub repository (decide public vs. private — see Open Questions)
- [ ] Enable MFA on GitHub, Vercel, and the domain registrar (SEC-10) — registrar not yet chosen, see `PROJECT.md` Pendências
- [ ] Configure branch protection on `main`: require PR before merge, require ≥1 approval (SEC-12/13) — only fully available if public, or private on GitHub Pro/Team
- [ ] Enable secret scanning + push protection (SEC-14) — free if public; paid GHAS or `gitleaks` CI fallback if private-on-Free
- [ ] Domain registrar lock + MFA (SEC-15) — Phase 5 per `ROADMAP.md`, but the registrar choice itself is a Pendência

## Sources

### Primary (HIGH confidence)
- `npm view <package> version` — this session, 2026-09-12 — confirmed exact registry versions for `next`, `react`, `react-dom`, `typescript`, `tailwindcss`, `@tailwindcss/postcss`, `zod`, `schema-dts`, `potrace`, `sharp`, `svgo`, `server-only`, `clsx`, `tailwind-merge`, `eslint`, `eslint-config-next`, `prettier`, `prettier-plugin-tailwindcss`, `vitest`
- `gsd_run query package-legitimacy check` — this session — verdicts and signals for all packages in the Standard Stack
- [nextjs.org/docs/app/guides/content-security-policy](https://nextjs.org/docs/app/guides/content-security-policy) — fetched this session, official, version-stamped `16.3.5`
- [nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/app-icons) — fetched this session, official
- [nextjs.org/docs/app/guides/testing/vitest](https://nextjs.org/docs/app/guides/testing/vitest) — fetched this session, official
- `img/logo.png` — read/viewed this session — confirmed exact visual composition (black bg, white rounded lettering, lime-green garlic icon with face detail)
- `.planning/research/ARCHITECTURE.md`, `.planning/research/PITFALLS.md`, `.planning/research/STACK.md`, `.planning/PROJECT.md`, `ask_questions/QA-LOG.md` — canonical project research/decisions, read this session

### Secondary (MEDIUM confidence)
- [docs.github.com — GitHub's plans](https://docs.github.com/get-started/learning-about-github/githubs-products) via WebSearch/WebFetch digest — branch-protection plan-tier gating (Pitfall D, Open Question 1)
- [docs.github.com — GitHub Advanced Security billing](https://docs.github.com/en/billing/concepts/product-billing/github-advanced-security) via WebFetch digest — secret-scanning private-repo paywall confirmation
- [zod.dev/v4](https://zod.dev/v4) release notes, cross-checked against two independent migration-guide blog posts — Zod v4 API changes
- [github.com/tooolbox/node-potrace](https://github.com/tooolbox/node-potrace) via WebFetch digest — potrace single-color-threshold behavior (Pitfall A)
- [github.com/gitleaks/gitleaks-action](https://github.com/gitleaks/gitleaks-action) via WebSearch digest — free-tier licensing nuance for personal vs. organization private repos

### Tertiary (LOW confidence)
- WebSearch-only digests not cross-checked against a primary doc (e.g., `@neplex/vectorizer`/`imagetracerjs` capability claims) — flagged `[ASSUMED]` in Assumptions Log where relied upon

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — every version number tool-verified against the live npm registry this session
- Architecture: HIGH — this phase implements the already-researched, project-canonical `ARCHITECTURE.md` patterns; no new architectural decisions were introduced, only Phase-1-specific application (icons, fonts, CSP simplification)
- Pitfalls: MEDIUM-HIGH — the CSP/icon/font pitfalls are tool-verified against official docs; the GitHub plan-tier gating (Pitfall D) is MEDIUM (WebFetch digest of official docs, not independently confirmed by logging into a real account) and is the one finding that should be double-checked by the client/planner before the security checklist is executed

**Research date:** 2026-09-12
**Valid until:** ~30 days for framework/library version numbers (Next.js/React/Zod/Tailwind ship frequently); GitHub plan-tier/pricing facts should be re-verified at execution time since pricing pages change without a "changelog" trail

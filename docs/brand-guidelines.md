# Guia de marca — It's Garlic

Guia prático (D-03): completo o suficiente para implementar um componente sem abrir uma captura
de tela ou fazer uma pergunta. Não é um brand book editorial — tom de voz e linguagem de
marketing vivem em `src/content/tone-of-voice.md`; este documento não repete aquele conteúdo.

Nenhum produto, preço ou horário de funcionamento é declarado aqui — dados comerciais não
confirmados vivem em `src/data/store.ts` (`hours.provisional: true`) e são tratados por
LOCAL-03 (Fase 2).

## Paleta

As sete cores oficiais da marca, copiadas caractere por caractere de `PROJECT.md` e espelhadas em
`src/styles/design-tokens.css` / `design-tokens.json`. Nunca ajuste um destes hex por contraste,
adicione um tom/tint que a marca não tem, ou troque por uma cor "parecida" — onde a paleta não
atinge um par de contraste, a regra vive na tabela abaixo, não numa edição da cor da marca (P11).

| Cor | Hex | Token semântico | Papel |
|---|---|---|---|
| Verde-limão | `#B8FF00` | `--color-accent` | Acento — destaque, CTA, ícone, foco de teclado. Nunca como campo extenso de fundo. |
| Carvão | `#202526` | `--color-surface-primary` | Superfície escura primária — fundo de seções, footer. |
| Preto | `#000000` | `--color-surface-deep` | Superfície escura profunda — fundo do header/logo principal, hero. |
| Branco | `#FFFFFF` | `--color-text-on-dark` | Texto sobre superfícies escuras. |
| Roxo | `#31266B` | `--color-accent-purple` | Superfície escura alternativa (variação de seção, nunca texto). |
| Coral | `#FF3B30` | `--color-accent-coral` | Acento de alerta/urgência (ex: "Happy Hour agora") — uso pontual. |
| Oliva | `#7D804D` | `--color-accent-olive` | Acento terroso secundário — uso pontual, nunca como texto de corpo isolado. |

Em componentes, referencie sempre a custom property (`var(--color-accent)`, classe Tailwind
`bg-accent`/`text-accent` etc.) — nunca um literal hex solto no código. Um hex num componente é
um token que o design system não conhece.

### Tabela de contraste (WCAG 2.2 — 4.5:1 texto de corpo, 3:1 texto grande ≥18px ou ≥14px bold)

Pares plausíveis no site, calculados a partir dos hex oficiais acima:

| Par (texto / fundo) | Razão de contraste | Texto de corpo | Texto grande |
|---|---|---|---|
| Branco sobre Carvão | ≈15,5:1 | Conforme (AAA) | Conforme |
| Branco sobre Preto | ≈21:1 | Conforme (AAA) | Conforme |
| Branco sobre Roxo | ≈13,0:1 | Conforme (AAA) | Conforme |
| Preto sobre Lima | ≈17,3:1 | Conforme (AAA) | Conforme |
| Carvão sobre Lima (ou Lima sobre Carvão) | ≈12,8:1 | Conforme (AAA) | Conforme |
| Lima sobre Preto | ≈17,3:1 | Conforme (AAA) | Conforme |
| Coral sobre Preto | ≈5,9:1 | Conforme (AA) | Conforme |
| Oliva sobre Preto | ≈5,1:1 | Conforme (AA), no limite | Conforme |
| Coral sobre Carvão | ≈4,4:1 | **Não conforme** (abaixo de 4,5:1) | Conforme |
| Oliva sobre Carvão | ≈3,7:1 | **Não conforme** (abaixo de 4,5:1) | Conforme |
| Branco sobre Lima | ≈1,2:1 | **Não conforme** — quase ilegível | **Não conforme** |

**Par recomendado para texto de corpo:** branco (`--color-text-on-dark`) sobre carvão
(`--color-surface-primary`) — a combinação padrão do site (ver `src/app/layout.tsx`, que aplica
exatamente esse par no `<body>`). Para botões/CTAs sobre fundo lima, use texto preto ou carvão
(`--color-surface-deep`/`--color-surface-primary`), nunca texto branco sobre lima.

**Onde um par oficial falha para texto de corpo** (coral e oliva sobre carvão): use-os sobre
preto (`--color-surface-deep`) em vez de carvão, ou reserve-os para texto grande/negrito (título,
badge). Não editar o hex da marca para "consertar" o contraste — a regra é trocar o par, não a
cor.

## Tipografia

| Papel | Família (token) | Peso carregado | Uso |
|---|---|---|---|
| Display | `--font-display` → Anton, com Archivo Black como substituto de fallback | Peso único 400 (Anton não é uma fonte variável) | Títulos e destaques (`font-display` no Tailwind) |
| Corpo | `--font-body` → Manrope, com Inter como substituto de fallback | Fonte variável, eixo de peso 200–800 (sem peso travado) | Corpo de texto, navegação, UI (`font-body`) |
| Script | `--font-script` → Caveat (escolha de critério do Claude — PROJECT.md não nomeia uma fonte script específica) | Peso único regular | **Reservada exclusivamente para frases promocionais pontuais** (ex: "Happy Hour") — nunca para corpo de texto ou navegação |

Ambas as famílias de uso corrente (display e corpo) são **self-hosted** pelo módulo de fontes do
Next.js (`next/font/google`, instanciado em `src/app/layout.tsx`) — nenhuma requisição em tempo
de execução sai para um CDN de fontes de terceiros. Adicionar uma nova fonte significa adicionar
uma nova instância `next/font` no layout raiz e vinculá-la a uma nova custom property
`--font-*`, nunca adicionar uma tag `<link>` de stylesheet externo.

### Escala tipográfica (mobile-first — `src/styles/design-tokens.css`)

| Token | Valor | Uso |
|---|---|---|
| `--text-heading-1` | 2rem (32px) | H1 de página |
| `--text-heading-2` | 1.5rem (24px) | H2 de seção |
| `--text-heading-3` | 1.25rem (20px) | H3 / subtítulo |
| `--text-body` | 1rem (16px) | Corpo padrão |
| `--text-body-sm` | 0.875rem (14px) | Texto auxiliar, legendas, footer |

Mobile-first: esta é a escala base para a tela pequena (PERF-03); breakpoints mais largos podem
aumentar o tamanho, nunca diminuir abaixo destes valores no caso base.

## Uso do logo

**Aviso — leia antes de usar qualquer arquivo abaixo (D-01, D-02):** os seis SVGs em
`public/brand/` são uma **aproximação vetorial provisória**, traçada automaticamente a partir de
`img/logo.png` pelo script `scripts/vectorize-logo.mjs` (ver `01-05-SUMMARY.md`). Eles **não
substituem** `img/logo.png`, que continua sendo a fonte oficial do logo até que um vetor
profissional seja entregue pelo cliente. Quando esse vetor chegar, ele substitui os arquivos
exatamente nos mesmos seis caminhos abaixo — nenhum import de componente muda. A lombada
lettering foi **traçada automaticamente** do original (não redesenhada à mão) e traçou limpa na
primeira tentativa, com contadores arredondados intactos.

| Arquivo (`public/brand/…`) | Descrição | Fundo indicado |
|---|---|---|
| `logo-principal.svg` | Cor cheia — fundo preto embutido, lettering branco, ícone lima | Fundo preto (`--color-surface-deep`) — usado no header (`Header.tsx`) |
| `logo-invertido.svg` | Fundo branco embutido, lettering carvão, ícone lima | Fundos claros |
| `logo-mono-preto.svg` | Uma cor, preto sólido, fundo transparente | Impressão/monocromia sobre fundo claro |
| `logo-mono-branco.svg` | Uma cor, branco sólido, fundo transparente | Sobre qualquer superfície escura da marca |
| `logo-icone.svg` | Ícone do alho isolado, fundo transparente, viewBox justo | Avatar, favicon, redes sociais, espaços pequenos |
| `favicon-source.svg` | Ícone em canvas quadrado com padding uniforme, fundo transparente | Fonte de geração de `icon.svg`/`apple-icon.png`/`favicon.ico` — não usar diretamente em UI |

### Regras de uso

- **Tamanho mínimo:** não renderizar o logo principal/invertido abaixo de 32px de altura, nem o
  ícone isolado abaixo de 20px — abaixo disso o traçado perde legibilidade.
- **Área de proteção:** manter um espaço livre ao redor do logo equivalente à altura do ícone do
  alho dentro da própria marca — não encostar outro elemento (texto, borda, outro logo) nessa
  área.
- **Nunca fazer:**
  - Recolorir o logo com uma cor fora da paleta de sete cores oficiais.
  - Esticar, distorcer ou alterar a proporção do arquivo.
  - Adicionar sombra, brilho, contorno ou qualquer efeito não presente no original.
  - Reconstruir o logo a partir de uma captura de tela do Instagram — sempre usar os arquivos
    versionados em `public/brand/` ou, na dúvida, `img/logo.png`.
  - Apresentar qualquer um destes seis SVGs como a versão definitiva/oficial do logo em material
    voltado ao cliente sem repetir o aviso de que é provisório.

## Linguagem visual

Confirmada em `PROJECT.md` e visível nos prints de referência do Instagram em `img/`
(`Screenshot 2026-09-12 151659.png`, `151751.png`, `151841.png`, `212321.png`):

- **Fundos escuros** — carvão (`--color-surface-primary`) e preto (`--color-surface-deep`) como
  superfícies predominantes; roxo (`--color-accent-purple`) como variação ocasional de seção.
- **Blocos vibrantes** — o verde-limão (`--color-accent`) usado com moderação, como destaque
  (botão, ícone, sublinhado, indicador de foco), nunca como um campo grande de cor. Uma página
  inteira em lima não é "mais on-brand" — é ilegível e foge do papel de acento que a cor tem na
  identidade real.
- **Formas diagonais** — recortes/blocos diagonais como elemento gráfico de composição entre
  seções, conforme visto nos stories de referência.
- **Ilustração de alho em line-art** — traço branco/lima sobre fundo escuro, no espírito do ícone
  vetorizado em `public/brand/logo-icone.svg`.
- **Tipografia manuscrita pontual** — a família script (Caveat) aparece do mesmo jeito que
  "Happy Hour" aparece manuscrito nos stories de referência: como uma frase isolada, nunca como
  bloco de texto corrido.

**Nota sobre os prints de referência:** os quatro arquivos `img/Screenshot*.png` /
`img/212321.png` são referência de **formato e linguagem visual apenas**. Os horários de
funcionamento visíveis neles têm entre 2,5 e 4,8 anos, são divergentes entre si, e **nunca devem
ser copiados como horário atual** — ver `PROJECT.md` Pendências e `src/data/store.ts`
(`hours.provisional: true`).

## Aplicação em componentes

Regras concretas para quem constrói um componente na Fase 2 em diante — as implementações de
referência são `src/components/layout/Header.tsx` e `src/components/layout/Footer.tsx`.

- **Cor:** sempre pela custom property/classe Tailwind do token (`bg-surface-deep`,
  `bg-surface-primary`, `text-accent`, `text-text-on-dark`, etc.) — nunca um hex literal. Ver a
  tabela de contraste acima antes de escolher um par texto/fundo.
- **Cartão (card) de produto:** fundo `--color-surface-primary` (carvão), texto
  `--color-text-on-dark` (branco), com o preço ou selo de destaque em `--color-accent` (lima)
  sobre um pequeno chip — nunca lima como fundo do cartão inteiro.
- **Botão primário (CTA):** fundo `--color-accent` (lima), texto `--color-surface-deep` ou
  `--color-surface-primary` (preto/carvão) — nunca texto branco sobre lima (falha de contraste,
  ver tabela acima).
- **Badge/selo secundário:** fundo `--color-accent-coral` ou `--color-accent-olive` com texto
  branco em tamanho grande/negrito (≥18px ou ≥14px bold), ou sobre `--color-surface-deep` se o
  texto for de corpo normal — nunca coral/oliva com texto de corpo normal sobre carvão (ver
  tabela de contraste).
- **Foco de teclado:** todo elemento interativo herda o anel `:focus-visible` global definido em
  `src/app/globals.css` (`--color-accent`, contraste ≈12,8:1 contra as duas superfícies escuras)
  — nunca remover esse anel sem substituí-lo por outro igualmente visível (PERF-01).
- **Imagens:** sempre via `next/image`, com `width`/`height` explícitos (ou um contêiner
  dimensionado com `fill`) para reservar o espaço e não causar deslocamento de layout (CLS).
  Nunca uma tag `<img>` crua nem `background-image` não gerenciado para foto de produto ou logo.
- **Responsividade:** mobile-first — estilizar primeiro para a tela pequena (a base, sem largura
  fixa em pixel) e adicionar breakpoints mais largos por cima, nunca o inverso (PERF-03).

## Referências cruzadas

- **Tom de voz e escrita:** `src/content/tone-of-voice.md` — registro, ritmo, regionalismo,
  exemplos aprovados/rejeitados. Este guia não repete esse conteúdo.
- **Tokens de design:** `src/styles/design-tokens.css` / `design-tokens.json` — fonte de verdade
  técnica para os valores exatos deste documento; se algum dia divergirem, os arquivos de token
  vencem e este guia deve ser atualizado para bater com eles.
- **Pipeline de geração da marca:** `scripts/vectorize-logo.mjs` — único caminho sancionado para
  regenerar os seis arquivos SVG de `public/brand/` e os três arquivos de convenção de ícone do
  Next.js, caso `img/logo.png` seja substituído por um novo original.

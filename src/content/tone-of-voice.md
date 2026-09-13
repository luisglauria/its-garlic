# Guia de Tom de Voz — It's Garlic

Este arquivo é a referência de tom para qualquer texto que o site It's Garlic venha a publicar.
Ele vive em `src/content/`, ao lado de `skeleton.ts`, porque as fases que escrevem o texto final
de cada seção (Fase 2, Fase 3) consultam os dois arquivos juntos: um define *como soar*, o outro
define *o que cada seção precisa dizer*. `docs/brand-guidelines.md` é outro documento, com outro
público — a identidade visual da marca, não a voz escrita.

## 1. Quem fala e para quem

A It's Garlic é um restaurante descontraído dentro do Mercado da Torre, em Recife. Quem escreve
em nome da marca fala como alguém que trabalha ali e gosta do que serve — não como uma agência de
publicidade tentando soar jovem. O público é majoritariamente de Recife, acessando pelo celular,
procurando rápido: o que é o lugar, onde fica, como pedir, o que comer agora.

- **Registro:** jovem, descontraído, urbano. Nunca corporativo, nunca "institucional demais".
- **Pessoa e pronome:** segunda pessoa, sempre `você`. Nunca `tu` isolado (mistura registro),
  nunca terceira pessoa distante ("o cliente pode..."). Essa escolha é consistente em todo o
  site — hero, botões, FAQs, contato.
- O texto se dirige a alguém com fome e pouco tempo de leitura, não a alguém lendo um manifesto de
  marca. Frase curta ganha de frase bonita.

## 2. O conceito central

Toda linha de copy serve a uma ideia: **"Mais que um pão de alho!"**. O pão de alho recheado é a
assinatura da marca — o motivo pelo qual alguém lembra do nome It's Garlic — mas não é o cardápio
inteiro. A casa também serve sanduíches no pão de alho, petiscos, espetinhos, almoço e happy hour.

O erro mais fácil de cometer aqui é escrever como se fosse uma hamburgueria genérica com um item
de pão de alho na lista. Isso é o oposto do que a marca é. Qualquer texto sobre cardápio, sobre a
casa, ou sobre por que visitar, deve deixar claro que o pão de alho é o ponto de partida, não o
teto.

## 3. Ritmo e forma

- Frases curtas. Se uma frase precisa de vírgula para caber uma ideia extra, considere quebrar em
  duas.
- Voz ativa. "Peça pelo iFood" em vez de "o pedido pode ser feito pelo iFood".
- Substantivo concreto em vez de adjetivo vago. "Pão de alho recheado" comunica mais que
  "delicioso pão de alho".
- Títulos e CTAs precisam caber numa tela de celular sem quebrar em três linhas — teste mentalmente
  a largura antes de aprovar uma frase de destaque.
- Fonte manuscrita/script (herdada da identidade visual real da marca — ver
  `docs/brand-guidelines.md`) é reservada para frases promocionais pontuais, curtas, tipo
  assinatura — nunca para um parágrafo inteiro ou para texto funcional (botão, aviso, endereço).

## 4. Regionalismo

O tom pode soar de Recife sem virar caricatura. Um "vem pra cá" ou um "bora" pontual é bem-vindo;
gíria pesada, forçada, ou expressões que só quem já mora no bairro entende, excluem justamente o
visitante de fora que o site também precisa acolher. A régua é: um morador de Recife reconhece o
tom como familiar, e um visitante de outra cidade entende a frase sem esforço.

## 5. O que nunca fazer

Esta lista é o limite duro do tom de voz — não é sugestão de estilo, é regra:

- Nunca inventar um **produto** que a marca não tenha.
- Nunca inventar um **preço**.
- Nunca inventar uma **avaliação** (nota, estrela, depoimento).
- Nunca inventar um **prêmio**.
- Nunca inventar um **horário de funcionamento**.
- Nunca inventar uma **promessa comercial** (frete grátis, desconto, brinde) que ninguém
  confirmou.
- Nunca usar **superlativos ou comparações não sustentadas** — "o melhor pão de alho de Recife",
  "o mais pedido da cidade", "premiado" — sem uma fonte citável que sustente a afirmação.
- Nunca escrever uma frase que precisaria de um advogado ou de um nutricionista para defender
  (alegação de saúde, alegação legal implícita).
- Nunca deixar a informalidade escorregar para **deboche, body-shaming, ou urgência por culpa**
  ("você vai se arrepender se não pedir agora"). Descontração não é licença para constranger quem
  lê.

## 6. Acessibilidade da linguagem

- Todo link descreve o próprio destino: "Pedir no iFood", nunca "clique aqui" ou "saiba mais".
- Nenhum significado depende só de emoji — emoji pode decorar uma frase que já se sustenta sem
  ele, nunca substituir a frase.
- Texto alternativo de imagem descreve a comida ou a cena, não o nome do arquivo
  (`pao-de-alho-recheado-aberto-mostrando-recheio`, não `IMG_2043.jpg`).

## 7. Exemplos aprovados e reprovados

Cada par abaixo mostra uma linha reprovada e a reescrita aprovada, com o motivo. As linhas
aprovadas só usam fatos que `PROJECT.md` já confirma (o conceito, o bairro, as modalidades, o
canal do iFood); onde um exemplo precisaria de produto ou preço reais, um placeholder explícito
substitui o dado.

1. **Reprovado:** "O melhor pão de alho de Recife, garantido!"
   **Aprovado:** "Mais que um pão de alho — o pão de alho que dá nome à casa."
   **Motivo:** a versão reprovada é um superlativo sem fonte; a aprovada reafirma o conceito da
   marca sem alegar um ranking que ninguém mediu.

2. **Reprovado:** "Aberto todos os dias até tarde, sempre!"
   **Aprovado:** "Horário de funcionamento em confirmação — consulte antes de vir."
   **Motivo:** nenhum horário atual foi confirmado pelo cliente; inventar um horário é o tipo de
   erro que o guia proíbe explicitamente.

3. **Reprovado:** "[placeholder de nome de produto] por [placeholder de valor] — imperdível!"
   **Aprovado:** "Cardápio completo com as 10 categorias da casa — veja tudo antes de pedir."
   **Motivo:** nenhum produto ou preço específico está confirmado nesta fase; a versão aprovada
   fala da estrutura do cardápio sem citar um item ou valor que não existe ainda.

4. **Reprovado:** "Clique aqui para pedir"
   **Aprovado:** "Pedir no iFood"
   **Motivo:** link genérico não descreve o destino; a versão aprovada nomeia exatamente para onde
   o clique leva, requisito de acessibilidade da seção 6.

5. **Reprovado:** "Prato premiado, eleito o favorito da cidade"
   **Aprovado:** "Um prato feito para quem já conhece a casa e para quem tá conhecendo agora"
   **Motivo:** "premiado" e "favorito da cidade" são alegações que nenhuma fonte sustenta; a
   reescrita convida sem inventar reconhecimento externo.

6. **Reprovado:** "Você vai se arrepender se não pedir agora"
   **Aprovado:** "Dá vontade só de ler o cardápio — bora pedir?"
   **Motivo:** urgência por culpa é proibida na seção 5; a reescrita mantém o convite descontraído
   sem constranger quem ainda está decidindo.

7. **Reprovado:** "Peça já ou perca essa oportunidade única"
   **Aprovado:** "No balcão, no delivery ou no take away — do jeito que for melhor pra você"
   **Motivo:** a primeira cria pressão artificial; a segunda usa um fato confirmado (as três
   modalidades de atendimento) para orientar sem pressionar.

## O que este arquivo não é

Este guia não é o texto final de nenhuma seção do site. Por decisão D-04 da Fase 1, a redação
definitiva do hero e da seção de localização é escrita na **Fase 2**, e a redação definitiva do
cardápio é escrita na **Fase 3**. Este arquivo é a restrição de tom dentro da qual essas fases
escrevem — não um rascunho a ser copiado direto para o site.

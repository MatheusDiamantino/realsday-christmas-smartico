# Widget Natal (React + Vite)

Widget front-end pensado para rodar como integração com a Smartico (missões, torneios e mapa/níveis).

## O que é

- Widget em React que renderiza um “mapa de níveis” com missões e torneio, consumindo dados via `window._smartico.api` quando a Smartico está disponível.
- O projeto roda sem Smartico configurado (renderiza o layout e usa fallbacks), para facilitar desenvolvimento e demonstração.
- No desktop, o app é apresentado dentro de um frame em formato de celular (UI “mobile-first”).

## Como funciona

### Entrada e Smartico

- [index.jsx](file:///c:/Users/mathe/Downloads/Widget-Natal/index.jsx) inicializa deep links do widget e tenta carregar o script da Smartico (quando configurado).
- [App.jsx](file:///c:/Users/mathe/Downloads/Widget-Natal/src/App.jsx) renderiza o layout sempre. Quando a Smartico está disponível, os componentes usam a API; caso contrário, o layout continua renderizando.

### Deep links

Os links `dp:` (Smartico) ficam como anchors invisíveis no HTML e são atualizados em runtime:

- `dl-tournaments` → `dp:gf_tournaments&id=...`
- `dl-missions` → `dp:gf_missions&id=...`
- `dl-missions-2` → `dp:gf_missions&id=...`
- `dl-daily-gift` → `dp:gf_section&id=...`

Isso permite que os botões do layout simplesmente “cliquem” nesses anchors, sem hardcode de IDs no HTML.

### Estrutura de pastas (resumo)

- `src/widget-pass/` → mapa/níveis + modais e visual principal
- `src/widget-mission/` → listagem e seleção de missões (prioriza IDs configurados)
- `src/widget-tourments/` → listagem de torneios
- `src/functions/` → helpers (ex: ações protegidas, timers)
- `src/config/` → configuração via variáveis de ambiente

## Configuração (variáveis de ambiente)

As chaves reais da Smartico não ficam no repositório. Use o arquivo de exemplo:

- `.env.example` (copie para `.env`)

Variáveis principais:

- `VITE_SMARTICO_PROJECT_KEY` / `VITE_SMARTICO_BRAND_KEY` → habilitam a integração Smartico
- `VITE_SMARTICO_PUBLIC_USER_ID` / `VITE_SMARTICO_PUBLIC_USER_HASH` → usuário “demo” para dev (opcional)
- `VITE_CHRISTMAS_TOURNAMENT_ID`, `VITE_CHRISTMAS_MISSION_IDS`, `VITE_CHRISTMAS_DAILY_GIFT_ID` → IDs da campanha

## Requisitos

- Node.js + npm

## Configuração

1. Instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` a partir do exemplo:

```bash
copy .env.example .env
```

3. Preencha as variáveis do `.env` (as chaves reais não ficam no repositório).

## Rodar local

```bash
npm run dev
```

## Build

```bash
npm run build
```

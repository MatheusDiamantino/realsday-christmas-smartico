# Widget de Natal com Smartico

Mapa de níveis interativo com tema de Natal, com missões, torneio e presente diário, feito em React e Vite.

Desenvolvido profissionalmente para a **UX Group**, empresa dona das marcas de apostas **Reals, Bingo e BetGo**. É um widget de gamificação integrado à plataforma **Smartico**. Este repositório é uma versão sem as marcas: chaves, IDs de campanha, domínios e imagens das marcas foram trocados por variáveis de ambiente e imagens genéricas.

## Funcionalidades

- **Mapa de níveis** com rolagem por arraste e botões, usando os níveis de `window._smartico.api.getLevels()`, um prédio ilustrado por nível
- **Animações Lottie** (rena, neve e fumaça) por cima do mapa
- **Modais por nível**:
  - **Presente de Natal**: explica a regra e abre o presente diário por deep link
  - **Torneio de Natal**: escolhe o torneio pelo ID (ou pelo nome) em `getTournamentsList()` e mostra o prêmio total, as inscrições e o botão de participar
  - **Missões**: busca as missões com `getMissions()`, dá prioridade aos IDs configurados e atualiza pelo `onUpdate`
- **Deep links `dp:`** da Smartico (`gf_tournaments`, `gf_missions`, `gf_section`) em links ocultos, com os IDs preenchidos ao carregar a página
- **Funciona sem a Smartico**: sem as chaves configuradas, o layout aparece com dados de reserva, o que ajuda no desenvolvimento e na demonstração
- **Moldura de celular** no desktop, já que o layout é pensado primeiro para mobile

## Stack

- React 19
- Vite 7, com `@vitejs/plugin-react` e `@vitejs/plugin-legacy` para navegadores antigos
- Sass (SCSS)
- `@lottiefiles/react-lottie-player`
- ESLint 9

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

Preencha o `.env` com as suas chaves e IDs. Todas as variáveis são opcionais: sem elas, o widget mostra só o layout.

| Variável | Uso |
| --- | --- |
| `VITE_SMARTICO_PROJECT_KEY` / `VITE_SMARTICO_BRAND_KEY` | Ligam a integração com a Smartico |
| `VITE_SMARTICO_PUBLIC_USER_ID` / `VITE_SMARTICO_PUBLIC_USER_HASH` | Usuário de demonstração |
| `VITE_CHRISTMAS_TOURNAMENT_ID` / `VITE_CHRISTMAS_TOURNAMENT_NAME` | Torneio da campanha |
| `VITE_CHRISTMAS_MISSION_IDS` | IDs das missões, separados por vírgula |
| `VITE_CHRISTMAS_DAILY_GIFT_ID` | Seção do presente diário |

Build de produção:

```bash
npm run build
```

## Estrutura

```
index.jsx               ponto de entrada: deep links e carregamento da Smartico
src/App.jsx             moldura de celular e espera pela API da Smartico
src/config/christmas.js leitura das variáveis da campanha
src/widget-pass/        mapa de níveis, modais, animações e estilos
src/widget-mission/     lista e carrossel de missões
src/widget-tourments/   lista de torneios
public/img/             ilustrações do mapa e ícones
```

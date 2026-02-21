# 📚 Guia Completo de Funções da Aplicação: AI Speaking Object (Gerador de Reels)

Este documento foi criado para fornecer ao agente **Manus** todas as informações detalhadas sobre as capacidades, fluxo de dados e integrações da nossa aplicação geradora de vídeos focada em "Objetos Falantes" para processos automatizados de Instagram Reels. Use este documento para planejar e extrair o máximo do potencial da ferramenta para a criação de conteúdo do usuário.

---

## 🏗 Estrutura Geral e Fluxo Principal (Core Flow)
A aplicação é um WebApp (Next.js + Capacitor para Android) onde o usuário cria vídeos curtos e engajadores de objetos inanimados falando, utilizando Inteligência Artificial.

**O Fluxo de Criação em 3 Passos (Localizado em `src/app/page.tsx` e `CreationForm.tsx`):**
1. **Input (Entrada de Dados):** O usuário preenche o nome do objeto, sua emoção e o motivo daquela emoção. Ele pode gerar um roteiro e um prompt visual refinados por IA com base nesses dados.
2. **Approval (Aprovação Visual):** Uma imagem inicial do objeto é gerada (ou enviada pelo usuário). O usuário aprova a imagem gerada antes de animar.
3. **Result (Geração do Vídeo):** A IA gera o vídeo do objeto falando com base no prompt aprovado e no estilo de voz selecionado.

---

## ⚙️ Funcionalidades Detalhadas e Módulos de IA

### 1. Geração de Roteiros e Prompts (Gemini API)
A aplicação utiliza o **Google Gemini (gemini-2.5-flash)** para processar textos inteligente.
- **`generateScript`:** Baseado no Objeto, Emoção e Motivo, a IA redige um roteiro engajador de fala curta para o Reels.
- **`refinePromptV2`:** Melhora e detalha automaticamente o prompt visual baseado no contexto e emoção do objeto, preparando os comandos exatos que serão enviados para a geração de imagem.
- **Viral Mode (Botão de Atalho):** Preenche automaticamente o formulação com um modelo provado e altamente viral (Exemplo atual: Coxinha Revoltada - "Salgadinho Brasileiro: Com muita Raiva por ser mordido por um gigante").

### 2. Criação de Imagens (Imagen 4.0 via Gemini / Replicate)
- **Geração Primária (`gemini-image.ts`):** Utiliza o **Google Imagen 4.0** (via API) para renderizar a imagem inicial do objeto inanimado com base no `prompt` textual criado. Custo na plataforma do usuário: **1 Crédito**.
- **Upload Manual:** O usuário pode pular a IA e fazer o upload direto de uma imagem de seu dispositivo.
- **Inserção de Logos:** A aplicação permite o upload da logo do usuário que pode ser compostado junto com as mídias.

### 3. Animação e Criação de Vídeo (Google Veo 3.1 & Modelos Extras)
O coração da aplicação é transformar a imagem estática no vídeo.
- **Google Veo 3.1 (`gemini-video.ts`):** Motor de vídeo ultra-realista que toma a imagem gerada/enviada e o prompt aprovado para criar um vídeo cinemático de exatamente **6 segundos** do objeto "vivo"/animado.
    - Existem duas qualidades disponíveis no Veo 3.1:
      - **Fast (`veo-3.1-fast-generate-preview`):** Geração rápida. Custo na plataforma: **15 Créditos**.
      - **Quality (`veo-3.1-generate-preview`):** Geração de extrema qualidade e renderização. Custo na plataforma: **40 Créditos**.
- **Modelos Alternativos/Backup (Replicate API, `replicate.ts`):** A aplicação ainda contém suporte para o TTS (Text-to-Speech) **Suno Bark** atrelado à animação via **SadTalker**, convertendo texto para áudio e animando os "lábios" da imagem gerada.

---

## 💰 Sistema de Créditos e Monetização
A plataforma é monetizada via **Stripe** e o saldo dos usuários é mantido via banco de dados **Supabase**.
- Componente `create-checkout-session.ts` e Webhooks do Stripe em `src/app/api/webhooks/route.ts` lidam com a compra de pacotes.
- **Gastos do Sistema:**
  - Gerar Imagem (Imagen 4.0): **1 crédito**
  - Geração de Vídeo Rápida (Veo Fast): **15 créditos**
  - Geração de Vídeo Alta Qualidade (Veo Quality): **40 créditos**
- A autenticação barra automaticamente os processos de backend se o saldo da carteira (`profiles.credits`) no banco de dados Supabase for insuficiente.

---

## 🌍 Internacionalização e Customização UX
- **Tradução Nativa (EN / PT):** Toda a jornada, desdo os formulários (`CreationForm.tsx`) aos roteiros de IA, reage dinamicamente entre Inglês (`en`) e Português do Brasil (`pt`) via estado global. Os prompts e retornos do Gemini são localizados mediante ao idioma selecionado.
- **Voice Styles e Escolha de Cenários:** O usuário pode selecionar cenários práticos (`ScenarioSelector.tsx`) para o fundo e estéticas pré-definidas de estilos de vozes (ex: "Cartoon / Expressive").
- **Histórico e Favoritos:** Integração total com o Supabase para carregar, favoritar (`toggleFavorite`) e manter salvos (`CreationForm.loadFavorites`) os roteiros bem-sucedidos do usuário através da tabela `Generations`.

---

## 🔐 Autenticação e Perfis (Supabase)
Todo o ecossistema de gestão de sessão do usuário é nativo implementado. O Manus pode auxiliar o usuário sugerindo estratégias de funil utilizando estas rotas:
- `/login`, `/signup`, `/forgot-password`, `/reset-password`
- Redirecionamentos seguros através do `/auth/callback`
- `/profile`: Acesso do usuário às configurações, visualização do plano e seus dados.
- `/admin`: Rota de painel administrativo para análise de uso amplo.

---

## 🤖 COMO O AGENTE MANUS PODE AGIR COM ESSAS INFORMAÇÕES:
Com base no que foi exposto, o agente Manus pode ser proativo ao lado do desenvolvedor/criador de conteúdo (USER) para:
1. **Criar Planilhas de "Objetos vs Emoções":** Idealizar roteiros virais e massivos testando combinações inusitadas (ex: "Sinaleiro Deprimido", "Garrafa Térmica Ansiosa") antes de colocar na ferramenta.
2. **Otimização de Custos (Prompt Engineering):** Como o Veo custa muitos créditos (15 a 40), o Manus pode ajudar os usuários e o USER a construir os **melhores e mais detalhados prompts de texto** e cenários imaginativos para o `generateScript` afim de garantir a geração de vídeo perfeita de primeira.
3. **Campanhas Multilíngues:** Formular estratégias que mesclam outputs simultâneos, planejando conteúdo em Português (PT-BR) e recriando as mesmas emoções e traduções localizadas para o mercado gringo (EN), pois o app suporta os dois lados.
4. **Gerar ideias para Atualizações:** O Manus sabe que a arquitetura suporta falas reais via **Bark + SadTalker** ou realismo cinemático puro via **Google Veo**. Ele pode traçar campanhas distintas dependendo se o foco do vídeo é "narrativa longa e falada" (usar Bark) ou apenas "reação visual cinemática de 6s" (usar Veo).

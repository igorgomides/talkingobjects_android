# Implementação: Página "Sobre Nós" Otimizada para SEO (AI Search) - v4.0 (ou versao superior se ja estivermos a frente)

## 1. Objetivo
Criar uma página `/about` (Sobre Nós) que não seja apenas um "diário do fundador" vago, mas sim um **documento estratégico de posicionamento para o Google e Buscas por IA** [1, 2]. O objetivo é garantir que a IA entenda exatamente o que o nosso SaaS faz, para quem ele é e quais serviços oferecemos [3].

## 2. Estrutura da Página e Copywriting (As 5 Regras de Ouro)

Crie um componente de página no Next.js (`app/about/page.tsx`) com design alinhado à nossa UI atual (Cyberpunk/Dark Mode), implementando rigorosamente os seguintes elementos textuais e estruturais [4, 5]:

### Elemento 1: A Fórmula de Definição (Hero Section)
Logo no topo, precisamos responder à pergunta da IA ("What does your business do?") de forma direta, usando a seguinte estrutura: *"Nós somos um [categoria] que ajuda [público] a alcançar [resultado]"* [4].
*   **Ação para o Dev:** Crie um Header/H1 e um subtítulo claro.
*   *Texto Sugerido:* "O AI Speaking Object é um **Software SaaS de Criação de Vídeos** que ajuda **criadores de conteúdo, agências de marketing e negócios locais** a **gerar vídeos virais e anúncios que retêm a atenção (scroll-stoppers) usando objetos 3D falantes**."

### Elemento 2: Definição Específica de Serviços (H2: "What We Do")
O Google odeia linguagem de missão vaga. Precisamos listar os "nitty-gritty details" [4].
*   **Ação para o Dev:** Crie uma seção com uma tag `<h2>` intitulada "O Que Nós Fazemos" (What we do) [6].
*   *Texto/Itens Sugeridos:*
    - "Geração de Roteiros Virais com IA (Google Gemini)."
    - "Criação de Personagens 3D Estilo Pixar (Google Imagen 3)."
    - "Animação Labial Sincronizada (Lip-Sync) com Google Veo."
    - "Renderização de Cenários Dinâmicos (Chroma Key, Lancheira, Estúdio)."
    - "Inserção Automatizada de Logotipos para Marcas."

### Elemento 3: Sinais de Autoridade e Casos de Uso
Precisamos de sinais de confiança para a IA [5].
*   **Ação para o Dev:** Crie uma seção de "Casos de Sucesso" ou "Para Quem É".
*   *Texto Sugerido:* Mencionar que o sistema é otimizado para plataformas *mobile-first* (TikTok, Reels, Shorts) e dar o exemplo prático de uso: "Desde restaurantes locais (como campanhas para lanchonetes e venda de salgadinhos) até grandes campanhas publicitárias."

### Elemento 4: Sinais Geográficos e de Mercado
Embora sejamos um SaaS global, o Google precisa entender nosso alcance [5].
*   **Ação para o Dev:** Adicionar um parágrafo ou rodapé estratégico.
*   *Texto Sugerido:* "Nossa plataforma possui suporte nativo bilíngue (Português e Inglês), atendendo tanto o mercado do **Brasil** quanto o mercado internacional com o nosso 'Modo Viral' regionalizado."

### Elemento 5: Links Internos Estratégicos (Breadcrumbs)
Isso é crucial: a página "Sobre" deve ser o hub que aponta para as páginas de conversão [2, 5].
*   **Ação para o Dev:** Integre links (tags `<a>` ou `<Link>` do Next.js) de forma natural no texto.
*   *Links Obrigatórios:*
    - **Loja de Créditos:** Quando mencionar "planos escaláveis para criadores e agências", faça um link direto para `/credits`.
    - **Planos Específicos:** Mencione no texto os pacotes "Starter", "Creator" e "Agency" e coloque links âncora ou diretos para eles.
    - **App Principal:** Um Call to Action (CTA) claro no final: "Comece a criar agora" linkando para `/login` ou a página principal do app `/`.

## 3. SEO Técnico (Metadados)
- Configure os metadados da página no Next.js (`export const metadata`).
- A `description` deve ser um resumo direto da fórmula do "Elemento 1". O Google às vezes reescreve a meta description baseada no conteúdo, mas o H2 "What We Do" ajudará a fixar isso [7].
- Considere adicionar a marcação Schema.org (JSON-LD) do tipo `SoftwareApplication` ou `Organization` no `<head>` desta página.

## 4. Seção de FAQ (Bônus)
O vídeo menciona que a IA adora FAQs [7].
*   **Ação para o Dev:** Crie um pequeno *accordion* no final da página com 3 perguntas:
    - O que é o AI Speaking Object?
    - Quais IAs o aplicativo utiliza? (Resposta: Gemini, Imagen 3, Veo).
    - Quanto custa gerar um vídeo animado? (Resposta com link para `/credits`).

## Notas para a Implementação
Não precisamos de um design ultracomplexo para esta página [2, 8]. O foco é a hierarquia das tags (H1, H2, H3), clareza do texto e o roteamento interno (`<Link>`). Mantenha a interface limpa para que os robôs do Google (e os usuários) leiam facilmente.
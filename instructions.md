Prompt de Implementação: AI Speaking Object v3.0 (SaaS Beta)

## 1. Visão Geral e Objetivo
Atue como um Arquiteto de Software Sênior. Estamos migrando o projeto "AI Speaking Object" da versão **v2.1.0** (onde favoritos e lógica são locais) para a **v3.0** (Arquitetura SaaS).
O objetivo desta sprint é implementar a infraestrutura de **Autenticação e Banco de Dados** usando **Supabase**, com um sistema estrito de **Whitelist** (Lista de Convidados) para controlar custos de API.

## 2. Stack Tecnológica
- **Framework:** Next.js 15 (App Router).
- **Estilização:** Tailwind CSS (Manter UI Cyberpunk atual).
- **Backend/Auth:** **Supabase** (Auth + Database PostgreSQL).
- **IA (Já implementada):** Google Gemini + Imagen + Veo (Manter lógica existente em `gemini-video.ts`).

## 3. Estrutura do Banco de Dados (Schema Supabase)
Crie as seguintes tabelas no esquema `public`:

### A. Tabela `whitelist`
*Responsável por controlar quem pode se cadastrar.*
- `email` (Text, Primary Key)
- `created_at` (Timestamp)

### B. Tabela `profiles` (ou `users`)
*Vinculada à tabela interna `auth.users` do Supabase.*
- `id` (UUID, PK, References `auth.users.id`)
- `email` (Text)
- `credits` (Integer, Default: 50) -> *Moeda interna para gerar vídeos.*
- `plan_tier` (Text, Default: 'beta_tester')

### C. Tabela `generations`
*Substitui o armazenamento local. Guarda o histórico.*
- `id` (UUID, PK)
- `user_id` (UUID, References `profiles.id`)
- `prompt_text` (Text)
- `image_url` (Text)
- `video_url` (Text)
- `created_at` (Timestamp)

## 4. Regras de Negócio e Autenticação

### Implementação da Whitelist
Crie uma **Postgres Function** e um **Trigger** que atue no evento de *Sign Up*:
1.  Quando um usuário tenta se cadastrar (via Google Login ou Email/Senha), o trigger verifica se o email dele existe na tabela `whitelist`.
2.  **Se existir:** Permite o cadastro e cria automaticamente a entrada na tabela `profiles` com 50 créditos iniciais.
3.  **Se NÃO existir:** Bloqueia o cadastro e retorna erro "Acesso restrito a convidados Beta".

### Seed Inicial (SQL)
Gere um script SQL (`seed_whitelist.sql`) para popular a tabela `whitelist` imediatamente com os seguintes 5 usuários (Beta Testers):
1.  `[SEU_EMAIL_AQUI]` (Admin/Você)
2.  `[EMAIL_DO_IGOR_GOMIDES]`
3.  `guest1@example.com` (Placeholder Usuário 3)
4.  `guest2@example.com` (Placeholder Usuário 4)
5.  `guest3@example.com` (Placeholder Usuário 5)
*(Nota para o Dev: Deixe o script fácil para eu substituir os emails reais).*

## 5. Alterações no Frontend (Next.js)

### 1. Header e Login
- Adicione um botão de "Login" no Header.
- Se logado: Mostre o Avatar do usuário e o saldo de créditos (ex: "🪙 50").

### 2. Proteção de Geração (Middleware/Server Action)
- Modifique a Server Action principal (`gemini-video.ts`):
    - Antes de chamar a API do Google Veo, verifique:
      `SELECT credits FROM profiles WHERE id = user_id`
    - **Se créditos > 0:** Execute a geração e subtraia 1 crédito (UPDATE).
    - **Se créditos <= 0:** Retorne erro "Saldo insuficiente".

### 3. Migração de Favoritos
- Altere o componente "Favorites System" (atualmente localstorage) para ler/gravar na tabela `generations` do Supabase.

## 6. Entregáveis
1.  Código de configuração do cliente Supabase (`utils/supabase/server.ts` e `client.ts`).
2.  Script SQL completo para criação das tabelas e triggers.
3.  Componentes de UI atualizados (Header, Login Page).
4.  Lógica de verificação de créditos integrada à Server Action existente.

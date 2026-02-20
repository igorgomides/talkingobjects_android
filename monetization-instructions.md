Arquivo Prompt para o Antigravity
Copie e salve como v3_monetization.md e envie para a IA.
# Implementação de Monetização (Stripe) - v3.0

## 1. Contexto Atual
Já temos implementado no projeto (Next.js 15 + Supabase):
- Tabela `profiles` com coluna `credits`.
- Auth funcionando e protegendo rotas.
- Lógica de dedução de créditos (Server Actions).

## 2. Objetivo da Sprint
Implementar o **Checkout do Stripe** para venda de pacotes de créditos e o **Webhook** para atualizar o saldo do usuário automaticamente após o pagamento.

## 3. Stack Tecnológica
- **Pagamentos:** Stripe (API + Webhooks).
- **Backend:** Next.js Route Handlers (para o Webhook) e Server Actions (para iniciar Checkout).
- **Database:** Supabase (atualizar tabela `profiles`).

## 4. Banco de Dados (Novas Tabelas)
Crie o SQL para adicionar uma tabela de auditoria financeira:
- Tabela `transactions`:
    - `id` (UUID, PK)
    - `user_id` (UUID, FK profiles)
    - `stripe_session_id` (Text, Unique)
    - `amount_paid` (Integer, em centavos)
    - `credits_added` (Integer)
    - `status` (Text: 'pending', 'completed', 'failed')
    - `created_at` (Timestamp)

## 5. Produtos e Planos (Hardcoded para MVP)
Crie uma UI de "Loja de Créditos" (`/credits`) com os seguintes cards. Use a lógica de R$ 1,00 = 1 Crédito (Moeda interna):

1.  **Pacote Starter (R$ 29,00)**
    - *30 Créditos* (Aprox. 3 vídeos completos)
    - Ideal para testar.
2.  **Pacote Creator (R$ 99,00)**
    - *120 Créditos* (Aprox. 12 vídeos completos)
    - Melhor custo-benefício.
3.  **Pacote Agência (R$ 299,00)**
    - *400 Créditos* (Aprox. 40 vídeos)
    - Para uso profissional.

## 6. Implementação Técnica

### A. Server Action: `create-checkout-session.ts`
- Recebe o `price` e `credits_amount` selecionado.
- Cria uma sessão de checkout no Stripe.
- Passa o `user_id` e `credits_amount` no suporte de metadados (`metadata`) do Stripe para recuperarmos depois.
- Redireciona o usuário para a URL do Stripe.

### B. Route Handler: `/api/webhooks/stripe`
- **IMPORTANTE:** Deve usar `raw-body` para verificar a assinatura do Stripe (segurança crítica).
- Escuta o evento `checkout.session.completed`.
- Extrai o `user_id` e `credits_amount` dos metadados.
- Executa uma transação no Supabase:
    1. Grava na tabela `transactions`.
    2. Atualiza a tabela `profiles`: `credits = credits + credits_amount`.
    3. Retorna status 200.

### C. Frontend
- Crie a página `/credits` bonita, usando os componentes do Tailwind já existentes.
- Mostre o saldo atual do usuário no topo.
- Botões de compra que chamam a server action.

## 7. Variáveis de Ambiente Necessárias
Liste no `.env.local`:
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`

--------------------------------------------------------------------------------
Por que essa abordagem?
1. Segurança dos Webhooks: O prompt pede explicitamente para usar metadata no Stripe. Isso significa que quando o Stripe avisar seu servidor "O pagamento de R$ 99,00 passou", ele também envia junto "Isso é para o Usuário X e vale 120 créditos". Isso evita erros de atribuição.
2. Auditoria (transactions): Se um usuário reclamar que pagou e não recebeu, você terá a tabela transactions para provar o status, separada da tabela de saldo simples.
3. Preço Realista: Configurei os pacotes baseados no seu relatório de custos.
    ◦ Pacote Starter (R$ 29,00 por 30 créditos):
        ▪ Se o usuário fizer 3 vídeos (30 créditos), você gasta aprox. **R18,00∗∗(3xR 6,00 no modo Fast).
        ▪ Lucro: ~R$ 11,00. (Margem segura).
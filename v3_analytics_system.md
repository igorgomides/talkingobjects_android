# Implementação de Sistema de Logs e Analytics (Supabase) - v3.0

## 1. Objetivo
Criar uma infraestrutura de dados robusta para rastrear o custo real de cada geração (Unit Economics) e o comportamento do usuário. Isso é vital para auditar a fatura do Google Cloud vs. Consumo de Créditos.

## 2. Banco de Dados (Novas Tabelas e Alterações)

### A. Tabela `usage_logs` (Nova)
*Esta tabela deve ser imutável e focada em métricas técnicas e financeiras.*
- `id` (UUID, PK)
- `user_id` (UUID, FK profiles)
- `action_type` (Text: 'script', 'image', 'video')
- `model_used` (Text) -> ex: 'veo-3.1-generate-preview', 'imagen-3.0'
- `cost_tokens` (Integer, Nullable) -> Para Gemini Text
- `cost_seconds` (Integer, Nullable) -> Para Veo Video (CRÍTICO para auditoria)
- `credits_deducted` (Integer) -> Quanto cobramos do usuário
- `latency_ms` (Integer) -> Tempo total da operação em milissegundos
- `status` (Text: 'success', 'error')
- `error_message` (Text, Nullable)
- `created_at` (Timestamp)

### B. Alteração na Tabela `generations` (Melhoria)
*Adicionar colunas de inteligência de negócio à tabela existente.*
- `meta_voice_style` (Text) -> ex: 'Monster', 'Cartoon'
- `meta_language` (Text) -> 'en' ou 'pt'
- `is_viral_mode` (Boolean) -> Se o usuário usou o preset 'Coxinha'

## 3. Implementação no Backend (Server Actions)

### Atualizar `gemini-video.ts` e `gemini-image.ts`
1.  **Start Timer:** No início da função, inicie uma contagem de tempo (`Date.now()`).
2.  **Try/Catch Block:**
    - **No Sucesso:** Insira uma linha em `usage_logs` com o modelo exato, duração do vídeo gerado e latência.
    - **No Erro:** Insira uma linha em `usage_logs` com status 'error', a mensagem de erro crua do Google e latência.
3.  **Captura de Metadados:**
    - Ao salvar na tabela `generations`, certifique-se de gravar qual 'Voice Style' e 'Language' foram usados.

## 4. Dashboard de Admin (Opcional / Futuro)
Crie uma query SQL (View) chamada `analytics_daily_costs` que agrupa:
- Total de Vídeos Gerados no dia.
- Soma de `cost_seconds` (Total de segundos gastos no Google).
- Soma de `credits_deducted` (Total de créditos queimados).
*Isso permitirá calcular se o dia foi lucrativo.*

## 5. Requisito de Segurança
- Certifique-se de que a tabela `usage_logs` tenha RLS (Row Level Security) habilitado, mas que o usuário final NÃO possa ler/escrever nela diretamente (apenas via Server Action com `service_role`).
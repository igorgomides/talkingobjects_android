# Implementação de Auth Flow Profissional (Sign Up, Verify, Reset) - v3.0

## 1. Objetivo
Melhorar a segurança e credibilidade do SaaS implementando um fluxo de autenticação completo e robusto. O sistema atual já possui Login básico, mas precisamos adicionar:
1.  **Sign Up com Verificação de Email:** O usuário só entra se confirmar o e-mail.
2.  **Proteção de Whitelist no Cadastro:** O cadastro só dispara o e-mail se o usuário estiver na `whitelist`.
3.  **Fluxo de "Esqueci minha Senha":** Envio de link de recuperação e formulário de troca de senha.
4.  **Feedback Visual:** Páginas de sucesso/erro claras (Toasts e Telas de Confirmação).

## 2. Estrutura de Rotas (Next.js App Router)
Crie ou atualize as seguintes páginas com a UI "Cyberpunk" existente:
- `/login`: (Já existe) Adicionar link "Esqueci minha senha".
- `/signup`: Formulário de cadastro (Nome, Email, Senha).
- `/forgot-password`: Formulário simples pedindo apenas o e-mail.
- `/reset-password`: Formulário para digitar a *nova* senha (acessível apenas via link de email).
- `/auth/callback/route.ts`: Rota de API crítica para processar os códigos de troca de senha e confirmação de e-mail do Supabase.

## 3. Implementação Técnica (Server Actions)

### A. Action: `signup(formData)`
1.  **Verificação de Whitelist (Crucial):** Antes de chamar o Supabase, verifique se o email existe na tabela `whitelist`.
    - *Se NÃO existir:* Retorne erro "Email não convidado para o Beta". (Não envie o email de confirmação).
    - *Se existir:* Chame `supabase.auth.signUp` com a opção `emailRedirectTo: origin + '/auth/callback'`.
2.  Retorne sucesso instruindo o usuário a checar a caixa de entrada.

### B. Action: `forgotPassword(formData)`
1.  Chame `supabase.auth.resetPasswordForEmail` com `redirectTo: origin + '/auth/callback?next=/reset-password'`.
2.  *Nota:* O parâmetro `next` é vital para redirecionar o usuário para o formulário de troca após ele clicar no link do email.

### C. Action: `updatePassword(formData)`
1.  Deve ser usada na página `/reset-password`.
2.  Chame `supabase.auth.updateUser({ password: newPassword })`.
3.  Redirecione para `/dashboard` com mensagem de sucesso.

### D. Route Handler: `/auth/callback/route.ts`
Esta rota deve capturar o `code` enviado pelo Supabase via URL.
- Use `supabase.auth.exchangeCodeForSession(code)`.
- Se houver um parâmetro `next` na URL (ex: vindo do reset password), redirecione para ele.
- Caso contrário, redirecione para `/dashboard`.

## 4. Design e UX
- **Mensagens de Erro:** Use componentes de "Alert" (vermelho) para erros como "Senha muito fraca" ou "Token expirado".
- **Mensagens de Sucesso:** Após o cadastro, exiba uma tela limpa: "Verifique seu e-mail. Um link de confirmação foi enviado para [email]."
- **Credibilidade:** Adicione validação de formulário no frontend (Zod) para garantir que as senhas tenham no mínimo 6 caracteres antes de enviar.

## 5. Instruções Específicas
- Utilize o cliente Supabase SSR (`utils/supabase/server.ts`) para todas as actions.
- Certifique-se de que a verificação da Whitelist ocorra *antes* de sujar o banco de autenticação do Supabase.

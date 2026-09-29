# Carteira Financeira

Aplicação full-stack de controle financeiro pessoal feita com **Next.js (App Router)**, **Tailwind CSS** e **Supabase (PostgreSQL)**, publicada na **Vercel**.

- **Dashboard:** saldo atual, total de receitas e total de despesas (calculados no banco pela view `transaction_summary`).
- **Nova transação:** descrição, valor, tipo (Receita/Despesa) e data, com validação no servidor.
- **Histórico:** lista em ordem cronológica (mais recentes primeiro), com cores e ícones para diferenciar entradas de saídas, e opção de excluir.

## Como rodar

Pré-requisitos: Node.js 20+ e um projeto no Supabase.

1. No Supabase, abra o **SQL Editor**, cole o conteúdo de `db/schema.sql` e clique em **Run**.
2. Em **Connect → Transaction pooler**, copie a URI de conexão (porta 6543).
3. Configure e suba o app:

```bash
npm install
cp .env.example .env.local   # cole a URI em DATABASE_URL, com a senha do banco
npm run dev
```

Acesse http://localhost:3000.

### Deploy na Vercel

1. Importe o repositório na Vercel e defina **Root Directory** como `financas-pessoais`.
2. Em **Environment Variables**, crie `DATABASE_URL` com a URI do Transaction pooler + `?sslmode=require`.
3. Clique em **Deploy**.

A `DATABASE_URL` não tem o prefixo `NEXT_PUBLIC_`, então nunca é enviada ao navegador. O `.env.local` está no `.gitignore`.

## Arquitetura

```
app/
  page.tsx        Server Component: lê resumo + transações do banco em paralelo
  actions.ts      Server Actions: createTransaction / deleteTransaction
  loading.tsx     Skeleton exibido durante o carregamento (Suspense)
  error.tsx       Error boundary (Client Component)
components/
  SummaryCards    Server Component – cards do dashboard
  TransactionList Server Component – histórico
  TransactionForm Client Component – useActionState + useFormStatus
  DeleteButton    Client Component – Server Action com .bind(id)
lib/
  db.ts           Conexão (postgres.js), marcada como server-only
  transactions.ts Consultas SQL parametrizadas
  validation.ts   Schemas zod
db/schema.sql     Tabela, índice e view de resumo
```

### Decisões

- **Server Components por padrão.** A leitura do banco acontece no servidor, sem API intermediária e sem enviar a string de conexão ao navegador (`import "server-only"` impede que `lib/db.ts` seja importado no cliente).
- **Client Components só onde há interatividade:** o formulário (estado de envio e erros) e o botão de excluir.
- **Server Actions para mutações.** O formulário chama `createTransaction` direto pelo atributo `action`. A action valida com zod, insere no banco e chama `revalidatePath("/")`, então o dashboard e o histórico se atualizam sem recarregar a página. O formulário funciona mesmo com JavaScript desabilitado (progressive enhancement).
- **Segurança:** as queries usam tagged templates do postgres.js, que são parametrizados (sem SQL injection). A validação acontece no servidor e o banco reforça com `CHECK` (valor > 0, tamanho da descrição).
- **Valores monetários** são `numeric(12,2)` no banco, nunca `float`.
- **RLS ligado** na tabela: a API REST pública do Supabase não acessa os dados. Só o servidor do Next, conectado como dono da tabela, lê e grava.

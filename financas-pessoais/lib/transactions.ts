import "server-only";
import { db } from "./db";
import type { Summary, Transaction, TransactionType } from "./types";

// Sem `type`, retorna todas; com `type`, só receitas ou só despesas.
export async function getTransactions(type?: TransactionType): Promise<Transaction[]> {
  const sql = db();
  const rows = await sql<
    { id: string; description: string; amount: string; type: TransactionType; occurred_on: string }[]
  >`
    select id, description, amount, type, to_char(occurred_on, 'YYYY-MM-DD') as occurred_on
    from transactions
    ${type ? sql`where type = ${type}` : sql``}
    order by occurred_on desc, created_at desc
  `;

  return rows.map((row) => ({
    id: row.id,
    description: row.description,
    amount: Number(row.amount),
    type: row.type,
    occurredOn: row.occurred_on,
  }));
}

export async function getSummary(): Promise<Summary> {
  const [row] = await db()<{ total_income: string; total_expense: string; balance: string }[]>`
    select total_income, total_expense, balance from transaction_summary
  `;

  return {
    totalIncome: Number(row.total_income),
    totalExpense: Number(row.total_expense),
    balance: Number(row.balance),
  };
}

export async function insertTransaction(input: Omit<Transaction, "id">) {
  await db()`
    insert into transactions (description, amount, type, occurred_on)
    values (${input.description}, ${input.amount}, ${input.type}, ${input.occurredOn})
  `;
}

export async function removeTransaction(id: string) {
  await db()`delete from transactions where id = ${id}`;
}

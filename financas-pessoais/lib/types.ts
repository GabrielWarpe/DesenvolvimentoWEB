export type TransactionType = "income" | "expense";

export type HistoryFilter = "receitas" | "despesas";

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  type: TransactionType;
  occurredOn: string;
};

export type Summary = {
  totalIncome: number;
  totalExpense: number;
  balance: number;
};

import { connection } from "next/server";
import { SummaryCards } from "@/components/SummaryCards";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { formatLongDate, greeting, TIME_ZONE } from "@/lib/format";
import { getSummary, getTransactions } from "@/lib/transactions";
import type { HistoryFilter, TransactionType } from "@/lib/types";

const OWNER = "Gabriel";

const FILTER_TYPES: Record<HistoryFilter, TransactionType> = {
  receitas: "income",
  despesas: "expense",
};

function parseFilter(value: string | string[] | undefined): HistoryFilter | undefined {
  return typeof value === "string" && Object.hasOwn(FILTER_TYPES, value)
    ? (value as HistoryFilter)
    : undefined;
}

export default async function Home({ searchParams }: PageProps<"/">) {
  await connection();

  const filter = parseFilter((await searchParams).tipo);

  const [summary, transactions] = await Promise.all([
    getSummary(),
    getTransactions(filter && FILTER_TYPES[filter]),
  ]);

  const now = new Date();
  const today = now.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

  return (
    <main className="mx-auto w-full max-w-5xl px-5 py-10 sm:py-14">
      <header>
        <p className="text-sm font-medium text-muted">Carteira Financeira</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight sm:text-3xl">
          {greeting(now)}, {OWNER}
        </h1>
        <p className="mt-1 text-sm text-muted first-letter:uppercase">{formatLongDate(now)}</p>
      </header>

      <SummaryCards summary={summary} />

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <TransactionForm today={today} />
        <TransactionList transactions={transactions} filter={filter} today={today} />
      </div>

      <footer className="mt-16 border-t border-line pt-6 text-xs text-muted">
        Gabriel Warpechowski · Desenvolvimento Web
      </footer>
    </main>
  );
}

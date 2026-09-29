import { connection } from "next/server";
import { Wallet } from "lucide-react";
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
  // Os dados vêm do banco a cada requisição (renderização dinâmica).
  await connection();

  // O filtro do histórico fica na URL (?tipo=receitas), então a página continua
  // sendo um Server Component: o banco já devolve a lista filtrada.
  const filter = parseFilter((await searchParams).tipo);

  const [summary, transactions] = await Promise.all([
    getSummary(),
    getTransactions(filter && FILTER_TYPES[filter]),
  ]);

  const now = new Date();
  const today = now.toLocaleDateString("en-CA", { timeZone: TIME_ZONE });

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6 sm:py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-zinc-400 first-letter:uppercase">
            {formatLongDate(now)}
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            {greeting(now)}, {OWNER} 👋
          </h1>
        </div>
        <div className="panel flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-medium text-zinc-300">
          <Wallet className="size-4 text-emerald-400" />
          Carteira Financeira
        </div>
      </header>

      <SummaryCards summary={summary} />

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
        <TransactionForm today={today} />
        <TransactionList transactions={transactions} filter={filter} />
      </div>

      <footer className="pt-4 text-center text-xs text-zinc-500">
        Feito por Gabriel Warpechowski · Desenvolvimento Web
      </footer>
    </main>
  );
}

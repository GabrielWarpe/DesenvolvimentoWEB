import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Inbox } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/format";
import type { HistoryFilter, Transaction } from "@/lib/types";
import { DeleteButton } from "./DeleteButton";

const TABS: { label: string; href: string; value?: HistoryFilter }[] = [
  { label: "Todas", href: "/" },
  { label: "Receitas", href: "/?tipo=receitas", value: "receitas" },
  { label: "Despesas", href: "/?tipo=despesas", value: "despesas" },
];

const EMPTY_MESSAGES: Record<HistoryFilter | "todas", string> = {
  todas: "Nenhuma transação ainda.",
  receitas: "Nenhuma receita encontrada.",
  despesas: "Nenhuma despesa encontrada.",
};

export function TransactionList({
  transactions,
  filter,
}: {
  transactions: Transaction[];
  filter?: HistoryFilter;
}) {
  return (
    <section className="panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-white">Histórico</h2>

        {/* Links comuns: trocar o filtro muda a URL e o servidor devolve a lista filtrada. */}
        <nav aria-label="Filtrar histórico" className="flex gap-1 rounded-xl bg-white/5 p-1 text-sm">
          {TABS.map((tab) => {
            const active = tab.value === filter;
            return (
              <Link
                key={tab.label}
                href={tab.href}
                scroll={false}
                aria-current={active ? "page" : undefined}
                className={`rounded-lg px-3 py-1.5 font-medium transition ${
                  active ? "bg-white/10 text-white shadow-sm" : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </nav>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-14 text-center text-zinc-500">
          <span className="grid size-12 place-items-center rounded-2xl bg-white/5">
            <Inbox className="size-6" />
          </span>
          <p className="mt-2 text-zinc-300">{EMPTY_MESSAGES[filter ?? "todas"]}</p>
          <p className="text-sm">Adicione uma pelo formulário.</p>
        </div>
      ) : (
        <ul className="mt-4 divide-y divide-white/5">
          {transactions.map((t) => {
            const income = t.type === "income";
            return (
              <li key={t.id} className="-mx-2 flex items-center gap-3 rounded-xl px-2 py-3 transition hover:bg-white/[0.03]">
                <span
                  className={`grid size-10 shrink-0 place-items-center rounded-xl ${
                    income ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"
                  }`}
                  aria-label={income ? "Receita" : "Despesa"}
                  role="img"
                >
                  {income ? <ArrowUpRight className="size-4" /> : <ArrowDownRight className="size-4" />}
                </span>

                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-zinc-100">{t.description}</p>
                  <p className="text-sm text-zinc-500">{formatDate(t.occurredOn)}</p>
                </div>

                <span
                  className={`shrink-0 font-semibold tabular-nums ${income ? "text-emerald-400" : "text-rose-400"}`}
                >
                  {income ? "+" : "−"} {formatCurrency(t.amount)}
                </span>

                <DeleteButton id={t.id} description={t.description} />
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

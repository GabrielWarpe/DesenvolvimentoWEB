"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { CircleCheck, CircleAlert, Plus } from "lucide-react";
import { createTransaction, type FormState } from "@/app/actions";

const initialState: FormState = { status: "idle", submissionId: 0 };

export function TransactionForm({ today }: { today: string }) {
  const [state, formAction] = useActionState(createTransaction, initialState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  return (
    <form
      // Remonta o formulário a cada envio: limpa após sucesso e preserva o que foi digitado após erro.
      key={state.submissionId}
      action={formAction}
      className="panel space-y-5 p-5 sm:p-6 lg:sticky lg:top-6"
    >
      <div>
        <h2 className="text-lg font-semibold text-white">Nova transação</h2>
        <p className="text-sm text-zinc-500">Registre uma entrada ou uma saída.</p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-zinc-300">Tipo</legend>
        <div className="grid grid-cols-2 gap-2 rounded-xl bg-white/5 p-1">
          <TypeOption value="income" label="Receita" defaultChecked={(values.type ?? "income") === "income"} />
          <TypeOption value="expense" label="Despesa" defaultChecked={values.type === "expense"} />
        </div>
        <FieldError messages={errors.type} />
      </fieldset>

      <Field label="Descrição" htmlFor="description" errors={errors.description}>
        <input
          id="description"
          name="description"
          type="text"
          required
          maxLength={120}
          placeholder="Ex.: Salário, Mercado, Aluguel"
          defaultValue={values.description}
          aria-invalid={!!errors.description}
          className={inputClass}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Valor" htmlFor="amount" errors={errors.amount}>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-sm text-zinc-500">
              R$
            </span>
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="decimal"
              required
              placeholder="0,00"
              defaultValue={values.amount}
              aria-invalid={!!errors.amount}
              className={`${inputClass} pl-10 tabular-nums`}
            />
          </div>
        </Field>

        <Field label="Data" htmlFor="occurredOn" errors={errors.occurredOn}>
          <input
            id="occurredOn"
            name="occurredOn"
            type="date"
            required
            defaultValue={values.occurredOn ?? today}
            aria-invalid={!!errors.occurredOn}
            className={inputClass}
          />
        </Field>
      </div>

      <SubmitButton />

      {state.message && (
        <p
          role="status"
          className={`flex items-center gap-2 rounded-xl px-3 py-2 text-sm ${
            state.status === "error" ? "bg-rose-500/10 text-rose-300" : "bg-emerald-500/10 text-emerald-300"
          }`}
        >
          {state.status === "error" ? <CircleAlert className="size-4" /> : <CircleCheck className="size-4" />}
          {state.message}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "w-full rounded-xl bg-white/5 px-3.5 py-2.5 text-zinc-100 ring-1 ring-white/10 outline-none transition placeholder:text-zinc-500 focus:ring-2 focus:ring-emerald-400/60 aria-invalid:ring-rose-500/70";

function Field({
  label,
  htmlFor,
  errors,
  children,
}: {
  label: string;
  htmlFor: string;
  errors?: string[];
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>
      {children}
      <FieldError messages={errors} />
    </div>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1.5 text-sm text-rose-400">{messages[0]}</p>;
}

function TypeOption({
  value,
  label,
  defaultChecked,
}: {
  value: "income" | "expense";
  label: string;
  defaultChecked: boolean;
}) {
  const checked =
    value === "income"
      ? "peer-checked:bg-emerald-500/15 peer-checked:text-emerald-300 peer-checked:ring-emerald-500/40"
      : "peer-checked:bg-rose-500/15 peer-checked:text-rose-300 peer-checked:ring-rose-500/40";

  return (
    <label className="cursor-pointer">
      <input type="radio" name="type" value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        className={`block rounded-lg px-3 py-2 text-center text-sm font-medium text-zinc-400 ring-1 ring-transparent transition hover:text-zinc-200 peer-focus-visible:ring-2 peer-focus-visible:ring-emerald-400/60 ${checked}`}
      >
        {label}
      </span>
    </label>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-emerald-950 shadow-lg shadow-emerald-500/20 transition hover:bg-emerald-400 disabled:opacity-60"
    >
      <Plus className="size-4" />
      {pending ? "Salvando..." : "Adicionar transação"}
    </button>
  );
}

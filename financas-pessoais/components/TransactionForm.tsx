"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTransaction, type FormState } from "@/app/actions";

const initialState: FormState = { status: "idle", submissionId: 0 };

export function TransactionForm({ today }: { today: string }) {
  const [state, formAction] = useActionState(createTransaction, initialState);
  const values = state.values ?? {};
  const errors = state.errors ?? {};

  return (
    <form
      key={state.submissionId}
      action={formAction}
      className="space-y-4 rounded-lg border border-line bg-surface p-5 lg:sticky lg:top-6"
    >
      <h2 className="font-semibold">Nova transação</h2>

      <fieldset>
        <legend className="sr-only">Tipo</legend>
        <div className="grid grid-cols-2 rounded-md border border-line p-0.5">
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

      <div className="grid grid-cols-2 gap-3">
        <Field label="Valor (R$)" htmlFor="amount" errors={errors.amount}>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="decimal"
            required
            placeholder="0,00"
            defaultValue={values.amount}
            aria-invalid={!!errors.amount}
            className={`${inputClass} tabular-nums`}
          />
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
        <p role="status" className={`text-sm ${state.status === "error" ? "text-expense" : "text-income"}`}>
          {state.message}
        </p>
      )}
    </form>
  );
}

const inputClass =
  "h-10 w-full rounded-md border border-line bg-surface px-3 outline-none transition placeholder:text-muted/60 focus:border-ink/40 focus:ring-3 focus:ring-ink/5 aria-invalid:border-expense";

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
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm text-muted">
        {label}
      </label>
      {children}
      <FieldError messages={errors} />
    </div>
  );
}

function FieldError({ messages }: { messages?: string[] }) {
  if (!messages?.length) return null;
  return <p className="mt-1.5 text-sm text-expense">{messages[0]}</p>;
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
  return (
    <label className="cursor-pointer">
      <input type="radio" name="type" value={value} defaultChecked={defaultChecked} className="peer sr-only" />
      <span
        className={`block rounded-[5px] py-1.5 text-center text-sm text-muted transition peer-checked:font-medium peer-focus-visible:ring-2 peer-focus-visible:ring-ink/20 hover:text-ink ${
          value === "income"
            ? "peer-checked:bg-income/10 peer-checked:text-income"
            : "peer-checked:bg-expense/10 peer-checked:text-expense"
        }`}
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
      className="h-10 w-full rounded-md bg-ink font-medium text-paper transition hover:opacity-85 disabled:opacity-50"
    >
      {pending ? "Salvando..." : "Adicionar"}
    </button>
  );
}

"use client";

import { useFormStatus } from "react-dom";
import { X } from "lucide-react";
import { deleteTransaction } from "@/app/actions";

export function DeleteButton({ id, description }: { id: string; description: string }) {
  return (
    <form action={deleteTransaction.bind(null, id)}>
      <Button description={description} />
    </form>
  );
}

function Button({ description }: { description: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label={`Excluir ${description}`}
      title="Excluir"
      className="-mr-1 rounded p-1 text-muted/40 transition group-hover:text-muted hover:text-expense! disabled:opacity-40"
    >
      <X className="size-4" />
    </button>
  );
}

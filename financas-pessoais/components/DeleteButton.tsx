"use client";

import { useFormStatus } from "react-dom";
import { Trash2 } from "lucide-react";
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
      className="rounded-lg p-2 text-zinc-500 transition hover:bg-rose-500/10 hover:text-rose-400 disabled:animate-pulse"
    >
      <Trash2 className="size-4" />
    </button>
  );
}

"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { insertTransaction, removeTransaction } from "@/lib/transactions";
import { idSchema, transactionSchema } from "@/lib/validation";

type Field = keyof z.input<typeof transactionSchema>;

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Partial<Record<Field, string[]>>;
  values?: Partial<Record<Field, string>>;
  // Muda a cada envio para o formulário ser remontado com os valores certos.
  submissionId: number;
};

export async function createTransaction(_prev: FormState, formData: FormData): Promise<FormState> {
  const raw = {
    description: String(formData.get("description") ?? ""),
    amount: String(formData.get("amount") ?? ""),
    type: String(formData.get("type") ?? ""),
    occurredOn: String(formData.get("occurredOn") ?? ""),
  };

  const parsed = transactionSchema.safeParse(raw);
  if (!parsed.success) {
    return {
      status: "error",
      message: "Corrija os campos destacados.",
      errors: z.flattenError(parsed.error).fieldErrors,
      values: raw,
      submissionId: Date.now(),
    };
  }

  try {
    await insertTransaction(parsed.data);
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      message: "Não foi possível salvar a transação. Tente novamente.",
      values: raw,
      submissionId: Date.now(),
    };
  }

  revalidatePath("/");
  return {
    status: "success",
    message: "Transação adicionada!",
    values: { type: raw.type, occurredOn: raw.occurredOn },
    submissionId: Date.now(),
  };
}

export async function deleteTransaction(id: string) {
  const parsed = idSchema.safeParse(id);
  if (!parsed.success) return;

  await removeTransaction(parsed.data);
  revalidatePath("/");
}

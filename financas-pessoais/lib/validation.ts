import { z } from "zod";

export const transactionSchema = z.object({
  description: z
    .string()
    .trim()
    .min(1, "Informe uma descrição.")
    .max(120, "Máximo de 120 caracteres."),
  amount: z
    .string()
    .trim()
    .min(1, "Informe um valor.")
    .transform((v) =>
      Number(
        v.includes(",") || /^\d{1,3}(\.\d{3})+$/.test(v)
          ? v.replace(/\./g, "").replace(",", ".")
          : v,
      ),
    )
    .pipe(
      z
        .number({ error: "Valor inválido." })
        .positive("O valor deve ser maior que zero.")
        .max(9_999_999_999.99, "Valor muito alto.")
        .transform((n) => Math.round(n * 100) / 100),
    ),
  type: z.enum(["income", "expense"], { error: "Escolha Receita ou Despesa." }),
  occurredOn: z.iso.date("Data inválida."),
});

export const idSchema = z.uuid();

"use client";

import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <AlertTriangle className="size-10 text-amber-500" />
      <h1 className="text-xl font-semibold text-white">Não foi possível carregar suas finanças</h1>
      <p className="text-zinc-400">
        Verifique se o banco de dados está rodando e se a variável <code>DATABASE_URL</code> está
        configurada.
      </p>
      <button
        onClick={() => retry()}
        className="rounded-xl bg-emerald-500 px-4 py-2 font-semibold text-emerald-950 hover:bg-emerald-400"
      >
        Tentar novamente
      </button>
    </main>
  );
}

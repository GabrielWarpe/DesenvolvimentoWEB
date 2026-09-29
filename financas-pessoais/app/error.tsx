"use client";

import { useEffect } from "react";

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
    <main className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center gap-3 px-5 py-16 text-center">
      <h1 className="text-xl font-semibold">Não foi possível carregar suas finanças</h1>
      <p className="text-sm text-muted">
        Verifique se o banco de dados está rodando e se a variável <code>DATABASE_URL</code> está
        configurada.
      </p>
      <button
        onClick={() => retry()}
        className="mt-2 h-10 rounded-md bg-ink px-4 font-medium text-paper hover:opacity-85"
      >
        Tentar novamente
      </button>
    </main>
  );
}

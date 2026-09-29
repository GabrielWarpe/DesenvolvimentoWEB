import "server-only";
import postgres from "postgres";

const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL não configurada. Veja o arquivo .env.example.");
  }
  // prepare: false é exigido pelo pooler de transações do Supabase (porta 6543).
  return postgres(url, { max: 5, prepare: false });
}

// Reaproveita a mesma conexão entre hot reloads no modo dev.
export function db() {
  globalForDb.sql ??= createClient();
  return globalForDb.sql;
}

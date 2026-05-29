// Neon Postgres client (server-only).
//
// On Vercel, the Neon integration injects a connection string. Depending on how
// it's added, the env var may be named DATABASE_URL, POSTGRES_URL, or
// DATABASE_URL_UNPOOLED — we accept any of them. Locally, set DATABASE_URL in
// .env.local. This module must never be imported by client components.
import { neon } from "@neondatabase/serverless";

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_PRISMA_URL ||
  "";

export const hasDatabase = Boolean(connectionString);

if (!connectionString) {
  console.warn(
    "[db] No database connection string found. Expected one of: DATABASE_URL, " +
      "POSTGRES_URL, DATABASE_URL_UNPOOLED. On Vercel, add the Neon integration " +
      "and redeploy. Locally, set DATABASE_URL in .env.local.",
  );
}

// Neon's tagged-template query function. We type it as returning any[] so result
// rows can be destructured directly (`const [row] = await sql\`...\``). Queries
// are parameterised by the template, which prevents SQL injection.
type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<any[]>;

const rawSql = connectionString
  ? (neon(connectionString) as unknown as SqlTag)
  : ((() => {
      throw new Error("No database connection string configured");
    }) as unknown as SqlTag);

export const sql: SqlTag = rawSql;

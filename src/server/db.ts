// Neon Postgres client (server-only).
//
// On Vercel, add the Neon integration and DATABASE_URL is injected automatically.
// Locally, set DATABASE_URL in .env.local. This module must never be imported by
// client components — it holds the secret connection string.
import { neon } from "@neondatabase/serverless";

const connectionString = process.env.DATABASE_URL;

export const hasDatabase = Boolean(connectionString);

if (!connectionString) {
  console.warn(
    "[db] DATABASE_URL is not set. On Vercel, add the Neon integration. Locally, set it in .env.local.",
  );
}

// Neon's tagged-template query function. We type it as returning any[] so result
// rows can be destructured directly (`const [row] = await sql\`...\``). Queries
// are parameterised by the template, which prevents SQL injection.
type SqlTag = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<any[]>;

const rawSql = connectionString
  ? (neon(connectionString) as unknown as SqlTag)
  : ((() => {
      throw new Error("DATABASE_URL is not configured");
    }) as unknown as SqlTag);

export const sql: SqlTag = rawSql;

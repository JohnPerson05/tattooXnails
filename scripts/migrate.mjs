// Schema migration for Neon Postgres.
// Run with: npm run db:migrate  (reads DATABASE_URL from .env.local or the environment)
import { neon } from "@neondatabase/serverless";
import { config } from "dotenv";

config({ path: ".env.local" });
config(); // also load .env if present

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[migrate] DATABASE_URL is not set. Add it to .env.local");
  process.exit(1);
}
const sql = neon(connectionString);

async function migrate() {
  console.log("[migrate] Creating extensions...");
  await sql`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`;

  console.log("[migrate] Creating enums...");
  await sql`DO $$ BEGIN CREATE TYPE discipline AS ENUM ('tattoo','nails'); EXCEPTION WHEN duplicate_object THEN null; END $$`;
  await sql`DO $$ BEGIN CREATE TYPE project_status AS ENUM ('published','draft','archived'); EXCEPTION WHEN duplicate_object THEN null; END $$`;
  await sql`DO $$ BEGIN CREATE TYPE inquiry_status AS ENUM ('new','read','replied','archived'); EXCEPTION WHEN duplicate_object THEN null; END $$`;

  console.log("[migrate] Creating tables...");
  await sql`CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'admin',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS artists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    discipline discipline NOT NULL,
    photo TEXT NOT NULL DEFAULT '',
    bio TEXT NOT NULL DEFAULT '',
    specialization TEXT NOT NULL DEFAULT '',
    experience TEXT NOT NULL DEFAULT '',
    social JSONB NOT NULL DEFAULT '{}'::jsonb,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    discipline discipline NOT NULL,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    cover_image TEXT NOT NULL DEFAULT '',
    gallery JSONB NOT NULL DEFAULT '[]'::jsonb,
    description TEXT NOT NULL DEFAULT '',
    artist_id UUID REFERENCES artists(id) ON DELETE SET NULL,
    tiktok_url TEXT,
    instagram_url TEXT,
    video_url TEXT,
    date_completed DATE NOT NULL DEFAULT now(),
    status project_status NOT NULL DEFAULT 'published',
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    contact TEXT NOT NULL DEFAULT '',
    service_type TEXT NOT NULL,
    message TEXT NOT NULL DEFAULT '',
    status inquiry_status NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    text TEXT NOT NULL,
    rating INT NOT NULL DEFAULT 5
  )`;

  await sql`CREATE TABLE IF NOT EXISTS settings (
    id INT PRIMARY KEY DEFAULT 1,
    data JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT settings_singleton CHECK (id = 1)
  )`;

  console.log("[migrate] Creating indexes...");
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_discipline ON projects(discipline)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_projects_artist ON projects(artist_id)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status)`;

  console.log("[migrate] Done.");
  process.exit(0);
}

migrate().catch((err) => {
  console.error("[migrate] Failed:", err);
  process.exit(1);
});

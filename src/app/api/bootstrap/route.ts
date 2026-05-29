import { sql, hasDatabase } from "@/server/db";
import { mapArtist, mapProject, mapInquiry, mapTestimonial } from "@/server/mappers";
import { jsonNoStore } from "@/server/http";

// Always fetch fresh data; the studio content changes via the admin.
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export async function GET() {
  if (!hasDatabase) {
    return jsonNoStore({ error: "Database not configured" }, { status: 500 });
  }
  try {
    const [artists, projects, inquiries, testimonials, settingsRows] = await Promise.all([
      sql`SELECT * FROM artists ORDER BY created_at ASC`,
      sql`SELECT * FROM projects ORDER BY created_at DESC`,
      sql`SELECT * FROM inquiries ORDER BY created_at DESC`,
      sql`SELECT * FROM testimonials ORDER BY id ASC`,
      sql`SELECT data FROM settings WHERE id = 1`,
    ]);

    return jsonNoStore({
      artists: artists.map(mapArtist),
      projects: projects.map(mapProject),
      inquiries: inquiries.map(mapInquiry),
      testimonials: testimonials.map(mapTestimonial),
      settings: settingsRows[0]?.data ?? {},
    });
  } catch (err) {
    console.error(err);
    return jsonNoStore({ error: "Failed to load data" }, { status: 500 });
  }
}

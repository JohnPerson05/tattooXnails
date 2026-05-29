// Seeds Neon with starter content + an admin user.
// Run with: npm run db:seed   (after npm run db:migrate)
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

config({ path: ".env.local" });
config();

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("[seed] DATABASE_URL is not set. Add it to .env.local");
  process.exit(1);
}
const sql = neon(connectionString);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@owshiexceleste.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "studio2026";

// Image paths served from /public/assets.
const A = {
  owshie: "/assets/artist-owshie.jpg",
  celeste: "/assets/artist-celeste.jpg",
  t1: "/assets/tattoo-sample-1.jpg",
  t2: "/assets/tattoo-sample-2.jpg",
  n1: "/assets/nail-sample-1.jpg",
  n2: "/assets/nail-sample-2.jpg",
  ba: "/assets/nails-before-after.jpg",
};
const TIKTOK = "https://www.tiktok.com/@scout2015/video/6718335390845095173";

async function seed() {
  console.log("[seed] Clearing existing content...");
  await sql`DELETE FROM projects`;
  await sql`DELETE FROM artists`;
  await sql`DELETE FROM inquiries`;
  await sql`DELETE FROM testimonials`;
  await sql`DELETE FROM settings`;

  console.log("[seed] Creating admin user...");
  const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  await sql`
    INSERT INTO admins (email, password_hash, role)
    VALUES (${ADMIN_EMAIL.toLowerCase()}, ${hash}, 'admin')
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`;

  console.log("[seed] Inserting artists...");
  const [owshie] = await sql`
    INSERT INTO artists (slug, name, role, discipline, photo, bio, specialization, experience, social, featured)
    VALUES ('owshie','Owshie','Tattoo Artist','tattoo',${A.owshie},
      'Specializing in fine line, minimal, and geometric tattoo work. Every piece is a collaboration — your story, my art.',
      'Fine Line · Geometric · Minimalist','5+ years',
      ${JSON.stringify({ instagram: "https://instagram.com/", tiktok: "https://tiktok.com/", facebook: "https://facebook.com/", email: "owshie@owshiexceleste.com" })}::jsonb, true)
    RETURNING id`;
  const [celeste] = await sql`
    INSERT INTO artists (slug, name, role, discipline, photo, bio, specialization, experience, social, featured)
    VALUES ('celeste','Celeste','Nail Art Specialist','nails',${A.celeste},
      'From elegant French tips to wild 3D nail art sets — every nail is a tiny canvas.',
      'Gel Extensions · 3D Art · Custom Sets','4+ years',
      ${JSON.stringify({ instagram: "https://instagram.com/", tiktok: "https://tiktok.com/", facebook: "https://facebook.com/", email: "celeste@owshiexceleste.com" })}::jsonb, true)
    RETURNING id`;

  console.log("[seed] Inserting projects...");
  const projects = [
    ["botanical-peony","tattoo","Botanical Peony","Fine Line",A.t1,[A.t1,A.t2],"A delicate fine line peony wrapping the forearm.",owshie.id,TIKTOK,true],
    ["sacred-geometry","tattoo","Sacred Geometry","Geometric",A.t2,[A.t2,A.t1],"Precision dotwork mandala built from interlocking geometric forms.",owshie.id,TIKTOK,true],
    ["rose-outline","tattoo","Rose Outline","Minimalist",A.t1,[A.t1],"A single-needle minimalist rose.",owshie.id,null,false],
    ["mandala-pattern","tattoo","Mandala Pattern","Traditional",A.t2,[A.t2],"Bold traditional mandala with strong linework.",owshie.id,null,false],
    ["gold-french-tips","nails","Gold French Tips","Gel Extensions",A.n1,[A.n1,A.ba],"Classic almond gel extensions with a hand-painted gold French tip.",celeste.id,TIKTOK,true],
    ["abstract-mosaic","nails","Abstract Mosaic","3D Nail Design",A.n2,[A.n2,A.n1],"Hand-sculpted 3D mosaic set with foil and gem accents.",celeste.id,TIKTOK,true],
    ["classic-nude","nails","Classic Nude","French Variations",A.n1,[A.n1],"A soft nude base with a barely-there micro French.",celeste.id,null,false],
    ["pop-art-set","nails","Pop Art Set","Custom Sets",A.n2,[A.n2],"Bold comic-inspired custom set with freehand line art.",celeste.id,null,false],
  ];
  for (const [slug, discipline, title, category, cover, gallery, description, artistId, tiktok, featured] of projects) {
    await sql`
      INSERT INTO projects (slug, discipline, title, category, cover_image, gallery, description, artist_id, tiktok_url, date_completed, status, featured)
      VALUES (${slug}, ${discipline}::discipline, ${title}, ${category}, ${cover},
        ${JSON.stringify(gallery)}::jsonb, ${description}, ${artistId}, ${tiktok},
        now(), 'published'::project_status, ${featured})`;
  }

  console.log("[seed] Inserting testimonials...");
  const testimonials = [
    ["Mia K.", "Absolutely incredible work. The fine line tattoo healed beautifully.", 5],
    ["Jade L.", "Best nail art I've ever had. The 3D designs are unreal and last for weeks!", 5],
    ["Alex R.", "The studio vibe is amazing. They really take the time to understand your vision.", 5],
  ];
  for (const [name, text, rating] of testimonials) {
    await sql`INSERT INTO testimonials (name, text, rating) VALUES (${name}, ${text}, ${rating})`;
  }

  console.log("[seed] Inserting settings...");
  const settings = {
    heroEyebrow: "Now Booking 2026",
    heroLineOne: "ART ON", heroLineOneAccent: "SKIN",
    heroLineTwo: "ART ON", heroLineTwoAccent: "NAILS",
    heroSubtitle: "Where ink meets elegance — a creative studio for the bold and beautiful.",
    featuredProjectIds: [],
    social: { instagram: "https://instagram.com/", tiktok: "https://tiktok.com/", facebook: "https://facebook.com/", whatsapp: "https://wa.me/", email: "studio@owshiexceleste.com" },
    contactEmail: "studio@owshiexceleste.com",
    contactPhone: "+1 555 0100",
    studioLocation: "123 Ink Lane, Art District",
  };
  await sql`INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(settings)}::jsonb)`;

  console.log(`[seed] Done. Admin login: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("[seed] Failed:", err);
  process.exit(1);
});

import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: NextRequest) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const [row] = await sql`
      INSERT INTO settings (id, data) VALUES (1, ${JSON.stringify(body)}::jsonb)
      ON CONFLICT (id) DO UPDATE SET data = settings.data || ${JSON.stringify(body)}::jsonb
      RETURNING data`;
    return NextResponse.json(row.data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}

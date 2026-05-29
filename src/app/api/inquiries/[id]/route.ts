import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";
import { mapInquiry } from "@/server/mappers";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { id: string };
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const [row] = await sql`
      UPDATE inquiries SET status = COALESCE(${body.status ?? null}::inquiry_status, status)
      WHERE id = ${params.id} RETURNING *`;
    if (!row) return NextResponse.json({ error: "Inquiry not found" }, { status: 404 });
    return NextResponse.json(mapInquiry(row));
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to update inquiry" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await sql`DELETE FROM inquiries WHERE id = ${params.id}`;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete inquiry" }, { status: 500 });
  }
}

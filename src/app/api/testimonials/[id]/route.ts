import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { verifyAdmin } from "@/server/auth";

export const dynamic = "force-dynamic";

interface Ctx {
  params: { id: string };
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    await sql`DELETE FROM testimonials WHERE id = ${params.id}`;
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}

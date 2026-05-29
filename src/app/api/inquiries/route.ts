import { NextRequest, NextResponse } from "next/server";
import { sql, hasDatabase } from "@/server/db";
import { mapInquiry } from "@/server/mappers";
import { sendInquiryEmail } from "@/server/email";

export const dynamic = "force-dynamic";

// Public: contact / booking forms create inquiries.
// The inquiry is saved to Neon first (source of truth), then we attempt to email
// it to the studio. Email failure never fails the request — the inquiry is still
// recorded and visible in the admin inbox.
export async function POST(req: NextRequest) {
  if (!hasDatabase) return NextResponse.json({ error: "Database not configured" }, { status: 500 });

  try {
    const i = await req.json();
    if (!i.name || !i.serviceType) {
      return NextResponse.json({ error: "Name and service type required" }, { status: 400 });
    }
    const [row] = await sql`
      INSERT INTO inquiries (name, email, contact, service_type, message, status)
      VALUES (${i.name}, ${i.email ?? ""}, ${i.contact ?? ""}, ${i.serviceType}, ${i.message ?? ""}, 'new')
      RETURNING *`;

    // Fire the notification email (best-effort).
    await sendInquiryEmail({
      name: i.name,
      email: i.email ?? "",
      contact: i.contact ?? "",
      serviceType: i.serviceType,
      message: i.message ?? "",
    });

    return NextResponse.json(mapInquiry(row), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 });
  }
}

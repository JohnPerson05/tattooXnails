import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { verifyAdmin } from "@/server/auth";

export const dynamic = "force-dynamic";

const blobConfigured = Boolean(process.env.BLOB_READ_WRITE_TOKEN);

// Admin-only image upload.
// - If Vercel Blob is configured, the file is stored in object storage and a
//   permanent CDN URL is returned (only this short URL is saved in Neon).
// - If not configured (e.g. local dev without a token), returns 501 so the
//   client falls back to inlining a data URL.
export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!blobConfigured) {
    return NextResponse.json(
      { error: "Blob storage not configured" },
      { status: 501 },
    );
  }

  try {
    const filename = req.nextUrl.searchParams.get("filename") || `upload-${Date.now()}`;
    if (!req.body) {
      return NextResponse.json({ error: "No file body" }, { status: 400 });
    }

    // Store under an images/ prefix with a random suffix to avoid collisions.
    const blob = await put(`images/${filename}`, req.body, {
      access: "public",
      addRandomSuffix: true,
    });

    return NextResponse.json({ url: blob.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

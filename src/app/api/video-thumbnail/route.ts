import { NextRequest, NextResponse } from "next/server";

// Returns a poster thumbnail for a TikTok video URL via TikTok's public oEmbed.
// YouTube thumbnails are derived client-side (i.ytimg.com) so they don't hit here.
// Cached for a day since thumbnails are stable.
export const revalidate = 86400;

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const res = await fetch(`https://www.tiktok.com/oembed?url=${encodeURIComponent(url)}`, {
      // Revalidate daily.
      next: { revalidate: 86400 },
    });
    if (!res.ok) {
      return NextResponse.json({ thumbnail: null }, { status: 200 });
    }
    const data = (await res.json()) as {
      thumbnail_url?: string;
      author_name?: string;
      title?: string;
    };
    return NextResponse.json({
      thumbnail: data.thumbnail_url ?? null,
      author: data.author_name ?? null,
      title: data.title ?? null,
    });
  } catch {
    return NextResponse.json({ thumbnail: null }, { status: 200 });
  }
}

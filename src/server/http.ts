import { NextResponse } from "next/server";

// JSON response with explicit no-store headers so browsers and the Vercel CDN
// never serve stale data (important for the live admin <-> public site sync).
export function jsonNoStore(body: unknown, init?: { status?: number }) {
  return NextResponse.json(body, {
    status: init?.status ?? 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
    },
  });
}

// Helpers for parsing and embedding TikTok video URLs.

export interface TikTokParsed {
  videoId: string | null;
  username: string | null;
}

export function parseTikTokUrl(url: string): TikTokParsed {
  const result: TikTokParsed = { videoId: null, username: null };
  if (!url) return result;
  try {
    const u = new URL(url);
    // Username segment like @scout2015
    const userMatch = u.pathname.match(/@([^/]+)/);
    if (userMatch) result.username = userMatch[1];
    // Video id segment like /video/123456789
    const videoMatch = u.pathname.match(/\/video\/(\d+)/);
    if (videoMatch) result.videoId = videoMatch[1];
  } catch {
    /* invalid url */
  }
  return result;
}

export function tiktokProfileUrl(username: string | null): string | null {
  return username ? `https://www.tiktok.com/@${username}` : null;
}

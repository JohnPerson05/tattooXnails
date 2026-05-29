// Helpers for parsing and embedding TikTok + YouTube video URLs.

export type VideoProvider = "tiktok" | "youtube";

export interface ParsedVideo {
  provider: VideoProvider | null;
  videoId: string | null;
  username: string | null;
  /** Embeddable iframe src (playable). */
  embedUrl: string | null;
  /** Poster/thumbnail image (YouTube only; null for TikTok). */
  thumbnail: string | null;
  /** Canonical watch URL for the click-through fallback. */
  watchUrl: string;
}

export function parseVideoUrl(url: string): ParsedVideo {
  const result: ParsedVideo = {
    provider: null,
    videoId: null,
    username: null,
    embedUrl: null,
    thumbnail: null,
    watchUrl: url,
  };
  if (!url) return result;

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");

    // ---- YouTube --------------------------------------------------------
    if (host === "youtube.com" || host === "m.youtube.com" || host === "youtu.be") {
      let id: string | null = null;
      if (host === "youtu.be") {
        id = u.pathname.slice(1).split("/")[0] || null;
      } else if (u.pathname.startsWith("/watch")) {
        id = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/shorts/")) {
        id = u.pathname.split("/shorts/")[1]?.split("/")[0] || null;
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/embed/")[1]?.split("/")[0] || null;
      }
      if (id) {
        result.provider = "youtube";
        result.videoId = id;
        result.embedUrl = `https://www.youtube.com/embed/${id}`;
        result.thumbnail = `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
      }
      return result;
    }

    // ---- TikTok ---------------------------------------------------------
    if (host.endsWith("tiktok.com")) {
      const userMatch = u.pathname.match(/@([^/]+)/);
      if (userMatch) result.username = userMatch[1];
      const videoMatch = u.pathname.match(/\/video\/(\d+)/);
      if (videoMatch) {
        result.provider = "tiktok";
        result.videoId = videoMatch[1];
        // Canonical embeddable player.
        result.embedUrl = `https://www.tiktok.com/embed/v2/${videoMatch[1]}`;
      } else if (result.username) {
        // A profile link with no specific video.
        result.provider = "tiktok";
      }
      return result;
    }
  } catch {
    /* invalid url */
  }
  return result;
}

// Backwards-compatible helper kept for existing imports.
export function parseTikTokUrl(url: string): { videoId: string | null; username: string | null } {
  const p = parseVideoUrl(url);
  return { videoId: p.provider === "tiktok" ? p.videoId : null, username: p.username };
}

export function tiktokProfileUrl(username: string | null): string | null {
  return username ? `https://www.tiktok.com/@${username}` : null;
}

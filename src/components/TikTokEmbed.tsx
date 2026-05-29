"use client";
// Playable video embed for TikTok and YouTube with a poster thumbnail.
//
// Shows a poster/facade with a play button; on click it swaps in the provider's
// iframe player and autoplays. TikTok thumbnails come from /api/video-thumbnail
// (oEmbed); YouTube thumbnails are derived from the video id.
import { useEffect, useState } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { parseVideoUrl } from "@/lib/tiktok";

interface Props {
  url: string;
  className?: string;
}

const TikTokGlyph = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-10 h-10 text-foreground/40">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.23 8.23 0 0 0 4.76 1.52V6.87a4.84 4.84 0 0 1-1-.18Z" />
  </svg>
);

const VideoEmbed = ({ url, className = "" }: Props) => {
  const [playing, setPlaying] = useState(false);
  const [thumb, setThumb] = useState<string | null>(null);
  const parsed = parseVideoUrl(url);
  const isYouTube = parsed.provider === "youtube";

  // YouTube thumbnail is known immediately; TikTok needs an oEmbed lookup.
  useEffect(() => {
    if (parsed.thumbnail) {
      setThumb(parsed.thumbnail);
      return;
    }
    if (parsed.provider === "tiktok") {
      let active = true;
      fetch(`/api/video-thumbnail?url=${encodeURIComponent(url)}`)
        .then((r) => r.json())
        .then((d: { thumbnail: string | null }) => {
          if (active && d.thumbnail) setThumb(d.thumbnail);
        })
        .catch(() => {});
      return () => {
        active = false;
      };
    }
  }, [url, parsed.provider, parsed.thumbnail]);

  // Unrecognized / profile-only link -> click-through card.
  if (!parsed.embedUrl) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`glass-card aspect-[9/16] flex flex-col items-center justify-center gap-3 group hover-lift ${className}`}
      >
        <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
          <Play size={24} className="text-primary ml-1" />
        </div>
        <span className="text-xs text-muted-foreground uppercase tracking-widest inline-flex items-center gap-1">
          Watch video <ArrowUpRight size={12} />
        </span>
      </a>
    );
  }

  const aspect = isYouTube ? "aspect-video" : "aspect-[9/16]";

  if (playing) {
    if (isYouTube) {
      return (
        <div className={`relative ${aspect} rounded-xl overflow-hidden bg-black ${className}`}>
          <iframe
            src={`${parsed.embedUrl}?autoplay=1&rel=0`}
            title="YouTube video player"
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      );
    }
    // TikTok's embed player adds a caption/header strip that creates an inner
    // scrollbar. We clip overflow and oversize the iframe height so the actual
    // video fills the 9:16 card cleanly.
    return (
      <div className={`relative ${aspect} rounded-xl overflow-hidden bg-black ${className}`}>
        <iframe
          src={`${parsed.embedUrl}?autoplay=1`}
          title="TikTok video player"
          scrolling="no"
          className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-[150%]"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlaying(true)}
      className={`relative ${aspect} rounded-xl overflow-hidden group w-full bg-card ${className}`}
      aria-label="Play video"
    >
      {/* Poster */}
      {thumb ? (
        <img
          src={thumb}
          alt="Video thumbnail"
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-muted to-card flex items-center justify-center">
          <TikTokGlyph />
        </div>
      )}

      {/* Overlay + play button */}
      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/45 transition-colors flex items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
          <Play size={26} className="text-primary-foreground ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Provider badge */}
      <span className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest text-white/90 font-medium bg-black/40 backdrop-blur px-2 py-1 rounded-full">
        {isYouTube ? "YouTube" : "TikTok"}
      </span>
    </button>
  );
};

export default VideoEmbed;

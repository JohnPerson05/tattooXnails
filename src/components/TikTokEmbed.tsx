"use client";
// Renders a TikTok video using the official blockquote embed + embed.js script.
// Falls back to a click-through card when the URL can't be parsed.
import { useEffect } from "react";
import { ArrowUpRight, Play } from "lucide-react";
import { parseTikTokUrl } from "@/lib/tiktok";

let scriptInjected = false;

function ensureEmbedScript() {
  if (scriptInjected) {
    // Re-run the loader if TikTok's global is already present.
    (window as unknown as { tiktokEmbedLoad?: () => void }).tiktokEmbedLoad?.();
    return;
  }
  const script = document.createElement("script");
  script.src = "https://www.tiktok.com/embed.js";
  script.async = true;
  document.body.appendChild(script);
  scriptInjected = true;
}

interface Props {
  url: string;
  className?: string;
}

const TikTokEmbed = ({ url, className = "" }: Props) => {
  const { videoId, username } = parseTikTokUrl(url);

  useEffect(() => {
    if (videoId) ensureEmbedScript();
  }, [videoId]);

  if (!videoId) {
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
          Watch on TikTok <ArrowUpRight size={12} />
        </span>
      </a>
    );
  }

  return (
    <blockquote
      className={`tiktok-embed ${className}`}
      cite={url}
      data-video-id={videoId}
      style={{ maxWidth: "100%", minWidth: "260px", margin: 0 }}
    >
      <section>
        <a
          href={username ? `https://www.tiktok.com/@${username}` : url}
          target="_blank"
          rel="noopener noreferrer"
        >
          {username ? `@${username}` : "View on TikTok"}
        </a>
      </section>
    </blockquote>
  );
};

export default TikTokEmbed;

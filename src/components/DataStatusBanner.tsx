"use client";
// Shows a small banner when the site data can't be loaded (DB unreachable or
// not yet seeded). This makes "why are there no images / no content" obvious
// instead of silently rendering empty sections.
import { AlertTriangle } from "lucide-react";
import { useStore } from "@/lib/store";

const DataStatusBanner = () => {
  const { error, loading, data } = useStore();

  if (loading) return null;

  const isEmpty =
    !error && data && data.projects.length === 0 && data.artists.length === 0;

  if (!error && !isEmpty) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-[90] bg-destructive/90 backdrop-blur text-destructive-foreground text-sm">
      <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
        <AlertTriangle size={16} className="shrink-0" />
        <span className="flex-1">
          {error
            ? "Couldn't load site content — the database isn't reachable."
            : "The database is connected but empty — no content has been added yet."}{" "}
          Open{" "}
          <a href="/api/health" target="_blank" rel="noopener noreferrer" className="underline font-medium">
            /api/health
          </a>{" "}
          for details.
        </span>
      </div>
    </div>
  );
};

export default DataStatusBanner;

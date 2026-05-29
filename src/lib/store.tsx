"use client";
// Global reactive store. Talks to the Neon-backed Next.js API routes (/api/*)
// and exposes data plus mutation helpers through React context.
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  Inquiry,
  Project,
  SiteSettings,
  StoreData,
  Testimonial,
} from "./types";
import { DataAdapter } from "./adapter";
import { ApiAdapter } from "./apiAdapter";

// The app always uses the Neon-backed API. On Vercel the Neon integration injects
// DATABASE_URL; locally set it in .env.local.
export const adapterMode = "api" as const;

interface StoreContextValue {
  data: StoreData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  adapter: DataAdapter;
  mode: "api";

  createProject: DataAdapter["createProject"];
  updateProject: DataAdapter["updateProject"];
  deleteProject: DataAdapter["deleteProject"];
  createArtist: DataAdapter["createArtist"];
  updateArtist: DataAdapter["updateArtist"];
  deleteArtist: DataAdapter["deleteArtist"];
  createInquiry: DataAdapter["createInquiry"];
  updateInquiry: DataAdapter["updateInquiry"];
  deleteInquiry: DataAdapter["deleteInquiry"];
  updateSettings: DataAdapter["updateSettings"];
  createTestimonial: DataAdapter["createTestimonial"];
  deleteTestimonial: DataAdapter["deleteTestimonial"];
}

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const adapterRef = useRef<DataAdapter>(new ApiAdapter());
  const adapter = adapterRef.current;

  const [data, setData] = useState<StoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const next = await adapter.getAll();
      setData(next);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [adapter]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const wrap = useCallback(
    <Args extends unknown[], R>(fn: (...args: Args) => Promise<R>) =>
      async (...args: Args): Promise<R> => {
        const result = await fn(...args);
        await refresh();
        return result;
      },
    [refresh],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      loading,
      error,
      refresh,
      adapter,
      mode: adapterMode,
      createProject: wrap(adapter.createProject.bind(adapter)),
      updateProject: wrap(adapter.updateProject.bind(adapter)),
      deleteProject: wrap(adapter.deleteProject.bind(adapter)),
      createArtist: wrap(adapter.createArtist.bind(adapter)),
      updateArtist: wrap(adapter.updateArtist.bind(adapter)),
      deleteArtist: wrap(adapter.deleteArtist.bind(adapter)),
      createInquiry: wrap(adapter.createInquiry.bind(adapter)),
      updateInquiry: wrap(adapter.updateInquiry.bind(adapter)),
      deleteInquiry: wrap(adapter.deleteInquiry.bind(adapter)),
      updateSettings: wrap(adapter.updateSettings.bind(adapter)),
      createTestimonial: wrap(adapter.createTestimonial.bind(adapter)),
      deleteTestimonial: wrap(adapter.deleteTestimonial.bind(adapter)),
    }),
    [data, loading, error, refresh, adapter, wrap],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

// Convenience selectors -------------------------------------------------------

export function useProjects(discipline?: Project["discipline"]) {
  const { data } = useStore();
  return useMemo(() => {
    const all = (data?.projects ?? []).filter((p) => p.status === "published");
    return discipline ? all.filter((p) => p.discipline === discipline) : all;
  }, [data, discipline]);
}

export function useArtists() {
  const { data } = useStore();
  return data?.artists ?? [];
}

export function useSettings(): SiteSettings | null {
  const { data } = useStore();
  return data?.settings ?? null;
}

export function useTestimonials(): Testimonial[] {
  const { data } = useStore();
  return data?.testimonials ?? [];
}

export function useInquiries(): Inquiry[] {
  const { data } = useStore();
  return data?.inquiries ?? [];
}

"use client";
// Global reactive store. Talks to the Neon-backed Next.js API routes (/api/*).
//
// Mutations update local state IMMEDIATELY from the API's returned row, so the
// admin UI reflects changes instantly without a full re-download. A background
// revalidation keeps things eventually consistent without blocking the UI.
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
  Artist,
  Inquiry,
  Project,
  SiteSettings,
  StoreData,
  Testimonial,
} from "./types";
import { DataAdapter } from "./adapter";
import { ApiAdapter } from "./apiAdapter";

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

  // Apply a local mutation to the in-memory snapshot for an instant UI update.
  const patch = useCallback((mutate: (d: StoreData) => StoreData) => {
    setData((prev) => (prev ? mutate(prev) : prev));
  }, []);

  // ---- Projects -----------------------------------------------------------
  const createProject = useCallback(
    async (input: Omit<Project, "id" | "createdAt">) => {
      const created = await adapter.createProject(input);
      patch((d) => ({ ...d, projects: [created, ...d.projects] }));
      return created;
    },
    [adapter, patch],
  );

  const updateProject = useCallback(
    async (id: string, p: Partial<Project>) => {
      const updated = await adapter.updateProject(id, p);
      patch((d) => ({
        ...d,
        projects: d.projects.map((x) => (x.id === id ? updated : x)),
      }));
      return updated;
    },
    [adapter, patch],
  );

  const deleteProject = useCallback(
    async (id: string) => {
      await adapter.deleteProject(id);
      patch((d) => ({
        ...d,
        projects: d.projects.filter((x) => x.id !== id),
        settings: {
          ...d.settings,
          featuredProjectIds: (d.settings.featuredProjectIds ?? []).filter((pid) => pid !== id),
        },
      }));
    },
    [adapter, patch],
  );

  // ---- Artists ------------------------------------------------------------
  const createArtist = useCallback(
    async (input: Omit<Artist, "id" | "createdAt">) => {
      const created = await adapter.createArtist(input);
      patch((d) => ({ ...d, artists: [...d.artists, created] }));
      return created;
    },
    [adapter, patch],
  );

  const updateArtist = useCallback(
    async (id: string, p: Partial<Artist>) => {
      const updated = await adapter.updateArtist(id, p);
      patch((d) => ({
        ...d,
        artists: d.artists.map((x) => (x.id === id ? updated : x)),
      }));
      return updated;
    },
    [adapter, patch],
  );

  const deleteArtist = useCallback(
    async (id: string) => {
      await adapter.deleteArtist(id);
      patch((d) => ({
        ...d,
        artists: d.artists.filter((x) => x.id !== id),
        // Match the API: deleted artist is detached from their projects.
        projects: d.projects.map((x) => (x.artistId === id ? { ...x, artistId: null } : x)),
      }));
    },
    [adapter, patch],
  );

  // ---- Inquiries ----------------------------------------------------------
  const createInquiry = useCallback(
    async (input: Omit<Inquiry, "id" | "createdAt" | "status">) => {
      const created = await adapter.createInquiry(input);
      patch((d) => ({ ...d, inquiries: [created, ...d.inquiries] }));
      return created;
    },
    [adapter, patch],
  );

  const updateInquiry = useCallback(
    async (id: string, p: Partial<Inquiry>) => {
      const updated = await adapter.updateInquiry(id, p);
      patch((d) => ({
        ...d,
        inquiries: d.inquiries.map((x) => (x.id === id ? updated : x)),
      }));
      return updated;
    },
    [adapter, patch],
  );

  const deleteInquiry = useCallback(
    async (id: string) => {
      await adapter.deleteInquiry(id);
      patch((d) => ({ ...d, inquiries: d.inquiries.filter((x) => x.id !== id) }));
    },
    [adapter, patch],
  );

  // ---- Settings & testimonials -------------------------------------------
  const updateSettings = useCallback(
    async (p: Partial<SiteSettings>) => {
      const updated = await adapter.updateSettings(p);
      patch((d) => ({ ...d, settings: updated }));
      return updated;
    },
    [adapter, patch],
  );

  const createTestimonial = useCallback(
    async (input: Omit<Testimonial, "id">) => {
      const created = await adapter.createTestimonial(input);
      patch((d) => ({ ...d, testimonials: [...d.testimonials, created] }));
      return created;
    },
    [adapter, patch],
  );

  const deleteTestimonial = useCallback(
    async (id: string) => {
      await adapter.deleteTestimonial(id);
      patch((d) => ({ ...d, testimonials: d.testimonials.filter((x) => x.id !== id) }));
    },
    [adapter, patch],
  );

  const value = useMemo<StoreContextValue>(
    () => ({
      data,
      loading,
      error,
      refresh,
      adapter,
      mode: adapterMode,
      createProject,
      updateProject,
      deleteProject,
      createArtist,
      updateArtist,
      deleteArtist,
      createInquiry,
      updateInquiry,
      deleteInquiry,
      updateSettings,
      createTestimonial,
      deleteTestimonial,
    }),
    [
      data, loading, error, refresh, adapter,
      createProject, updateProject, deleteProject,
      createArtist, updateArtist, deleteArtist,
      createInquiry, updateInquiry, deleteInquiry,
      updateSettings, createTestimonial, deleteTestimonial,
    ],
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

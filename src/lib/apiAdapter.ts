// REST adapter that talks to the Next.js API routes (same origin: /api/*).
// Admin-mutating calls include the JWT issued by /api/auth/login.
import type {
  Artist,
  Inquiry,
  Project,
  SiteSettings,
  StoreData,
  Testimonial,
} from "./types";
import { DataAdapter } from "./adapter";

const TOKEN_KEY = "owshie-celeste-admin-token";

function authHeaders(): Record<string, string> {
  const token = typeof window !== "undefined" ? window.localStorage.getItem(TOKEN_KEY) : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export class ApiAdapter implements DataAdapter {
  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`/api${path}`, {
      ...init,
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        ...(init?.headers ?? {}),
      },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => res.statusText);
      throw new Error(`API ${res.status}: ${detail}`);
    }
    if (res.status === 204) return undefined as T;
    return (await res.json()) as T;
  }

  getAll(): Promise<StoreData> {
    return this.request<StoreData>("/bootstrap");
  }

  createProject(input: Omit<Project, "id" | "createdAt">): Promise<Project> {
    return this.request<Project>("/projects", { method: "POST", body: JSON.stringify(input) });
  }
  updateProject(id: string, patch: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  }
  deleteProject(id: string): Promise<void> {
    return this.request<void>(`/projects/${id}`, { method: "DELETE" });
  }

  createArtist(input: Omit<Artist, "id" | "createdAt">): Promise<Artist> {
    return this.request<Artist>("/artists", { method: "POST", body: JSON.stringify(input) });
  }
  updateArtist(id: string, patch: Partial<Artist>): Promise<Artist> {
    return this.request<Artist>(`/artists/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  }
  deleteArtist(id: string): Promise<void> {
    return this.request<void>(`/artists/${id}`, { method: "DELETE" });
  }

  createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry> {
    return this.request<Inquiry>("/inquiries", { method: "POST", body: JSON.stringify(input) });
  }
  updateInquiry(id: string, patch: Partial<Inquiry>): Promise<Inquiry> {
    return this.request<Inquiry>(`/inquiries/${id}`, { method: "PATCH", body: JSON.stringify(patch) });
  }
  deleteInquiry(id: string): Promise<void> {
    return this.request<void>(`/inquiries/${id}`, { method: "DELETE" });
  }

  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings> {
    return this.request<SiteSettings>("/settings", { method: "PATCH", body: JSON.stringify(patch) });
  }

  createTestimonial(input: Omit<Testimonial, "id">): Promise<Testimonial> {
    return this.request<Testimonial>("/testimonials", { method: "POST", body: JSON.stringify(input) });
  }
  deleteTestimonial(id: string): Promise<void> {
    return this.request<void>(`/testimonials/${id}`, { method: "DELETE" });
  }
}

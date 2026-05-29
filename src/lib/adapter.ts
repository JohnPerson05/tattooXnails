// Data adapter contract.
// Implemented by ApiAdapter, which talks to the Neon-backed Next.js API routes.
import type {
  Artist,
  Inquiry,
  Project,
  SiteSettings,
  StoreData,
  Testimonial,
} from "./types";

export interface DataAdapter {
  getAll(): Promise<StoreData>;

  createProject(input: Omit<Project, "id" | "createdAt">): Promise<Project>;
  updateProject(id: string, patch: Partial<Project>): Promise<Project>;
  deleteProject(id: string): Promise<void>;

  createArtist(input: Omit<Artist, "id" | "createdAt">): Promise<Artist>;
  updateArtist(id: string, patch: Partial<Artist>): Promise<Artist>;
  deleteArtist(id: string): Promise<void>;

  createInquiry(input: Omit<Inquiry, "id" | "createdAt" | "status">): Promise<Inquiry>;
  updateInquiry(id: string, patch: Partial<Inquiry>): Promise<Inquiry>;
  deleteInquiry(id: string): Promise<void>;

  updateSettings(patch: Partial<SiteSettings>): Promise<SiteSettings>;

  createTestimonial(input: Omit<Testimonial, "id">): Promise<Testimonial>;
  deleteTestimonial(id: string): Promise<void>;
}

export const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

export const genId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;

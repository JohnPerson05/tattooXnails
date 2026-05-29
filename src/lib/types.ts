// Domain types for Owshie Tattoo x Celeste Nail
// These mirror the PostgreSQL / Supabase schema documented in docs/ARCHITECTURE.md
// so the localStorage MVP store can later be swapped for Supabase with minimal changes.

export type Discipline = "tattoo" | "nails";

export type ProjectStatus = "published" | "draft" | "archived";

export type InquiryStatus = "new" | "read" | "replied" | "archived";

export interface SocialLinks {
  instagram?: string;
  tiktok?: string;
  facebook?: string;
  whatsapp?: string;
  email?: string;
}

export interface Artist {
  id: string;
  slug: string;
  name: string;
  role: string; // e.g. "Tattoo Artist", "Nail Art Specialist"
  discipline: Discipline;
  photo: string;
  bio: string;
  specialization: string;
  experience: string; // e.g. "3+ years"
  social: SocialLinks;
  featured: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  slug: string;
  discipline: Discipline;
  title: string;
  category: string;
  coverImage: string;
  gallery: string[];
  description: string;
  artistId: string | null;
  tiktokUrl?: string;
  instagramUrl?: string;
  videoUrl?: string;
  dateCompleted: string; // ISO date
  status: ProjectStatus;
  featured: boolean;
  createdAt: string;
}

export interface Inquiry {
  id: string;
  name: string;
  email: string;
  contact: string;
  serviceType: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  text: string;
  rating: number; // 1-5
}

export interface SiteSettings {
  heroEyebrow: string;
  heroLineOne: string;
  heroLineOneAccent: string;
  heroLineTwo: string;
  heroLineTwoAccent: string;
  heroSubtitle: string;
  featuredProjectIds: string[];
  social: SocialLinks;
  contactEmail: string;
  contactPhone: string;
  studioLocation: string;
}

export interface StoreData {
  artists: Artist[];
  projects: Project[];
  inquiries: Inquiry[];
  testimonials: Testimonial[];
  settings: SiteSettings;
}

// Tattoo & nail categories surfaced in filters and the admin forms.
export const TATTOO_CATEGORIES = [
  "Fine Line",
  "Black & Grey",
  "Minimalist",
  "Custom Design",
  "Traditional",
  "Geometric",
] as const;

export const NAIL_CATEGORIES = [
  "Gel Extensions",
  "Acrylic Extensions",
  "Nail Art",
  "3D Nail Design",
  "Custom Sets",
  "French Variations",
] as const;

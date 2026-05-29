// Convert snake_case DB rows <-> camelCase API shapes used by the frontend.
import type { Artist, Inquiry, Project, Testimonial } from "@/lib/types";

type Row = Record<string, any>;

export function mapArtist(row: Row): Artist {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    role: row.role,
    discipline: row.discipline,
    photo: row.photo,
    bio: row.bio,
    specialization: row.specialization,
    experience: row.experience,
    social: row.social ?? {},
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function mapProject(row: Row): Project {
  return {
    id: row.id,
    slug: row.slug,
    discipline: row.discipline,
    title: row.title,
    category: row.category,
    coverImage: row.cover_image,
    gallery: row.gallery ?? [],
    description: row.description,
    artistId: row.artist_id,
    tiktokUrl: row.tiktok_url ?? "",
    instagramUrl: row.instagram_url ?? "",
    videoUrl: row.video_url ?? "",
    dateCompleted:
      row.date_completed instanceof Date
        ? row.date_completed.toISOString().slice(0, 10)
        : String(row.date_completed).slice(0, 10),
    status: row.status,
    featured: row.featured,
    createdAt: row.created_at,
  };
}

export function mapInquiry(row: Row): Inquiry {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    contact: row.contact,
    serviceType: row.service_type,
    message: row.message,
    status: row.status,
    createdAt: row.created_at,
  };
}

export function mapTestimonial(row: Row): Testimonial {
  return { id: row.id, name: row.name, text: row.text, rating: row.rating };
}

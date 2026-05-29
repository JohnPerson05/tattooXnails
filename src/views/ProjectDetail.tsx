"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Instagram, Tag, X } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import TikTokEmbed from "@/components/TikTokEmbed";
import { useStore } from "@/lib/store";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.23 8.23 0 0 0 4.76 1.52V6.87a4.84 4.84 0 0 1-1-.18Z" />
  </svg>
);

const ProjectDetail = ({ slug }: { slug: string }) => {
  const { data, loading } = useStore();
  const [lightbox, setLightbox] = useState<string | null>(null);

  const project = data?.projects.find((p) => p.slug === slug);
  const artist = project ? data?.artists.find((a) => a.id === project.artistId) : null;
  const accent = project?.discipline === "nails" ? "secondary" : "primary";

  if (loading) {
    return (
      <Layout>
        <div className="section-padding max-w-7xl mx-auto">
          <div className="h-[60vh] rounded-2xl bg-muted animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <section className="section-padding max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl tracking-wider text-foreground">Project Not Found</h1>
          <p className="text-muted-foreground mt-4">This piece may have been archived or moved.</p>
          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-primary hover:underline">
            <ArrowLeft size={16} /> Back home
          </Link>
        </section>
      </Layout>
    );
  }

  const backLink = project.discipline === "nails" ? "/nails" : "/tattoo";
  const related = (data?.projects ?? [])
    .filter((p) => p.discipline === project.discipline && p.id !== project.id && p.status === "published")
    .slice(0, 3);

  return (
    <Layout>
      <article className="section-padding max-w-6xl mx-auto">
        <SectionReveal>
          <Link
            href={backLink}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8"
          >
            <ArrowLeft size={16} /> Back to {project.discipline === "nails" ? "Nail Art" : "Tattoo"}
          </Link>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Cover + gallery */}
          <SectionReveal>
            <div className="space-y-4">
              <button
                onClick={() => setLightbox(project.coverImage)}
                className="block w-full rounded-2xl overflow-hidden group"
              >
                <img
                  src={project.coverImage}
                  alt={project.title}
                  className="w-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </button>
              {project.gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {project.gallery.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setLightbox(img)}
                      className="rounded-lg overflow-hidden aspect-square hover-lift"
                    >
                      <img src={img} alt={`${project.title} ${i + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </SectionReveal>

          {/* Details */}
          <SectionReveal delay={0.15}>
            <div className="lg:sticky lg:top-28">
              <span
                className={`text-xs uppercase tracking-[0.3em] font-medium ${
                  accent === "secondary" ? "text-secondary" : "text-primary"
                }`}
              >
                {project.discipline === "nails" ? "Nail Art" : "Tattoo"}
              </span>
              <h1 className="font-display text-4xl md:text-6xl tracking-wider text-foreground mt-2">
                {project.title}
              </h1>

              <div className="flex flex-wrap gap-4 mt-5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Tag size={14} /> {project.category}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={14} />
                  {new Date(project.dateCompleted).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>

              <p className="text-foreground/80 leading-relaxed mt-6">{project.description}</p>

              {artist && (
                <Link
                  href={`/artist/${artist.slug}`}
                  className="glass-card flex items-center gap-4 p-4 mt-8 hover-lift"
                >
                  <img src={artist.photo} alt={artist.name} className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <span className="text-xs uppercase tracking-widest text-muted-foreground">Artist</span>
                    <p className="font-display text-xl tracking-wider text-foreground leading-tight">
                      {artist.name}
                    </p>
                    <span className="text-xs text-muted-foreground">{artist.role}</span>
                  </div>
                  <ArrowRight size={16} className="ml-auto text-muted-foreground" />
                </Link>
              )}

              {/* Social links */}
              <div className="flex gap-3 mt-6">
                {project.instagramUrl && (
                  <a
                    href={project.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-muted px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <Instagram size={16} /> Instagram
                  </a>
                )}
                {project.tiktokUrl && (
                  <a
                    href={project.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-muted px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/70 transition-colors"
                  >
                    <TikTokIcon size={16} /> TikTok
                  </a>
                )}
              </div>

              <Link
                href="/contact"
                className={`inline-flex items-center justify-center gap-2 mt-8 w-full py-3.5 rounded-lg font-medium text-sm tracking-wide hover:opacity-90 transition-opacity ${
                  accent === "secondary"
                    ? "bg-secondary text-secondary-foreground rose-glow"
                    : "bg-primary text-primary-foreground gold-glow"
                }`}
              >
                Inquire About Similar Work <ArrowRight size={16} />
              </Link>
            </div>
          </SectionReveal>
        </div>

        {/* TikTok embed */}
        {project.tiktokUrl && (
          <SectionReveal className="mt-16">
            <h2 className="font-display text-3xl tracking-wider text-foreground text-center mb-8">
              Watch the <span className={accent === "secondary" ? "text-secondary" : "text-primary"}>Process</span>
            </h2>
            <div className="flex justify-center">
              <TikTokEmbed url={project.tiktokUrl} className="max-w-sm w-full" />
            </div>
          </SectionReveal>
        )}

        {/* Related */}
        {related.length > 0 && (
          <SectionReveal className="mt-20">
            <h2 className="font-display text-3xl tracking-wider text-foreground mb-8">More Work</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {related.map((p) => (
                <Link key={p.id} href={`/project/${p.slug}`} className="group rounded-xl overflow-hidden hover-lift">
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={p.coverImage}
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </SectionReveal>
        )}
      </article>

      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
            <X size={28} />
          </button>
          <img src={lightbox} alt={project.title} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </motion.div>
      )}
    </Layout>
  );
};

export default ProjectDetail;

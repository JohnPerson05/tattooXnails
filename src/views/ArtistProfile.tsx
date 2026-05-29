"use client";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Award, Facebook, Instagram, Mail, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import { useStore } from "@/lib/store";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.23 8.23 0 0 0 4.76 1.52V6.87a4.84 4.84 0 0 1-1-.18Z" />
  </svg>
);

const ArtistProfile = ({ slug }: { slug: string }) => {
  const { data, loading } = useStore();

  const artist = data?.artists.find((a) => a.slug === slug);
  const accent = artist?.discipline === "nails" ? "secondary" : "primary";
  const works = (data?.projects ?? []).filter(
    (p) => p.artistId === artist?.id && p.status === "published",
  );

  if (loading) {
    return (
      <Layout>
        <div className="section-padding max-w-5xl mx-auto">
          <div className="h-[50vh] rounded-2xl bg-muted animate-pulse" />
        </div>
      </Layout>
    );
  }

  if (!artist) {
    return (
      <Layout>
        <section className="section-padding max-w-3xl mx-auto text-center">
          <h1 className="font-display text-5xl tracking-wider text-foreground">Artist Not Found</h1>
          <Link href="/" className="inline-flex items-center gap-2 mt-8 text-primary hover:underline">
            <ArrowLeft size={16} /> Back home
          </Link>
        </section>
      </Layout>
    );
  }

  const socials = [
    artist.social.instagram && { icon: <Instagram size={18} />, href: artist.social.instagram, label: "Instagram" },
    artist.social.tiktok && { icon: <TikTokIcon size={18} />, href: artist.social.tiktok, label: "TikTok" },
    artist.social.facebook && { icon: <Facebook size={18} />, href: artist.social.facebook, label: "Facebook" },
    artist.social.email && { icon: <Mail size={18} />, href: `mailto:${artist.social.email}`, label: "Email" },
  ].filter(Boolean) as { icon: JSX.Element; href: string; label: string }[];

  return (
    <Layout>
      <section className="section-padding max-w-6xl mx-auto">
        <SectionReveal>
          <Link
            href="/#about"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8"
          >
            <ArrowLeft size={16} /> All Artists
          </Link>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <SectionReveal className="lg:col-span-2">
            <div className="rounded-2xl overflow-hidden glass-card">
              <img src={artist.photo} alt={artist.name} className="w-full aspect-[3/4] object-cover object-top" />
            </div>
          </SectionReveal>

          <SectionReveal delay={0.15} className="lg:col-span-3">
            <span
              className={`text-xs uppercase tracking-[0.3em] font-medium ${
                accent === "secondary" ? "text-secondary" : "text-primary"
              }`}
            >
              {artist.role}
            </span>
            <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mt-2">
              {artist.name}
            </h1>

            <div className="flex flex-wrap gap-4 mt-6">
              <div className="glass-card px-5 py-3 flex items-center gap-3">
                <Sparkles size={18} className={accent === "secondary" ? "text-secondary" : "text-primary"} />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Specialization</span>
                  <span className="text-sm text-foreground">{artist.specialization}</span>
                </div>
              </div>
              <div className="glass-card px-5 py-3 flex items-center gap-3">
                <Award size={18} className={accent === "secondary" ? "text-secondary" : "text-primary"} />
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-muted-foreground block">Experience</span>
                  <span className="text-sm text-foreground">{artist.experience}</span>
                </div>
              </div>
            </div>

            <p className="text-foreground/80 leading-relaxed mt-6">{artist.bio}</p>

            <div className="flex flex-wrap gap-3 mt-8">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-muted px-4 py-2.5 rounded-lg text-sm text-foreground hover:bg-muted/70 transition-colors"
                >
                  {s.icon} {s.label}
                </a>
              ))}
            </div>

            <Link
              href="/contact"
              className={`inline-flex items-center justify-center gap-2 mt-8 px-8 py-3.5 rounded-lg font-medium text-sm tracking-wide hover:opacity-90 transition-opacity ${
                accent === "secondary"
                  ? "bg-secondary text-secondary-foreground rose-glow"
                  : "bg-primary text-primary-foreground gold-glow"
              }`}
            >
              Contact {artist.name} <ArrowRight size={16} />
            </Link>
          </SectionReveal>
        </div>

        {/* Portfolio */}
        {works.length > 0 && (
          <div className="mt-20">
            <SectionReveal>
              <h2 className="font-display text-3xl md:text-4xl tracking-wider text-foreground mb-8">
                Portfolio
              </h2>
            </SectionReveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {works.map((p, i) => (
                <SectionReveal key={p.id} delay={i * 0.08}>
                  <Link href={`/project/${p.slug}`} className="group block rounded-xl overflow-hidden hover-lift">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={p.coverImage}
                        alt={p.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="p-3">
                      <span className="text-xs uppercase tracking-widest text-muted-foreground">{p.category}</span>
                      <p className="text-sm text-foreground">{p.title}</p>
                    </div>
                  </Link>
                </SectionReveal>
              ))}
            </div>
          </div>
        )}
      </section>
    </Layout>
  );
};

export default ArtistProfile;

"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import PortfolioCard from "@/components/PortfolioCard";
import Marquee from "@/components/Marquee";
import StatsSection from "@/components/StatsSection";
import AboutArtists from "@/components/AboutArtists";
import ProcessTimeline from "@/components/ProcessTimeline";
import TikTokEmbed from "@/components/TikTokEmbed";
import { useStore, useSettings, useTestimonials } from "@/lib/store";

const heroImages = {
  heroTattoo: "/assets/hero-tattoo.jpg",
  heroNails: "/assets/hero-nails.jpg",
};

const Index = () => {
  const { data } = useStore();
  const settings = useSettings();
  const testimonials = useTestimonials();

  const published = (data?.projects ?? []).filter((p) => p.status === "published");
  const featured = settings
    ? settings.featuredProjectIds
        .map((id) => published.find((p) => p.id === id))
        .filter(Boolean)
        .slice(0, 4)
    : [];
  const featuredWork = (featured.length ? featured : published.slice(0, 4)) as typeof published;

  const tiktokVideos = published.filter((p) => p.tiktokUrl).slice(0, 4);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-1 md:grid-cols-2">
          <div className="relative overflow-hidden">
            <motion.img
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              src={heroImages.heroTattoo}
              alt="Tattoo art"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/60" />
          </div>
          <div className="relative overflow-hidden hidden md:block">
            <motion.img
              initial={{ scale: 1.15, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
              src={heroImages.heroNails}
              alt="Nail art"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-background/60" />
          </div>
        </div>

        <div className="absolute left-1/2 top-0 bottom-0 w-px bg-primary/30 hidden md:block" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 w-full text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6"
            >
              <Sparkles size={14} className="text-primary" />
              <span className="text-xs uppercase tracking-widest text-primary font-medium">
                {settings?.heroEyebrow ?? "Now Booking 2026"}
              </span>
            </motion.div>
            <h1 className="font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl tracking-wider text-foreground leading-none">
              {settings?.heroLineOne ?? "ART ON"}{" "}
              <span className="text-gradient-gold">{settings?.heroLineOneAccent ?? "SKIN"}</span>
              <br />
              {settings?.heroLineTwo ?? "ART ON"}{" "}
              <span className="text-gradient-rose">{settings?.heroLineTwoAccent ?? "NAILS"}</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg md:text-xl max-w-md mx-auto font-light">
              {settings?.heroSubtitle ?? "Where ink meets elegance — a creative studio for the bold and beautiful."}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/tattoo"
              className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-lg font-medium text-sm tracking-wide hover:opacity-90 transition-opacity gold-glow"
            >
              View Tattoo Work <ArrowRight size={16} />
            </Link>
            <Link
              href="/nails"
              className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-lg font-medium text-sm tracking-wide hover:opacity-90 transition-opacity rose-glow"
            >
              View Nail Art <ArrowRight size={16} />
            </Link>
            <Link
              href="/booking"
              className="inline-flex items-center justify-center gap-2 border border-border text-foreground px-8 py-3.5 rounded-lg font-medium text-sm tracking-wide hover:bg-muted transition-colors"
            >
              Book Now
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
        >
          <div className="w-5 h-8 border-2 border-muted-foreground/40 rounded-full flex items-start justify-center pt-1.5">
            <div className="w-1 h-2 bg-muted-foreground/60 rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* Marquee */}
      <Marquee />

      {/* Stats */}
      <StatsSection />

      {/* Featured Work */}
      <section className="section-padding max-w-7xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-5xl tracking-wider text-foreground">
              Featured <span className="text-primary">Work</span>
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              A curated selection of our latest tattoo and nail art projects.
            </p>
          </div>
        </SectionReveal>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featuredWork.map((item, i) => (
            <PortfolioCard
              key={item.id}
              image={item.coverImage}
              title={item.title}
              category={item.category}
              index={i}
              to={`/project/${item.slug}`}
            />
          ))}
        </div>
      </section>

      {/* About Artists */}
      <AboutArtists />

      {/* Process */}
      <ProcessTimeline />

      {/* Video Section */}
      {tiktokVideos.length > 0 && (
        <section className="section-padding bg-card">
          <div className="max-w-7xl mx-auto">
            <SectionReveal>
              <div className="text-center mb-12">
                <h2 className="font-display text-4xl md:text-5xl tracking-wider text-foreground">
                  Watch Us <span className="text-secondary">Create</span>
                </h2>
                <p className="mt-3 text-muted-foreground">Follow our process on TikTok & Instagram</p>
              </div>
            </SectionReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 justify-items-center">
              {tiktokVideos.map((p, i) => (
                <SectionReveal key={p.id} delay={i * 0.1} className="w-full">
                  <TikTokEmbed url={p.tiktokUrl!} className="w-full" />
                </SectionReveal>
              ))}
            </div>
            {settings?.social.tiktok && (
              <div className="text-center mt-8">
                <a
                  href={settings.social.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-2"
                >
                  Watch More on TikTok <ArrowRight size={14} />
                </a>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Testimonials */}
      {testimonials.length > 0 && (
        <section className="section-padding max-w-7xl mx-auto">
          <SectionReveal>
            <div className="text-center mb-12">
              <h2 className="font-display text-4xl md:text-5xl tracking-wider text-foreground">
                What They <span className="text-primary">Say</span>
              </h2>
            </div>
          </SectionReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <SectionReveal key={t.id} delay={i * 0.15}>
                <div className="glass-card p-6 md:p-8">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-4 font-serif italic">"{t.text}"</p>
                  <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">— {t.name}</span>
                </div>
              </SectionReveal>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="section-padding bg-card">
        <SectionReveal>
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="font-display text-4xl md:text-6xl tracking-wider text-foreground">
              Ready to Get <span className="text-gradient-gold">Inked</span> or{" "}
              <span className="text-gradient-rose">Styled</span>?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Book your session today and let's create something beautiful together.
            </p>
            <Link
              href="/booking"
              className="inline-flex items-center gap-2 mt-8 bg-primary text-primary-foreground px-10 py-4 rounded-lg font-medium tracking-wide hover:opacity-90 transition-opacity gold-glow"
            >
              Book Your Session <ArrowRight size={16} />
            </Link>
          </div>
        </SectionReveal>
      </section>
    </Layout>
  );
};

export default Index;

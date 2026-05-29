"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import PortfolioCard from "@/components/PortfolioCard";
import TikTokEmbed from "@/components/TikTokEmbed";
import { useProjects, useSettings } from "@/lib/store";

const TattooPortfolio = () => {
  const projects = useProjects("tattoo");
  const settings = useSettings();
  const [active, setActive] = useState("All");

  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ["All", ...Array.from(set)];
  }, [projects]);

  const filtered = active === "All" ? projects : projects.filter((w) => w.category === active);

  const processVideos = projects.filter((p) => p.tiktokUrl).slice(0, 3);

  return (
    <Layout>
      {/* Header */}
      <section className="section-padding max-w-7xl mx-auto text-center">
        <SectionReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Portfolio</span>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mt-3">
            Tattoo <span className="text-gradient-gold">Art</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Every piece tells a story. Browse our collection of custom tattoo designs crafted with precision and passion.
          </p>
        </SectionReveal>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-medium transition-all ${
                active === cat
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Grid */}
      <section className="px-5 md:px-8 lg:px-16 pb-16 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No projects in this category yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {filtered.map((item, i) => (
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
        )}
      </section>

      {/* Video Section */}
      {processVideos.length > 0 && (
        <section className="section-padding bg-card">
          <div className="max-w-7xl mx-auto text-center">
            <SectionReveal>
              <h2 className="font-display text-3xl md:text-5xl tracking-wider text-foreground mb-8">
                Process <span className="text-primary">Videos</span>
              </h2>
            </SectionReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto justify-items-center">
              {processVideos.map((p) => (
                <TikTokEmbed key={p.id} url={p.tiktokUrl!} className="w-full max-w-xs" />
              ))}
            </div>
            {settings?.social.tiktok && (
              <a
                href={settings.social.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-2 mt-6"
              >
                Watch More on TikTok <ArrowRight size={14} />
              </a>
            )}
          </div>
        </section>
      )}

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Link
          href="/booking"
          className="bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium gold-glow shadow-lg"
        >
          Book Now
        </Link>
      </div>
    </Layout>
  );
};

export default TattooPortfolio;

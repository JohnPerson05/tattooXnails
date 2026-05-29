"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import PortfolioCard from "@/components/PortfolioCard";
import BeforeAfterSlider from "@/components/BeforeAfterSlider";
import TikTokEmbed from "@/components/TikTokEmbed";
import { useProjects, useSettings } from "@/lib/store";

const nailSample1 = "/assets/nail-sample-1.jpg";
const nailsBeforeAfter = "/assets/nails-before-after.jpg";

const pricingPreview = [
  { service: "Gel Extensions — Full Set", price: "From $65" },
  { service: "Acrylic Extensions", price: "From $55" },
  { service: "3D Nail Art Add-on", price: "From $15" },
  { service: "Gel Manicure", price: "From $35" },
  { service: "Custom Design Set", price: "From $85" },
];

const NailArt = () => {
  const projects = useProjects("nails");
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
      <section className="section-padding max-w-7xl mx-auto text-center">
        <SectionReveal>
          <span className="text-xs uppercase tracking-[0.3em] text-secondary font-medium">Portfolio</span>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mt-3">
            Nail <span className="text-gradient-rose">Art</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            From elegant classics to bold artistic sets — every nail is a tiny canvas.
          </p>
        </SectionReveal>

        <div className="flex flex-wrap justify-center gap-2 mt-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-4 py-2 rounded-lg text-xs uppercase tracking-wider font-medium transition-all ${
                active === cat
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="px-5 md:px-8 lg:px-16 pb-16 max-w-7xl mx-auto">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No sets in this category yet.</p>
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

      {/* Before & After */}
      <section className="section-padding max-w-4xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-10">
            <h2 className="font-display text-3xl md:text-5xl tracking-wider text-foreground">
              Before <span className="text-secondary">&</span> After
            </h2>
            <p className="mt-3 text-muted-foreground text-sm">Drag the slider to see the transformation</p>
          </div>
        </SectionReveal>
        <BeforeAfterSlider
          beforeImage={nailSample1}
          afterImage={nailsBeforeAfter}
          beforeLabel="Before"
          afterLabel="After"
        />
      </section>

      {/* Video */}
      {processVideos.length > 0 && (
        <section className="section-padding bg-card">
          <div className="max-w-7xl mx-auto text-center">
            <SectionReveal>
              <h2 className="font-display text-3xl md:text-5xl tracking-wider text-foreground mb-8">
                See the <span className="text-secondary">Process</span>
              </h2>
            </SectionReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto justify-items-center">
              {processVideos.map((p) => (
                <TikTokEmbed key={p.id} url={p.tiktokUrl!} className="w-full max-w-xs" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Preview */}
      <section className="section-padding max-w-3xl mx-auto">
        <SectionReveal>
          <h2 className="font-display text-3xl md:text-5xl tracking-wider text-foreground text-center mb-10">
            Pricing <span className="text-primary">Preview</span>
          </h2>
        </SectionReveal>
        <div className="space-y-3">
          {pricingPreview.map((p, i) => (
            <SectionReveal key={p.service} delay={i * 0.08}>
              <div className="glass-card px-6 py-4 flex items-center justify-between">
                <span className="text-foreground text-sm">{p.service}</span>
                <span className="text-primary font-medium text-sm">{p.price}</span>
              </div>
            </SectionReveal>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 bg-secondary text-secondary-foreground px-8 py-3.5 rounded-lg font-medium text-sm tracking-wide hover:opacity-90 transition-opacity rose-glow"
          >
            Book Your Set <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        <Link
          href="/booking"
          className="bg-secondary text-secondary-foreground px-6 py-3 rounded-full text-sm font-medium rose-glow shadow-lg"
        >
          Book Now
        </Link>
      </div>
    </Layout>
  );
};

export default NailArt;

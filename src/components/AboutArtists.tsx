"use client";
import { motion } from "framer-motion";
import { ArrowRight, Instagram } from "lucide-react";
import Link from "next/link";
import SectionReveal from "./SectionReveal";
import { useArtists } from "@/lib/store";

const AboutArtists = () => {
  const artists = useArtists();

  return (
    <section id="about" className="section-padding max-w-7xl mx-auto">
      <SectionReveal>
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">The Artists</span>
          <h2 className="font-display text-4xl md:text-6xl tracking-wider text-foreground mt-3">
            Meet the <span className="text-gradient-gold">Creatives</span>
          </h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Two artists, one studio. Passion meets precision.
          </p>
        </div>
      </SectionReveal>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {artists.map((artist, i) => {
          const accent = artist.discipline === "nails" ? "secondary" : "primary";
          return (
            <SectionReveal key={artist.id} delay={i * 0.2}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.3 }} className="glass-card overflow-hidden group">
                <Link href={`/artist/${artist.slug}`} className="block aspect-[4/3] overflow-hidden">
                  <img
                    src={artist.photo}
                    alt={artist.name}
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  />
                </Link>
                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <Link href={`/artist/${artist.slug}`}>
                        <h3 className="font-display text-3xl tracking-wider text-foreground hover:opacity-80 transition-opacity">
                          {artist.name}
                        </h3>
                      </Link>
                      <span
                        className={`text-xs uppercase tracking-widest font-medium ${
                          accent === "primary" ? "text-primary" : "text-secondary"
                        }`}
                      >
                        {artist.role}
                      </span>
                    </div>
                    {artist.social.instagram && (
                      <a
                        href={artist.social.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                          accent === "primary"
                            ? "bg-primary/10 text-primary hover:bg-primary/20"
                            : "bg-secondary/10 text-secondary hover:bg-secondary/20"
                        }`}
                      >
                        <Instagram size={18} />
                      </a>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{artist.bio}</p>
                  <Link
                    href={`/artist/${artist.slug}`}
                    className={`inline-flex items-center gap-2 mt-5 text-sm font-medium ${
                      accent === "primary" ? "text-primary" : "text-secondary"
                    } hover:gap-3 transition-all`}
                  >
                    View Profile <ArrowRight size={14} />
                  </Link>
                </div>
              </motion.div>
            </SectionReveal>
          );
        })}
      </div>
    </section>
  );
};

export default AboutArtists;

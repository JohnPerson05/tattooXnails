"use client";
import { motion } from "framer-motion";
import SectionReveal from "./SectionReveal";

const stats = [
  { value: "500+", label: "Tattoos Done" },
  { value: "1.2K+", label: "Nail Sets Created" },
  { value: "4.9★", label: "Average Rating" },
  { value: "3+", label: "Years Experience" },
];

const StatsSection = () => (
  <section className="section-padding bg-card">
    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
      {stats.map((s, i) => (
        <SectionReveal key={s.label} delay={i * 0.1}>
          <div className="text-center">
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="font-display text-4xl md:text-5xl text-primary block"
            >
              {s.value}
            </motion.span>
            <span className="text-muted-foreground text-xs uppercase tracking-widest mt-2 block">{s.label}</span>
          </div>
        </SectionReveal>
      ))}
    </div>
  </section>
);

export default StatsSection;

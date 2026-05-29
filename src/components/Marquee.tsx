"use client";
import { motion } from "framer-motion";

const items = [
  "Fine Line Tattoo", "Gel Extensions", "3D Nail Art", "Custom Ink", "French Tips",
  "Minimal Tattoo", "Acrylic Sets", "Sacred Geometry", "Ombré Nails", "Botanical Art",
];

const Marquee = () => (
  <div className="overflow-hidden py-6 bg-card border-y border-border/30">
    <motion.div
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="flex gap-8 whitespace-nowrap"
    >
      {[...items, ...items].map((item, i) => (
        <span key={i} className="font-display text-2xl md:text-3xl tracking-wider text-muted-foreground/40 flex items-center gap-8">
          {item}
          <span className="w-2 h-2 rounded-full bg-primary/40" />
        </span>
      ))}
    </motion.div>
  </div>
);

export default Marquee;

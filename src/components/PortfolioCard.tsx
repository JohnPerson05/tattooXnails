"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

interface Props {
  image: string;
  title: string;
  category: string;
  index?: number;
  /** When provided, the card navigates to this route instead of opening a lightbox. */
  to?: string;
}

const PortfolioCard = ({ image, title, category, index = 0, to }: Props) => {
  const [lightbox, setLightbox] = useState(false);

  const inner = (
    <>
      <div className="aspect-square overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <span className="text-xs uppercase tracking-widest text-primary font-medium">{category}</span>
        <span className="text-sm font-medium text-foreground mt-1">{title}</span>
      </div>
    </>
  );

  if (to) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-xl cursor-pointer hover-lift"
      >
        <Link href={to} className="block">
          {inner}
        </Link>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
        onClick={() => setLightbox(true)}
        className="group relative overflow-hidden rounded-xl cursor-pointer hover-lift"
      >
        {inner}
      </motion.div>

      {lightbox && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={() => setLightbox(false)}
        >
          <button className="absolute top-6 right-6 text-foreground hover:text-primary transition-colors">
            <X size={28} />
          </button>
          <img src={image} alt={title} className="max-w-full max-h-[85vh] object-contain rounded-lg" />
        </motion.div>
      )}
    </>
  );
};

export default PortfolioCard;

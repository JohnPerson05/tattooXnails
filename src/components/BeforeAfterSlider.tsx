"use client";
import { useState, useRef } from "react";
import { motion } from "framer-motion";

interface Props {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}

const BeforeAfterSlider = ({ beforeImage, afterImage, beforeLabel = "Before", afterLabel = "After" }: Props) => {
  const [position, setPosition] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);

  const updatePosition = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    updatePosition(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (dragging.current) updatePosition(e.clientX);
  };

  const handlePointerUp = () => {
    dragging.current = false;
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="relative w-full aspect-[2/1] rounded-xl overflow-hidden cursor-col-resize select-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {/* After (full) */}
      <img src={afterImage} alt={afterLabel} className="absolute inset-0 w-full h-full object-cover" />

      {/* Before (clipped) */}
      <div className="absolute inset-0 overflow-hidden" style={{ width: `${position}%` }}>
        <img src={beforeImage} alt={beforeLabel} className="absolute inset-0 w-full h-full object-cover" style={{ width: `${containerRef.current ? containerRef.current.offsetWidth : 100}px`, maxWidth: 'none' }} />
      </div>

      {/* Divider */}
      <div className="absolute top-0 bottom-0 w-0.5 bg-foreground/80" style={{ left: `${position}%` }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-foreground/90 flex items-center justify-center shadow-lg">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7 4L3 10L7 16" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M13 4L17 10L13 16" stroke="hsl(var(--background))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 text-xs uppercase tracking-widest font-medium bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-foreground">{beforeLabel}</span>
      <span className="absolute top-4 right-4 text-xs uppercase tracking-widest font-medium bg-background/70 backdrop-blur-sm px-3 py-1 rounded-full text-foreground">{afterLabel}</span>
    </motion.div>
  );
};

export default BeforeAfterSlider;

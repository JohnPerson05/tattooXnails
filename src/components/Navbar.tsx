"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/tattoo", label: "Tattoo" },
  { to: "/nails", label: "Nail Art" },
  { to: "/#about", label: "About" },
  { to: "/contact", label: "Contact" },
  { to: "/booking", label: "Book Now" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (to: string) => {
    setOpen(false);
    if (to.includes("#")) {
      const hash = to.split("#")[1];
      const basePath = to.split("#")[0] || "/";
      if (pathname === basePath) {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(basePath);
      }
    }
  };

  const isActive = (to: string) => {
    if (to.includes("#")) return false;
    return pathname === to;
  };

  const getLinkTo = (to: string) => {
    if (to.includes("#")) {
      const [basePath] = to.split("#");
      return basePath || "/";
    }
    return to;
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/30">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-5 md:px-8 h-16 md:h-20">
        <Link href="/" className="font-display text-lg md:text-2xl tracking-wider text-foreground leading-tight">
          Owshie Tattoo<span className="text-primary"> x </span>Celeste Nail
        </Link>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              href={getLinkTo(link.to)}
              onClick={() => handleNavClick(link.to)}
              className={`text-sm font-medium tracking-wide uppercase transition-colors duration-200 ${
                isActive(link.to) ? "text-primary" : "text-muted-foreground hover:text-foreground"
              } ${link.label === "Book Now" ? "bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:opacity-90" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border/30 overflow-hidden"
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  href={getLinkTo(link.to)}
                  onClick={() => handleNavClick(link.to)}
                  className={`text-lg font-display tracking-wider py-3 px-3 rounded-lg transition-colors ${
                    isActive(link.to) ? "text-primary bg-muted" : "text-foreground hover:bg-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

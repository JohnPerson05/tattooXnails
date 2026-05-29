"use client";
import Link from "next/link";
import { Instagram, Facebook } from "lucide-react";
import { useSettings } from "@/lib/store";

const TikTokIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.23 8.23 0 0 0 4.76 1.52V6.87a4.84 4.84 0 0 1-1-.18Z"/>
  </svg>
);

const Footer = () => {
  const settings = useSettings();
  const socials = [
    settings?.social.instagram && { icon: <Instagram size={20} />, href: settings.social.instagram, label: "Instagram" },
    settings?.social.tiktok && { icon: <TikTokIcon />, href: settings.social.tiktok, label: "TikTok" },
    settings?.social.facebook && { icon: <Facebook size={20} />, href: settings.social.facebook, label: "Facebook" },
  ].filter(Boolean) as { icon: JSX.Element; href: string; label: string }[];

  return (
    <footer className="bg-card border-t border-border/30">
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-display text-xl tracking-wider text-foreground mb-4">
              Owshie Tattoo<span className="text-primary"> x </span>Celeste Nail
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Where ink meets elegance. A creative studio blending bold tattoo artistry with refined nail design.
            </p>
          </div>
          <div>
            <h4 className="font-display text-lg tracking-wider text-foreground mb-4">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[
                { to: "/tattoo", label: "Tattoo Portfolio" },
                { to: "/nails", label: "Nail Art" },
                { to: "/contact", label: "Contact" },
                { to: "/booking", label: "Book Appointment" },
              ].map((l) => (
                <Link key={l.to} href={l.to} className="text-muted-foreground text-sm hover:text-primary transition-colors">
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-display text-lg tracking-wider text-foreground mb-4">Follow Us</h4>
            <div className="flex gap-4">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-muted/80 transition-colors"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/30 flex flex-col sm:flex-row items-center justify-between gap-3 text-muted-foreground text-xs">
          <span>© 2026 Owshie Tattoo x Celeste Nail. All rights reserved.</span>
          <Link href="/admin" className="hover:text-primary transition-colors">Admin</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

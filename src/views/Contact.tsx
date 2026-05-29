"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Facebook, Instagram, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import { useStore, useSettings } from "@/lib/store";
import { toast } from "sonner";

const TikTokIcon = ({ size = 18 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={size} height={size}>
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.88-2.88 2.89 2.89 0 0 1 2.88-2.88c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 0 0-.79-.05A6.34 6.34 0 0 0 3.15 15a6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.8a8.23 8.23 0 0 0 4.76 1.52V6.87a4.84 4.84 0 0 1-1-.18Z" />
  </svg>
);

const SERVICE_TYPES = [
  "Fine Line Tattoo",
  "Black & Grey Tattoo",
  "Custom Tattoo Design",
  "Gel Extensions",
  "Acrylic Extensions",
  "3D Nail Design",
  "Custom Nail Set",
  "General Inquiry",
];

const Contact = () => {
  const { createInquiry } = useStore();
  const settings = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    contact: "",
    serviceType: SERVICE_TYPES[0],
    message: "",
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createInquiry(form);
      setSubmitted(true);
      toast.success("Inquiry sent! We'll be in touch soon.");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const channels = [
    settings?.social.instagram && {
      icon: <Instagram size={20} />,
      label: "Instagram DM",
      sub: "Send us a message",
      href: settings.social.instagram,
    },
    settings?.social.tiktok && {
      icon: <TikTokIcon size={20} />,
      label: "TikTok",
      sub: "Watch & message",
      href: settings.social.tiktok,
    },
    settings?.social.facebook && {
      icon: <Facebook size={20} />,
      label: "Facebook Messenger",
      sub: "Chat with us",
      href: settings.social.facebook,
    },
    settings?.social.whatsapp && {
      icon: <MessageCircle size={20} />,
      label: "WhatsApp",
      sub: "Quick chat",
      href: settings.social.whatsapp,
    },
  ].filter(Boolean) as { icon: JSX.Element; label: string; sub: string; href: string }[];

  return (
    <Layout>
      <section className="section-padding max-w-6xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Get In Touch</span>
            <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mt-3">
              Contact <span className="text-gradient-gold">Us</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Send an inquiry or reach us directly. We respond within 24 hours.
            </p>
          </div>
        </SectionReveal>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-3">
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 text-center h-full flex flex-col items-center justify-center"
              >
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Send size={24} className="text-primary" />
                </div>
                <h3 className="font-display text-2xl tracking-wider text-foreground">Inquiry Sent!</h3>
                <p className="text-muted-foreground mt-2 text-sm max-w-xs">
                  Thanks {form.name.split(" ")[0]}. We'll reach out within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setForm({ name: "", email: "", contact: "", serviceType: SERVICE_TYPES[0], message: "" });
                  }}
                  className="mt-6 text-primary text-sm hover:underline"
                >
                  Send another
                </button>
              </motion.div>
            ) : (
              <SectionReveal>
                <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                      <input
                        required
                        value={form.name}
                        onChange={update("name")}
                        placeholder="Your name"
                        className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={update("email")}
                        placeholder="you@email.com"
                        className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Contact Number</label>
                      <input
                        value={form.contact}
                        onChange={update("contact")}
                        placeholder="Phone (optional)"
                        className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Service Type</label>
                      <select
                        value={form.serviceType}
                        onChange={update("serviceType")}
                        className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        {SERVICE_TYPES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={form.message}
                      onChange={update("message")}
                      placeholder="Tell us about your idea..."
                      className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3.5 rounded-lg font-medium text-sm tracking-wide transition-opacity hover:opacity-90 bg-primary text-primary-foreground gold-glow disabled:opacity-60 inline-flex items-center justify-center gap-2"
                  >
                    {submitting ? "Sending..." : "Send Inquiry"} <Send size={15} />
                  </button>
                </form>
              </SectionReveal>
            )}
          </div>

          {/* Direct channels */}
          <div className="lg:col-span-2 space-y-4">
            <SectionReveal delay={0.1}>
              <div className="glass-card p-6 space-y-4">
                <h3 className="font-display text-xl tracking-wider text-foreground">Studio</h3>
                {settings?.studioLocation && (
                  <div className="flex items-start gap-3 text-sm text-muted-foreground">
                    <MapPin size={16} className="text-primary mt-0.5" /> {settings.studioLocation}
                  </div>
                )}
                {settings?.contactPhone && (
                  <a href={`tel:${settings.contactPhone}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                    <Phone size={16} className="text-primary" /> {settings.contactPhone}
                  </a>
                )}
                {settings?.contactEmail && (
                  <a href={`mailto:${settings.contactEmail}`} className="flex items-center gap-3 text-sm text-muted-foreground hover:text-foreground">
                    <Mail size={16} className="text-primary" /> {settings.contactEmail}
                  </a>
                )}
              </div>
            </SectionReveal>

            {channels.map((c, i) => (
              <SectionReveal key={c.label} delay={0.15 + i * 0.05}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-card p-5 flex items-center gap-4 hover-lift"
                >
                  <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center text-primary">
                    {c.icon}
                  </div>
                  <div>
                    <span className="text-foreground text-sm font-medium block">{c.label}</span>
                    <span className="text-muted-foreground text-xs">{c.sub}</span>
                  </div>
                </a>
              </SectionReveal>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;

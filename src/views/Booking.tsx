"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MessageCircle } from "lucide-react";
import Layout from "@/components/Layout";
import SectionReveal from "@/components/SectionReveal";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const Booking = () => {
  const { createInquiry } = useStore();
  const [service, setService] = useState<"tattoo" | "nails">("tattoo");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    style: "Fine Line",
    date: "",
    message: "",
  });

  const set = (key: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createInquiry({
        name: form.name,
        email: form.contact.includes("@") ? form.contact : "",
        contact: form.contact,
        serviceType: `${service === "tattoo" ? "Tattoo" : "Nail Art"} — ${form.style}`,
        message: `${form.message}${form.date ? `\n\nPreferred date: ${form.date}` : ""}`,
      });
      setSubmitted(true);
      toast.success("Booking request sent!");
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <section className="section-padding max-w-3xl mx-auto">
        <SectionReveal>
          <div className="text-center mb-12">
            <span className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Appointments</span>
            <h1 className="font-display text-5xl md:text-7xl tracking-wider text-foreground mt-3">
              Book Your <span className="text-gradient-gold">Session</span>
            </h1>
            <p className="mt-4 text-muted-foreground max-w-md mx-auto">
              Fill in the form below and we'll get back to you within 24 hours.
            </p>
          </div>
        </SectionReveal>

        {/* Service Toggle */}
        <SectionReveal delay={0.1}>
          <div className="flex justify-center mb-10">
            <div className="bg-muted rounded-lg p-1 flex gap-1">
              <button
                onClick={() => {
                  setService("tattoo");
                  setForm((f) => ({ ...f, style: "Fine Line" }));
                }}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                  service === "tattoo"
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                🎨 Tattoo
              </button>
              <button
                onClick={() => {
                  setService("nails");
                  setForm((f) => ({ ...f, style: "Gel Extensions" }));
                }}
                className={`px-6 py-2.5 rounded-md text-sm font-medium transition-all ${
                  service === "nails"
                    ? "bg-secondary text-secondary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                💅 Nail Art
              </button>
            </div>
          </div>
        </SectionReveal>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-10 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
              <Send size={24} className="text-primary" />
            </div>
            <h3 className="font-display text-2xl tracking-wider text-foreground">Request Sent!</h3>
            <p className="text-muted-foreground mt-2 text-sm">
              We'll reach out within 24 hours to confirm your appointment.
            </p>
          </motion.div>
        ) : (
          <SectionReveal delay={0.2}>
            <form onSubmit={handleSubmit} className="glass-card p-6 md:p-10 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Name</label>
                  <input
                    required
                    type="text"
                    value={form.name}
                    onChange={set("name")}
                    placeholder="Your name"
                    className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Contact</label>
                  <input
                    required
                    type="text"
                    value={form.contact}
                    onChange={set("contact")}
                    placeholder="Phone or email"
                    className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>

              {service === "tattoo" ? (
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Tattoo Style</label>
                  <select
                    value={form.style}
                    onChange={set("style")}
                    className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    <option>Fine Line</option>
                    <option>Black & Grey</option>
                    <option>Minimalist</option>
                    <option>Traditional</option>
                    <option>Geometric</option>
                    <option>Custom Design</option>
                  </select>
                </div>
              ) : (
                <div>
                  <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Nail Service</label>
                  <select
                    value={form.style}
                    onChange={set("style")}
                    className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50"
                  >
                    <option>Gel Extensions</option>
                    <option>Acrylic Extensions</option>
                    <option>3D Nail Design</option>
                    <option>French Variations</option>
                    <option>Custom Sets</option>
                    <option>Gel Manicure</option>
                  </select>
                </div>
              )}

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Preferred Date</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={set("date")}
                  className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div>
                <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Message (optional)</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={set("message")}
                  placeholder="Tell us about your idea..."
                  className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className={`w-full py-3.5 rounded-lg font-medium text-sm tracking-wide transition-opacity hover:opacity-90 disabled:opacity-60 ${
                  service === "tattoo"
                    ? "bg-primary text-primary-foreground gold-glow"
                    : "bg-secondary text-secondary-foreground rose-glow"
                }`}
              >
                {submitting ? "Sending..." : "Send Booking Request"}
              </button>
            </form>
          </SectionReveal>
        )}

        {/* Quick contact */}
        <SectionReveal delay={0.3}>
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="https://wa.me/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 flex items-center gap-4 hover-lift"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <MessageCircle size={20} className="text-primary" />
              </div>
              <div>
                <span className="text-foreground text-sm font-medium block">WhatsApp</span>
                <span className="text-muted-foreground text-xs">Quick chat</span>
              </div>
            </a>
            <a
              href="https://instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="glass-card p-5 flex items-center gap-4 hover-lift"
            >
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <Send size={20} className="text-secondary" />
              </div>
              <div>
                <span className="text-foreground text-sm font-medium block">Instagram DM</span>
                <span className="text-muted-foreground text-xs">Send us a message</span>
              </div>
            </a>
          </div>
        </SectionReveal>
      </section>
    </Layout>
  );
};

export default Booking;

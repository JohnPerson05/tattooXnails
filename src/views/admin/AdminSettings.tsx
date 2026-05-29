"use client";
import { useEffect, useState } from "react";
import { Plus, Save, Trash2, Star } from "lucide-react";
import { useStore } from "@/lib/store";
import type { SiteSettings } from "@/lib/types";
import { toast } from "sonner";

const labelCls = "text-xs uppercase tracking-wider text-muted-foreground mb-2 block";
const inputCls =
  "w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40";

const AdminSettings = () => {
  const { data, updateSettings, createTestimonial, deleteTestimonial } = useStore();

  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [newT, setNewT] = useState({ name: "", text: "", rating: 5 });

  useEffect(() => {
    if (data?.settings && !form) setForm(data.settings);
  }, [data, form]);

  if (!form) return null;

  const set = <K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const setSocial = (key: keyof SiteSettings["social"], value: string) =>
    setForm((f) => (f ? { ...f, social: { ...f.social, [key]: value } } : f));

  const toggleFeatured = (id: string) => {
    setForm((f) => {
      if (!f) return f;
      const exists = f.featuredProjectIds.includes(id);
      const next = exists
        ? f.featuredProjectIds.filter((p) => p !== id)
        : [...f.featuredProjectIds, id].slice(0, 8);
      return { ...f, featuredProjectIds: next };
    });
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateSettings(form);
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const addTestimonial = async () => {
    if (!newT.name || !newT.text) {
      toast.error("Name and text are required");
      return;
    }
    await createTestimonial(newT);
    setNewT({ name: "", text: "", rating: 5 });
    toast.success("Testimonial added");
  };

  const published = (data?.projects ?? []).filter((p) => p.status === "published");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">Settings</h1>
          <p className="text-muted-foreground text-sm mt-1">Homepage content, social links & testimonials</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          <Save size={16} /> {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      <div className="space-y-6">
        {/* Hero */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display text-xl tracking-wider text-foreground">Hero Section</h2>
          <div>
            <label className={labelCls}>Eyebrow Badge</label>
            <input value={form.heroEyebrow} onChange={(e) => set("heroEyebrow", e.target.value)} className={inputCls} />
          </div>
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Line 1 Text</label>
              <input value={form.heroLineOne} onChange={(e) => set("heroLineOne", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Line 1 Accent (gold)</label>
              <input value={form.heroLineOneAccent} onChange={(e) => set("heroLineOneAccent", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Line 2 Text</label>
              <input value={form.heroLineTwo} onChange={(e) => set("heroLineTwo", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Line 2 Accent (rose)</label>
              <input value={form.heroLineTwoAccent} onChange={(e) => set("heroLineTwoAccent", e.target.value)} className={inputCls} />
            </div>
          </div>
          <div>
            <label className={labelCls}>Subtitle</label>
            <textarea
              rows={2}
              value={form.heroSubtitle}
              onChange={(e) => set("heroSubtitle", e.target.value)}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>

        {/* Featured projects */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl tracking-wider text-foreground mb-1">Featured Projects</h2>
          <p className="text-xs text-muted-foreground mb-4">
            Select up to 8 projects to feature on the homepage ({form.featuredProjectIds.length} selected).
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {published.map((p) => {
              const active = form.featuredProjectIds.includes(p.id);
              return (
                <button
                  key={p.id}
                  onClick={() => toggleFeatured(p.id)}
                  className={`relative rounded-lg overflow-hidden aspect-square border-2 transition-all ${
                    active ? "border-primary" : "border-transparent opacity-60 hover:opacity-100"
                  }`}
                >
                  <img src={p.coverImage} alt={p.title} className="w-full h-full object-cover" />
                  {active && (
                    <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <Star size={11} className="fill-primary-foreground text-primary-foreground" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Contact & Social */}
        <div className="glass-card p-6 space-y-5">
          <h2 className="font-display text-xl tracking-wider text-foreground">Contact & Social</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelCls}>Contact Email</label>
              <input value={form.contactEmail} onChange={(e) => set("contactEmail", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Contact Phone</label>
              <input value={form.contactPhone} onChange={(e) => set("contactPhone", e.target.value)} className={inputCls} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelCls}>Studio Location</label>
              <input value={form.studioLocation} onChange={(e) => set("studioLocation", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Instagram</label>
              <input value={form.social.instagram ?? ""} onChange={(e) => setSocial("instagram", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>TikTok</label>
              <input value={form.social.tiktok ?? ""} onChange={(e) => setSocial("tiktok", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Facebook</label>
              <input value={form.social.facebook ?? ""} onChange={(e) => setSocial("facebook", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>WhatsApp</label>
              <input value={form.social.whatsapp ?? ""} onChange={(e) => setSocial("whatsapp", e.target.value)} className={inputCls} />
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="glass-card p-6">
          <h2 className="font-display text-xl tracking-wider text-foreground mb-4">Testimonials</h2>
          <div className="space-y-3 mb-5">
            {(data?.testimonials ?? []).map((t) => (
              <div key={t.id} className="flex items-start gap-3 bg-muted/50 rounded-lg p-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} size={11} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-sm text-foreground/80 italic">"{t.text}"</p>
                  <span className="text-xs text-muted-foreground">— {t.name}</span>
                </div>
                <button
                  onClick={() => deleteTestimonial(t.id)}
                  className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors flex-shrink-0"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-border/30 pt-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={newT.name}
                onChange={(e) => setNewT((t) => ({ ...t, name: e.target.value }))}
                placeholder="Client name"
                className={inputCls}
              />
              <select
                value={newT.rating}
                onChange={(e) => setNewT((t) => ({ ...t, rating: Number(e.target.value) }))}
                className={inputCls}
              >
                {[5, 4, 3, 2, 1].map((r) => (
                  <option key={r} value={r}>
                    {r} stars
                  </option>
                ))}
              </select>
              <button
                onClick={addTestimonial}
                className="inline-flex items-center justify-center gap-2 bg-muted text-foreground rounded-lg text-sm font-medium hover:bg-muted/70 transition-colors"
              >
                <Plus size={16} /> Add
              </button>
            </div>
            <textarea
              value={newT.text}
              onChange={(e) => setNewT((t) => ({ ...t, text: e.target.value }))}
              placeholder="Testimonial text..."
              rows={2}
              className={`${inputCls} resize-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

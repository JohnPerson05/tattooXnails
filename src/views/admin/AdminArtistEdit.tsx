"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useStore } from "@/lib/store";
import ImageInput from "@/components/admin/ImageInput";
import { slugify } from "@/lib/adapter";
import type { Artist, Discipline } from "@/lib/types";
import { toast } from "sonner";

const emptyArtist: Omit<Artist, "id" | "createdAt"> = {
  slug: "",
  name: "",
  role: "Tattoo Artist",
  discipline: "tattoo",
  photo: "",
  bio: "",
  specialization: "",
  experience: "",
  social: { instagram: "", tiktok: "", facebook: "", email: "" },
  featured: false,
};

const labelCls = "text-xs uppercase tracking-wider text-muted-foreground mb-2 block";
const inputCls =
  "w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40";

const AdminArtistEdit = ({ id }: { id?: string }) => {
  const isNew = !id;
  const router = useRouter();
  const { data, createArtist, updateArtist } = useStore();

  const [form, setForm] = useState<Omit<Artist, "id" | "createdAt">>(emptyArtist);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && data) {
      const existing = data.artists.find((a) => a.id === id);
      if (existing) {
        const { id: _id, createdAt: _c, ...rest } = existing;
        setForm(rest);
      }
    }
  }, [id, data]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const setSocial = (key: keyof Artist["social"], value: string) =>
    setForm((f) => ({ ...f, social: { ...f.social, [key]: value } }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.photo) {
      toast.error("A profile photo is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.name) };
      if (isNew) {
        await createArtist(payload);
        toast.success("Artist created");
      } else {
        await updateArtist(id!, payload);
        toast.success("Artist updated");
      }
      router.push("/admin/artists");
    } catch {
      toast.error("Failed to save artist");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/artists"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Artists
      </Link>

      <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground mb-6">
        {isNew ? "New Artist" : "Edit Artist"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card p-6 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="e.g. Owshie"
                  className={inputCls}
                />
              </div>
              <div>
                <label className={labelCls}>Role</label>
                <input
                  required
                  value={form.role}
                  onChange={(e) => set("role", e.target.value)}
                  placeholder="e.g. Tattoo Artist"
                  className={inputCls}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Discipline</label>
                <select
                  value={form.discipline}
                  onChange={(e) => set("discipline", e.target.value as Discipline)}
                  className={inputCls}
                >
                  <option value="tattoo">Tattoo</option>
                  <option value="nails">Nails</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Experience</label>
                <input
                  value={form.experience}
                  onChange={(e) => set("experience", e.target.value)}
                  placeholder="e.g. 5+ years"
                  className={inputCls}
                />
              </div>
            </div>

            <div>
              <label className={labelCls}>Specialization</label>
              <input
                value={form.specialization}
                onChange={(e) => set("specialization", e.target.value)}
                placeholder="e.g. Fine Line · Geometric · Minimalist"
                className={inputCls}
              />
            </div>

            <div>
              <label className={labelCls}>Biography</label>
              <textarea
                rows={5}
                value={form.bio}
                onChange={(e) => set("bio", e.target.value)}
                placeholder="Tell their story..."
                className={`${inputCls} resize-none`}
              />
            </div>
          </div>

          <div className="glass-card p-6 space-y-5">
            <h2 className="font-display text-lg tracking-wider text-foreground">Social Links</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Instagram</label>
                <input value={form.social.instagram ?? ""} onChange={(e) => setSocial("instagram", e.target.value)} placeholder="https://instagram.com/..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>TikTok</label>
                <input value={form.social.tiktok ?? ""} onChange={(e) => setSocial("tiktok", e.target.value)} placeholder="https://tiktok.com/@..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Facebook</label>
                <input value={form.social.facebook ?? ""} onChange={(e) => setSocial("facebook", e.target.value)} placeholder="https://facebook.com/..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Email</label>
                <input value={form.social.email ?? ""} onChange={(e) => setSocial("email", e.target.value)} placeholder="artist@email.com" className={inputCls} />
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-5">
          <div className="glass-card p-6">
            <ImageInput label="Profile Photo" value={form.photo} onChange={(v) => set("photo", v)} />
          </div>
          <div className="glass-card p-6 space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-foreground">Feature on homepage</span>
            </label>
            <div>
              <label className={labelCls}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => set("slug", slugify(e.target.value))}
                placeholder="auto-generated"
                className={inputCls}
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full py-3.5 rounded-lg font-medium text-sm tracking-wide bg-primary text-primary-foreground gold-glow hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            <Save size={16} /> {saving ? "Saving..." : isNew ? "Create Artist" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminArtistEdit;

"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, Save, Trash2 } from "lucide-react";
import { useStore } from "@/lib/store";
import ImageInput from "@/components/admin/ImageInput";
import { slugify } from "@/lib/adapter";
import {
  NAIL_CATEGORIES,
  TATTOO_CATEGORIES,
  type Discipline,
  type Project,
  type ProjectStatus,
} from "@/lib/types";
import { toast } from "sonner";

const emptyProject: Omit<Project, "id" | "createdAt"> = {
  slug: "",
  discipline: "tattoo",
  title: "",
  category: "Fine Line",
  coverImage: "",
  gallery: [],
  description: "",
  artistId: null,
  tiktokUrl: "",
  instagramUrl: "",
  videoUrl: "",
  dateCompleted: new Date().toISOString().slice(0, 10),
  status: "published",
  featured: false,
};

const labelCls = "text-xs uppercase tracking-wider text-muted-foreground mb-2 block";
const inputCls =
  "w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40";

const AdminProjectEdit = ({ id }: { id?: string }) => {
  const isNew = !id;
  const router = useRouter();
  const { data, createProject, updateProject } = useStore();

  const [form, setForm] = useState<Omit<Project, "id" | "createdAt">>(emptyProject);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (id && data) {
      const existing = data.projects.find((p) => p.id === id);
      if (existing) {
        const { id: _id, createdAt: _c, ...rest } = existing;
        setForm(rest);
      }
    }
  }, [id, data]);

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const categories = form.discipline === "nails" ? NAIL_CATEGORIES : TATTOO_CATEGORIES;
  const artists = (data?.artists ?? []).filter((a) => a.discipline === form.discipline);

  const handleDisciplineChange = (discipline: Discipline) => {
    const cats = discipline === "nails" ? NAIL_CATEGORIES : TATTOO_CATEGORIES;
    setForm((f) => ({ ...f, discipline, category: cats[0] }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.coverImage) {
      toast.error("A cover image is required");
      return;
    }
    setSaving(true);
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title) };
      if (isNew) {
        await createProject(payload);
        toast.success("Project created");
      } else {
        await updateProject(id!, payload);
        toast.success("Project updated");
      }
      router.push("/admin/projects");
    } catch {
      toast.error("Failed to save project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Link
        href="/admin/projects"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6"
      >
        <ArrowLeft size={16} /> Back to Projects
      </Link>

      <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground mb-6">
        {isNew ? "New Project" : "Edit Project"}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-5">
          <div className="glass-card p-6 space-y-5">
            <div>
              <label className={labelCls}>Title</label>
              <input
                required
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="e.g. Botanical Peony"
                className={inputCls}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Discipline</label>
                <select
                  value={form.discipline}
                  onChange={(e) => handleDisciplineChange(e.target.value as Discipline)}
                  className={inputCls}
                >
                  <option value="tattoo">Tattoo</option>
                  <option value="nails">Nails</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Category</label>
                <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                  {categories.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelCls}>Description</label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                placeholder="Describe the piece..."
                className={`${inputCls} resize-none`}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Artist</label>
                <select
                  value={form.artistId ?? ""}
                  onChange={(e) => set("artistId", e.target.value || null)}
                  className={inputCls}
                >
                  <option value="">Unassigned</option>
                  {artists.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelCls}>Date Completed</label>
                <input
                  type="date"
                  value={form.dateCompleted}
                  onChange={(e) => set("dateCompleted", e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* Social / video */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="font-display text-lg tracking-wider text-foreground">Social & Video</h2>
            <div>
              <label className={labelCls}>TikTok URL</label>
              <input
                value={form.tiktokUrl ?? ""}
                onChange={(e) => set("tiktokUrl", e.target.value)}
                placeholder="https://www.tiktok.com/@user/video/123..."
                className={inputCls}
              />
              <p className="text-[11px] text-muted-foreground mt-1.5">
                Paste a full TikTok video link — it embeds automatically on the project page.
              </p>
            </div>
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input
                value={form.instagramUrl ?? ""}
                onChange={(e) => set("instagramUrl", e.target.value)}
                placeholder="https://instagram.com/p/..."
                className={inputCls}
              />
            </div>
          </div>

          {/* Gallery */}
          <div className="glass-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg tracking-wider text-foreground">Gallery</h2>
              <button
                type="button"
                onClick={() => set("gallery", [...form.gallery, ""])}
                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                <Plus size={14} /> Add image
              </button>
            </div>
            {form.gallery.length === 0 && (
              <p className="text-sm text-muted-foreground">No gallery images yet. The cover image is shown by default.</p>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {form.gallery.map((img, i) => (
                <div key={i} className="relative">
                  <ImageInput
                    label={`Image ${i + 1}`}
                    value={img}
                    onChange={(val) =>
                      set("gallery", form.gallery.map((g, gi) => (gi === i ? val : g)))
                    }
                  />
                  <button
                    type="button"
                    onClick={() => set("gallery", form.gallery.filter((_, gi) => gi !== i))}
                    className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="glass-card p-6">
            <ImageInput label="Cover Image" value={form.coverImage} onChange={(v) => set("coverImage", v)} />
          </div>

          <div className="glass-card p-6 space-y-4">
            <div>
              <label className={labelCls}>Status</label>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value as ProjectStatus)}
                className={inputCls}
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="w-4 h-4 accent-primary"
              />
              <span className="text-sm text-foreground">Mark as featured</span>
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
            <Save size={16} /> {saving ? "Saving..." : isNew ? "Create Project" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProjectEdit;

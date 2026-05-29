"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Archive, ArchiveRestore, Search } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import type { Discipline, ProjectStatus } from "@/lib/types";

const AdminProjects = () => {
  const { data, updateProject, deleteProject } = useStore();
  const [discipline, setDiscipline] = useState<"all" | Discipline>("all");
  const [status, setStatus] = useState<"all" | ProjectStatus>("all");
  const [query, setQuery] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const projects = data?.projects ?? [];
  const artists = data?.artists ?? [];

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (discipline !== "all" && p.discipline !== discipline) return false;
      if (status !== "all" && p.status !== status) return false;
      if (query && !p.title.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [projects, discipline, status, query]);

  const artistName = (id: string | null) => artists.find((a) => a.id === id)?.name ?? "—";

  const toggleArchive = async (id: string, current: ProjectStatus) => {
    const next: ProjectStatus = current === "archived" ? "published" : "archived";
    await updateProject(id, { status: next });
    toast.success(next === "archived" ? "Project archived" : "Project restored");
  };

  const handleDelete = async (id: string) => {
    await deleteProject(id);
    setConfirmId(null);
    toast.success("Project deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects.length} total</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search projects..."
            className="w-full bg-muted border border-border/50 rounded-lg pl-9 pr-4 py-2.5 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <select
          value={discipline}
          onChange={(e) => setDiscipline(e.target.value as typeof discipline)}
          className="bg-muted border border-border/50 rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All Types</option>
          <option value="tattoo">Tattoo</option>
          <option value="nails">Nails</option>
        </select>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as typeof status)}
          className="bg-muted border border-border/50 rounded-lg px-3 py-2.5 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="archived">Archived</option>
        </select>
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">No projects match your filters.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((p) => (
            <div key={p.id} className="glass-card p-4 flex items-center gap-4">
              <img src={p.coverImage} alt={p.title} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-foreground font-medium truncate">{p.title}</h3>
                  <span
                    className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      p.status === "published"
                        ? "bg-green-500/15 text-green-400"
                        : p.status === "draft"
                        ? "bg-yellow-500/15 text-yellow-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.status}
                  </span>
                  {p.featured && (
                    <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1 capitalize">
                  {p.discipline} · {p.category} · {artistName(p.artistId)}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Link
                  href={`/admin/projects/${p.id}`}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title="Edit"
                >
                  <Pencil size={16} />
                </Link>
                <button
                  onClick={() => toggleArchive(p.id, p.status)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  title={p.status === "archived" ? "Restore" : "Archive"}
                >
                  {p.status === "archived" ? <ArchiveRestore size={16} /> : <Archive size={16} />}
                </button>
                <button
                  onClick={() => setConfirmId(p.id)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Delete"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur">
          <div className="glass-card p-6 max-w-sm w-full">
            <h3 className="font-display text-xl tracking-wider text-foreground">Delete project?</h3>
            <p className="text-muted-foreground text-sm mt-2">
              This permanently removes the project. This action cannot be undone.
            </p>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/70 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium bg-destructive text-destructive-foreground hover:opacity-90 transition-opacity"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProjects;

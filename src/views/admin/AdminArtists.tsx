"use client";
import { useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Trash2, Instagram } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";

const AdminArtists = () => {
  const { data, deleteArtist } = useStore();
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const artists = data?.artists ?? [];
  const projectCount = (artistId: string) =>
    (data?.projects ?? []).filter((p) => p.artistId === artistId).length;

  const handleDelete = async (id: string) => {
    await deleteArtist(id);
    setConfirmId(null);
    toast.success("Artist deleted");
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">Artists</h1>
          <p className="text-muted-foreground text-sm mt-1">{artists.length} total</p>
        </div>
        <Link
          href="/admin/artists/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Artist
        </Link>
      </div>

      {artists.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">No artists yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {artists.map((a) => {
            const accent = a.discipline === "nails" ? "secondary" : "primary";
            return (
              <div key={a.id} className="glass-card p-4 flex items-center gap-4">
                <img src={a.photo} alt={a.name} className="w-16 h-16 rounded-full object-cover object-top flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-foreground font-medium truncate">{a.name}</h3>
                    {a.featured && (
                      <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className={`text-xs ${accent === "secondary" ? "text-secondary" : "text-primary"}`}>{a.role}</p>
                  <p className="text-[11px] text-muted-foreground mt-1">{projectCount(a.id)} projects</p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Link
                    href={`/admin/artists/${a.id}`}
                    className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  >
                    <Pencil size={16} />
                  </Link>
                  <button
                    onClick={() => setConfirmId(a.id)}
                    className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur">
          <div className="glass-card p-6 max-w-sm w-full">
            <h3 className="font-display text-xl tracking-wider text-foreground">Delete artist?</h3>
            <p className="text-muted-foreground text-sm mt-2">
              Their projects will be kept but unassigned. This cannot be undone.
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

export default AdminArtists;

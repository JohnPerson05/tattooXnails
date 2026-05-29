"use client";
import Link from "next/link";
import { Images, Users, Inbox, Star, ArrowRight, Plus } from "lucide-react";
import { useStore } from "@/lib/store";

const AdminOverview = () => {
  const { data } = useStore();

  const projects = data?.projects ?? [];
  const artists = data?.artists ?? [];
  const inquiries = data?.inquiries ?? [];

  const stats = [
    {
      label: "Projects",
      value: projects.length,
      sub: `${projects.filter((p) => p.status === "published").length} published`,
      icon: Images,
      to: "/admin/projects",
    },
    {
      label: "Artists",
      value: artists.length,
      sub: `${artists.filter((a) => a.featured).length} featured`,
      icon: Users,
      to: "/admin/artists",
    },
    {
      label: "Inquiries",
      value: inquiries.length,
      sub: `${inquiries.filter((i) => i.status === "new").length} new`,
      icon: Inbox,
      to: "/admin/inquiries",
    },
    {
      label: "Testimonials",
      value: data?.testimonials.length ?? 0,
      sub: "on homepage",
      icon: Star,
      to: "/admin/settings",
    },
  ];

  const recentInquiries = inquiries.slice(0, 5);
  const recentProjects = projects.slice(0, 5);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Manage your studio content</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> New Project
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.to} className="glass-card p-5 hover-lift group">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <s.icon size={18} className="text-primary" />
              </div>
              <ArrowRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <span className="font-display text-3xl text-foreground block">{s.value}</span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">{s.label}</span>
            <span className="text-[11px] text-primary block mt-1">{s.sub}</span>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent inquiries */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wider text-foreground">Recent Inquiries</h2>
            <Link href="/admin/inquiries" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentInquiries.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No inquiries yet.</p>
          ) : (
            <div className="space-y-3">
              {recentInquiries.map((inq) => (
                <div key={inq.id} className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground uppercase">
                    {inq.name.slice(0, 2)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate">{inq.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{inq.serviceType}</p>
                  </div>
                  {inq.status === "new" && (
                    <span className="text-[10px] uppercase tracking-wide bg-primary/15 text-primary px-2 py-0.5 rounded-full">New</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent projects */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-xl tracking-wider text-foreground">Recent Projects</h2>
            <Link href="/admin/projects" className="text-xs text-primary hover:underline">View all</Link>
          </div>
          {recentProjects.length === 0 ? (
            <p className="text-muted-foreground text-sm py-6 text-center">No projects yet.</p>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((p) => (
                <Link
                  key={p.id}
                  href={`/admin/projects/${p.id}`}
                  className="flex items-center gap-3 py-2 border-b border-border/20 last:border-0 group"
                >
                  <img src={p.coverImage} alt={p.title} className="w-10 h-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-foreground truncate group-hover:text-primary transition-colors">{p.title}</p>
                    <p className="text-xs text-muted-foreground truncate capitalize">{p.discipline} · {p.category}</p>
                  </div>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminOverview;

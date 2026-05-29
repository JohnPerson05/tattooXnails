"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Images,
  Users,
  Inbox,
  Settings,
  LogOut,
  Menu,
  X,
  ExternalLink,
  Database,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useStore } from "@/lib/store";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/admin/projects", label: "Projects", icon: Images },
  { to: "/admin/artists", label: "Artists", icon: Users },
  { to: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

const AdminLayout = ({ children }: { children: ReactNode }) => {
  const { logout, email } = useAuth();
  const { data } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const newInquiries = (data?.inquiries ?? []).filter((i) => i.status === "new").length;

  const handleLogout = () => {
    logout();
    router.push("/admin/login");
  };

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(`${to}/`);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <Link href="/admin" className="block px-6 py-6 border-b border-border/30">
        <span className="font-display text-lg tracking-wider text-foreground leading-tight">
          Owshie<span className="text-primary"> x </span>Celeste
        </span>
        <span className="block text-[10px] uppercase tracking-widest text-muted-foreground mt-1">Studio CMS</span>
      </Link>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            onClick={() => setMobileOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive(item.to, item.exact)
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }`}
          >
            <item.icon size={18} />
            {item.label}
            {item.label === "Inquiries" && newInquiries > 0 && (
              <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold rounded-full px-2 py-0.5">
                {newInquiries}
              </span>
            )}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-4 border-t border-border/30 space-y-1">
        <div className="px-3 py-2 flex items-center gap-2 text-[11px] text-muted-foreground">
          <Database size={13} /> Neon connected
        </div>
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <ExternalLink size={18} /> View Site
        </a>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut size={18} /> Logout
        </button>
        {email && <p className="px-3 pt-2 text-[11px] text-muted-foreground/70 truncate">{email}</p>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden md:flex w-64 border-r border-border/30 bg-card flex-col fixed inset-y-0">
        <SidebarContent />
      </aside>

      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-card border-b border-border/30 flex items-center justify-between px-4 h-14">
        <span className="font-display text-base tracking-wider text-foreground">Studio CMS</span>
        <button onClick={() => setMobileOpen(true)} className="text-foreground p-2">
          <Menu size={22} />
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 bg-card border-r border-border/30 h-full">
            <button onClick={() => setMobileOpen(false)} className="absolute top-5 right-4 text-foreground z-10">
              <X size={20} />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 md:ml-64 pt-14 md:pt-0">
        <div className="p-5 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;

"use client";
import { useMemo, useState } from "react";
import { Download, Mail, Trash2, Check, Archive } from "lucide-react";
import { useStore } from "@/lib/store";
import { toast } from "sonner";
import type { Inquiry, InquiryStatus } from "@/lib/types";

const statusStyles: Record<InquiryStatus, string> = {
  new: "bg-primary/15 text-primary",
  read: "bg-blue-500/15 text-blue-400",
  replied: "bg-green-500/15 text-green-400",
  archived: "bg-muted text-muted-foreground",
};

const AdminInquiries = () => {
  const { data, updateInquiry, deleteInquiry } = useStore();
  const [filter, setFilter] = useState<"all" | InquiryStatus>("all");
  const [selected, setSelected] = useState<Inquiry | null>(null);

  const inquiries = data?.inquiries ?? [];
  const filtered = useMemo(
    () => (filter === "all" ? inquiries : inquiries.filter((i) => i.status === filter)),
    [inquiries, filter],
  );

  const openInquiry = async (inq: Inquiry) => {
    setSelected(inq);
    if (inq.status === "new") {
      await updateInquiry(inq.id, { status: "read" });
    }
  };

  const setStatus = async (id: string, status: InquiryStatus) => {
    await updateInquiry(id, { status });
    setSelected((s) => (s && s.id === id ? { ...s, status } : s));
    toast.success(`Marked as ${status}`);
  };

  const remove = async (id: string) => {
    await deleteInquiry(id);
    setSelected(null);
    toast.success("Inquiry deleted");
  };

  const replyHref = (inq: Inquiry) =>
    `mailto:${inq.email}?subject=${encodeURIComponent(
      `Re: Your ${inq.serviceType} inquiry`,
    )}&body=${encodeURIComponent(`Hi ${inq.name},\n\nThanks for reaching out about ${inq.serviceType}.\n\n`)}`;

  const exportCsv = () => {
    const header = ["Name", "Email", "Contact", "Service", "Message", "Status", "Date"];
    const rows = inquiries.map((i) => [
      i.name,
      i.email,
      i.contact,
      i.serviceType,
      i.message.replace(/\n/g, " "),
      i.status,
      new Date(i.createdAt).toLocaleString(),
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Inquiries exported");
  };

  const filters: ("all" | InquiryStatus)[] = ["all", "new", "read", "replied", "archived"];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-wider text-foreground">Inquiries</h1>
          <p className="text-muted-foreground text-sm mt-1">{inquiries.length} total</p>
        </div>
        <button
          onClick={exportCsv}
          className="inline-flex items-center gap-2 bg-muted text-foreground px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-muted/70 transition-colors"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider font-medium transition-colors capitalize ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="glass-card p-12 text-center text-muted-foreground">No inquiries here.</div>
      ) : (
        <div className="space-y-3">
          {filtered.map((inq) => (
            <button
              key={inq.id}
              onClick={() => openInquiry(inq)}
              className="w-full glass-card p-4 flex items-center gap-4 text-left hover-lift"
            >
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-xs font-medium text-foreground uppercase flex-shrink-0">
                {inq.name.slice(0, 2)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-foreground font-medium truncate">{inq.name}</span>
                  <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full ${statusStyles[inq.status]}`}>
                    {inq.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground truncate">{inq.serviceType} · {inq.message}</p>
              </div>
              <span className="text-[11px] text-muted-foreground flex-shrink-0 hidden sm:block">
                {new Date(inq.createdAt).toLocaleDateString()}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-background/80 backdrop-blur" onClick={() => setSelected(null)} />
          <div className="relative w-full max-w-md bg-card border-l border-border/30 h-full overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <span className={`text-[10px] uppercase tracking-wide px-2 py-1 rounded-full ${statusStyles[selected.status]}`}>
                {selected.status}
              </span>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground text-sm">
                Close
              </button>
            </div>

            <h2 className="font-display text-2xl tracking-wider text-foreground">{selected.name}</h2>
            <p className="text-sm text-muted-foreground mt-1">
              {new Date(selected.createdAt).toLocaleString()}
            </p>

            <div className="mt-6 space-y-4 text-sm">
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Service</span>
                <span className="text-foreground">{selected.serviceType}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Email</span>
                <a href={`mailto:${selected.email}`} className="text-primary hover:underline break-all">
                  {selected.email || "—"}
                </a>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Contact</span>
                <span className="text-foreground">{selected.contact || "—"}</span>
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground block mb-1">Message</span>
                <p className="text-foreground/80 whitespace-pre-wrap leading-relaxed">{selected.message}</p>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              {selected.email && (
                <a
                  href={replyHref(selected)}
                  onClick={() => setStatus(selected.id, "replied")}
                  className="w-full py-3 rounded-lg font-medium text-sm bg-primary text-primary-foreground gold-glow hover:opacity-90 transition-opacity inline-flex items-center justify-center gap-2"
                >
                  <Mail size={16} /> Reply via Email
                </a>
              )}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setStatus(selected.id, "replied")}
                  className="py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/70 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Check size={15} /> Replied
                </button>
                <button
                  onClick={() => setStatus(selected.id, "archived")}
                  className="py-2.5 rounded-lg text-sm font-medium bg-muted text-foreground hover:bg-muted/70 transition-colors inline-flex items-center justify-center gap-2"
                >
                  <Archive size={15} /> Archive
                </button>
              </div>
              <button
                onClick={() => remove(selected.id)}
                className="w-full py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminInquiries;

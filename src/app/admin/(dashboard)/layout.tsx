import type { ReactNode } from "react";
import RequireAuth from "@/components/admin/RequireAuth";
import AdminLayout from "@/views/admin/AdminLayout";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <RequireAuth>
      <AdminLayout>{children}</AdminLayout>
    </RequireAuth>
  );
}

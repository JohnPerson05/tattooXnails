import AdminProjectEdit from "@/views/admin/AdminProjectEdit";

export default function EditProjectPage({ params }: { params: { id: string } }) {
  return <AdminProjectEdit id={params.id} />;
}

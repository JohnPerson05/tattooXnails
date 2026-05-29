import AdminArtistEdit from "@/views/admin/AdminArtistEdit";

export default function EditArtistPage({ params }: { params: { id: string } }) {
  return <AdminArtistEdit id={params.id} />;
}

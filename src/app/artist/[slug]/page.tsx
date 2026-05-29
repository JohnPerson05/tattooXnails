import ArtistProfile from "@/views/ArtistProfile";

export default function ArtistPage({ params }: { params: { slug: string } }) {
  return <ArtistProfile slug={params.slug} />;
}

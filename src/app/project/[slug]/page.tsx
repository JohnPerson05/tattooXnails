import ProjectDetail from "@/views/ProjectDetail";

export default function ProjectPage({ params }: { params: { slug: string } }) {
  return <ProjectDetail slug={params.slug} />;
}

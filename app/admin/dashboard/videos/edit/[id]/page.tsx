import EditVideoContent from "./EditVideoContent";

export default async function EditVideoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditVideoContent videoId={id} />;
}

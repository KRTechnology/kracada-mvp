import EditVideoContent from "./EditVideoContent";

export default function EditVideoPage({ params }: { params: { id: string } }) {
  return <EditVideoContent videoId={params.id} />;
}

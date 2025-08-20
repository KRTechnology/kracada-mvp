import { JobDetailsClient } from "@/components/specific/jobs/JobDetailsClient";
import { getJobByIdAction } from "@/app/actions/home-actions";
import { notFound } from "next/navigation";

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;

  // Fetch job data from the database
  const jobResult = await getJobByIdAction(id);

  if (!jobResult.success || !jobResult.data) {
    notFound();
  }

  return <JobDetailsClient job={jobResult.data} />;
}

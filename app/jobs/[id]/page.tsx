import { JobDetailsClient } from "@/components/specific/jobs/JobDetailsClient";
import { jobsData } from "@/lib/data/jobs-data";
import { notFound } from "next/navigation";

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobDetailsPage({ params }: JobDetailsPageProps) {
  const { id } = await params;
  const jobId = parseInt(id);
  const job = jobsData.find((job) => job.id === jobId);

  if (!job) {
    notFound();
  }

  return <JobDetailsClient job={job} />;
}

import { JobApplicationsPageClient } from "@/components/specific/jobs/JobApplicationsPageClient";
import { jobsData } from "@/lib/data/jobs-data";
import { jobApplicationsData } from "@/lib/data/job-applications-data";
import { notFound } from "next/navigation";

interface JobApplicationsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function JobApplicationsPage({
  params,
}: JobApplicationsPageProps) {
  const resolvedParams = await params;
  const jobId = parseInt(resolvedParams.id);
  const job = jobsData.find((job) => job.id === jobId);

  if (!job) {
    notFound();
  }

  // Use comprehensive job applications data
  // In a real app, this would fetch from the database based on job ID
  const applications = jobApplicationsData;

  return <JobApplicationsPageClient job={job} applications={applications} />;
}

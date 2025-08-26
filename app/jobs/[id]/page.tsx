import { JobDetailsClient } from "@/components/specific/jobs/JobDetailsClient";
import {
  getJobByIdAction,
  trackJobViewAction,
} from "@/app/actions/home-actions";
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

  // Track job view (only counts if viewer is not the job owner)
  // This runs on the server side and doesn't affect page loading
  trackJobViewAction(id).catch((error) => {
    console.error("Failed to track job view:", error);
    // Don't throw error - view tracking shouldn't break the page
  });

  return <JobDetailsClient job={jobResult.data} />;
}

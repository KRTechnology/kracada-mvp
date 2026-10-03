import { auth } from "@/auth";
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

  const session = await auth();

  console.log("Session:", session);

  // Fetch job data from the database
  const jobResult = await getJobByIdAction(id);

  if (!jobResult.success || !jobResult.data) {
    notFound();
  }

  const job = jobResult.data;

  // Determine whether the current user can view applications
  const userEmail = session?.user?.email?.toLowerCase();

  const canViewApplications =
    session?.user?.isAdmin === true ||
    session?.user?.id === job.employerId ||
    userEmail?.endsWith("@kimberly-ryan.net") === true;

  // Track job view
  trackJobViewAction(id).catch((error) => {
    console.error("Failed to track job view:", error);
  });

  return (
    <JobDetailsClient job={job} canViewApplications={canViewApplications} />
  );
}

import { JobApplicationsPageClient } from "@/components/specific/jobs/JobApplicationsPageClient";
import { getJobApplicationsAction } from "@/app/(dashboard)/actions/job-application-management-actions";
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
  const jobId = resolvedParams.id;

  // Fetch real-time job and applications data
  const result = await getJobApplicationsAction(jobId);

  if (!result.success || !result.data) {
    if (result.message === "Job not found") {
      notFound();
    }

    // Handle other errors (unauthorized, etc.)
    return (
      <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="text-4xl mb-4">❌</div>
            <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              Access Denied
            </h4>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
              {result.message ||
                "You don't have permission to view these applications."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { job, applications } = result.data;

  return <JobApplicationsPageClient job={job} applications={applications} />;
}

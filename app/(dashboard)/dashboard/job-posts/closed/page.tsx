import { ClosedJobPostsContent } from "@/components/specific/dashboard/ClosedJobPostsContent";
import { getEmployerJobsAction } from "@/app/(dashboard)/actions/job-actions";
import { Loader } from "@/components/common/Loader";

export default async function ClosedJobPostsPage() {
  const result = await getEmployerJobsAction();

  if (!result.success || !result.data) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">❌</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Failed to load job posts
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          {result.message || "Unable to fetch your job posts at this time."}
        </p>
      </div>
    );
  }

  return <ClosedJobPostsContent jobs={result.data} />;
}

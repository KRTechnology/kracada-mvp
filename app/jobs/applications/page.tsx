import { JobApplicationsClient } from "@/components/specific/jobs/JobApplicationsClient";
import { getUserJobApplicationsAction } from "@/app/(dashboard)/actions/job-application-data-actions";

export default async function JobApplicationsPage() {
  // Fetch user applications from the database
  const applicationsResult = await getUserJobApplicationsAction();

  if (!applicationsResult.success) {
    // Handle error case - could also redirect to error page
    console.error("Failed to fetch applications:", applicationsResult.error);
  }

  const userApplications = applicationsResult.success
    ? applicationsResult.data || []
    : [];

  return <JobApplicationsClient applications={userApplications} />;
}

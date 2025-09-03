import { ApplicationsContent } from "@/components/specific/dashboard/ApplicationsContent";
import { getUserJobApplicationsAction } from "@/app/(dashboard)/actions/job-application-data-actions";

export default async function ApplicationsPage() {
  // Fetch user applications from the database
  const applicationsResult = await getUserJobApplicationsAction();

  if (!applicationsResult.success) {
    // Handle error case - could also redirect to error page
    console.error("Failed to fetch applications:", applicationsResult.error);
  }

  const applications = applicationsResult.success
    ? applicationsResult.data || []
    : [];

  return <ApplicationsContent applications={applications} />;
}

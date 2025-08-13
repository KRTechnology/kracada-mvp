import { JobApplicationsClient } from "@/components/specific/jobs/JobApplicationsClient";
import { applicationsData } from "@/lib/data/applications-data";

export default async function JobApplicationsPage() {
  // In a real app, this would fetch from the database based on the authenticated user
  // For now, we'll use the mock data
  const userApplications = applicationsData;

  return <JobApplicationsClient applications={userApplications} />;
}

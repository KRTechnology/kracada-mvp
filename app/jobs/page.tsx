import { JobsClient } from "@/components/specific/jobs/JobsClient";
import { getAllActiveJobsAction } from "@/app/actions/home-actions";

export default async function JobsPage() {
  // Fetch all active jobs from the database
  const jobsResult = await getAllActiveJobsAction();
  const allJobs = jobsResult.success ? jobsResult.data || [] : [];

  // Extract unique locations from the real job data
  const locations = Array.from(
    new Set(allJobs.map((job) => job.location))
  ).sort();

  return <JobsClient initialJobs={allJobs} locations={locations} />;
}

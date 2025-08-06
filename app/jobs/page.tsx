import { JobsClient } from "@/components/specific/jobs/JobsClient";
import { jobsData, getUniqueLocations } from "@/lib/data/jobs-data";

export default function JobsPage() {
  const locations = getUniqueLocations();

  return <JobsClient initialJobs={jobsData} locations={locations} />;
}

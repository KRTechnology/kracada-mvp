import { index } from "drizzle-orm/pg-core";
import { jobApplications, jobs } from "./jobs";

// Performance indexes for job applications
export const jobApplicationsApplicantIdIndex = index(
  "job_applications_applicant_id_idx"
).on(jobApplications.applicantId);

export const jobApplicationsJobIdIndex = index(
  "job_applications_job_id_idx"
).on(jobApplications.jobId);

export const jobApplicationsCreatedAtIndex = index(
  "job_applications_created_at_idx"
).on(jobApplications.createdAt);

export const jobApplicationsStatusIndex = index(
  "job_applications_status_idx"
).on(jobApplications.status);

// Composite index for efficient user application queries
export const jobApplicationsApplicantCreatedIndex = index(
  "job_applications_applicant_created_idx"
).on(jobApplications.applicantId, jobApplications.createdAt);

// Jobs indexes for joins
export const jobsEmployerIdIndex = index("jobs_employer_id_idx").on(
  jobs.employerId
);

export const jobsStatusIndex = index("jobs_status_idx").on(jobs.status);

export const jobsCreatedAtIndex = index("jobs_created_at_idx").on(
  jobs.createdAt
);

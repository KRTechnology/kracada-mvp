"use server";

import { db } from "@/lib/db/drizzle";
import { jobs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Types for home page job data
export interface HomePageJob {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  locationType: "remote" | "onsite" | "hybrid";
  companyLogo?: string | null;
}

// Fetch latest 6 active jobs for home page
export async function getLatestJobsAction(): Promise<{
  success: boolean;
  data?: HomePageJob[];
  message?: string;
}> {
  try {
    // Fetch latest 6 active jobs, ordered by creation date
    const latestJobs = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.companyName,
        location: jobs.location,
        description: jobs.description,
        skills: jobs.requiredSkills,
        locationType: jobs.locationType,
        companyLogo: jobs.companyLogo,
      })
      .from(jobs)
      .where(eq(jobs.status, "active"))
      .orderBy(desc(jobs.createdAt))
      .limit(6);

    // Transform the data to match HomePageJob interface
    const transformedJobs: HomePageJob[] = latestJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      skills: job.skills ? JSON.parse(job.skills) : [],
      locationType: job.locationType,
      companyLogo: job.companyLogo,
    }));

    return {
      success: true,
      data: transformedJobs,
    };
  } catch (error) {
    console.error("Error fetching latest jobs:", error);
    return {
      success: false,
      message: "Failed to fetch latest jobs",
    };
  }
}

// Types for job details page
export interface JobDetailsData {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  locationType: "remote" | "onsite" | "hybrid";
  industry: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  salaryRange: string;
  currency: string;
  deadline: Date;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
  status: "active" | "closed";
  createdAt: Date;
  updatedAt: Date;
}

// Fetch a specific job by ID for job details page
export async function getJobByIdAction(jobId: string): Promise<{
  success: boolean;
  data?: JobDetailsData;
  message?: string;
}> {
  try {
    // Fetch the specific job by ID
    const [job] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: jobs.companyName,
        location: jobs.location,
        description: jobs.description,
        skills: jobs.requiredSkills,
        locationType: jobs.locationType,
        industry: jobs.industry,
        jobType: jobs.jobType,
        salaryRange: jobs.salaryRange,
        currency: jobs.currency,
        deadline: jobs.deadline,
        companyLogo: jobs.companyLogo,
        companyWebsite: jobs.companyWebsite,
        companyEmail: jobs.companyEmail,
        status: jobs.status,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
      })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return {
        success: false,
        message: "Job not found",
      };
    }

    // Transform the data to match JobDetailsData interface
    const transformedJob: JobDetailsData = {
      id: job.id,
      title: job.title,
      company: job.company,
      location: job.location,
      description: job.description,
      skills: job.skills ? JSON.parse(job.skills) : [],
      locationType: job.locationType,
      industry: job.industry,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      currency: job.currency,
      deadline: job.deadline,
      companyLogo: job.companyLogo,
      companyWebsite: job.companyWebsite,
      companyEmail: job.companyEmail,
      status: job.status,
      createdAt: job.createdAt,
      updatedAt: job.updatedAt,
    };

    return {
      success: true,
      data: transformedJob,
    };
  } catch (error) {
    console.error("Error fetching job by ID:", error);
    return {
      success: false,
      message: "Failed to fetch job details",
    };
  }
}

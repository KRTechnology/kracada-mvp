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

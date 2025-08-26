"use server";

import { db } from "@/lib/db/drizzle";
import { jobs, jobApplications, users } from "@/lib/db/schema";
import { eq, desc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

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
    // Fetch latest 6 active jobs with recruiter company info, ordered by creation date
    const latestJobs = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: users.companyName,
        location: jobs.location,
        description: jobs.description,
        skills: jobs.requiredSkills,
        locationType: jobs.locationType,
        companyLogo: users.companyLogo,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(eq(jobs.status, "active"))
      .orderBy(desc(jobs.createdAt))
      .limit(6);

    // Transform the data to match HomePageJob interface
    const transformedJobs: HomePageJob[] = latestJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company || "Company Not Specified",
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
  requirements: string[];
  locationType: "remote" | "onsite" | "hybrid";
  industry: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  salaryRange: string;
  currency: string;
  deadline: Date;
  employerId: string;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
  companyDescription?: string | null;
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
    // Fetch the specific job by ID with recruiter company info
    const [job] = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: users.companyName,
        location: jobs.location,
        description: jobs.description,
        skills: jobs.requiredSkills,
        requirements: jobs.requirements,
        locationType: jobs.locationType,
        industry: jobs.industry,
        jobType: jobs.jobType,
        salaryRange: jobs.salaryRange,
        currency: jobs.currency,
        deadline: jobs.deadline,
        employerId: jobs.employerId,
        companyLogo: users.companyLogo,
        companyWebsite: users.companyWebsite,
        companyEmail: users.companyEmail,
        companyDescription: users.companyDescription,
        status: jobs.status,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.employerId, users.id))
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
      company: job.company || "Company Not Specified",
      location: job.location,
      description: job.description,
      skills: job.skills ? JSON.parse(job.skills) : [],
      requirements: job.requirements ? JSON.parse(job.requirements) : [],
      locationType: job.locationType,
      industry: job.industry,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      currency: job.currency,
      deadline: job.deadline,
      employerId: job.employerId,
      companyLogo: job.companyLogo,
      companyWebsite: job.companyWebsite,
      companyEmail: job.companyEmail,
      companyDescription: job.companyDescription,
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

// Types for all jobs page
export interface AllJobsData {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  locationType: "remote" | "onsite" | "hybrid";
  companyLogo?: string | null;
  applicantsCount: number;
  viewsCount: number;
  status: "active" | "closed";
  createdAt: Date;
}

// Fetch all active jobs for the jobs listing page
export async function getAllActiveJobsAction(): Promise<{
  success: boolean;
  data?: AllJobsData[];
  message?: string;
}> {
  try {
    // Fetch all active jobs with recruiter company info, ordered by creation date (newest first)
    const allJobs = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        company: users.companyName,
        location: jobs.location,
        description: jobs.description,
        skills: jobs.requiredSkills,
        locationType: jobs.locationType,
        companyLogo: users.companyLogo,
        status: jobs.status,
        createdAt: jobs.createdAt,
        applicantsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${jobApplications} 
          WHERE ${jobApplications.jobId} = ${jobs.id}
        )`,
        viewsCount: sql<number>`0`, // For now, set to 0 as requested
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(eq(jobs.status, "active"))
      .orderBy(desc(jobs.createdAt));

    // Transform the data to match AllJobsData interface
    const transformedJobs: AllJobsData[] = allJobs.map((job) => ({
      id: job.id,
      title: job.title,
      company: job.company || "Company Not Specified",
      location: job.location,
      description: job.description,
      skills: job.skills ? JSON.parse(job.skills) : [],
      locationType: job.locationType,
      companyLogo: job.companyLogo,
      status: job.status,
      createdAt: job.createdAt,
      applicantsCount: job.applicantsCount,
      viewsCount: job.viewsCount,
    }));

    return {
      success: true,
      data: transformedJobs,
    };
  } catch (error) {
    console.error("Error fetching all active jobs:", error);
    return {
      success: false,
      message: "Failed to fetch jobs",
    };
  }
}

// Track job view - increment view count for non-owners
export async function trackJobViewAction(jobId: string) {
  try {
    // Get current session (if any)
    const session = await auth();
    const currentUserId = session?.user?.id;

    // Get job details to check the owner
    const [job] = await db
      .select({
        id: jobs.id,
        employerId: jobs.employerId,
        viewsCount: jobs.viewsCount,
      })
      .from(jobs)
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    // Only increment view count if the viewer is not the job owner
    // This includes both logged-out users and logged-in users who aren't the owner
    if (!currentUserId || currentUserId !== job.employerId) {
      await db
        .update(jobs)
        .set({
          viewsCount: sql`${jobs.viewsCount} + 1`,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, jobId));

      // Revalidate dashboard pages to show updated view counts
      revalidatePath("/dashboard/job-posts");
      revalidatePath("/dashboard/job-posts/closed");
      revalidatePath("/dashboard");

      return {
        success: true,
        message: "View tracked successfully",
        newViewCount: job.viewsCount + 1,
      };
    }

    // Job owner viewing their own job - no view increment
    return {
      success: true,
      message: "Job owner view - not counted",
      newViewCount: job.viewsCount,
    };
  } catch (error) {
    console.error("Error tracking job view:", error);
    return {
      success: false,
      message: "Failed to track view",
    };
  }
}

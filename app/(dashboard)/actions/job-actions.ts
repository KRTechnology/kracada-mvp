"use server";

import { db } from "@/lib/db/drizzle";
import { jobs, jobApplications, users } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Types
export interface CreateJobData {
  title: string;
  description: string;
  location: string;
  locationType: "remote" | "onsite" | "hybrid";
  industry: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  salaryRange: string;
  currency: string;
  deadline: string;
  companyName: string;
  companyLogo?: string;
  companyWebsite?: string;
  companyEmail?: string;
  multimediaContent?: string;
  requiredSkills: string[];
}

export interface UpdateJobData extends Partial<CreateJobData> {
  id: string;
  status?: "active" | "closed";
}

export interface UpdateApplicationStatusData {
  applicationId: string;
  status:
    | "Submitted"
    | "Under review"
    | "Shortlisted"
    | "Rejected"
    | "Interviewed"
    | "Offer";
}

// Fetch jobs by user ID (employer/business owner)
export async function getEmployerJobsAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user is an employer or business owner
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (
      !user.length ||
      !["Employer", "Business Owner"].includes(user[0].accountType)
    ) {
      return {
        success: false,
        message: "Only employers and business owners can view job posts",
      };
    }

    // Fetch jobs with applicant count
    const jobsWithCounts = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        locationType: jobs.locationType,
        industry: jobs.industry,
        jobType: jobs.jobType,
        salaryRange: jobs.salaryRange,
        currency: jobs.currency,
        deadline: jobs.deadline,
        companyName: jobs.companyName,
        companyLogo: jobs.companyLogo,
        companyWebsite: jobs.companyWebsite,
        companyEmail: jobs.companyEmail,
        multimediaContent: jobs.multimediaContent,
        requiredSkills: jobs.requiredSkills,
        status: jobs.status,
        employerId: jobs.employerId,
        createdAt: jobs.createdAt,
        updatedAt: jobs.updatedAt,
        applicantsCount: sql<number>`(
          SELECT COUNT(*)::int 
          FROM ${jobApplications} 
          WHERE ${jobApplications.jobId} = ${jobs.id}
        )`,
        viewsCount: sql<number>`0`, // For now, set to 0 as requested
      })
      .from(jobs)
      .where(eq(jobs.employerId, userId))
      .orderBy(desc(jobs.createdAt));

    return {
      success: true,
      data: jobsWithCounts,
    };
  } catch (error) {
    console.error("Error fetching employer jobs:", error);
    return {
      success: false,
      message: "Failed to fetch job posts",
    };
  }
}

// Create a new job post
export async function createJobAction(data: CreateJobData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user is an employer or business owner
    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);
    if (
      !user.length ||
      !["Employer", "Business Owner"].includes(user[0].accountType)
    ) {
      return {
        success: false,
        message: "Only employers and business owners can create job posts",
      };
    }

    // Create the job
    const [newJob] = await db
      .insert(jobs)
      .values({
        title: data.title,
        description: data.description,
        location: data.location,
        locationType: data.locationType,
        industry: data.industry,
        jobType: data.jobType,
        salaryRange: data.salaryRange,
        currency: data.currency,
        deadline: new Date(data.deadline),
        companyName: data.companyName,
        companyLogo: data.companyLogo || null,
        companyWebsite: data.companyWebsite || null,
        companyEmail: data.companyEmail || null,
        multimediaContent: data.multimediaContent || null,
        requiredSkills: JSON.stringify(data.requiredSkills),
        employerId: userId,
      })
      .returning();

    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Job post created successfully",
      data: newJob,
    };
  } catch (error) {
    console.error("Error creating job post:", error);
    return {
      success: false,
      message: "Failed to create job post",
    };
  }
}

// Update a job post
export async function updateJobAction(data: UpdateJobData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user owns the job
    const [existingJob] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, data.id), eq(jobs.employerId, userId)))
      .limit(1);

    if (!existingJob) {
      return { success: false, message: "Job not found or unauthorized" };
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.title) updateData.title = data.title;
    if (data.description) updateData.description = data.description;
    if (data.location) updateData.location = data.location;
    if (data.locationType) updateData.locationType = data.locationType;
    if (data.industry) updateData.industry = data.industry;
    if (data.jobType) updateData.jobType = data.jobType;
    if (data.salaryRange) updateData.salaryRange = data.salaryRange;
    if (data.currency) updateData.currency = data.currency;
    if (data.deadline) updateData.deadline = new Date(data.deadline);
    if (data.companyName) updateData.companyName = data.companyName;
    if (data.companyLogo !== undefined)
      updateData.companyLogo = data.companyLogo;
    if (data.companyWebsite !== undefined)
      updateData.companyWebsite = data.companyWebsite;
    if (data.companyEmail !== undefined)
      updateData.companyEmail = data.companyEmail;
    if (data.multimediaContent !== undefined)
      updateData.multimediaContent = data.multimediaContent;
    if (data.requiredSkills)
      updateData.requiredSkills = JSON.stringify(data.requiredSkills);
    if (data.status) updateData.status = data.status;

    const [updatedJob] = await db
      .update(jobs)
      .set(updateData)
      .where(eq(jobs.id, data.id))
      .returning();

    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Job updated successfully",
      data: updatedJob,
    };
  } catch (error) {
    console.error("Error updating job:", error);
    return {
      success: false,
      message: "Failed to update job",
    };
  }
}

// Delete a job post
export async function deleteJobAction(jobId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user owns the job
    const [existingJob] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, userId)))
      .limit(1);

    if (!existingJob) {
      return { success: false, message: "Job not found or unauthorized" };
    }

    // Delete the job (cascade will handle applications)
    await db.delete(jobs).where(eq(jobs.id, jobId));

    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Job deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting job:", error);
    return {
      success: false,
      message: "Failed to delete job",
    };
  }
}

// Toggle job status (active/closed)
export async function toggleJobStatusAction(jobId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Verify user owns the job
    const [existingJob] = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, jobId), eq(jobs.employerId, userId)))
      .limit(1);

    if (!existingJob) {
      return { success: false, message: "Job not found or unauthorized" };
    }

    const newStatus = existingJob.status === "active" ? "closed" : "active";

    const [updatedJob] = await db
      .update(jobs)
      .set({ status: newStatus, updatedAt: new Date() })
      .where(eq(jobs.id, jobId))
      .returning();

    revalidatePath("/jobs");
    revalidatePath("/dashboard");

    return {
      success: true,
      message: `Job ${newStatus} successfully`,
      data: updatedJob,
    };
  } catch (error) {
    console.error("Error toggling job status:", error);
    return {
      success: false,
      message: "Failed to toggle job status",
    };
  }
}

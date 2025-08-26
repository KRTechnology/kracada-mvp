"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { jobApplications, jobs } from "@/lib/db/schema/jobs";
import { users } from "@/lib/db/schema/users";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface CreateJobApplicationData {
  jobId: string;
  coverLetterUrl?: string;
}

export interface JobApplicationStatus {
  hasApplied: boolean;
  applicationId?: string;
  status?:
    | "Submitted"
    | "Under review"
    | "Shortlisted"
    | "Rejected"
    | "Interviewed"
    | "Offer";
  canWithdraw: boolean;
}

// Check if user has already applied for a job
export async function getJobApplicationStatusAction(jobId: string): Promise<{
  success: boolean;
  data?: JobApplicationStatus;
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check if user has already applied
    const existingApplication = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.applicantId, userId)
        )
      )
      .limit(1);

    if (existingApplication.length === 0) {
      return {
        success: true,
        data: {
          hasApplied: false,
          canWithdraw: false,
        },
      };
    }

    const application = existingApplication[0];
    const canWithdraw = application.status === "Submitted";

    return {
      success: true,
      data: {
        hasApplied: true,
        applicationId: application.id,
        status: application.status,
        canWithdraw,
      },
    };
  } catch (error) {
    console.error("Error checking job application status:", error);
    return {
      success: false,
      message: "Failed to check application status",
    };
  }
}

// Create a new job application
export async function createJobApplicationAction(
  data: CreateJobApplicationData
): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get job details and verify it exists and is active
    const job = await db
      .select({
        id: jobs.id,
        employerId: jobs.employerId,
        status: jobs.status,
      })
      .from(jobs)
      .where(eq(jobs.id, data.jobId))
      .limit(1);

    if (job.length === 0) {
      return { success: false, message: "Job not found" };
    }

    if (job[0].status !== "active") {
      return { success: false, message: "This job is no longer active" };
    }

    // Check if user is trying to apply to their own job
    if (job[0].employerId === userId) {
      return {
        success: false,
        message: "You cannot apply to your own job posting",
      };
    }

    // Check if user has already applied
    const existingApplication = await db
      .select()
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, data.jobId),
          eq(jobApplications.applicantId, userId)
        )
      )
      .limit(1);

    if (existingApplication.length > 0) {
      return {
        success: false,
        message: "You have already applied for this job",
      };
    }

    // Get user's CV URL
    const user = await db
      .select({
        cv: users.cv,
      })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (user.length === 0 || !user[0].cv) {
      return {
        success: false,
        message:
          "You need to upload a CV to your profile before applying for jobs",
      };
    }

    // Create the job application
    await db.insert(jobApplications).values({
      jobId: data.jobId,
      applicantId: userId,
      resumeUrl: user[0].cv,
      coverLetter: data.coverLetterUrl || null,
      status: "Submitted",
    });

    // Revalidate the job details page
    revalidatePath(`/jobs/${data.jobId}`);
    revalidatePath("/jobs/applications");

    return {
      success: true,
      message: "Application submitted successfully!",
    };
  } catch (error) {
    console.error("Error creating job application:", error);
    return {
      success: false,
      message: "Failed to submit application",
    };
  }
}

// Withdraw a job application
export async function withdrawJobApplicationAction(jobId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Find the application
    const existingApplication = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
      })
      .from(jobApplications)
      .where(
        and(
          eq(jobApplications.jobId, jobId),
          eq(jobApplications.applicantId, userId)
        )
      )
      .limit(1);

    if (existingApplication.length === 0) {
      return { success: false, message: "Application not found" };
    }

    const application = existingApplication[0];

    // Only allow withdrawal if status is "Submitted"
    if (application.status !== "Submitted") {
      return {
        success: false,
        message:
          "You can only withdraw applications that are in 'Submitted' status",
      };
    }

    // Delete the application
    await db
      .delete(jobApplications)
      .where(eq(jobApplications.id, application.id));

    // Revalidate the job details page
    revalidatePath(`/jobs/${jobId}`);
    revalidatePath("/jobs/applications");

    return {
      success: true,
      message: "Application withdrawn successfully",
    };
  } catch (error) {
    console.error("Error withdrawing job application:", error);
    return {
      success: false,
      message: "Failed to withdraw application",
    };
  }
}

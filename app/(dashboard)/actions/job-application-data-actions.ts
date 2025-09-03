"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { jobApplications, jobs, users } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getTimeAgo } from "@/lib/utils/application-utils";

export interface JobApplicationWithDetails {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status:
    | "Submitted"
    | "Under review"
    | "Shortlisted"
    | "Rejected"
    | "Interviewed"
    | "Offer";
  logo?: string;
  jobId: string;
  coverLetter?: string;
  resumeUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetUserJobApplicationsResult {
  success: boolean;
  data?: JobApplicationWithDetails[];
  error?: string;
}

/**
 * Fetch all job applications for the authenticated user
 */
export async function getUserJobApplicationsAction(): Promise<GetUserJobApplicationsResult> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/login");
    }

    // Fetch applications with job and company details
    const userApplications = await db
      .select({
        // Application fields
        applicationId: jobApplications.id,
        applicationStatus: jobApplications.status,
        applicationCoverLetter: jobApplications.coverLetter,
        applicationResumeUrl: jobApplications.resumeUrl,
        applicationCreatedAt: jobApplications.createdAt,
        applicationUpdatedAt: jobApplications.updatedAt,

        // Job fields
        jobId: jobs.id,
        jobTitle: jobs.title,
        jobLocation: jobs.location,

        // Employer/Company fields
        companyName: users.companyName,
        companyLogo: users.companyLogo,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(eq(jobApplications.applicantId, session.user.id))
      .orderBy(desc(jobApplications.createdAt));

    // Transform the data to match the expected interface
    const formattedApplications: JobApplicationWithDetails[] =
      userApplications.map((app) => {
        const timeAgo = getTimeAgo(app.applicationCreatedAt);

        return {
          id: app.applicationId,
          jobTitle: app.jobTitle,
          company: app.companyName || "Company Name Not Available",
          location: app.jobLocation,
          appliedDate: `Applied ${timeAgo}`,
          status: app.applicationStatus,
          logo: app.companyLogo || undefined,
          jobId: app.jobId,
          coverLetter: app.applicationCoverLetter || undefined,
          resumeUrl: app.applicationResumeUrl || undefined,
          createdAt: app.applicationCreatedAt,
          updatedAt: app.applicationUpdatedAt,
        };
      });

    return {
      success: true,
      data: formattedApplications,
    };
  } catch (error) {
    console.error("Error fetching user job applications:", error);
    return {
      success: false,
      error: "Failed to fetch job applications. Please try again.",
    };
  }
}

/**
 * Get a specific job application by ID for the authenticated user
 */
export async function getUserJobApplicationByIdAction(
  applicationId: string
): Promise<{
  success: boolean;
  data?: JobApplicationWithDetails;
  error?: string;
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/login");
    }

    const application = await db
      .select({
        // Application fields
        applicationId: jobApplications.id,
        applicationStatus: jobApplications.status,
        applicationCoverLetter: jobApplications.coverLetter,
        applicationResumeUrl: jobApplications.resumeUrl,
        applicationCreatedAt: jobApplications.createdAt,
        applicationUpdatedAt: jobApplications.updatedAt,

        // Job fields
        jobId: jobs.id,
        jobTitle: jobs.title,
        jobLocation: jobs.location,

        // Employer/Company fields
        companyName: users.companyName,
        companyLogo: users.companyLogo,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (application.length === 0) {
      return {
        success: false,
        error: "Application not found",
      };
    }

    const app = application[0];

    // Verify the application belongs to the authenticated user
    const applicationOwnership = await db
      .select()
      .from(jobApplications)
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (
      applicationOwnership.length === 0 ||
      applicationOwnership[0].applicantId !== session.user.id
    ) {
      return {
        success: false,
        error: "Unauthorized access to this application",
      };
    }

    const timeAgo = getTimeAgo(app.applicationCreatedAt);

    const formattedApplication: JobApplicationWithDetails = {
      id: app.applicationId,
      jobTitle: app.jobTitle,
      company: app.companyName || "Company Name Not Available",
      location: app.jobLocation,
      appliedDate: `Applied ${timeAgo}`,
      status: app.applicationStatus,
      logo: app.companyLogo || undefined,
      jobId: app.jobId,
      coverLetter: app.applicationCoverLetter || undefined,
      resumeUrl: app.applicationResumeUrl || undefined,
      createdAt: app.applicationCreatedAt,
      updatedAt: app.applicationUpdatedAt,
    };

    return {
      success: true,
      data: formattedApplication,
    };
  } catch (error) {
    console.error("Error fetching job application:", error);
    return {
      success: false,
      error: "Failed to fetch job application. Please try again.",
    };
  }
}

/**
 * Get application statistics for the authenticated user
 */
export async function getUserApplicationStatsAction(): Promise<{
  success: boolean;
  data?: {
    total: number;
    submitted: number;
    underReview: number;
    shortlisted: number;
    rejected: number;
    interviewed: number;
    offers: number;
  };
  error?: string;
}> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      redirect("/login");
    }

    const applications = await db
      .select({
        status: jobApplications.status,
      })
      .from(jobApplications)
      .where(eq(jobApplications.applicantId, session.user.id));

    const stats = {
      total: applications.length,
      submitted: applications.filter((app) => app.status === "Submitted")
        .length,
      underReview: applications.filter((app) => app.status === "Under review")
        .length,
      shortlisted: applications.filter((app) => app.status === "Shortlisted")
        .length,
      rejected: applications.filter((app) => app.status === "Rejected").length,
      interviewed: applications.filter((app) => app.status === "Interviewed")
        .length,
      offers: applications.filter((app) => app.status === "Offer").length,
    };

    return {
      success: true,
      data: stats,
    };
  } catch (error) {
    console.error("Error fetching application stats:", error);
    return {
      success: false,
      error: "Failed to fetch application statistics. Please try again.",
    };
  }
}

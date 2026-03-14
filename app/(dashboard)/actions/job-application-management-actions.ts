"use server";

import { db } from "@/lib/db/drizzle";
import { jobApplications, jobs, users, experiences } from "@/lib/db/schema";
import { eq, and, desc, sql } from "drizzle-orm";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Interface for job application with user details
export interface JobApplicationWithUser {
  id: string;
  name: string;
  email: string;
  status:
    | "Submitted"
    | "Under review"
    | "Shortlisted"
    | "Rejected"
    | "Interviewed"
    | "Offer";
  coverLetter?: string | null;
  resumeUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // User profile details
  avatar?: string | null;
  phone?: string | null;
  location?: string | null;
  experience?: number | null;
  skills?: string | null;
  // Most recent job experience
  recentJobTitle?: string | null;
  recentCompany?: string | null;
}

// Interface for job details with company info
export interface JobWithCompany {
  id: string;
  title: string;
  description: string;
  location: string;
  locationType: "remote" | "onsite" | "hybrid";
  industry: string;
  jobType: "full-time" | "part-time" | "contract" | "internship" | "freelance";
  salaryRange: string;
  currency: string;
  deadline: Date;
  employerId: string;
  companyName?: string | null;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
  status: "active" | "closed";
  createdAt: Date;
  applicationsCount: number;
}

// Get job applications for a specific job (only for job owner)
export async function getJobApplicationsAction(jobId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    const userId = session.user.id;

    // First, verify that the user owns this job
    const [job] = await db
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
        employerId: jobs.employerId,
        status: jobs.status,
        createdAt: jobs.createdAt,
        companyName: users.companyName,
        companyLogo: users.companyLogo,
        companyWebsite: users.companyWebsite,
        companyEmail: users.companyEmail,
      })
      .from(jobs)
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(eq(jobs.id, jobId))
      .limit(1);

    if (!job) {
      return { success: false, message: "Job not found" };
    }

    if (job.employerId !== userId) {
      return {
        success: false,
        message:
          "Unauthorized: You can only view applications for your own job posts",
      };
    }

    // Fetch applications with user details and most recent experience
    const applications = await db
      .select({
        id: jobApplications.id,
        status: jobApplications.status,
        coverLetter: jobApplications.coverLetter,
        resumeUrl: jobApplications.resumeUrl,
        createdAt: jobApplications.createdAt,
        updatedAt: jobApplications.updatedAt,
        // User details
        name: users.fullName,
        email: users.email,
        avatar: users.profilePicture,
        phone: users.phone,
        location: users.location,
        experience: users.yearsOfExperience,
        skills: users.skills,
        // Most recent experience subquery
        recentJobTitle: sql<string | null>`(
          SELECT ${experiences.jobTitle}
          FROM ${experiences}
          WHERE ${experiences.userId} = ${users.id}
          ORDER BY 
            CASE WHEN ${experiences.currentlyWorking} = true THEN 1 ELSE 0 END DESC,
            ${experiences.startYear} DESC,
            ${experiences.startMonth} DESC
          LIMIT 1
        )`,
        recentCompany: sql<string | null>`(
          SELECT ${experiences.company}
          FROM ${experiences}
          WHERE ${experiences.userId} = ${users.id}
          ORDER BY 
            CASE WHEN ${experiences.currentlyWorking} = true THEN 1 ELSE 0 END DESC,
            ${experiences.startYear} DESC,
            ${experiences.startMonth} DESC
          LIMIT 1
        )`,
      })
      .from(jobApplications)
      .innerJoin(users, eq(jobApplications.applicantId, users.id))
      .where(eq(jobApplications.jobId, jobId))
      .orderBy(desc(jobApplications.createdAt));

    // Count total applications
    const applicationsCount = applications.length;

    // Transform job data
    const jobData: JobWithCompany = {
      id: job.id,
      title: job.title,
      description: job.description,
      location: job.location,
      locationType: job.locationType,
      industry: job.industry,
      jobType: job.jobType,
      salaryRange: job.salaryRange,
      currency: job.currency,
      deadline: job.deadline,
      employerId: job.employerId,
      companyName: job.companyName,
      companyLogo: job.companyLogo,
      companyWebsite: job.companyWebsite,
      companyEmail: job.companyEmail,
      status: job.status,
      createdAt: job.createdAt,
      applicationsCount,
    };

    // Transform applications data
    const transformedApplications: JobApplicationWithUser[] = applications.map(
      (app) => ({
        id: app.id,
        name: app.name || "Unknown",
        email: app.email || "",
        status: app.status,
        coverLetter: app.coverLetter,
        resumeUrl: app.resumeUrl,
        createdAt: app.createdAt,
        updatedAt: app.updatedAt,
        avatar: app.avatar,
        phone: app.phone,
        location: app.location,
        experience: app.experience,
        skills: app.skills,
        recentJobTitle: app.recentJobTitle,
        recentCompany: app.recentCompany,
      })
    );

    return {
      success: true,
      data: {
        job: jobData,
        applications: transformedApplications,
      },
    };
  } catch (error) {
    console.error("Error fetching job applications:", error);
    return { success: false, message: "Failed to fetch job applications" };
  }
}

// Update application status (only for job owner)
export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus:
    | "Submitted"
    | "Under review"
    | "Shortlisted"
    | "Rejected"
    | "Interviewed"
    | "Offer"
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      redirect("/login");
    }

    const userId = session.user.id;

    // Verify that the user owns the job for this application
    const [application] = await db
      .select({
        applicationId: jobApplications.id,
        jobId: jobApplications.jobId,
        employerId: jobs.employerId,
      })
      .from(jobApplications)
      .innerJoin(jobs, eq(jobApplications.jobId, jobs.id))
      .where(eq(jobApplications.id, applicationId))
      .limit(1);

    if (!application) {
      return { success: false, message: "Application not found" };
    }

    if (application.employerId !== userId) {
      return {
        success: false,
        message:
          "Unauthorized: You can only update applications for your own job posts",
      };
    }

    // Update the application status
    await db
      .update(jobApplications)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(jobApplications.id, applicationId));

    return {
      success: true,
      message: "Application status updated successfully",
    };
  } catch (error) {
    console.error("Error updating application status:", error);
    return { success: false, message: "Failed to update application status" };
  }
}

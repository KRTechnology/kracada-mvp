/**
 * Utility functions for job application data formatting and processing
 */

import { JobApplicationWithDetails } from "@/app/(dashboard)/actions/job-application-data-actions";

/**
 * Calculate time ago from a date with various time units
 */
export function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInWeeks = Math.floor(diffInDays / 7);
  const diffInMonths = Math.floor(diffInDays / 30);

  if (diffInMinutes < 1) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? "" : "s"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? "" : "s"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? "" : "s"} ago`;
  } else if (diffInWeeks < 4) {
    return `${diffInWeeks} week${diffInWeeks === 1 ? "" : "s"} ago`;
  } else {
    return `${diffInMonths} month${diffInMonths === 1 ? "" : "s"} ago`;
  }
}

/**
 * Get status color class for application status
 */
export function getApplicationStatusColor(
  status: JobApplicationWithDetails["status"]
): string {
  switch (status) {
    case "Submitted":
      return "bg-neutral-400";
    case "Under review":
      return "bg-blue-500";
    case "Shortlisted":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-500";
    case "Interviewed":
      return "bg-purple-500";
    case "Offer":
      return "bg-yellow-500";
    default:
      return "bg-neutral-400";
  }
}

/**
 * Get status text color for better contrast
 */
export function getApplicationStatusTextColor(
  status: JobApplicationWithDetails["status"]
): string {
  switch (status) {
    case "Submitted":
    case "Under review":
    case "Shortlisted":
    case "Rejected":
    case "Interviewed":
      return "text-white";
    case "Offer":
      return "text-neutral-900"; // Dark text on yellow background
    default:
      return "text-white";
  }
}

/**
 * Sort applications by various criteria
 */
export function sortApplications(
  applications: JobApplicationWithDetails[],
  sortBy: "date" | "status" | "company" | "title" = "date",
  order: "asc" | "desc" = "desc"
): JobApplicationWithDetails[] {
  return [...applications].sort((a, b) => {
    let comparison = 0;

    switch (sortBy) {
      case "date":
        comparison = a.createdAt.getTime() - b.createdAt.getTime();
        break;
      case "status":
        comparison = a.status.localeCompare(b.status);
        break;
      case "company":
        comparison = a.company.localeCompare(b.company);
        break;
      case "title":
        comparison = a.jobTitle.localeCompare(b.jobTitle);
        break;
      default:
        comparison = 0;
    }

    return order === "desc" ? -comparison : comparison;
  });
}

/**
 * Filter applications by status
 */
export function filterApplicationsByStatus(
  applications: JobApplicationWithDetails[],
  statuses: JobApplicationWithDetails["status"][]
): JobApplicationWithDetails[] {
  if (statuses.length === 0) return applications;
  return applications.filter((app) => statuses.includes(app.status));
}

/**
 * Get application statistics
 */
export function getApplicationStats(applications: JobApplicationWithDetails[]) {
  const total = applications.length;
  const submitted = applications.filter(
    (app) => app.status === "Submitted"
  ).length;
  const underReview = applications.filter(
    (app) => app.status === "Under review"
  ).length;
  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;
  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;
  const interviewed = applications.filter(
    (app) => app.status === "Interviewed"
  ).length;
  const offers = applications.filter((app) => app.status === "Offer").length;

  return {
    total,
    submitted,
    underReview,
    shortlisted,
    rejected,
    interviewed,
    offers,
    responseRate:
      total > 0
        ? Math.round(
            ((underReview + shortlisted + interviewed + offers) / total) * 100
          )
        : 0,
    successRate: total > 0 ? Math.round((offers / total) * 100) : 0,
  };
}

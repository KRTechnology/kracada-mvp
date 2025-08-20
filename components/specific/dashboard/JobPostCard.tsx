"use client";

import { useState } from "react";
import { MoreVertical, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobPostDropdown } from "./JobPostDropdown";
import {
  deleteJobAction,
  toggleJobStatusAction,
} from "@/app/(dashboard)/actions/job-actions";
import { toast } from "sonner";

interface JobPostCardProps {
  job: {
    id: string;
    jobTitle: string;
    company: string;
    location: string;
    applicantsCount: number;
    viewsCount: number;
    isRemote?: boolean;
    companyLogo?: string | null;
    status: "active" | "closed";
  };
  onEdit?: (jobId: string) => void;
}

export function JobPostCard({ job, onEdit }: JobPostCardProps) {
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleEdit = () => {
    if (onEdit) {
      onEdit(job.id);
    }
  };

  const handleCloseJob = async () => {
    try {
      const result = await toggleJobStatusAction(job.id);
      if (result.success) {
        toast.success(result.message);
        // The server action will revalidate the dashboard, so no need to reload
      } else {
        toast.error(result.message || "Failed to toggle job status");
      }
    } catch (error) {
      console.error("Error toggling job status:", error);
      toast.error("Failed to toggle job status");
    }
  };

  const handleViewApplications = () => {
    router.push(`/jobs/${job.id}/applications`);
  };

  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow relative">
      <div className="flex items-start mb-3">
        {/* Company Logo */}
        <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center mr-2 overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-600 rounded flex items-center justify-center">
              <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">
                {job.company.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Job Details Section */}
        <div className="flex-1">
          {/* Job Title */}
          <h3 className="font-semibold text-neutral-900 dark:text-white text-base mb-1">
            {job.jobTitle}
          </h3>

          {/* Company Name */}
          <span className="text-neutral-600 dark:text-white text-sm">
            {job.company}
          </span>
        </div>

        {/* Right Side - More Options and Location */}
        <div className="flex flex-col items-end">
          {/* More Options Icon */}
          <button
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mb-2 relative"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Dropdown Menu */}
          <JobPostDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
            onEdit={handleEdit}
            onCloseJob={handleCloseJob}
          />

          {/* Location */}
          <div className="flex items-center text-neutral-500 dark:text-white text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span>
              {job.isRemote ? "Remote - " : ""}Based in {job.location}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Section - Pills and Button */}
      <div className="flex items-center justify-between">
        {/* Pills for Applicants and Views */}
        <div className="flex items-center space-x-2">
          {/* Applicants Pill */}
          <div className="flex items-center px-3 py-2 bg-jobPill-applicants-light-bg dark:bg-jobPill-applicants-dark-bg border border-jobPill-applicants-light-border dark:border-jobPill-applicants-dark-border rounded-full">
            <div className="w-2 h-2 bg-jobPill-applicants-light-dot dark:bg-jobPill-applicants-dark-dot rounded-full mr-2"></div>
            <span className="text-jobPill-applicants-light-text dark:text-jobPill-applicants-dark-text text-sm font-medium">
              {job.applicantsCount} Applicants
            </span>
          </div>

          {/* Views Pill */}
          <div className="flex items-center px-3 py-2 bg-jobPill-views-light-bg dark:bg-jobPill-views-dark-bg border border-jobPill-views-light-border dark:border-jobPill-views-dark-border rounded-full">
            <div className="w-2 h-2 bg-jobPill-views-light-dot dark:bg-jobPill-views-dark-dot rounded-full mr-2"></div>
            <span className="text-jobPill-views-light-text dark:text-jobPill-views-dark-text text-sm font-medium">
              {job.viewsCount} views
            </span>
          </div>
        </div>

        {/* Conditional Button based on Job Status */}
        {job.status === "active" ? (
          <button
            onClick={handleViewApplications}
            className="px-4 py-2 bg-viewButton-light-bg dark:bg-viewButton-dark-bg border border-viewButton-light-border dark:border-viewButton-dark-border rounded-lg text-viewButton-light-text dark:text-viewButton-dark-text text-sm font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
          >
            View Applications
          </button>
        ) : (
          <button
            onClick={handleCloseJob}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 border border-green-600 text-white text-sm font-medium transition-colors rounded-lg"
          >
            Make Active
          </button>
        )}
      </div>
    </div>
  );
}

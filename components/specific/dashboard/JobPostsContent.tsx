"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubTabSwitcher, JobPostsSubTabType } from "./SubTabSwitcher";
import { JobPostCard } from "./JobPostCard";
import { Pagination } from "./Pagination";
import { getEmployerJobsAction } from "@/app/(dashboard)/actions/job-actions";
import { toast } from "sonner";
import { EditJobPostDialog } from "./EditJobPostDialog";

// Types for the job data
interface JobData {
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
  companyName: string;
  companyLogo?: string | null;
  companyWebsite?: string | null;
  companyEmail?: string | null;
  multimediaContent?: string | null;
  requiredSkills: string;
  status: "active" | "closed";
  employerId: string;
  createdAt: Date;
  updatedAt: Date;
  applicantsCount: number;
  viewsCount: number;
}

const ITEMS_PER_PAGE = 5;

interface JobPostsContentProps {
  refreshTrigger?: number;
}

export function JobPostsContent({ refreshTrigger = 0 }: JobPostsContentProps) {
  const [activeSubTab, setActiveSubTab] =
    useState<JobPostsSubTabType>("Active Jobs");
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Edit modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<JobData | null>(
    null
  );

  // Fetch jobs on component mount and when refreshTrigger changes
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        const result = await getEmployerJobsAction();
        if (result.success && result.data) {
          setJobs(result.data);
        } else {
          toast.error(result.message || "Failed to fetch jobs");
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, [refreshTrigger]);

  // Filter jobs for active and closed
  const activeJobs = jobs.filter((job) => job.status === "active");
  const closedJobs = jobs.filter((job) => job.status === "closed");

  // Job post tabs with counts
  const jobPostTabs = [
    {
      id: "Active Jobs" as JobPostsSubTabType,
      label: "Active Jobs",
      count: activeJobs.length,
    },
    {
      id: "Closed Jobs" as JobPostsSubTabType,
      label: "Closed Jobs",
      count: closedJobs.length,
    },
  ];

  const handleSubTabChange = (tab: JobPostsSubTabType) => {
    setActiveSubTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Wrapper function to handle type conversion for SubTabSwitcher
  const handleTabChangeWrapper = (tab: any) => {
    if (tab === "Active Jobs" || tab === "Closed Jobs") {
      handleSubTabChange(tab);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditJob = (jobId: string) => {
    const job = jobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJobForEdit(job);
      setIsEditModalOpen(true);
    }
  };

  const getDataForTab = (tab: JobPostsSubTabType) => {
    switch (tab) {
      case "Active Jobs":
        return activeJobs;
      case "Closed Jobs":
        return closedJobs;
      default:
        return [];
    }
  };

  const data = getDataForTab(activeSubTab);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const renderEmptyState = (tab: JobPostsSubTabType) => {
    const emptyStates = {
      "Active Jobs": {
        icon: "💼",
        title: "No active job posts yet",
        description:
          "Create your first job post to start attracting talented candidates. Active jobs are visible to job seekers and can receive applications.",
      },
      "Closed Jobs": {
        icon: "🔒",
        title: "No closed job posts yet",
        description:
          "Closed jobs are no longer accepting applications. You can view and manage your closed job postings here.",
      },
    };

    const state = emptyStates[tab];

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">{state.icon}</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          {state.title}
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          {state.description}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-orange-500 border-t-transparent mb-4"></div>
          <p className="text-neutral-600 dark:text-neutral-400">
            Loading jobs...
          </p>
        </div>
      );
    }

    if (currentData.length === 0) {
      return renderEmptyState(activeSubTab);
    }

    return (
      <div className="space-y-4">
        {currentData.map((job, index) => (
          <motion.div
            key={job.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}
          >
            <JobPostCard
              job={{
                id: job.id.toString(),
                jobTitle: job.title,
                company: job.companyName,
                location: job.location,
                applicantsCount: job.applicantsCount || 0,
                viewsCount: job.viewsCount || 0,
                isRemote: job.locationType === "remote",
                companyLogo: job.companyLogo,
                status: job.status,
              }}
              onEdit={handleEditJob}
            />
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SubTab Switcher */}
      <div className="pb-4">
        <SubTabSwitcher
          activeTab={activeSubTab}
          onTabChange={handleTabChangeWrapper}
          tabs={jobPostTabs}
          layoutId="job-posts-subtab-underline"
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Edit Job Modal */}
      {selectedJobForEdit && (
        <EditJobPostDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          jobData={{
            id: selectedJobForEdit.id,
            title: selectedJobForEdit.title,
            description: selectedJobForEdit.description,
            location: selectedJobForEdit.location,
            locationType: selectedJobForEdit.locationType,
            industry: selectedJobForEdit.industry,
            jobType: selectedJobForEdit.jobType,
            salaryRange: selectedJobForEdit.salaryRange,
            currency: selectedJobForEdit.currency,
            deadline: selectedJobForEdit.deadline,
            companyName: selectedJobForEdit.companyName,
            companyLogo: selectedJobForEdit.companyLogo,
            requiredSkills: selectedJobForEdit.requiredSkills,
          }}
        />
      )}
    </div>
  );
}

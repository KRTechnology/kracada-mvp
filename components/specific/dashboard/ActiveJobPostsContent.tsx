"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

interface ActiveJobPostsContentProps {
  refreshTrigger?: number;
}

export function ActiveJobPostsContent({
  refreshTrigger = 0,
}: ActiveJobPostsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<JobData | null>(
    null
  );

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

  // Filter only active jobs
  const activeJobs = jobs.filter((job) => job.status === "active");

  const totalPages = Math.ceil(activeJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = activeJobs.slice(startIndex, endIndex);

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

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📝</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No active job posts yet
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Create your first job post to start attracting qualified candidates.
        </p>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (currentData.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <AnimatePresence mode="wait">
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
                  id: job.id,
                  jobTitle: job.title,
                  company: job.companyName,
                  location: job.location,
                  applicantsCount: job.applicantsCount,
                  viewsCount: job.viewsCount,
                  isRemote: job.locationType === "remote",
                  companyLogo: job.companyLogo,
                  status: job.status,
                }}
                onEdit={handleEditJob}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      {/* Edit Job Post Dialog */}
      {selectedJobForEdit && (
        <EditJobPostDialog
          open={isEditModalOpen}
          onOpenChange={setIsEditModalOpen}
          jobData={selectedJobForEdit}
        />
      )}
    </div>
  );
}

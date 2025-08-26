"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { JobPostCard } from "./JobPostCard";
import { Pagination } from "./Pagination";
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

interface ClosedJobPostsContentProps {
  jobs: JobData[];
}

export function ClosedJobPostsContent({ jobs }: ClosedJobPostsContentProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedJobForEdit, setSelectedJobForEdit] = useState<JobData | null>(
    null
  );

  // Filter only closed jobs
  const closedJobs = jobs.filter((job) => job.status === "closed");

  const totalPages = Math.ceil(closedJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = closedJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditJob = (jobId: string) => {
    const job = closedJobs.find((j) => j.id === jobId);
    if (job) {
      setSelectedJobForEdit(job);
      setIsEditModalOpen(true);
    }
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">📋</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No closed job posts yet
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Job posts that are no longer accepting applications will appear here.
        </p>
      </div>
    );
  };

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
                  company: job.companyName || "Company Not Specified",
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubTabSwitcher, JobPostsSubTabType } from "./SubTabSwitcher";
import { JobPostCard } from "./JobPostCard";
import { Pagination } from "./Pagination";
import { jobsData, JobItem } from "@/lib/data/jobs-data";

// Filter jobs for active and closed (for now, all jobs are considered active)
const activeJobs = jobsData.filter(
  (job) => job.applicantsCount && job.viewsCount
);
const closedJobs: JobItem[] = []; // Empty for now, can be populated later

const ITEMS_PER_PAGE = 5;

export function JobPostsContent() {
  const [activeSubTab, setActiveSubTab] =
    useState<JobPostsSubTabType>("Active Jobs");
  const [currentPage, setCurrentPage] = useState(1);

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
                company: job.company,
                location: job.location,
                applicantsCount: job.applicantsCount || 0,
                viewsCount: job.viewsCount || 0,
                isRemote: job.isRemote,
              }}
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
    </div>
  );
}

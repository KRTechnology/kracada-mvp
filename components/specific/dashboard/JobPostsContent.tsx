"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubTabSwitcher, JobPostsSubTabType } from "./SubTabSwitcher";

export function JobPostsContent() {
  const [activeSubTab, setActiveSubTab] =
    useState<JobPostsSubTabType>("Active Jobs");

  // Job post tabs
  const jobPostTabs = [
    { id: "Active Jobs" as JobPostsSubTabType, label: "Active Jobs", count: 0 },
    { id: "Closed Jobs" as JobPostsSubTabType, label: "Closed Jobs", count: 0 },
  ];

  const handleSubTabChange = (tab: JobPostsSubTabType) => {
    setActiveSubTab(tab);
  };

  // Wrapper function to handle type conversion for SubTabSwitcher
  const handleTabChangeWrapper = (tab: any) => {
    if (tab === "Active Jobs" || tab === "Closed Jobs") {
      handleSubTabChange(tab);
    }
  };

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
          {renderEmptyState(activeSubTab)}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

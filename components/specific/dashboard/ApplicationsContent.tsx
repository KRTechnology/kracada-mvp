"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplicationCard } from "./ApplicationCard";
import { Pagination } from "./Pagination";
import { applicationsData, JobApplication } from "@/lib/data/applications-data";

const ITEMS_PER_PAGE = 5;

export function ApplicationsContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(applicationsData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = applicationsData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-neutral-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No applications yet
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Track your job applications here. When you apply to jobs, they will
          appear in this section with their current status.
        </p>
      </div>
    );
  };

  const renderContent = () => {
    if (currentApplications.length === 0) {
      return renderEmptyState();
    }

    return (
      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {currentApplications.map((application, index) => (
            <motion.div
              key={application.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ApplicationCard application={application} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Applications Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">
          Applications
        </h2>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
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

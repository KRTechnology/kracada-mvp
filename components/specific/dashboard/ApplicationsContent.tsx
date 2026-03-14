"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApplicationCard } from "./ApplicationCard";
import { Pagination } from "./Pagination";
import {
  JobApplicationWithDetails,
  getUserJobApplicationsAction,
} from "@/app/(dashboard)/actions/job-application-data-actions";

const ITEMS_PER_PAGE = 5;

interface ApplicationsContentProps {
  applications?: JobApplicationWithDetails[];
}

export function ApplicationsContent({
  applications: propApplications,
}: ApplicationsContentProps) {
  const [applications, setApplications] = useState<JobApplicationWithDetails[]>(
    propApplications || []
  );
  const [isLoading, setIsLoading] = useState(!propApplications);
  const [error, setError] = useState<string | null>(null);

  // Fetch applications if not provided as props
  useEffect(() => {
    if (!propApplications) {
      const fetchApplications = async () => {
        try {
          setIsLoading(true);
          const result = await getUserJobApplicationsAction();
          if (result.success) {
            setApplications(result.data || []);
          } else {
            setError(result.error || "Failed to fetch applications");
          }
        } catch (err) {
          setError("An unexpected error occurred");
        } finally {
          setIsLoading(false);
        }
      };

      fetchApplications();
    }
  }, [propApplications]);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = applications.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderLoadingState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-600 border-t-warm-200 rounded-full animate-spin mb-4"></div>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm">
          Loading applications...
        </p>
      </div>
    );
  };

  const renderErrorState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        </div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          Error loading applications
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          {error}
        </p>
      </div>
    );
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
    if (isLoading) {
      return renderLoadingState();
    }

    if (error) {
      return renderErrorState();
    }

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

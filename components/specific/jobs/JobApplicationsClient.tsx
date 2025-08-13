"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MoreVertical, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobApplication } from "@/lib/data/applications-data";
import { Pagination } from "@/components/specific/dashboard/Pagination";
import { ApplicationCard } from "./ApplicationCard";

interface JobApplicationsClientProps {
  applications: JobApplication[];
}

const ITEMS_PER_PAGE = 5;

export function JobApplicationsClient({
  applications,
}: JobApplicationsClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = applications.slice(startIndex, endIndex);

  const handleGoBack = () => {
    router.back();
  };

  const handlePageChange = async (page: number) => {
    setIsLoading(true);
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Simulate loading delay for better UX
    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "Submitted":
        return "bg-neutral-400";
      case "Under review":
        return "bg-blue-500";
      case "Shortlisted":
        return "bg-green-500";
      case "Rejected":
        return "bg-red-500";
      case "Interview":
        return "bg-purple-500";
      case "Offer":
        return "bg-yellow-500";
      default:
        return "bg-neutral-400";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Main Applications Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-dark rounded-2xl shadow-sm max-w-4xl mx-auto pb-6"
        >
          {/* Go Back Button */}
          <div className="p-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 border border-goBackButton-light dark:border-goBackButton-dark-border text-goBackButton-light dark:text-goBackButton-dark-text rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Go Back</span>
            </motion.button>
          </div>

          {/* Applications Header */}
          <div className="px-6 mb-6">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
              Applications
            </h1>
          </div>

          {/* Applications Content */}
          <div className="px-6 mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentPage}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="w-8 h-8 border-2 border-neutral-200 dark:border-neutral-600 border-t-warm-200 rounded-full animate-spin"></div>
                      <p className="text-neutral-500 dark:text-neutral-400 text-sm">
                        Loading applications...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {currentApplications.map((application, index) => (
                      <motion.div
                        key={application.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ApplicationCard
                          application={application}
                          getStatusColor={getStatusColor}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

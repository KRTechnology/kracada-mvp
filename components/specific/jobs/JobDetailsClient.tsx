"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { JobDetailsData } from "@/app/actions/home-actions";
import { JobApplicationDialog } from "@/components/specific/jobs/JobApplicationDialog";
import { AuthRequiredAlert } from "@/components/common/AuthRequiredAlert";
import {
  getJobApplicationStatusAction,
  withdrawJobApplicationAction,
  JobApplicationStatus,
} from "@/app/(dashboard)/actions/job-application-actions";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { Loader } from "@/components/common/Loader";
import { toast } from "sonner";

interface JobDetailsClientProps {
  job: JobDetailsData;
}

export function JobDetailsClient({ job }: JobDetailsClientProps) {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [isAuthAlertOpen, setIsAuthAlertOpen] = useState(false);
  const [applicationStatus, setApplicationStatus] =
    useState<JobApplicationStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [isLoadingBookmarkStatus, setIsLoadingBookmarkStatus] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Check application status when user is authenticated
  useEffect(() => {
    const checkApplicationStatus = async () => {
      if (status === "loading") return;

      if (session?.user?.id) {
        try {
          const result = await getJobApplicationStatusAction(job.id);
          if (result.success && result.data) {
            setApplicationStatus(result.data);
          }
        } catch (error) {
          console.error("Error checking application status:", error);
        }
      }
      setIsLoadingStatus(false);
    };

    checkApplicationStatus();
  }, [job.id, session, status]);

  // Check bookmark status when user is authenticated
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (status === "loading") return;

      if (session?.user?.id) {
        try {
          const result = await checkBookmarkStatusAction("job", job.id);
          if (result.success) {
            setIsSaved(result.isBookmarked);
          }
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        }
      }
      setIsLoadingBookmarkStatus(false);
    };

    checkBookmarkStatus();
  }, [job.id, session, status]);

  const handleGoBack = () => {
    router.back();
  };

  const handleApply = () => {
    // Check if user is authenticated
    if (status === "loading") return;

    if (!session) {
      setIsAuthAlertOpen(true);
      return;
    }

    // Check if user is trying to apply to their own job
    if (session.user?.id === job.employerId) {
      toast.error("You cannot apply to your own job posting");
      return;
    }

    setIsApplicationDialogOpen(true);
  };

  const handleWithdrawApplication = async () => {
    if (!session?.user?.id || !applicationStatus?.canWithdraw) return;

    setIsWithdrawing(true);
    try {
      const result = await withdrawJobApplicationAction(job.id);

      if (result.success) {
        toast.success(result.message);
        // Refresh application status
        const statusResult = await getJobApplicationStatusAction(job.id);
        if (statusResult.success && statusResult.data) {
          setApplicationStatus(statusResult.data);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error withdrawing application:", error);
      toast.error("Failed to withdraw application");
    } finally {
      setIsWithdrawing(false);
    }
  };

  const handleApplicationSuccess = async () => {
    // Refresh application status after successful application
    try {
      const result = await getJobApplicationStatusAction(job.id);
      if (result.success && result.data) {
        setApplicationStatus(result.data);
      }
    } catch (error) {
      console.error("Error refreshing application status:", error);
    }
  };

  const handleSave = async () => {
    // Check if user is authenticated
    if (status === "loading") return;

    if (!session) {
      setIsAuthAlertOpen(true);
      return;
    }

    setIsSaving(true);
    try {
      const result = await toggleBookmarkAction({
        contentType: "job",
        contentId: job.id,
      });

      if (result.success) {
        setIsSaved(result.isBookmarked || false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error saving bookmark:", error);
      toast.error("Failed to save bookmark");
    } finally {
      setIsSaving(false);
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
        {/* Main Job Details Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-dark rounded-2xl shadow-sm max-w-4xl mx-auto pb-6"
        >
          {/* Go Back Button - Now inside the card */}
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

          {/* Job Details Sections - All wrapped in one border, including Job Title */}
          <div className="mx-6 mb-10 p-6 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px] space-y-4">
            {/* Job Header Section */}
            <div className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {job.companyLogo ? (
                      <img
                        src={job.companyLogo}
                        alt={`${job.company} logo`}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-600 rounded flex items-center justify-center">
                        <span className="text-neutral-500 dark:text-neutral-400 text-sm font-medium">
                          {job.company.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Job Title and Company */}
                  <div className="flex-1">
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      {job.title}
                    </h1>
                    <p className="text-lg text-neutral-600 dark:text-white mb-2">
                      {job.company}
                    </p>
                    <div className="flex items-center text-neutral-500 dark:text-neutral-300">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>
                        {job.locationType === "remote"
                          ? `Remote - Based in ${job.location}`
                          : job.locationType === "hybrid"
                            ? `Hybrid - ${job.location}`
                            : job.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* More Options */}
                <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Salary Range */}
            <div className="p-4 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px]">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Salary Range
              </h2>
              <p className="text-neutral-700 dark:text-white font-semibold">
                {job.currency === "NGN"
                  ? "₦"
                  : job.currency === "USD"
                    ? "$"
                    : job.currency === "EUR"
                      ? "€"
                      : job.currency === "GBP"
                        ? "£"
                        : job.currency + " "}
                {job.salaryRange} per annum
              </p>
            </div>

            {/* Job Description */}
            <div className="p-4 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px]">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Job Description
              </h2>
              <div className="text-neutral-700 dark:text-white space-y-3">
                <p className="whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Industry */}
            <div className="p-4 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px]">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Industry
              </h2>
              <p className="text-neutral-700 dark:text-white capitalize">
                {job.industry}
              </p>
            </div>

            {/* Requirements */}
            <div className="p-4 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px]">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Requirements
              </h2>
              <ul className="text-neutral-700 dark:text-white space-y-2 list-disc list-inside">
                {job.requirements.map((requirement, index) => (
                  <li key={index}>{requirement}</li>
                ))}
              </ul>
            </div>

            {/* Application Deadline */}
            <div className="p-4 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px]">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Application Deadline
              </h2>
              <p className="text-neutral-700 dark:text-white">
                {new Date(job.deadline).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>

            {/* Company Information */}
            {job.companyDescription && (
              <div className="p-4 border border-sectionBorder-light dark:border-sectionBorder-darkSecondary rounded-[10px]">
                <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                  Company Information
                </h2>
                <p className="text-neutral-700 dark:text-white">
                  {job.companyDescription}
                </p>
              </div>
            )}

            {/* Job Skills */}
            <div>
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text text-sm font-medium rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {isLoadingStatus ? (
                  <div className="flex items-center justify-center py-2 min-h-[42px]">
                    <Loader size="sm" />
                  </div>
                ) : (
                  <>
                    {/* Application Button Logic */}
                    {!session ? (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApply}
                        className="bg-warm-200 hover:bg-warm-300 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm min-h-[42px] flex items-center justify-center"
                      >
                        Apply Now
                      </motion.button>
                    ) : session.user?.id === job.employerId ? (
                      <div className="py-2 px-4 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-lg font-medium text-center min-h-[42px] flex items-center justify-center">
                        This is your job posting
                      </div>
                    ) : applicationStatus?.hasApplied ? (
                      <>
                        {applicationStatus.canWithdraw ? (
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleWithdrawApplication}
                            disabled={isWithdrawing}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-400 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm flex items-center justify-center gap-2 min-h-[42px]"
                          >
                            {isWithdrawing ? (
                              <div className="flex items-center gap-2">
                                <Loader size="sm" color="border-white" inline />
                                <span>Withdrawing...</span>
                              </div>
                            ) : (
                              "Withdraw Application"
                            )}
                          </motion.button>
                        ) : (
                          <div className="py-2 px-4 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg font-medium text-center border border-green-200 dark:border-green-800 min-h-[42px] flex items-center justify-center">
                            Application {applicationStatus.status} - Cannot
                            withdraw
                          </div>
                        )}
                      </>
                    ) : (
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleApply}
                        className="bg-warm-200 hover:bg-warm-300 text-white py-2 px-4 rounded-lg font-medium transition-colors shadow-sm min-h-[42px] flex items-center justify-center"
                      >
                        Apply Now
                      </motion.button>
                    )}
                  </>
                )}

                {/* Save Button - Only show if not the job owner */}
                {session?.user?.id !== job.employerId && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSave}
                    disabled={isSaving || isLoadingBookmarkStatus}
                    className={`py-2 px-4 rounded-lg font-medium transition-colors shadow-sm border min-h-[42px] flex items-center justify-center gap-2 ${
                      isSaved
                        ? "bg-warm-200 text-white border-warm-200"
                        : "bg-white dark:bg-neutral-700 text-neutral-700 dark:text-white border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                    } ${isSaving || isLoadingBookmarkStatus ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {isSaving ? (
                      <div className="flex items-center gap-2">
                        <Loader
                          size="sm"
                          color={isSaved ? "border-white" : "border-current"}
                          inline
                        />
                        <span>{isSaved ? "Removing..." : "Saving..."}</span>
                      </div>
                    ) : isLoadingBookmarkStatus ? (
                      <div className="flex items-center gap-2">
                        <Loader size="sm" color="border-current" inline />
                        <span>Loading...</span>
                      </div>
                    ) : isSaved ? (
                      "Saved"
                    ) : (
                      "Save"
                    )}
                  </motion.button>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Disclaimer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4 max-w-4xl mx-auto mt-6"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white"
              >
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                  fill="currentColor"
                />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm text-orange-800 dark:text-orange-200 leading-relaxed">
                <strong className="font-semibold">Disclaimer:</strong> Kracada
                is not responsible for user-generated content. Posts are not
                pre-screened, and all responsibility lies with the original
                poster. Please report any content that violates our guidelines.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <JobApplicationDialog
        isOpen={isApplicationDialogOpen}
        onClose={() => setIsApplicationDialogOpen(false)}
        jobId={job.id}
        jobTitle={job.title}
        companyName={job.company}
        onApplicationSuccess={handleApplicationSuccess}
      />

      <AuthRequiredAlert
        isOpen={isAuthAlertOpen}
        onClose={() => setIsAuthAlertOpen(false)}
      />
    </div>
  );
}

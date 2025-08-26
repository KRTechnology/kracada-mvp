"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/dialog";
import { createJobApplicationAction } from "@/app/(dashboard)/actions/job-application-actions";
import {
  uploadCoverLetter,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
import { Loader } from "@/components/common/Loader";
import { toast } from "sonner";

interface JobApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  jobTitle: string;
  companyName: string;
  onApplicationSuccess?: () => void;
}

export function JobApplicationDialog({
  isOpen,
  onClose,
  jobId,
  jobTitle,
  companyName,
  onApplicationSuccess,
}: JobApplicationDialogProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [coverLetterUrl, setCoverLetterUrl] = useState<string | null>(null);
  const [coverLetterKey, setCoverLetterKey] = useState<string | null>(null);
  const [isUploadingCoverLetter, setIsUploadingCoverLetter] = useState(false);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [certification, setCertification] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");

  const handleSubmit = async () => {
    if (!session?.user?.id) {
      toast.error("You must be logged in to apply");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await createJobApplicationAction({
        jobId,
        coverLetterUrl: coverLetterUrl || undefined,
      });

      if (result.success) {
        setIsSubmitted(true);
        toast.success(result.message);
        onApplicationSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setIsSubmitting(false);
    setCoverLetterFile(null);
    setCoverLetterUrl(null);
    setCoverLetterKey(null);
    setPortfolioLink("");
    setCertification("");
    setLinkedinProfile("");
    onClose();
  };

  const handleViewApplicationStatus = () => {
    onClose();
    router.push("/jobs/applications");
  };

  const handleCoverLetterUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_FILE_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_FILE_SIZE) {
      toast.error(
        "Cover letter size exceeds 1MB limit. Please choose a smaller file."
      );
      event.target.value = "";
      return;
    }

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    if (!session?.user?.id) {
      toast.error("You must be logged in to upload files");
      return;
    }

    setIsUploadingCoverLetter(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", session.user.id);
      formData.append("fullName", session.user.name || "User");

      const result = await uploadCoverLetter(formData);

      if (result.success && result.url) {
        setCoverLetterUrl(result.url);
        setCoverLetterKey(result.key || null);
        setCoverLetterFile(file);
        toast.success("Cover letter uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload cover letter");
      }
    } catch (error) {
      console.error("Cover letter upload error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsUploadingCoverLetter(false);
    }

    // Reset input
    event.target.value = "";
  };

  const handleRemoveCoverLetter = async () => {
    if (coverLetterKey) {
      try {
        const result = await deleteUploadedFile(coverLetterKey);
        if (result.success) {
          setCoverLetterUrl(null);
          setCoverLetterKey(null);
          setCoverLetterFile(null);
          toast.success("Cover letter removed successfully");
        } else {
          toast.error("Failed to remove cover letter from storage");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while removing the file");
      }
    } else {
      setCoverLetterUrl(null);
      setCoverLetterKey(null);
      setCoverLetterFile(null);
      toast.success("Cover letter removed");
    }
  };

  const CoverLetterUploadArea = () => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#363231]">
        Upload your cover letter (optional)
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          coverLetterUrl
            ? "border-warm-200 bg-warm-50 dark:bg-warm-900/20"
            : "border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
        }`}
      >
        {coverLetterUrl ? (
          /* Cover Letter Uploaded State */
          <div className="space-y-4">
            <div className="w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>

            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-white mb-1">
                Cover Letter Uploaded Successfully
              </p>
              {coverLetterFile && (
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {coverLetterFile.name} •{" "}
                  {(coverLetterFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleRemoveCoverLetter}
              className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium transition-colors"
            >
              <X className="w-4 h-4 inline mr-1" />
              Remove
            </button>
          </div>
        ) : (
          /* Cover Letter Upload State */
          <div className="space-y-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleCoverLetterUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={isUploadingCoverLetter}
            />

            {isUploadingCoverLetter ? (
              <div className="flex flex-col items-center space-y-2">
                <Loader size="sm" />
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Uploading cover letter...
                </p>
              </div>
            ) : (
              <>
                <Upload className="w-8 h-8 mx-auto text-neutral-400 dark:text-neutral-500" />
                <div className="space-y-2">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="text-warm-200 font-medium">
                      Click to upload
                    </span>{" "}
                    <span className="text-[#535862]">or drag and drop</span>
                  </p>
                  <p className="text-xs text-[#535862]">
                    PDF only (Maximum 1MB)
                  </p>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-left">
          <DialogTitle className="text-xl font-bold text-[#334155]">
            Apply for this job
          </DialogTitle>
          <DialogDescription className="text-[#64748B]">
            Fill in the form below and submit your application
          </DialogDescription>
        </DialogHeader>

        {!isSubmitted ? (
          // Unsubmitted State
          <div className="space-y-6">
            {/* CV Notice */}
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
                CV Information
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Your current CV from your profile will be used for this
                application. Please ensure your CV is up to date before
                applying.
              </p>
            </div>

            {/* Upload Cover Letter */}
            <CoverLetterUploadArea />

            {/* Additional Information */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-[#363231]">
                Additional Information (optional)
              </h3>

              <div className="space-y-3">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#64748B]">
                    Portfolio link
                  </label>
                  <input
                    type="url"
                    placeholder="Input the link to your portfolio"
                    value={portfolioLink}
                    onChange={(e) => setPortfolioLink(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-[#334155] focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#64748B]">
                    Certification
                  </label>
                  <input
                    type="url"
                    placeholder="Input the link to your certification"
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-[#334155] focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent transition-colors"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#64748B]">
                    LinkedIn Profile
                  </label>
                  <input
                    type="url"
                    placeholder="Input the link to your linkedin profile"
                    value={linkedinProfile}
                    onChange={(e) => setLinkedinProfile(e.target.value)}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-[#334155] focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Submitted State
          <div className="text-center py-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-20 h-20 mx-auto mb-4 flex items-center justify-center"
            >
              <FileText className="w-10 h-10 text-warm-200" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-xl font-bold text-neutral-900 dark:text-white mb-2"
            >
              Application Submitted!
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-neutral-600 dark:text-neutral-400"
            >
              Thank you for applying to {companyName}.
            </motion.p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="bg-[#F8FAFC] dark:bg-[#121212] -mx-6 -mb-6 px-6 py-4 rounded-b-lg">
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-3 space-y-3 space-y-reverse">
            <button
              onClick={handleClose}
              className="px-4 py-2 border border-[#E2E8F0] rounded-lg bg-white dark:bg-neutral-800 text-neutral-700 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors h-10"
            >
              Close
            </button>

            {!isSubmitted ? (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-4 py-2 bg-warm-200 hover:bg-warm-300 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors h-10 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader size="sm" color="border-white" />
                    Submitting...
                  </>
                ) : (
                  "Submit application"
                )}
              </button>
            ) : (
              <button
                onClick={handleViewApplicationStatus}
                className="px-4 py-2 bg-warm-200 hover:bg-warm-300 text-white rounded-lg font-medium transition-colors h-10"
              >
                View Application Status
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Upload, X, FileText, Linkedin, Award, Globe } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/dialog";

interface JobApplicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  companyName: string;
}

export function JobApplicationDialog({
  isOpen,
  onClose,
  jobTitle,
  companyName,
}: JobApplicationDialogProps) {
  const router = useRouter();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null);
  const [portfolioLink, setPortfolioLink] = useState("");
  const [certification, setCertification] = useState("");
  const [linkedinProfile, setLinkedinProfile] = useState("");

  const handleSubmit = () => {
    // TODO: Implement actual submission logic
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setCvFile(null);
    setCoverLetterFile(null);
    setPortfolioLink("");
    setCertification("");
    setLinkedinProfile("");
    onClose();
  };

  const handleViewApplicationStatus = () => {
    onClose();
    router.push("/jobs/applications");
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: (file: File | null) => void
  ) => {
    const file = event.target.files?.[0];
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 5 * 1024 * 1024
    ) {
      setFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent,
    setFile: (file: File | null) => void
  ) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (
      file &&
      file.type === "application/pdf" &&
      file.size <= 5 * 1024 * 1024
    ) {
      setFile(file);
    }
  };

  const UploadArea = ({
    label,
    file,
    setFile,
    isRequired = false,
  }: {
    label: string;
    file: File | null;
    setFile: (file: File | null) => void;
    isRequired?: boolean;
  }) => (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-[#363231]">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          file
            ? "border-warm-200 bg-warm-50 dark:bg-warm-900/20"
            : "border-neutral-300 dark:border-neutral-600 hover:border-neutral-400 dark:hover:border-neutral-500"
        }`}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, setFile)}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={(e) => handleFileUpload(e, setFile)}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        {file ? (
          <div className="space-y-2">
            <FileText className="w-8 h-8 mx-auto text-warm-200" />
            <p className="text-sm font-medium text-neutral-900 dark:text-white">
              {file.name}
            </p>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-neutral-400 dark:text-neutral-500" />
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <span className="text-warm-200 font-medium">Click to upload</span>{" "}
              <span className="text-[#535862]">or drag and drop</span>
            </p>
            <p className="text-xs text-[#535862]">PDF. (Maximum 5mb)</p>
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
            {/* Upload CV */}
            <UploadArea
              label="Upload your CV"
              file={cvFile}
              setFile={setCvFile}
              isRequired={true}
            />

            {/* Upload Cover Letter */}
            <UploadArea
              label="Upload your cover letter (optional)"
              file={coverLetterFile}
              setFile={setCoverLetterFile}
            />

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
                disabled={!cvFile}
                className="px-4 py-2 bg-warm-200 hover:bg-warm-300 disabled:bg-neutral-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors h-10"
              >
                Submit application
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

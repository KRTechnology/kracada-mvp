"use client";

import { motion } from "framer-motion";
import { Upload, FileText, X } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface UploadedFile {
  file: File;
  id: string;
}

export default function CVUploadContent() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const validateFile = (file: File): boolean => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    const maxSize = 10 * 1024 * 1024; // 10MB

    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a PDF or DOCX file only.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("File size must be less than 10MB.");
      return false;
    }

    return true;
  };

  const handleFileUpload = useCallback((file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);

    // Simulate upload process
    setTimeout(() => {
      const uploadedFile: UploadedFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
      };

      setUploadedFile(uploadedFile);
      setIsUploading(false);
      toast.success("CV uploaded successfully!");
    }, 1500);
  }, []);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) {
        handleFileUpload(files[0]);
      }
    },
    [handleFileUpload]
  );

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async () => {
    if (!uploadedFile) {
      toast.error("Please upload a CV first.");
      return;
    }

    setIsUploading(true);

    // Simulate form submission
    setTimeout(() => {
      setIsUploading(false);
      toast.success("CV submitted for optimization!");

      // Navigate to success page
      router.push("/cv-optimization/success");
    }, 2000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-warm-100 dark:text-warm-200 text-base mb-3 font-medium">
              CV Optimization
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Upload & Submit your CV
            </h1>
          </motion.div>

          {/* Mobile Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl max-w-md mx-auto"
          >
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? "border-warm-200 bg-warm-50 dark:bg-warm-900/20"
                  : "border-neutral-300 dark:border-neutral-600 hover:border-warm-200 dark:hover:border-warm-200"
              } ${uploadedFile ? "border-green-300 bg-green-50 dark:bg-green-900/20" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mx-auto">
                    <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-neutral-900 dark:text-white text-sm">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute top-2 right-2 w-6 h-6 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <X className="w-3 h-3 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-medium text-warm-200 text-sm mb-1">
                      Click to upload
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400 text-xs">
                      or drag and drop
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-500 text-xs mt-1">
                      PDF or DOCX files.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!uploadedFile || isUploading}
              onClick={handleSubmit}
              className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                uploadedFile && !isUploading
                  ? "bg-warm-200 hover:bg-warm-300 text-white hover:shadow-xl"
                  : "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Submitting..." : "Submit CV for Optimization"}
            </motion.button>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-warm-100 dark:text-warm-200 text-lg mb-4 font-medium">
              CV Optimization
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Upload & Submit your CV
            </h1>
          </motion.div>

          {/* Desktop Upload Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-neutral-800 rounded-3xl p-12 shadow-xl max-w-2xl mx-auto"
          >
            {/* Upload Area */}
            <div
              className={`relative border-2 border-dashed rounded-2xl p-16 text-center transition-all duration-200 cursor-pointer ${
                isDragOver
                  ? "border-warm-200 bg-warm-50 dark:bg-warm-900/20"
                  : "border-neutral-300 dark:border-neutral-600 hover:border-warm-200 dark:hover:border-warm-200"
              } ${uploadedFile ? "border-green-300 bg-green-50 dark:bg-green-900/20" : ""}`}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileSelect}
                className="hidden"
              />

              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/50 rounded-xl flex items-center justify-center mx-auto">
                    <FileText className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white text-lg">
                      {uploadedFile.file.name}
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-400">
                      {formatFileSize(uploadedFile.file.size)}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile();
                    }}
                    className="absolute top-4 right-4 w-8 h-8 bg-neutral-100 dark:bg-neutral-700 rounded-full flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-600 transition-colors"
                  >
                    <X className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-xl flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-neutral-600 dark:text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-warm-200 text-lg mb-2">
                      Click to upload
                    </p>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      or drag and drop
                    </p>
                    <p className="text-neutral-500 dark:text-neutral-500 mt-2">
                      PDF or DOCX files.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!uploadedFile || isUploading}
              onClick={handleSubmit}
              className={`w-full mt-8 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${
                uploadedFile && !isUploading
                  ? "bg-warm-200 hover:bg-warm-300 text-white hover:shadow-xl"
                  : "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isUploading ? "Submitting..." : "Submit CV for Optimization"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

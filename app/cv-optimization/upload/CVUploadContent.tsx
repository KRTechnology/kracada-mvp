"use client";

import { motion } from "framer-motion";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { useState, useRef, useCallback, useEffect, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import {
  verifyPaymentAndUpdateOrder,
  getOrderByPaymentReference,
  updateOrderWithCV,
} from "@/app/(dashboard)/actions/cv-optimization-actions";
import { uploadCV } from "@/app/(dashboard)/actions/upload-actions";

interface UploadedFile {
  file: File;
  id: string;
}

interface OrderDetails {
  id: string;
  packageName: string;
  packagePrice: string;
  paymentStatus: string;
  orderStatus: string;
  paymentReference: string;
}

export default function CVUploadContent() {
  const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "verified" | "failed" | "unauthorized"
  >("loading");
  const [customerNotes, setCustomerNotes] = useState("");
  const [isPending, startTransition] = useTransition();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const paymentReference = searchParams.get("ref");

  // Verify payment on component mount
  useEffect(() => {
    async function verifyPayment() {
      if (!paymentReference) {
        setVerificationStatus("unauthorized");
        setIsVerifying(false);
        return;
      }

      if (!session?.user?.id) {
        setVerificationStatus("unauthorized");
        setIsVerifying(false);
        return;
      }

      try {
        // First, try to get existing order
        const orderResult = await getOrderByPaymentReference(paymentReference);

        if (orderResult.success && orderResult.order) {
          // Order exists, check payment status
          if (orderResult.order.paymentStatus === "successful") {
            setOrderDetails({
              id: orderResult.order.id,
              packageName: orderResult.order.packageName,
              packagePrice: orderResult.order.packagePrice,
              paymentStatus: orderResult.order.paymentStatus,
              orderStatus: orderResult.order.orderStatus,
              paymentReference: orderResult.order.paymentReference || "",
            });
            setVerificationStatus("verified");
          } else {
            // Try to verify payment with Paystack
            const verificationResult =
              await verifyPaymentAndUpdateOrder(paymentReference);

            if (verificationResult.success && verificationResult.verified) {
              setOrderDetails({
                id: verificationResult.order.id,
                packageName: verificationResult.order.packageName,
                packagePrice: verificationResult.order.packagePrice,
                paymentStatus: verificationResult.order.paymentStatus,
                orderStatus: verificationResult.order.orderStatus,
                paymentReference:
                  verificationResult.order.paymentReference || "",
              });
              setVerificationStatus("verified");
            } else {
              setVerificationStatus("failed");
            }
          }
        } else {
          // Order doesn't exist, payment reference might be invalid
          setVerificationStatus("failed");
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationStatus("failed");
      } finally {
        setIsVerifying(false);
      }
    }

    verifyPayment();
  }, [paymentReference, session]);

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

    const uploadedFile: UploadedFile = {
      file,
      id: Math.random().toString(36).substr(2, 9),
    };

    setUploadedFile(uploadedFile);
    toast.success("CV file selected!");
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
    if (!uploadedFile || !orderDetails || !session?.user) {
      toast.error("Missing required information.");
      return;
    }

    startTransition(async () => {
      try {
        setIsUploading(true);

        // Upload CV to Cloudflare
        const formData = new FormData();
        formData.append("file", uploadedFile.file);
        formData.append("userId", session.user?.id || "");
        formData.append(
          "fullName",
          `${session.user?.name || "CV Optimization User"}`
        );

        const uploadResult = await uploadCV(formData);

        if (!uploadResult.success) {
          toast.error(uploadResult.error || "Failed to upload CV");
          return;
        }

        // Update order with CV details
        const updateResult = await updateOrderWithCV(
          orderDetails.id,
          uploadResult.url!,
          uploadResult.key!,
          customerNotes.trim() || undefined
        );

        if (updateResult.success) {
          toast.success("CV submitted for optimization!");
          // Navigate to success page with order ID
          router.push(`/cv-optimization/success?orderId=${orderDetails.id}`);
        } else {
          toast.error(updateResult.error || "Failed to submit CV");
        }
      } catch (error) {
        console.error("CV submission error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setIsUploading(false);
      }
    });
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Show loading state during verification
  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-warm-200 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Verifying Payment
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please wait while we verify your payment...
          </p>
        </div>
      </div>
    );
  }

  // Show unauthorized state
  if (verificationStatus === "unauthorized") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Access Denied
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            You need to complete a payment to access this page. Please select a
            package and complete payment first.
          </p>
          <button
            onClick={() => router.push("/cv-optimization")}
            className="bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
          >
            Go to Packages
          </button>
        </div>
      </div>
    );
  }

  // Show payment verification failed state
  if (verificationStatus === "failed") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Payment Verification Failed
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            We couldn't verify your payment. Please try again or contact support
            if the issue persists.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/cv-optimization")}
              className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/contact")}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main upload interface (only shown if payment is verified)
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
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-400 mr-2" />
              <span className="text-green-100 text-sm font-medium">
                Payment Verified
              </span>
            </div>
            <p className="text-warm-100 dark:text-warm-200 text-base mb-3 font-medium">
              CV Optimization - {orderDetails?.packageName}
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Upload Your CV
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
              } ${
                uploadedFile
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : ""
              }`}
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
                      PDF or DOCX files (Max: 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any specific requirements or instructions for your CV optimization..."
                className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-warm-200 focus:border-warm-200 dark:bg-neutral-700 dark:text-white resize-none"
                rows={3}
                maxLength={500}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {customerNotes.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!uploadedFile || isUploading || isPending}
              onClick={handleSubmit}
              className={`w-full mt-6 py-3 px-6 rounded-xl font-semibold transition-all duration-200 shadow-lg ${
                uploadedFile && !isUploading && !isPending
                  ? "bg-warm-200 hover:bg-warm-300 text-white hover:shadow-xl"
                  : "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isUploading || isPending
                ? "Submitting..."
                : "Submit CV for Optimization"}
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
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center mb-6">
              <CheckCircle className="w-8 h-8 text-green-400 mr-3" />
              <span className="text-green-100 text-lg font-medium">
                Payment Verified - {orderDetails?.packageName}
              </span>
            </div>
            <p className="text-warm-100 dark:text-warm-200 text-lg mb-4 font-medium">
              CV Optimization
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Upload Your CV
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
              } ${
                uploadedFile
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : ""
              }`}
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
                      PDF or DOCX files (Max: 10MB)
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Customer Notes */}
            <div className="mt-8">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Additional Notes (Optional)
              </label>
              <textarea
                value={customerNotes}
                onChange={(e) => setCustomerNotes(e.target.value)}
                placeholder="Any specific requirements or instructions for your CV optimization..."
                className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-warm-200 focus:border-warm-200 dark:bg-neutral-700 dark:text-white resize-none"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                {customerNotes.length}/500 characters
              </p>
            </div>

            {/* Submit Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!uploadedFile || isUploading || isPending}
              onClick={handleSubmit}
              className={`w-full mt-8 py-4 px-8 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg ${
                uploadedFile && !isUploading && !isPending
                  ? "bg-warm-200 hover:bg-warm-300 text-white hover:shadow-xl"
                  : "bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 cursor-not-allowed"
              }`}
            >
              {isUploading || isPending
                ? "Submitting..."
                : "Submit CV for Optimization"}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

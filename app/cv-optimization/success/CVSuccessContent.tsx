"use client";

import { motion } from "framer-motion";
import { CheckCircle, FileText, Clock, ArrowRight, Home } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface PackageInfo {
  id: string;
  name: string;
  price: string;
  turnaroundTime: string;
  revisions: string;
}

const packageDetails: Record<string, PackageInfo> = {
  deluxe: {
    id: "deluxe",
    name: "Deluxe Package",
    price: "₦20,000",
    turnaroundTime: "3 working days",
    revisions: "Up to 2 revisions",
  },
  supreme: {
    id: "supreme",
    name: "Supreme Package",
    price: "₦30,000",
    turnaroundTime: "5 working days",
    revisions: "Up to 3 revisions",
  },
  premium: {
    id: "premium",
    name: "Premium Package",
    price: "₦45,000",
    turnaroundTime: "7 working days",
    revisions: "Up to 5 revisions",
  },
};

export default function CVSuccessContent() {
  const [selectedPackage, setSelectedPackage] = useState<PackageInfo | null>(
    null
  );
  const [submissionId, setSubmissionId] = useState<string>("");
  const router = useRouter();

  useEffect(() => {
    // Get selected package from localStorage
    const packageId = localStorage.getItem("selectedPackage");
    if (packageId && packageDetails[packageId]) {
      setSelectedPackage(packageDetails[packageId]);
    } else {
      // Fallback to deluxe if no package selected
      setSelectedPackage(packageDetails.deluxe);
    }

    // Generate submission ID
    const id = `CV-${Date.now().toString().slice(-6)}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    setSubmissionId(id);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  if (!selectedPackage) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto"
          >
            {/* Success Icon */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                CV Submitted Successfully!
              </h1>
              <p className="text-warm-100 dark:text-warm-200 text-sm">
                Your CV has been received and will be optimized according to
                your selected package.
              </p>
            </motion.div>

            {/* Submission Details Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl mb-6"
            >
              <div className="space-y-4">
                {/* Submission ID */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Submission ID
                  </span>
                  <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">
                    {submissionId}
                  </span>
                </div>

                {/* Package Details */}
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Package Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Package
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedPackage.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Price
                      </span>
                      <span className="text-sm font-medium text-warm-200">
                        {selectedPackage.price}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Turnaround
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedPackage.turnaroundTime}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Revisions
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {selectedPackage.revisions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl mb-6"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-warm-600 dark:text-warm-400">
                      1
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Our team will review your CV and begin the optimization
                    process
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-warm-600 dark:text-warm-400">
                      2
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    You'll receive the first draft within{" "}
                    {selectedPackage.turnaroundTime}
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-warm-600 dark:text-warm-400">
                      3
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Provide feedback and we'll make revisions as needed
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <Link
                href="/"
                className="w-full border border-white/20 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-2xl mx-auto"
          >
            {/* Success Icon */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                CV Submitted Successfully!
              </h1>
              <p className="text-warm-100 dark:text-warm-200 text-lg">
                Your CV has been received and will be optimized according to
                your selected package.
              </p>
            </motion.div>

            {/* Submission Details Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl mb-8"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left Column - Submission Info */}
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-lg">
                    Submission Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <span className="font-medium text-neutral-600 dark:text-neutral-400">
                        Submission ID
                      </span>
                      <span className="font-mono font-bold text-neutral-900 dark:text-white">
                        {submissionId}
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        CV file uploaded successfully
                      </span>
                    </div>
                    <div className="flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Submitted on {new Date().toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Column - Package Details */}
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-4 text-lg">
                    Package Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Package
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {selectedPackage.name}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Price
                      </span>
                      <span className="font-medium text-warm-200">
                        {selectedPackage.price}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Turnaround
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {selectedPackage.turnaroundTime}
                      </span>
                    </div>
                    <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                      <span className="text-neutral-600 dark:text-neutral-400">
                        Revisions
                      </span>
                      <span className="font-medium text-neutral-900 dark:text-white">
                        {selectedPackage.revisions}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl mb-8"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-6 text-lg">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-warm-600 dark:text-warm-400">
                      1
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Our team will review your CV and begin the optimization
                    process
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-warm-600 dark:text-warm-400">
                      2
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    You'll receive the first draft within{" "}
                    {selectedPackage.turnaroundTime}
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-lg font-bold text-warm-600 dark:text-warm-400">
                      3
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Provide feedback and we'll make revisions as needed
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                href="/dashboard"
                className="flex-1 bg-warm-200 hover:bg-warm-300 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>
              <Link
                href="/"
                className="flex-1 border border-white/20 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

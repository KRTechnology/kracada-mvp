"use client";

import { motion } from "framer-motion";
import { Users, Briefcase, FileText } from "lucide-react";

interface EmptyApplicationsStateProps {
  jobTitle: string;
}

export function EmptyApplicationsState({
  jobTitle,
}: EmptyApplicationsStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      {/* Icon Stack */}
      <div className="relative mb-8">
        <div className="w-24 h-24 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center">
          <Briefcase className="w-12 h-12 text-neutral-400 dark:text-neutral-500" />
        </div>
        <div className="absolute -top-2 -right-2 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
          <Users className="w-6 h-6 text-blue-500 dark:text-blue-400" />
        </div>
        <div className="absolute -bottom-2 -left-2 w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
          <FileText className="w-5 h-5 text-orange-500 dark:text-orange-400" />
        </div>
      </div>

      {/* Main Message */}
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3">
        No Applications Yet
      </h3>

      <p className="text-neutral-600 dark:text-neutral-400 mb-2 max-w-md">
        Your job posting for{" "}
        <span className="font-medium text-neutral-900 dark:text-white">
          "{jobTitle}"
        </span>{" "}
        hasn't received any applications yet.
      </p>

      <p className="text-sm text-neutral-500 dark:text-neutral-500 max-w-md leading-relaxed">
        Applications will appear here once candidates start applying. Make sure
        your job description is detailed and engaging to attract the right
        talent.
      </p>

      {/* Decorative Elements */}
      <div className="mt-8 flex space-x-2">
        <div className="w-2 h-2 bg-blue-300 dark:bg-blue-600 rounded-full animate-pulse"></div>
        <div
          className="w-2 h-2 bg-orange-300 dark:bg-orange-600 rounded-full animate-pulse"
          style={{ animationDelay: "0.2s" }}
        ></div>
        <div
          className="w-2 h-2 bg-green-300 dark:bg-green-600 rounded-full animate-pulse"
          style={{ animationDelay: "0.4s" }}
        ></div>
      </div>
    </motion.div>
  );
}

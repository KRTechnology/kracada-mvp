"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, MapPin, MoreVertical } from "lucide-react";
import { useRouter } from "next/navigation";
import { JobItem } from "@/lib/data/jobs-data";

interface JobDetailsClientProps {
  job: JobItem;
}

export function JobDetailsClient({ job }: JobDetailsClientProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const handleApply = () => {
    // TODO: Implement apply functionality
    console.log("Apply for job:", job.id);
  };

  const handleSave = () => {
    setIsSaved(!isSaved);
    // TODO: Implement save functionality
    console.log("Save job:", job.id, !isSaved);
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
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Go Back Button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={handleGoBack}
          className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Go Back</span>
        </motion.button>

        {/* Main Job Details Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm max-w-4xl mx-auto"
        >
          {/* Job Header Section */}
          <div className="p-6 border-b border-neutral-100 dark:border-neutral-700">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Company Logo Placeholder */}
                <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <div className="w-12 h-12 bg-neutral-100 dark:bg-neutral-600 rounded"></div>
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
                    <span>Remote - Based in {job.location}</span>
                  </div>
                </div>
              </div>

              {/* More Options */}
              <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Job Details Sections */}
          <div className="p-6 space-y-6">
            {/* Salary Range */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Salary Range
              </h2>
              <p className="text-neutral-700 dark:text-white font-semibold">
                ₦6,000,000 - ₦8,500,000 per annum
              </p>
            </div>

            {/* Job Description */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Job Description
              </h2>
              <div className="text-neutral-700 dark:text-white space-y-3">
                <p>
                  {job.company} is seeking a talented {job.title} to join our
                  fast-growing engineering team. You will work closely with
                  product managers, designers, and backend developers to create
                  seamless user experiences across web and mobile platforms.
                </p>
                <p>
                  Your role will include translating UI/UX designs into
                  high-quality code, optimizing components for maximum
                  performance, and contributing to the development of scalable,
                  reliable solutions.
                </p>
              </div>
            </div>

            {/* Industry */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Industry
              </h2>
              <p className="text-neutral-700 dark:text-white">
                Information Technology and Services
              </p>
            </div>

            {/* Requirements */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Requirements
              </h2>
              <ul className="text-neutral-700 dark:text-white space-y-2 list-disc list-inside">
                <li>
                  4+ years of experience in frontend development (React, Vue.js,
                  or Angular preferred).
                </li>
                <li>Strong understanding of HTML5, CSS3, JavaScript (ES6+).</li>
                <li>
                  Familiarity with RESTful APIs and modern authorization
                  mechanisms.
                </li>
                <li>Experience with version control systems like Git.</li>
                <li>Excellent problem-solving and communication skills.</li>
                <li>
                  Bachelor's degree in Computer Science or related field is
                  preferred.
                </li>
              </ul>
            </div>

            {/* Application Deadline */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
                Application Deadline
              </h2>
              <p className="text-neutral-700 dark:text-white">May 30, 2025</p>
            </div>

            {/* Company Information */}
            <div>
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                Company Information
              </h2>
              <p className="text-neutral-700 dark:text-white">
                {job.company} is an award-winning technology company focused on
                delivering innovative IT solutions for businesses across Africa.
                Our team is passionate about creating products that make a real
                difference in the lives of users.
              </p>
            </div>

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
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-neutral-100 dark:border-neutral-700">
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleApply}
                className="flex-1 bg-warm-200 hover:bg-warm-300 text-white py-3 px-6 rounded-lg font-medium transition-colors shadow-sm"
              >
                Apply Now
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSave}
                className={`flex-1 py-3 px-6 rounded-lg font-medium transition-colors shadow-sm border ${
                  isSaved
                    ? "bg-warm-200 text-white border-warm-200"
                    : "bg-white dark:bg-neutral-700 text-neutral-700 dark:text-white border-neutral-200 dark:border-neutral-600 hover:bg-neutral-50 dark:hover:bg-neutral-600"
                }`}
              >
                {isSaved ? "Saved" : "Save"}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

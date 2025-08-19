"use client";

import { motion } from "framer-motion";
import {
  Globe,
  ExternalLink,
  Mail,
  Building2,
  Calendar,
  User,
} from "lucide-react";

interface EmployerProfileContentProps {
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    website?: string | null;
    portfolio?: string | null;
    profilePicture?: string | null;
    yearsOfExperience?: number | null;
    recruiterExperience?: string | null;
    companyLogo?: string | null;
    companyName?: string | null;
    companyDescription?: string | null;
    companyWebsite?: string | null;
    companyEmail?: string | null;
  };
}

export function EmployerProfileContent({
  userData,
}: EmployerProfileContentProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      {/* Left Column - Personal Information */}
      <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
        {/* Personal Details */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Personal Details
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <User className="w-4 h-4" />
              <span>
                {userData.firstName} {userData.lastName}
              </span>
            </div>
            {userData.recruiterExperience && (
              <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
                <Calendar className="w-4 h-4" />
                <span>{userData.recruiterExperience} years experience</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Location */}
        {userData.location && (
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Location
            </h3>
            <div className="flex items-center gap-2 text-neutral-900 dark:text-neutral-100">
              <Globe className="w-4 h-4" />
              <span>{userData.location}</span>
            </div>
          </motion.div>
        )}

        {/* Personal Website */}
        {userData.website && (
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Personal Website
            </h3>
            <a
              href={userData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-warm-200 hover:text-warm-300 transition-colors"
            >
              <span>{userData.website}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        )}

        {/* Portfolio */}
        {userData.portfolio && (
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Portfolio
            </h3>
            <a
              href={userData.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-warm-200 hover:text-warm-300 transition-colors"
            >
              <span>@{userData.portfolio}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </motion.div>
        )}

        {/* Email */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Email
          </h3>
          <a
            href={`mailto:${userData.email}`}
            className="flex items-center gap-2 text-warm-200 hover:text-warm-300 transition-colors"
          >
            <span>{userData.email}</span>
            <Mail className="w-3 h-3" />
          </a>
        </motion.div>

        {/* Phone */}
        {userData.phone && (
          <motion.div variants={itemVariants} className="space-y-2">
            <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
              Phone
            </h3>
            <span className="text-neutral-900 dark:text-neutral-100">
              {userData.phone}
            </span>
          </motion.div>
        )}
      </motion.div>

      {/* Right Column - Main Content */}
      <motion.div variants={itemVariants} className="lg:col-span-2 space-y-8">
        {/* About Me */}
        {userData.bio && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              About me
            </h3>
            <div className="space-y-4 text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {userData.bio.split("\n").map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>
        )}

        {/* Company Information */}
        {(userData.companyName || userData.companyLogo) && (
          <motion.div variants={itemVariants} className="space-y-6">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Company Information
            </h3>

            {/* Company Header */}
            <div className="bg-tab-light-bg dark:bg-neutral-800 rounded-lg p-6 border border-tab-light-border shadow-sm dark:border-neutral-700">
              <div className="flex items-start gap-4">
                {/* Company Logo */}
                {userData.companyLogo && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={userData.companyLogo}
                      alt="Company Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                )}

                {/* Company Details */}
                <div className="flex-1 min-w-0">
                  {userData.companyName && (
                    <h4 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {userData.companyName}
                    </h4>
                  )}

                  {userData.companyDescription && (
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-3">
                      {userData.companyDescription}
                    </p>
                  )}

                  {/* Company Contact Info */}
                  <div className="space-y-3">
                    {userData.companyEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                        <a
                          href={`mailto:${userData.companyEmail}`}
                          className="text-warm-200 hover:text-warm-300 transition-colors"
                        >
                          {userData.companyEmail}
                        </a>
                      </div>
                    )}

                    {userData.companyWebsite && (
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-neutral-500 flex-shrink-0" />
                        <div className="flex items-center gap-1">
                          <a
                            href={
                              userData.companyWebsite.startsWith("http")
                                ? userData.companyWebsite
                                : `https://${userData.companyWebsite}`
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-warm-200 hover:text-warm-300 transition-colors whitespace-nowrap"
                          >
                            {userData.companyWebsite}
                          </a>
                          <ExternalLink className="w-3 h-3 text-warm-200 flex-shrink-0" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Professional Experience */}
        {userData.yearsOfExperience && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Professional Experience
            </h3>
            <div className="bg-tab-light-bg dark:bg-neutral-800 rounded-lg p-4 border border-tab-light-border shadow-sm dark:border-neutral-700">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-warm-200 rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-900 dark:text-neutral-100">
                    Years of Experience
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-300">
                    {userData.yearsOfExperience} years in the industry
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Globe, ExternalLink, Mail, MapPin } from "lucide-react";
import { SkillTag } from "@/components/common/SkillTag";

interface ProfileContentProps {
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    website?: string | null;
    portfolio?: string | null;
    skills?: string[];
    jobPreferences?: string[];
  };
  experiences: Array<{
    id: string;
    jobTitle: string;
    employmentType: string;
    company: string;
    currentlyWorking: boolean;
    startMonth: string | null;
    startYear: string | null;
    endMonth: string | null;
    endYear: string | null;
    description: string | null;
    skills: string[];
  }>;
}

// Generate a unique color for each company
const getCompanyColor = (companyName: string) => {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-green-500",
    "bg-orange-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-red-500",
  ];
  const index = companyName.charCodeAt(0) % colors.length;
  return colors[index];
};

// Generate initials for company
const getCompanyInitials = (companyName: string) => {
  return companyName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export function ProfileContent({ userData, experiences }: ProfileContentProps) {
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
      {/* Left Column - Contact Information */}
      <motion.div variants={itemVariants} className="lg:col-span-1 space-y-6">
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

        {/* Website */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Website
          </h3>
          {userData.website ? (
            <a
              href={userData.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-warm-200 hover:text-warm-300 transition-colors"
            >
              <span>{userData.website}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-500 italic">
              Not provided
            </span>
          )}
        </motion.div>

        {/* Portfolio */}
        <motion.div variants={itemVariants} className="space-y-2">
          <h3 className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            Portfolio
          </h3>
          {userData.portfolio ? (
            <a
              href={userData.portfolio}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-warm-200 hover:text-warm-300 transition-colors"
            >
              <span>@{userData.portfolio}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-500 italic">
              Not provided
            </span>
          )}
        </motion.div>

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

        {/* Experience */}
        {experiences.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Experience
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {experiences.map((experience, index) => (
                <motion.div
                  key={experience.id}
                  variants={itemVariants}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {/* Company Icon */}
                    <div
                      className={`w-10 h-10 rounded-full ${getCompanyColor(experience.company)} flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-white font-semibold text-sm">
                        {getCompanyInitials(experience.company)}
                      </span>
                    </div>

                    {/* Experience Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-neutral-900 dark:text-neutral-100 text-sm">
                        {experience.jobTitle}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                        {experience.company}
                      </p>
                      <p className="text-neutral-500 dark:text-neutral-500 text-xs">
                        {experience.startMonth} {experience.startYear} -{" "}
                        {experience.currentlyWorking
                          ? "Present"
                          : `${experience.endMonth} ${experience.endYear}`}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Skills */}
        {userData.skills && userData.skills.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Skills
            </h3>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-wrap gap-2">
                {userData.skills.map((skill, index) => (
                  <SkillTag key={index}>{skill}</SkillTag>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Job Preferences */}
        {userData.jobPreferences && userData.jobPreferences.length > 0 && (
          <motion.div variants={itemVariants} className="space-y-4">
            <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Job Preferences
            </h3>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700">
              <div className="flex flex-wrap gap-2">
                {userData.jobPreferences.map((preference, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                  >
                    {preference}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}

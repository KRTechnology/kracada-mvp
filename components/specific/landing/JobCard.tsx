"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapPin, MoreVertical, Bookmark, BookmarkCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";

// Flexible interface that can handle both HomePageJob and JobItem
interface FlexibleJobItem {
  id: string | number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
  locationType?: "remote" | "onsite" | "hybrid";
  companyLogo?: string | null;
}

interface JobCardProps {
  job: FlexibleJobItem;
  index: number;
  showBookmarkButton?: boolean;
}

const JobCard = ({ job, index, showBookmarkButton = true }: JobCardProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  // Check bookmark status when component mounts
  useEffect(() => {
    const checkBookmarkStatus = async () => {
      if (status === "loading" || !session?.user?.id || !showBookmarkButton)
        return;

      try {
        const result = await checkBookmarkStatusAction("job", String(job.id));
        if (result.success) {
          setIsBookmarked(result.isBookmarked);
        }
      } catch (error) {
        console.error("Error checking bookmark status:", error);
      }
    };

    checkBookmarkStatus();
  }, [job.id, session, status, showBookmarkButton]);

  const handleCardClick = () => {
    router.push(`/jobs/${job.id}`);
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status === "loading" || !session?.user?.id) return;

    setIsBookmarkLoading(true);
    try {
      const result = await toggleBookmarkAction({
        contentType: "job",
        contentId: String(job.id),
      });

      if (result.success) {
        setIsBookmarked(result.isBookmarked || false);
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("Failed to update bookmark");
    } finally {
      setIsBookmarkLoading(false);
    }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onClick={handleCardClick}
      className="bg-white dark:bg-[#121212] border border-neutral-50 dark:border-[#232020] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
    >
      {/* Action Buttons - positioned outside the hover scale container */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
        {/* Bookmark Button */}
        {showBookmarkButton && session?.user?.id && (
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleBookmarkClick}
            disabled={isBookmarkLoading}
            className={`p-1 rounded-full transition-colors flex items-center justify-center ${
              isBookmarked
                ? "bg-warm-200 text-white hover:bg-warm-300"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
            } ${isBookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            style={{ width: "24px", height: "24px" }}
            title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            {isBookmarkLoading ? (
              <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            ) : isBookmarked ? (
              <BookmarkCheck className="w-4 h-4" />
            ) : (
              <Bookmark className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
            )}
          </motion.button>
        )}

        {/* Three Dots Menu */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => e.stopPropagation()}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center"
          style={{ width: "24px", height: "24px" }}
        >
          <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </motion.button>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {/* Company Logo */}
        <div className="w-12 h-12 mb-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-600 rounded flex items-center justify-center">
              <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">
                {job.company.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Job Title */}
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2 pr-8">
          {job.title}
        </h3>

        {/* Company Name and Location */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-neutral-600 dark:text-white font-medium">
            {job.company}
          </span>
          <div className="flex items-center text-neutral-500 dark:text-white text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Job Description */}
        <p className="text-neutral-600 dark:text-white text-sm leading-relaxed mb-6 line-clamp-3">
          {job.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-3 py-1 bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobCard;

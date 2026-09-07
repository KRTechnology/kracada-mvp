// "use client";

// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { MapPin, MoreVertical, Bookmark, BookmarkCheck } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";
// import {
//   toggleBookmarkAction,
//   checkBookmarkStatusAction,
// } from "@/app/(dashboard)/actions/bookmark-actions";
// import { toast } from "sonner";

// // Flexible interface that can handle both HomePageJob and JobItem
// interface FlexibleJobItem {
//   id: string | number;
//   title: string;
//   company: string;
//   location: string;
//   description: string;
//   skills: string[];
//   locationType?: "remote" | "onsite" | "hybrid";
//   companyLogo?: string | null;
// }

// interface JobCardProps {
//   job: FlexibleJobItem;
//   index: number;
//   showBookmarkButton?: boolean;
// }

// const JobCard = ({ job, index, showBookmarkButton = true }: JobCardProps) => {
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const [isBookmarked, setIsBookmarked] = useState(false);
//   const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

//   // Check bookmark status when component mounts
//   useEffect(() => {
//     const checkBookmarkStatus = async () => {
//       if (status === "loading" || !session?.user?.id || !showBookmarkButton)
//         return;

//       try {
//         const result = await checkBookmarkStatusAction("job", String(job.id));
//         if (result.success) {
//           setIsBookmarked(result.isBookmarked);
//         }
//       } catch (error) {
//         console.error("Error checking bookmark status:", error);
//       }
//     };

//     checkBookmarkStatus();
//   }, [job.id, session, status, showBookmarkButton]);

//   const handleCardClick = () => {
//     router.push(`/jobs/${job.id}`);
//   };

//   const handleBookmarkClick = async (e: React.MouseEvent) => {
//     e.stopPropagation();

//     if (status === "loading" || !session?.user?.id) return;

//     setIsBookmarkLoading(true);
//     try {
//       const result = await toggleBookmarkAction({
//         contentType: "job",
//         contentId: String(job.id),
//       });

//       if (result.success) {
//         setIsBookmarked(result.isBookmarked || false);
//         toast.success(result.message);
//       } else {
//         toast.error(result.message);
//       }
//     } catch (error) {
//       console.error("Error toggling bookmark:", error);
//       toast.error("Failed to update bookmark");
//     } finally {
//       setIsBookmarkLoading(false);
//     }
//   };
//   return (
//     <div
//       onClick={handleCardClick}
//       className="bg-white dark:bg-[#121212] border border-neutral-50 dark:border-[#232020] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative h-full flex flex-col"
//     >
//       {/* Action Buttons - positioned outside the hover scale container */}
//       <div className="absolute top-6 right-6 z-10 flex items-center gap-2">
//         {/* Bookmark Button */}
//         {showBookmarkButton && session?.user?.id && (
//           <motion.button
//             whileHover={{ scale: 1.1 }}
//             whileTap={{ scale: 0.95 }}
//             onClick={handleBookmarkClick}
//             disabled={isBookmarkLoading}
//             className={`p-1 rounded-full transition-colors flex items-center justify-center ${
//               isBookmarked
//                 ? "bg-warm-200 text-white hover:bg-warm-300"
//                 : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
//             } ${isBookmarkLoading ? "opacity-50 cursor-not-allowed" : ""}`}
//             style={{ width: "24px", height: "24px" }}
//             title={isBookmarked ? "Remove bookmark" : "Add bookmark"}
//           >
//             {isBookmarkLoading ? (
//               <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
//             ) : isBookmarked ? (
//               <BookmarkCheck className="w-4 h-4" />
//             ) : (
//               <Bookmark className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
//             )}
//           </motion.button>
//         )}

//         {/* Three Dots Menu */}
//         {/* <motion.button
//           whileHover={{ scale: 1.1 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={(e) => e.stopPropagation()}
//           className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center"
//           style={{ width: "24px", height: "24px" }}
//         >
//           <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
//         </motion.button> */}
//       </div>

//       <motion.div
//         whileHover={{ scale: 1.02 }}
//         transition={{ duration: 0.3 }}
//         className="flex-1 flex flex-col"
//       >
//         {/* Company Logo */}
//         <div className="w-12 h-12 mb-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center overflow-hidden">
//           {job.companyLogo ? (
//             <img
//               src={job.companyLogo}
//               alt={`${job.company} logo`}
//               className="w-full h-full object-contain rounded-lg"
//             />
//           ) : (
//             <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-600 rounded flex items-center justify-center">
//               <span className="text-neutral-500 dark:text-neutral-400 text-xs font-medium">
//                 {job.company.charAt(0).toUpperCase()}
//               </span>
//             </div>
//           )}
//         </div>

//         {/* Job Title */}
//         <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2 pr-8">
//           {job.title}
//         </h3>

//         {/* Company Name and Location */}
//         <div className="flex items-center justify-between mb-4">
//           <span className="text-neutral-600 dark:text-white font-medium">
//             {job.company}
//           </span>
//           <div className="flex items-center text-neutral-500 dark:text-white text-sm">
//             <MapPin className="w-4 h-4 mr-1" />
//             <span>{job.location}</span>
//           </div>
//         </div>

//         {/* Job Description */}
//         <p className="text-neutral-600 dark:text-white text-sm leading-relaxed mb-6 line-clamp-3 flex-1">
//           {job.description}
//         </p>

//         {/* Skills Tags */}
//         <div className="flex flex-wrap gap-2 mt-auto">
//           {job.skills.map((skill, skillIndex) => (
//             <span
//               key={skillIndex}
//               className="px-3 py-1 bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text text-xs font-medium rounded-full"
//             >
//               {skill}
//             </span>
//           ))}
//         </div>
//       </motion.div>
//     </div>
//   );
// };

// export default JobCard;
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Wifi,
  Building2,
  Shuffle,
} from "lucide-react";
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

// The card's whole color system is built from the brand orange already
// used for the bookmark and focus ring — no extra hues introduced, just
// consistent applications of the same color at different weights so it
// reads as intentional brand identity rather than a random per-card mix.
const ACCENT = {
  logoBg: "bg-orange-50 dark:bg-orange-500/15",
  logoText: "text-orange-600 dark:text-orange-400",
  badge:
    "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  pill: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  dot: "bg-orange-400",
  hoverShadow: "hover:shadow-orange-200/60 dark:hover:shadow-orange-500/10",
  hoverBorder: "hover:border-orange-200 dark:hover:border-orange-500/30",
};

const LOCATION_TYPE_META = {
  remote: { label: "Remote", icon: Wifi },
  hybrid: { label: "Hybrid", icon: Shuffle },
  onsite: { label: "Onsite", icon: Building2 },
} as const;

// Real-world skill arrays mix short tags ("Sales", "React") with full
// requirement sentences ("Excellent verbal and written communication
// skills."). Rendering a sentence as a pill produces an oversized,
// ugly chip, so each entry is classified and rendered differently:
// short tags become pills, sentences fall back to a compact list.
function classifySkills(skills: string[]) {
  const tags: string[] = [];
  const requirements: string[] = [];

  skills.forEach((raw) => {
    const skill = raw.trim();
    if (!skill) return;
    const wordCount = skill.split(/\s+/).length;
    const readsAsSentence = /[.!?]$/.test(skill) || wordCount > 4;

    if (readsAsSentence) {
      requirements.push(skill.replace(/[.!?]+$/, ""));
    } else {
      tags.push(skill);
    }
  });

  return { tags, requirements };
}

const JobCard = ({ job, index, showBookmarkButton = true }: JobCardProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const locationMeta = job.locationType
    ? LOCATION_TYPE_META[job.locationType]
    : null;
  const { tags, requirements } = useMemo(
    () => classifySkills(job.skills ?? []),
    [job.skills],
  );
  const visibleTags = tags.slice(0, 4);
  const extraTagCount = tags.length - visibleTags.length;
  const visibleRequirements = requirements.slice(0, 2);

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

  const handleCardKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleCardClick();
    }
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

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.995 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-100 bg-white p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all duration-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 dark:border-[#232020] dark:bg-[#121212] dark:focus-visible:ring-offset-[#121212] ${ACCENT.hoverShadow} ${ACCENT.hoverBorder}`}
    >
      {/* Bookmark */}
      {showBookmarkButton && session?.user?.id && (
        <button
          type="button"
          onClick={handleBookmarkClick}
          disabled={isBookmarkLoading}
          aria-pressed={isBookmarked}
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          className={`absolute right-5 top-5 z-10 flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
            isBookmarked
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
          } ${isBookmarkLoading ? "cursor-not-allowed opacity-50" : ""}`}
        >
          {isBookmarkLoading ? (
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : isBookmarked ? (
            <BookmarkCheck className="h-4 w-4" />
          ) : (
            <Bookmark className="h-4 w-4" />
          )}
        </button>
      )}

      {/* Logo + location type */}
      <div className="mb-4 flex items-start justify-between pr-10">
        <div
          className={`flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl ${ACCENT.logoBg}`}
        >
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={`${job.company} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <span className={`text-sm font-semibold ${ACCENT.logoText}`}>
              {job.company.charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {locationMeta && (
          <span
            className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${ACCENT.badge}`}
          >
            <locationMeta.icon className="h-3 w-3" />
            {locationMeta.label}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 className="mb-1.5 text-lg font-semibold leading-snug text-neutral-900 dark:text-neutral-100">
        {job.title}
      </h3>

      {/* Company + location */}
      <div className="mb-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <span className="font-medium text-neutral-700 dark:text-neutral-300">
          {job.company}
        </span>
        <span
          aria-hidden
          className="h-1 w-1 rounded-full bg-neutral-300 dark:bg-neutral-600"
        />
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {job.location}
        </span>
      </div>

      {/* Description */}
      <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
        {job.description}
      </p>

      {/* Skills: short tags render as pills; when a job has only
          requirement-style sentences, fall back to a compact list
          instead of forcing them into pill shape. */}
      {visibleTags.length > 0 ? (
        <div className="mt-auto flex flex-wrap gap-2">
          {visibleTags.map((tag, tagIndex) => (
            <span
              key={tagIndex}
              title={tag}
              className={`max-w-[160px] truncate rounded-full px-3 py-1 text-xs font-medium ${ACCENT.pill}`}
            >
              {tag}
            </span>
          ))}
          {extraTagCount > 0 && (
            <span className="rounded-full px-3 py-1 text-xs font-medium text-neutral-400 dark:text-neutral-500">
              +{extraTagCount} more
            </span>
          )}
        </div>
      ) : visibleRequirements.length > 0 ? (
        <ul className="mt-auto space-y-1.5">
          {visibleRequirements.map((requirement, reqIndex) => (
            <li
              key={reqIndex}
              className="flex items-start gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
            >
              <span
                aria-hidden
                className={`mt-1.5 h-1 w-1 flex-shrink-0 rounded-full ${ACCENT.dot}`}
              />
              <span className="line-clamp-1">{requirement}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </motion.div>
  );
};

export default JobCard;

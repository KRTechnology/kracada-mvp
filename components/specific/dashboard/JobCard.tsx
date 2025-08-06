"use client";

import { MoreVertical, MapPin } from "lucide-react";
import { JobBookmark } from "@/lib/data/bookmarks-data";
import { lineClamp } from "@/lib/utils";

interface JobCardProps {
  job: JobBookmark;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white dark:bg-dark rounded-lg border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        {/* Company Logo Placeholder */}
        <div className="w-12 h-12 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center mr-3">
          <div className="w-8 h-8 bg-neutral-100 dark:bg-neutral-600 rounded"></div>
        </div>

        {/* Job Title */}
        <div className="flex-1">
          <h3 className="font-semibold text-neutral-900 dark:text-neutral-100 text-base mb-1">
            {job.title}
          </h3>
        </div>

        {/* More Options Icon */}
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Company and Location */}
      <div className="flex items-center mb-3">
        <span className="text-neutral-600 dark:text-white text-sm mr-3">
          {job.company}
        </span>
        <div className="flex items-center text-neutral-500 dark:text-white text-sm">
          <MapPin className="w-3 h-3 mr-1" />
          {job.location}
        </div>
      </div>

      {/* Job Description */}
      <p
        className="text-neutral-600 dark:text-white text-sm mb-4"
        style={lineClamp(3)}
      >
        {job.description}
      </p>

      {/* Skills */}
      <div className="flex flex-wrap gap-2">
        {job.skills.map((skill, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-md bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

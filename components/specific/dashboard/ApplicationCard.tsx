"use client";

import { MoreVertical, MapPin } from "lucide-react";
import {
  JobApplication,
  ApplicationStatus,
} from "@/lib/data/applications-data";

interface ApplicationCardProps {
  application: JobApplication;
}

const getStatusColor = (status: ApplicationStatus) => {
  switch (status) {
    case "Submitted":
      return "bg-neutral-400";
    case "Under review":
      return "bg-blue-500";
    case "Shortlisted":
      return "bg-green-500";
    case "Rejected":
      return "bg-red-500";
    case "Interview":
      return "bg-purple-500";
    case "Offer":
      return "bg-yellow-500";
    default:
      return "bg-neutral-400";
  }
};

export function ApplicationCard({ application }: ApplicationCardProps) {
  return (
    <div className="bg-white dark:bg-dark rounded-xl border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start mb-3">
        {/* Company Logo Placeholder */}
        <div className="w-16 h-16 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center mr-2">
          <div className="w-10 h-10 bg-neutral-100 dark:bg-neutral-600 rounded"></div>
        </div>

        {/* Job Details Section */}
        <div className="flex-1">
          {/* Job Title */}
          <h3 className="font-semibold text-neutral-900 dark:text-white text-base mb-1">
            {application.jobTitle}
          </h3>

          {/* Company Name */}
          <span className="text-neutral-600 dark:text-white text-sm">
            {application.company}
          </span>

          {/* Applied Date */}
          <div className="text-neutral-500 dark:text-white text-xs mt-1">
            {application.appliedDate}
          </div>
        </div>

        {/* Right Side - Location and More Options */}
        <div className="flex flex-col items-end">
          {/* More Options Icon */}
          <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors mb-2">
            <MoreVertical className="w-4 h-4" />
          </button>

          {/* Location */}
          <div className="flex mt-7 items-center text-neutral-500 dark:text-white text-sm">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{application.location}</span>
          </div>
        </div>
      </div>

      {/* Status Pill */}
      <div className="flex items-center">
        <div className="flex items-center px-3 py-2 border border-statusPill-light-border dark:border-statusPill-dark-border rounded-lg">
          <div
            className={`w-2 h-2 rounded-full ${getStatusColor(application.status)} mr-2`}
          ></div>
          <span className="text-statusPill-light-text dark:text-statusPill-dark-text text-sm font-medium">
            {application.status}
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { MoreVertical, Play, Eye, Clock } from "lucide-react";
import { VideoBookmark } from "@/lib/data/bookmarks-data";
import { lineClamp } from "@/lib/utils";

interface VideoCardProps {
  video: VideoBookmark;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <div className="bg-white dark:bg-dark rounded-lg border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        {/* Video Thumbnail Placeholder */}
        <div className="w-20 h-12 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center mr-3 relative">
          <div className="w-16 h-10 bg-neutral-100 dark:bg-neutral-600 rounded"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Video Title */}
        <div className="flex-1">
          <h3
            className="font-semibold text-neutral-900 dark:text-neutral-100 text-base mb-1"
            style={lineClamp(2)}
          >
            {video.title}
          </h3>
        </div>

        {/* More Options Icon */}
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Creator and Platform */}
      <div className="flex items-center mb-2">
        <span className="text-neutral-600 dark:text-white text-sm mr-3">
          {video.creator}
        </span>
        <span className="text-neutral-500 dark:text-white text-sm">
          {video.platform}
        </span>
      </div>

      {/* Duration and Views */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center">
          <Clock className="w-3 h-3 text-neutral-500 dark:text-white mr-1" />
          <span className="text-neutral-500 dark:text-white text-sm">
            {video.duration}
          </span>
        </div>
        <div className="flex items-center">
          <Eye className="w-3 h-3 text-neutral-500 dark:text-white mr-1" />
          <span className="text-neutral-500 dark:text-white text-sm">
            {video.views} views
          </span>
        </div>
      </div>

      {/* Video Description */}
      <p
        className="text-neutral-600 dark:text-white text-sm mb-3"
        style={lineClamp(2)}
      >
        {video.description}
      </p>

      {/* Upload Date */}
      <div className="flex justify-end">
        <span className="text-neutral-500 dark:text-white text-xs">
          {new Date(video.uploadedDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

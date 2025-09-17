"use client";

import { ExternalLink, Play } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface LifestyleVideo {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  isVideo?: boolean;
}

interface LifestyleVideoCardProps {
  video: LifestyleVideo;
  index: number;
}

export function LifestyleVideoCard({ video, index }: LifestyleVideoCardProps) {
  return (
    <Link href={`/lifestyle/${video.id}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
      >
        {/* Video Thumbnail with Play Button */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={video.image}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {/* Video Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-16 h-16 bg-white/90 dark:bg-neutral-800/90 rounded-full flex items-center justify-center group-hover:bg-white dark:group-hover:bg-neutral-800 transition-colors">
              <Play
                className="w-6 h-6 text-neutral-700 dark:text-neutral-300 ml-1"
                fill="currentColor"
              />
            </div>
          </div>
          {/* Video Controls Overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <button className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            </button>
            <button className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </button>
            <button className="w-8 h-8 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-5v4m0-4h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Video Content */}
        <div className="p-6 space-y-4">
          {/* Author and Date */}
          <div className="flex items-center text-sm">
            <span className="text-orange-500 font-medium">{video.author}</span>
            <span className="text-neutral-500 dark:text-neutral-400 mx-2">
              •
            </span>
            <span className="text-neutral-500 dark:text-neutral-400">
              {video.date}
            </span>
          </div>

          {/* Title with External Link Icon */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight flex-1 pr-2">
              {video.title}
            </h3>
            <ExternalLink className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-1" />
          </div>

          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
            {video.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {video.categories.map((category, categoryIndex) => (
              <span
                key={categoryIndex}
                className={`px-3 py-1 text-xs font-medium rounded-full ${
                  categoryIndex === 0
                    ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    : "bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300"
                }`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </Link>
  );
}

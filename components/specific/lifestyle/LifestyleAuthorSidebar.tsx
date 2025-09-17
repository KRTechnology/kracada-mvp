"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, ExternalLink, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/common/button";

interface LifestyleAuthorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LifestyleAuthorSidebar = ({
  isOpen,
  onClose,
}: LifestyleAuthorSidebarProps) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://example.com/author/sarah-johnson"
      );
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const otherArticles = [
    {
      title: "The Power of Mindful Mornings",
      author: "Sarah Johnson",
      year: "2025",
    },
    { title: "Building Healthy Habits", author: "Sarah Johnson", year: "2024" },
    {
      title: "Work-Life Balance Mastery",
      author: "Sarah Johnson",
      year: "2024",
    },
    { title: "Digital Detox Guide", author: "Sarah Johnson", year: "2023" },
    {
      title: "Stress Management Techniques",
      author: "Sarah Johnson",
      year: "2023",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 z-40 lg:hidden"
            onClick={onClose}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm lg:w-96 bg-white dark:bg-neutral-900 shadow-2xl z-50 overflow-y-auto lg:shadow-none lg:border-l lg:border-neutral-200 lg:dark:border-neutral-700"
          >
            {/* Header Image with Close Button */}
            <div className="relative h-32 bg-gradient-to-r from-neutral-100 to-neutral-200 dark:from-neutral-800 dark:to-neutral-700">
              <Image
                src="/images/contributor-header-image.jpg"
                alt="Author header background"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />

              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 bg-white/90 dark:bg-neutral-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
              >
                <X className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
              </button>

              {/* External Link and Edit Icons */}
              <div className="absolute bottom-4 right-4 flex items-center gap-2">
                <button className="w-8 h-8 bg-white/90 dark:bg-neutral-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors">
                  <ExternalLink className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                </button>
                <button className="w-8 h-8 bg-white/90 dark:bg-neutral-800/90 rounded-full flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors">
                  <svg
                    className="w-4 h-4 text-neutral-600 dark:text-neutral-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Author Profile */}
            <div className="p-6">
              {/* Profile Image */}
              <div className="relative -mt-12 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden">
                  <Image
                    src="/images/contributor-profile-image.png"
                    alt="Sarah Johnson"
                    width={80}
                    height={80}
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Author Info */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Sarah Johnson
                  </h2>
                  <div className="w-5 h-5 text-orange-400">
                    <svg fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-4">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm font-medium rounded-full">
                    Contributor
                  </span>
                  <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Author
                  </span>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-6">
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Works
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        12
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Reviews
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        248
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Favorites
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-orange-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        3,421
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mb-6">
                  <Button
                    onClick={handleCopyLink}
                    variant="outline"
                    size="sm"
                    className="flex-1 flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    {linkCopied ? "Copied!" : "Copy link"}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Author page
                  </Button>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-6"></div>

                {/* About Section */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    About
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    Sarah Johnson is a certified lifestyle coach and wellness
                    expert with over 8 years of experience helping people
                    transform their daily routines and achieve personal growth.
                  </p>

                  {/* Location and Website */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        San Francisco, California
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        />
                      </svg>
                      <span className="text-sm text-neutral-600 dark:text-neutral-300">
                        sarahjohnson.com
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">
                      Author
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">
                      Wellness
                    </span>
                    <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-xs rounded-full">
                      Lifestyle
                    </span>
                    <button className="w-6 h-6 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-xs rounded-full flex items-center justify-center">
                      +
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-6"></div>

                {/* Other Articles */}
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                    Other articles
                  </h3>
                  <div className="space-y-4">
                    {otherArticles.map((article, index) => (
                      <Link
                        key={index}
                        href={`/lifestyle/${index + 2}`}
                        className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors group"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium text-neutral-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                            {article.title}
                          </h4>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                            {article.author} | {article.year}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                      </Link>
                    ))}
                  </div>

                  {/* See All Works */}
                  <Link
                    href="/lifestyle/author/sarah-johnson"
                    className="flex items-center justify-between p-3 mt-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors group"
                  >
                    <span className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                      See all works (12)
                    </span>
                    <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

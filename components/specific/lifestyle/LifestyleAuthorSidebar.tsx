"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, ExternalLink, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/common/button";
import { getAuthorStatsAndPostsAction } from "@/app/actions/lifestyle-actions";

interface LifestyleAuthorSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  author?: any;
  postId?: string;
}

export const LifestyleAuthorSidebar = ({
  isOpen,
  onClose,
  author,
  postId,
}: LifestyleAuthorSidebarProps) => {
  const [linkCopied, setLinkCopied] = useState(false);
  const [authorStats, setAuthorStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
  });
  const [recentPosts, setRecentPosts] = useState<any[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  // Get author details with fallbacks
  const authorName =
    author?.firstName && author?.lastName
      ? `${author.firstName} ${author.lastName}`
      : author?.fullName || "Anonymous";
  const authorBio = author?.bio || "No bio available.";
  const authorWebsite = author?.website || null;
  const authorProfilePicture =
    author?.profilePicture || "/images/default-avatar.png";
  const authorId = author?.id || "";

  // Fetch author stats and posts when component mounts or authorId changes
  useEffect(() => {
    const fetchAuthorData = async () => {
      if (!authorId) return;

      setIsLoadingStats(true);
      try {
        const result = await getAuthorStatsAndPostsAction(authorId);
        if (result.success && result.data) {
          setAuthorStats(result.data.stats);
          setRecentPosts(result.data.recentPosts);
        }
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchAuthorData();
  }, [authorId]);

  const handleCopyLink = async () => {
    try {
      const authorUrl = `${window.location.origin}/lifestyle/author/${authorId}`;
      await navigator.clipboard.writeText(authorUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  // Function to get tag color based on index
  const getTagColor = (index: number) => {
    const colors = [
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    ];
    return colors[index % colors.length];
  };

  const tags = ["Author", "Wellness", "Lifestyle"];

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
                    src={authorProfilePicture}
                    alt={authorName}
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
                    {authorName}
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
                      Posts
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
                        {isLoadingStats ? "..." : authorStats.totalPosts}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Comments
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {isLoadingStats ? "..." : authorStats.totalComments}
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-neutral-500 dark:text-neutral-400 mb-1">
                      Likes
                    </div>
                    <div className="flex items-center gap-1">
                      <svg
                        className="w-4 h-4 text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                        />
                      </svg>
                      <span className="font-semibold text-neutral-900 dark:text-white">
                        {isLoadingStats ? "..." : authorStats.totalLikes}
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
                  <Link href={`/lifestyle/author/${authorId}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 w-full"
                    >
                      Author page
                    </Button>
                  </Link>
                </div>

                {/* Divider */}
                <div className="border-t border-neutral-200 dark:border-neutral-700 my-6"></div>

                {/* About Section */}
                <div className="mb-6">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    About
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed mb-4">
                    {authorBio}
                  </p>

                  {/* Website */}
                  {authorWebsite && (
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
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                        <a
                          href={
                            authorWebsite.startsWith("http")
                              ? authorWebsite
                              : `https://${authorWebsite}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-orange-600 dark:text-orange-400 hover:underline"
                        >
                          {authorWebsite}
                        </a>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getTagColor(
                          index
                        )}`}
                      >
                        {tag}
                      </span>
                    ))}
                    <button className="w-6 h-6 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs rounded-full flex items-center justify-center hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-colors">
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
                  {isLoadingStats ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-purple-50 dark:from-orange-900/10 dark:to-purple-900/10 border border-orange-100 dark:border-orange-900/20 animate-pulse"
                        >
                          <div className="h-4 bg-gradient-to-r from-orange-200 to-purple-200 dark:from-orange-800/50 dark:to-purple-800/50 rounded-lg mb-3 shadow-sm" />
                          <div className="h-3 bg-gradient-to-r from-orange-100 to-purple-100 dark:from-orange-900/30 dark:to-purple-900/30 rounded-lg w-2/3" />
                        </div>
                      ))}
                    </div>
                  ) : recentPosts.length > 0 ? (
                    <div className="space-y-4">
                      {recentPosts.map((article) => (
                        <Link
                          key={article.id}
                          href={`/lifestyle/${article.slug}`}
                          className="flex items-center justify-between p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors group"
                        >
                          <div className="flex-1">
                            <h4 className="font-medium text-neutral-900 dark:text-white text-sm group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                              {article.title}
                            </h4>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                              {authorName} | {article.year}
                            </p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
                      No articles yet
                    </p>
                  )}

                  {/* See All Works */}
                  {!isLoadingStats &&
                    authorStats.totalPosts > recentPosts.length && (
                      <Link
                        href={`/lifestyle/author/${authorId}`}
                        className="flex items-center justify-between p-3 mt-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-lg transition-colors group"
                      >
                        <span className="text-sm font-medium text-neutral-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          See all works
                        </span>
                        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors" />
                      </Link>
                    )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

"use client";

import { motion } from "framer-motion";
import {
  Copy,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/common/button";

interface NewsArticleHeaderDynamicProps {
  post: any;
}

export function NewsArticleHeaderDynamic({
  post,
}: NewsArticleHeaderDynamicProps) {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const authorName = post.author
    ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
      "Admin"
    : "Admin";

  const publishedDate = new Date(
    post.publishedAt || post.createdAt
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = post.content
    ? post.content.split(/\s+/).filter((word: string) => word.length > 0).length
    : 0;
  const readTime = Math.max(1, Math.ceil(wordCount / 200));

  // Get first category for display
  const primaryCategory =
    post.categories && post.categories.length > 0 ? post.categories[0] : "News";

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-[#0D0D0D] border-b border-neutral-200 dark:border-neutral-700"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/news")}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Button>
        </motion.div>

        {/* Category and Read Time */}
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
            {primaryCategory}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 text-sm">
            {readTime} min read
          </span>
        </div>

        {/* Article Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
        >
          {post.title}
        </motion.h1>

        {/* Article Description */}
        {post.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed"
          >
            {post.description}
          </motion.p>
        )}

        {/* Author and Publication Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                Written by
              </span>
              <span className="text-neutral-900 dark:text-white font-semibold">
                {authorName}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                Published on
              </span>
              <span className="text-neutral-900 dark:text-white font-semibold">
                {publishedDate}
              </span>
            </div>
            {post.viewCount > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                  {post.viewCount.toLocaleString()} views
                </span>
              </div>
            )}
          </div>

          {/* Social Sharing */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy link"}
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
}

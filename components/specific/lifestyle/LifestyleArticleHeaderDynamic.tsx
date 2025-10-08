"use client";

import { motion } from "framer-motion";
import { ArrowLeft, Edit2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Button } from "@/components/common/button";

interface LifestyleArticleHeaderDynamicProps {
  post: any;
}

export function LifestyleArticleHeaderDynamic({
  post,
}: LifestyleArticleHeaderDynamicProps) {
  const router = useRouter();
  const { data: session } = useSession();

  // Check if current user is the post owner
  const isOwner = session?.user?.id && session.user.id === post.authorId;

  const authorName = post.author
    ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
      "Anonymous"
    : "Anonymous";

  const publishedDate = new Date(
    post.publishedAt || post.createdAt
  ).toLocaleDateString("en-US", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <header className="bg-white dark:bg-[#0D0D0D] border-b border-neutral-200 dark:border-neutral-700">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation Bar with Back Button and Edit Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center justify-between mb-6"
        >
          <Button
            variant="ghost"
            onClick={() => router.push("/lifestyle")}
            className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lifestyle
          </Button>

          {/* Edit Button - Only visible to post owner */}
          {isOwner && (
            <Button
              onClick={() => router.push(`/lifestyle/edit/${post.id}`)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Edit2 className="w-4 h-4" />
              Edit Post
            </Button>
          )}
        </motion.div>

        {/* Article Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
        >
          {post.title}
        </motion.h1>

        {/* Article Meta */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-400"
        >
          <span className="font-medium">{authorName}</span>
          <span className="text-neutral-400 dark:text-neutral-500">•</span>
          <span>{publishedDate}</span>
          {post.viewCount > 0 && (
            <>
              <span className="text-neutral-400 dark:text-neutral-500">•</span>
              <span>{post.viewCount.toLocaleString()} views</span>
            </>
          )}
          {post.likeCount > 0 && (
            <>
              <span className="text-neutral-400 dark:text-neutral-500">•</span>
              <span>{post.likeCount} likes</span>
            </>
          )}
        </motion.div>

        {/* Description */}
        {post.description && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-6 text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            {post.description}
          </motion.p>
        )}
      </div>
    </header>
  );
}

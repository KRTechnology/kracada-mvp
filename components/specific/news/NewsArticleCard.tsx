"use client";

import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { toggleBookmarkAction } from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";

interface NewsArticle {
  id: string | number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  link?: string;
}

interface NewsArticleCardProps {
  article: NewsArticle;
  index: number;
}

export function NewsArticleCard({ article, index }: NewsArticleCardProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  const getCategoryColor = (categoryIndex: number) => {
    const colors = [
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    ];
    return colors[categoryIndex % colors.length];
  };
  const { data: session, status } = useSession();

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status === "loading" || !session?.user?.id) return;

    setIsBookmarkLoading(true);
    console.log(article);
    try {
      const result = await toggleBookmarkAction({
        contentType: "article",
        contentId: String(article.id),
        ...article,
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

  // Determine the wrapper component dynamically
  const Wrapper = article.link ? "a" : Link;
  const wrapperProps = article.link
    ? {
        href: article.link,
        target: "_blank",
        rel: "noopener noreferrer",
        className: "h-full",
      }
    : { href: `/news/${article.id}`, className: "h-full" };

  return (
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer flex flex-col max-h-[400px]">
      {/* Article Image */}
      <div className="relative w-full h-48 overflow-hidden shrink-0">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Article Content */}
      <div className="p-4 flex-1 flex flex-col min-h-0 gap-2">
        {/* Author and Date */}
        <div className="flex items-center text-sm shrink-0">
          <span className="text-orange-500 font-medium truncate max-w-[120px]">
            {article.author}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 mx-2">•</span>
          <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
            {article.date}
          </span>
          {session?.user?.id && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmarkClick}
              disabled={isBookmarkLoading}
              className={`p-1 rounded-full transition-colors flex items-center justify-center ml-auto ${
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
        </div>

        {/* Title with External Link Icon */}
        <div className="flex items-start justify-between shrink-0">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white leading-tight flex-1 pr-2 line-clamp-3">
            {article.title}
          </h3>
          {article.link && (
            <Wrapper {...wrapperProps}>
              <ExternalLink className="w-4 h-4 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-0.5" />
            </Wrapper>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed line-clamp-2 flex-1 min-h-0">
          {article.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-1.5 shrink-0">
          {article.categories.slice(0, 3).map((category, categoryIndex) => (
            <span
              key={categoryIndex}
              className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${getCategoryColor(
                categoryIndex,
              )}`}
            >
              {category}
            </span>
          ))}
          {article.categories.length > 3 && (
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">
              +{article.categories.length - 3}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

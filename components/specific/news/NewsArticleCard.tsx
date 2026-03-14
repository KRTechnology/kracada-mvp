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
    <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
      {/* Article Image */}
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={article.image}
          alt={article.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Article Content */}
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        {/* Author and Date */}
        <div className="flex items-center text-sm">
          <span className="text-orange-500 font-medium">{article.author}</span>
          <span className="text-neutral-500 dark:text-neutral-400 mx-2">•</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {article.date}
          </span>
          {session?.user?.id && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBookmarkClick}
              disabled={isBookmarkLoading}
              className={`p-1 rounded-full transition-colors flex items-center justify-center  ml-auto ${
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
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight flex-1 pr-2">
            {article.title}
          </h3>
          {article.link && (
            <Wrapper {...wrapperProps}>
              <ExternalLink className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-1" />
            </Wrapper>
          )}
        </div>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed flex-1">
          {article.description}
        </p>
        <p
          onClick={() => {
            console.log(article);
          }}
        ></p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mt-auto">
          {article.categories.map((category, categoryIndex) => (
            <span
              key={categoryIndex}
              className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getCategoryColor(
                categoryIndex
              )}`}
            >
              {category}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

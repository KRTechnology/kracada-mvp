"use client";

import {
  MoreVertical,
  Bookmark,
  BookmarkCheck,
  Clock,
  User,
} from "lucide-react";

import { useState, useRef, useEffect } from "react";
import { ArticleBookmark } from "@/lib/data/bookmarks-data";
import { lineClamp } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";

interface ArticleCardProps {
  article: ArticleBookmark;
}

export function ArticleCard({ article }: ArticleCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status === "loading" || !session?.user?.id) return;

    setIsBookmarkLoading(true);
    try {
      const result = await toggleBookmarkAction({
        contentType: "article",
        contentId: String(article.id),
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

  // Handlers for the items
  const handleView = () => {
    setIsOpen(false); // close after action
  };

  return (
    <div className="bg-white dark:bg-dark rounded-lg border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow">
      <div
        className="flex items-start justify-between mb-3 relative "
        ref={dropdownRef}
      >
        {/* Article Image Placeholder */}
        <div className="w-16 h-12 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center mr-3">
          <div className="w-12 h-8 bg-neutral-100 dark:bg-neutral-600 rounded"></div>
        </div>
        {/* Article Title */}
        <div className="flex-1">
          <h3
            className="font-semibold text-neutral-900 dark:text-neutral-100 text-base mb-1"
            style={lineClamp(2)}
          >
            {article.title}
          </h3>
        </div>
        {/* More Options Icon */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
        >
          <MoreVertical className="w-4 h-4" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2   bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md shadow-lg z-10">
            <p
              onClick={handleView}
              className="text-neutral-600 dark:text-white text-xs mb-1 px-2 font-medium py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              View
            </p>
            <p
              onClick={handleDelete}
              className="text-red-500 dark:text-white text-xs px-2 py-2 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-700 cursor-pointer"
            >
              Delete
            </p>
          </div>
        )}
        {isBookmarkLoading ? (
          <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
        ) : isBookmarked ? (
          <BookmarkCheck className="w-4 h-4" />
        ) : (
          <Bookmark className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        )}
      </div>

      {/* Author and Publication */}
      <div className="flex items-center mb-2">
        <User className="w-3 h-3 text-neutral-500 dark:text-white mr-1" />
        <span className="text-neutral-600 dark:text-white text-sm mr-3">
          {article.author}
        </span>
        <span className="text-neutral-500 dark:text-white text-sm">
          {article.publication}
        </span>
      </div>

      {/* Read Time */}
      <div className="flex items-center mb-3">
        <Clock className="w-3 h-3 text-neutral-500 dark:text-white mr-1" />
        <span className="text-neutral-500 dark:text-white text-sm">
          {article.readTime}
        </span>
      </div>

      {/* Article Excerpt */}
      <p
        className="text-neutral-600 dark:text-white text-sm mb-3"
        style={lineClamp(3)}
      >
        {article.excerpt}
      </p>

      {/* Category */}
      <div className="flex justify-between items-center">
        <span className="px-2 py-1 text-xs rounded-md bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text">
          {article.category}
        </span>
        <span className="text-neutral-500 dark:text-white text-xs">
          {new Date(article.publishedDate).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
}

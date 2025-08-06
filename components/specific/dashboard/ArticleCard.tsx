"use client";

import { MoreVertical, Clock, User } from "lucide-react";
import { ArticleBookmark } from "@/lib/data/bookmarks-data";
import { lineClamp } from "@/lib/utils";

interface ArticleCardProps {
  article: ArticleBookmark;
}

export function ArticleCard({ article }: ArticleCardProps) {
  return (
    <div className="bg-white dark:bg-dark rounded-lg border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
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
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
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

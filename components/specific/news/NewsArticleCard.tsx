"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

interface NewsArticle {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
}

interface NewsArticleCardProps {
  article: NewsArticle;
  index: number;
}

export function NewsArticleCard({ article, index }: NewsArticleCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
    >
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
      <div className="p-6 space-y-4">
        {/* Author and Date */}
        <div className="flex items-center text-sm">
          <span className="text-orange-500 font-medium">{article.author}</span>
          <span className="text-neutral-500 dark:text-neutral-400 mx-2">•</span>
          <span className="text-neutral-500 dark:text-neutral-400">
            {article.date}
          </span>
        </div>

        {/* Title with External Link Icon */}
        <div className="flex items-start justify-between">
          <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight flex-1 pr-2">
            {article.title}
          </h3>
          <ExternalLink className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-1" />
        </div>

        {/* Description */}
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
          {article.description}
        </p>

        {/* Categories */}
        <div className="flex flex-wrap gap-2">
          {article.categories.map((category, categoryIndex) => (
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
  );
}

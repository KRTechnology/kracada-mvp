"use client";

import { ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

interface NewsArticle {
  id: string | number;
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
  // Function to get category color based on index
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

  return (
    <Link href={`/news/${article.id}`} className="h-full">
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
            <span className="text-orange-500 font-medium">
              {article.author}
            </span>
            <span className="text-neutral-500 dark:text-neutral-400 mx-2">
              •
            </span>
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
          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed flex-1">
            {article.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {article.categories.map((category, categoryIndex) => (
              <span
                key={categoryIndex}
                className={`px-3 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                  categoryIndex
                )}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

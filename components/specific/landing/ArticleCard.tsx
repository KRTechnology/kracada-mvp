"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface ArticleItem {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
}

interface ArticleCardProps {
  article: ArticleItem;
  index: number;
}

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1,
      },
    },
  };

  // Function to get category colors
  const getCategoryColor = (category: string) => {
    const colorMap: { [key: string]: string } = {
      Leadership: "#8B5CF6", // Purple
      Management: "#6B7280", // Gray
      Product: "#3B82F6", // Blue
      Research: "#6366F1", // Indigo
      Frameworks: "#F59E0B", // Amber
    };
    return colorMap[category] || "#6B7280"; // Default gray
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="cursor-pointer relative"
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {/* Image Container with rounded corners */}
        <div className="relative h-48 lg:h-56 overflow-hidden rounded-2xl mb-6">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover transition-transform duration-500 hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Arrow Icon - positioned on the image */}
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              whileHover={{ scale: 1.1, rotate: 45 }}
              transition={{ duration: 0.2 }}
              className="bg-white bg-opacity-90 rounded-full p-2 shadow-sm"
            >
              <ArrowUpRight className="w-4 h-4 text-neutral-800" />
            </motion.div>
          </div>
        </div>

        {/* Content - directly on background */}
        <div>
          {/* Author and Date */}
          <div
            className="flex items-center text-sm mb-4"
            style={{ color: "#FF6F00" }}
          >
            <span className="font-medium">{article.author}</span>
            <span className="mx-2">•</span>
            <span>{article.date}</span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-3 leading-tight"
            style={{ color: "#FFECE8" }}
          >
            {article.title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-6"
            style={{ color: "#FFECE8", opacity: 0.8 }}
          >
            {article.description}
          </p>

          {/* Category Tags */}
          <div className="flex flex-wrap gap-2">
            {article.categories.map((category, categoryIndex) => (
              <span
                key={categoryIndex}
                className="px-3 py-1 text-white text-xs font-medium rounded-full"
                style={{ backgroundColor: getCategoryColor(category) }}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ArticleCard;

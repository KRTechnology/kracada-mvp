"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

interface NewsItem {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  type: "image" | "video";
}

interface NewsCardProps {
  news: NewsItem;
  index: number;
}

const NewsCard = ({ news, index }: NewsCardProps) => {
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
            src={news.image}
            alt={news.title}
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

        {/* Content - directly on background, no white card */}
        <div>
          {/* Author and Date */}
          <div
            className="flex items-center text-sm mb-4"
            style={{ color: "#FF6F00" }}
          >
            <span className="font-medium">{news.author}</span>
            <span className="mx-2">•</span>
            <span>{news.date}</span>
          </div>

          {/* Title */}
          <h3
            className="text-xl font-bold mb-3 leading-tight"
            style={{ color: "#FFECE8" }}
          >
            {news.title}
          </h3>

          {/* Description */}
          <p className="text-sm leading-relaxed" style={{ color: "#FFE3DE" }}>
            {news.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NewsCard;

"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import NewsCard from "./NewsCard";
import NewsPagination from "./NewsPagination";
import { HomePageNewsPost } from "@/app/actions/home-actions";

interface NewsSectionProps {
  latestNews: HomePageNewsPost[];
}

const NewsSection = ({ latestNews }: NewsSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Transform news data to match NewsCard expected format
  const newsData = latestNews.map((news) => ({
    id: news.id,
    author: news.author,
    date: news.date,
    title: news.title,
    description: news.description,
    image: news.image,
    type: "image" as const,
  }));

  return (
    <section className="py-16 lg:py-24 bg-[#301000] dark:bg-neutral-900">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12">
            <motion.div variants={itemVariants} className="mb-8 lg:mb-0">
              <p className="text-sm font-medium mb-3 text-[#FFECE8] dark:text-neutral-200">
                News
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#FFECE8] dark:text-neutral-200">
                Latest News
              </h2>
              <p className="text-lg lg:text-xl max-w-md text-[#FFE3DE] dark:text-neutral-100">
                Catch up with the latest news around you
              </p>
            </motion.div>

            {/* View All Button - Desktop Only */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <Link href="/news">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  View all news posts
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* News Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {newsData.map((news, index) => (
              <NewsCard key={news.id} news={news} index={index} />
            ))}
          </motion.div>

          {/* Mobile View All Button */}
          <motion.div variants={itemVariants} className="lg:hidden mt-8">
            <Link href="/news">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-warm-200 hover:bg-warm-300 text-white dark:text-dark py-4 rounded-xl font-semibold transition-all duration-300"
              >
                View all news posts
              </motion.button>
            </Link>
          </motion.div>

          {/* Mobile Pagination */}
          <motion.div variants={itemVariants} className="lg:hidden mt-8">
            <NewsPagination />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default NewsSection;

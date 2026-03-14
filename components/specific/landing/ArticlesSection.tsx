"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import ArticleCard from "./ArticleCard";
import { HomePageLifestylePost } from "@/app/actions/home-actions";

interface ArticlesSectionProps {
  latestPosts: HomePageLifestylePost[];
}

const ArticlesSection = ({ latestPosts }: ArticlesSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
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

  return (
    <section className="py-16 lg:py-24 bg-[#585251] dark:bg-neutral-900">
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
                Articles
              </p>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-[#FFECE8] dark:text-neutral-200">
                Latest Articles
              </h2>
            </motion.div>

            {/* View All Button - Desktop Only */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <Link href="/lifestyle">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark px-6 py-3 rounded-xl font-semibold transition-all duration-300"
                >
                  View all articles
                </motion.button>
              </Link>
            </motion.div>
          </div>

          {/* Articles Cards Grid */}
          {latestPosts.length > 0 ? (
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
            >
              {latestPosts.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div variants={itemVariants} className="text-center py-12">
              <p className="text-[#FFECE8] dark:text-neutral-200 text-lg">
                No lifestyle articles available at the moment.
              </p>
              <p className="text-[#FFECE8]/80 dark:text-neutral-400 text-sm mt-2">
                Check back later for inspiring lifestyle content!
              </p>
            </motion.div>
          )}

          {/* Mobile View All Button */}
          <motion.div variants={itemVariants} className="lg:hidden mt-8">
            <Link href="/lifestyle">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-warm-200 hover:bg-warm-300 text-white dark:text-dark py-4 rounded-xl font-semibold transition-all duration-300"
              >
                View all articles
              </motion.button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesSection;

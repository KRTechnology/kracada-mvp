"use client";

import React from "react";
import { motion } from "framer-motion";
import ArticleCard from "./ArticleCard";

const ArticlesSection = () => {
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

  // Sample articles data
  const articlesData: Array<{
    id: number;
    author: string;
    date: string;
    title: string;
    description: string;
    image: string;
    categories: string[];
  }> = [
    {
      id: 1,
      author: "Alec Whitten",
      date: "17 Jan 2025",
      title: "Bill Walsh leadership lessons",
      description:
        "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
      image: "/images/news-sample-image.jpg",
      categories: ["Leadership", "Management"],
    },
    {
      id: 2,
      author: "Demi Wilkinson",
      date: "16 Jan 2025",
      title: "PM mental models",
      description:
        "Mental models are simple expressions of complex processes or relationships.",
      image: "/images/landing-hero-image.jpg",
      categories: ["Product", "Research", "Frameworks"],
    },
    {
      id: 3,
      author: "Alec Whitten",
      date: "17 Jan 2025",
      title: "Bill Walsh leadership lessons",
      description:
        "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
      image: "/images/news-sample-image.jpg",
      categories: ["Leadership", "Management"],
    },
  ];

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#585251" }}>
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
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#FFECE8" }}
              >
                Articles
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{ color: "#FFECE8" }}
              >
                Latest Articles
              </h2>
            </motion.div>

            {/* View All Button - Desktop Only */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-warm-200 hover:bg-warm-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                View all articles
              </motion.button>
            </motion.div>
          </div>

          {/* Articles Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {articlesData.map((article, index) => (
              <ArticleCard key={article.id} article={article} index={index} />
            ))}
          </motion.div>

          {/* Mobile View All Button */}
          <motion.div variants={itemVariants} className="lg:hidden mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-warm-200 hover:bg-warm-300 text-white py-4 rounded-xl font-semibold transition-all duration-300"
            >
              View all articles
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ArticlesSection;

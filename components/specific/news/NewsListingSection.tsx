"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { NewsArticleCard } from "./NewsArticleCard";
import { Pagination } from "@/components/common/Pagination";

// Sample news data - in a real app, this would come from an API
const newsData = [
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
    author: "Sarah Chen",
    date: "16 Jan 2025",
    title: "Product Management Mental Models",
    description:
      "Mental models are simple expressions of complex processes or relationships that help us understand the world better.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Product", "Research"],
  },
  {
    id: 3,
    author: "Marcus Johnson",
    date: "15 Jan 2025",
    title: "The Future of Remote Work",
    description:
      "Exploring how distributed teams are reshaping the modern workplace and what it means for productivity.",
    image: "/images/news-sample-image.jpg",
    categories: ["Technology", "Business"],
  },
  {
    id: 4,
    author: "Emily Rodriguez",
    date: "14 Jan 2025",
    title: "Design Systems That Scale",
    description:
      "Building maintainable design systems that grow with your product and team over time.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Design", "Frameworks"],
  },
  {
    id: 5,
    author: "David Kim",
    date: "13 Jan 2025",
    title: "Data-Driven Decision Making",
    description:
      "How to leverage analytics and metrics to make better business decisions and drive growth.",
    image: "/images/news-sample-image.jpg",
    categories: ["Analytics", "Business"],
  },
  {
    id: 6,
    author: "Lisa Wang",
    date: "12 Jan 2025",
    title: "Customer Success Strategies",
    description:
      "Proven methods for building strong customer relationships and reducing churn in SaaS companies.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Customer Success", "SaaS"],
  },
  {
    id: 7,
    author: "Alex Thompson",
    date: "11 Jan 2025",
    title: "Agile Development Best Practices",
    description:
      "Essential practices for running effective agile teams and delivering value consistently.",
    image: "/images/news-sample-image.jpg",
    categories: ["Development", "Agile"],
  },
  {
    id: 8,
    author: "Maria Garcia",
    date: "10 Jan 2025",
    title: "Building High-Performance Teams",
    description:
      "Key principles for creating and maintaining teams that consistently deliver exceptional results.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Leadership", "Team Building"],
  },
  {
    id: 9,
    author: "James Wilson",
    date: "9 Jan 2025",
    title: "Marketing Automation Mastery",
    description:
      "Advanced strategies for implementing and optimizing marketing automation workflows.",
    image: "/images/news-sample-image.jpg",
    categories: ["Marketing", "Automation"],
  },
  {
    id: 10,
    author: "Rachel Brown",
    date: "8 Jan 2025",
    title: "User Experience Research Methods",
    description:
      "Comprehensive guide to conducting effective UX research and translating insights into action.",
    image: "/images/landing-hero-image.jpg",
    categories: ["UX", "Research"],
  },
  {
    id: 11,
    author: "Michael Davis",
    date: "7 Jan 2025",
    title: "Financial Planning for Startups",
    description:
      "Essential financial strategies and planning techniques for early-stage companies.",
    image: "/images/news-sample-image.jpg",
    categories: ["Finance", "Startups"],
  },
  {
    id: 12,
    author: "Jennifer Lee",
    date: "6 Jan 2025",
    title: "Content Strategy That Converts",
    description:
      "How to create content that not only engages but also drives meaningful business outcomes.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Content", "Marketing"],
  },
  {
    id: 13,
    author: "Robert Taylor",
    date: "5 Jan 2025",
    title: "Cybersecurity for Small Businesses",
    description:
      "Practical security measures that small businesses can implement to protect their data and systems.",
    image: "/images/news-sample-image.jpg",
    categories: ["Security", "Business"],
  },
  {
    id: 14,
    author: "Amanda Clark",
    date: "4 Jan 2025",
    title: "The Psychology of User Onboarding",
    description:
      "Understanding user behavior during onboarding and designing experiences that drive adoption.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Psychology", "UX"],
  },
  {
    id: 15,
    author: "Kevin Martinez",
    date: "3 Jan 2025",
    title: "API Design Best Practices",
    description:
      "Creating APIs that are intuitive, maintainable, and developer-friendly for long-term success.",
    image: "/images/news-sample-image.jpg",
    categories: ["API", "Development"],
  },
  {
    id: 16,
    author: "Sophie Anderson",
    date: "2 Jan 2025",
    title: "Sustainable Business Practices",
    description:
      "How companies can integrate sustainability into their operations while maintaining profitability.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Sustainability", "Business"],
  },
  {
    id: 17,
    author: "Daniel White",
    date: "1 Jan 2025",
    title: "Machine Learning in Production",
    description:
      "Best practices for deploying and maintaining machine learning models in real-world applications.",
    image: "/images/news-sample-image.jpg",
    categories: ["Machine Learning", "Technology"],
  },
  {
    id: 18,
    author: "Jessica Moore",
    date: "31 Dec 2024",
    title: "Building Inclusive Workplaces",
    description:
      "Creating environments where all employees feel valued, respected, and able to contribute their best work.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Diversity", "Culture"],
  },
];

export const NewsListingSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const totalPages = Math.ceil(newsData.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch new data here
  };

  // Get current page articles
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = newsData.slice(startIndex, endIndex);

  return (
    <section className="bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-neutral-900 dark:text-white mb-8"
        >
          All News Posts
        </motion.h2>

        {/* News Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
        >
          {currentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <NewsArticleCard article={article} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

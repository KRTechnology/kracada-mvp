"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { LifestyleArticleCard } from "./LifestyleArticleCard";
import { LifestylePagination } from "./LifestylePagination";

// Sample lifestyle data - in a real app, this would come from an API
const lifestyleData = [
  {
    id: 1,
    author: "Sarah Johnson",
    date: "17 Jan 2025",
    title: "5 Morning Routines for Peak Productivity",
    description:
      "Start your day with intention and energy using these proven morning routines that successful people swear by.",
    image: "/images/news-sample-image.jpg",
    categories: ["Personal Development", "Productivity"],
  },
  {
    id: 2,
    author: "Dr. Michael Chen",
    date: "16 Jan 2025",
    title: "The Science of Healthy Eating",
    description:
      "Discover the latest research on nutrition and how to build sustainable healthy eating habits that last.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Health", "Nutrition"],
  },
  {
    id: 3,
    author: "Emma Rodriguez",
    date: "15 Jan 2025",
    title: "Sustainable Fashion: Building a Conscious Wardrobe",
    description:
      "Learn how to create a stylish, sustainable wardrobe that reflects your values and reduces environmental impact.",
    image: "/images/news-sample-image.jpg",
    categories: ["Fashion", "Sustainability"],
  },
  {
    id: 4,
    author: "James Wilson",
    date: "14 Jan 2025",
    title: "Mental Health in the Digital Age",
    description:
      "Navigating the challenges of modern life while maintaining good mental health and digital wellness.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Mental Health", "Wellness"],
  },
  {
    id: 5,
    author: "Lisa Park",
    date: "13 Jan 2025",
    title: "Work-Life Balance: Finding Your Sweet Spot",
    description:
      "Practical strategies for creating boundaries and achieving a fulfilling balance between work and personal life.",
    image: "/images/news-sample-image.jpg",
    categories: ["Work-Life Balance", "Career"],
  },
  {
    id: 6,
    author: "David Kim",
    date: "12 Jan 2025",
    title: "Fitness Trends That Actually Work",
    description:
      "Cut through the noise and focus on fitness approaches that deliver real, sustainable results for your lifestyle.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Fitness", "Health"],
  },
  {
    id: 7,
    author: "Maria Garcia",
    date: "11 Jan 2025",
    title: "Building Confidence Through Self-Care",
    description:
      "How a consistent self-care routine can boost your confidence and improve your overall quality of life.",
    image: "/images/news-sample-image.jpg",
    categories: ["Self-Care", "Personal Development"],
  },
  {
    id: 8,
    author: "Alex Thompson",
    date: "10 Jan 2025",
    title: "Minimalist Living: Less is More",
    description:
      "Embrace minimalism to reduce stress, increase focus, and create more space for what truly matters in life.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Minimalism", "Lifestyle"],
  },
  {
    id: 9,
    author: "Rachel Brown",
    date: "9 Jan 2025",
    title: "The Art of Mindful Communication",
    description:
      "Improve your relationships and reduce conflict through mindful communication techniques and active listening.",
    image: "/images/news-sample-image.jpg",
    categories: ["Communication", "Relationships"],
  },
  {
    id: 10,
    author: "Kevin Martinez",
    date: "8 Jan 2025",
    title: "Financial Wellness for Millennials",
    description:
      "Practical money management tips and strategies specifically tailored for the millennial generation.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Finance", "Personal Development"],
  },
  {
    id: 11,
    author: "Sophie Anderson",
    date: "7 Jan 2025",
    title: "Creating a Home Sanctuary",
    description:
      "Transform your living space into a peaceful sanctuary that supports your well-being and personal growth.",
    image: "/images/news-sample-image.jpg",
    categories: ["Home", "Wellness"],
  },
  {
    id: 12,
    author: "Daniel White",
    date: "6 Jan 2025",
    title: "The Power of Gratitude Practice",
    description:
      "How a simple daily gratitude practice can transform your mindset and improve your overall happiness.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Mindfulness", "Personal Development"],
  },
];

export const LifestyleListingSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const totalPages = Math.ceil(lifestyleData.length / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // In a real app, you would fetch new data here
  };

  // Get current page articles
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const currentArticles = lifestyleData.slice(startIndex, endIndex);

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
          All Lifestyle Posts
        </motion.h2>

        {/* Lifestyle Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {currentArticles.map((article, index) => (
            <LifestyleArticleCard
              key={article.id}
              article={article}
              index={index}
            />
          ))}
        </motion.div>

        {/* Pagination */}
        <LifestylePagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

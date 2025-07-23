"use client";

import React from "react";
import { motion } from "framer-motion";
import TravelCard from "./TravelCard";

const TravelSection = () => {
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

  // Sample travel data
  const travelData: Array<{
    id: number;
    category: string;
    title: string;
    rating: number;
    reviewCount: number;
    location: string;
    price: number;
    currency: string;
    image: string;
    badge?: string;
  }> = [
    {
      id: 1,
      category: "Entire apartment rental in Collingwood",
      title: "A Stylish Apt, 5 min walk to Queen Victoria Market",
      rating: 4.9,
      reviewCount: 202,
      location: "Collingwood VIC",
      price: 540,
      currency: "AUD",
      image: "/images/landing-hero-image.jpg",
      badge: "Rare find",
    },
    {
      id: 2,
      category: "Entire loft in central business district",
      title: "Designer NY style loft",
      rating: 4.8,
      reviewCount: 44,
      location: "Melbourne VIC",
      price: 620,
      currency: "AUD",
      image: "/images/news-sample-image.jpg",
    },
    {
      id: 3,
      category: "Entire rental unit in Carlton",
      title: "5 minute walk from University of Melbourne",
      rating: 4.7,
      reviewCount: 82,
      location: "Carlton VIC",
      price: 490,
      currency: "AUD",
      image: "/images/landing-hero-image.jpg",
    },
    {
      id: 4,
      category: "Entire apartment rental in Collingwood",
      title: "Magnificent apartment next to public transport",
      rating: 4.8,
      reviewCount: 12,
      location: "Collingwood VIC",
      price: 600,
      currency: "AUD",
      image: "/images/news-sample-image.jpg",
    },
  ];

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#EBE9E9" }}>
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
                style={{ color: "#7C7573" }}
              >
                Travel & Tourism
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{ color: "#7C7573" }}
              >
                Travel & Tourism
              </h2>
            </motion.div>

            {/* View All Button - Desktop Only */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-warm-200 hover:bg-warm-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                Go to travel & tourism
              </motion.button>
            </motion.div>
          </div>

          {/* Travel Cards */}
          <motion.div
            variants={itemVariants}
            className="space-y-6 lg:space-y-8"
          >
            {travelData.map((travel, index) => (
              <TravelCard key={travel.id} travel={travel} index={index} />
            ))}
          </motion.div>

          {/* Mobile View All Button */}
          <motion.div variants={itemVariants} className="lg:hidden mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-warm-200 hover:bg-warm-300 text-white py-4 rounded-xl font-semibold transition-all duration-300"
            >
              Go to travel & tourism
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default TravelSection;

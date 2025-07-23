"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import Link from "next/link";

const HeroContent = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-center lg:text-left"
    >
      {/* Main Heading */}
      <motion.h1
        variants={itemVariants}
        className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-800 leading-tight"
      >
        Welcome to{" "}
        <span className="relative inline-flex items-center">
          <span className="text-warm-200">Kracada</span>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.8,
              type: "spring",
              stiffness: 200,
            }}
            className="ml-2"
          >
            <Sparkles className="w-8 h-8 md:w-10 md:h-10 text-warm-200" />
          </motion.div>
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        variants={itemVariants}
        className="text-lg md:text-xl text-neutral-500 mt-6 lg:mt-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
      >
        Your one-stop shop for everything that is important to you.
      </motion.p>

      {/* CTA Button */}
      <motion.div variants={itemVariants} className="mt-8 lg:mt-12">
        <Link href="/signup">
          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 10px 30px rgba(255, 111, 0, 0.3)",
            }}
            whileTap={{ scale: 0.95 }}
            className="bg-warm-200 hover:bg-warm-300 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center"
            style={{
              width: "130px",
              height: "48px",
              fontSize: "16px",
            }}
          >
            Get started
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HeroContent;

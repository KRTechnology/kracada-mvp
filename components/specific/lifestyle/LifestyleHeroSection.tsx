"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { LifestyleSubscriptionForm } from "@/components/specific/lifestyle/LifestyleSubscriptionForm";

export const LifestyleHeroSection = () => {
  const { theme } = useTheme();

  return (
    <section
      className={`w-full py-16 ${theme === "dark" ? "bg-peach-600" : "bg-warm-500"}`}
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-left space-y-8"
        >
          {/* Lifestyle Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Lifestyle
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            Explore lifestyle content related to career, health, fashion and
            personal development so that you can improve your overall
            well-being.
          </motion.p>

          {/* Subscription Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="max-w-md"
          >
            <LifestyleSubscriptionForm />
          </motion.div>

          {/* Privacy Policy Text */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8, ease: "easeOut" }}
            className="text-sm text-white/70 max-w-md"
          >
            Subscribe to get the latest updates straight to you
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
};

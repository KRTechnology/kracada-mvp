"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";

export const QuizHeroSection = () => {
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
          {/* Quiz Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Quiz
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
          >
            Test your knowledge and challenge yourself with interactive quizzes
            across various topics
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
            className="flex flex-wrap gap-8"
          >
            <div className="text-white">
              <div className="text-2xl font-bold">50+</div>
              <div className="text-sm text-white/80">Quizzes Available</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">10k+</div>
              <div className="text-sm text-white/80">Questions Answered</div>
            </div>
            <div className="text-white">
              <div className="text-2xl font-bold">5</div>
              <div className="text-sm text-white/80">Difficulty Levels</div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

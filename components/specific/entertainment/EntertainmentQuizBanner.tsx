"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/common/button";

export const EntertainmentQuizBanner = () => {
  return (
    <section className="py-6 lg:py-8">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative overflow-hidden rounded-3xl lg:rounded-[32px]"
        >
          {/* Main Background Gradient */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(255, 247, 241, 0) 0%, #FF6F00 100%)",
            }}
          />

          {/* Backdrop Filter Layer */}
          <div
            className="absolute inset-0"
            style={{
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          />

          {/* Dark Mode Background Override */}
          <div
            className="absolute inset-0 opacity-0 dark:opacity-100 transition-opacity duration-300"
            style={{
              background:
                "linear-gradient(180deg, rgba(13, 13, 13, 0.1) 0%, rgba(255, 111, 0, 0.95) 100%)",
              backdropFilter: "blur(14px)",
              WebkitBackdropFilter: "blur(14px)",
            }}
          />

          {/* Quiz Banner Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 p-5 sm:p-6 lg:p-8 xl:p-12">
            {/* Left Content */}
            <div className="flex-1 max-w-lg text-center lg:text-left">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-800 dark:text-white mb-3 lg:mb-4 leading-tight"
              >
                Test Your Knowledge. <br className="hidden sm:block" />
                Have Some Fun.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm sm:text-base lg:text-lg text-neutral-700 dark:text-neutral-200 mb-4 lg:mb-6 leading-relaxed max-w-md mx-auto lg:mx-0"
              >
                Dive into interactive quizzes across entertainment, lifestyle,
                tech, and more. Challenge yourself, share with friends, and
                discover something new every time.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Button
                  size="lg"
                  className="bg-[#FF6F00] hover:bg-[#F57C00] text-white font-semibold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl text-base sm:text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  Get started
                </Button>
              </motion.div>
            </div>

            {/* Right Image with Pattern Background */}
            <div className="relative flex-shrink-0 order-first lg:order-last">
              {/* Pattern Background Container */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 lg:w-80 lg:h-80 xl:w-96 xl:h-96">
                {/* Background Mask with Radial Gradient */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, rgba(255, 247, 241, 0.3) 0%, rgba(255, 111, 0, 0.1) 50%, transparent 100%)",
                  }}
                />

                {/* Grid Dot Pattern Background - Light Mode */}
                <div
                  className="absolute inset-0 rounded-full opacity-100 dark:opacity-0 transition-opacity duration-300"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 1px 1px, rgba(255, 247, 241, 0.8) 1px, transparent 0)
                    `,
                    backgroundSize: "24px 24px",
                    backgroundPosition: "0 0",
                  }}
                />

                {/* Grid Dot Pattern Background - Dark Mode */}
                <div
                  className="absolute inset-0 rounded-full opacity-0 dark:opacity-100 transition-opacity duration-300"
                  style={{
                    backgroundImage: `
                      radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.15) 1px, transparent 0)
                    `,
                    backgroundSize: "24px 24px",
                    backgroundPosition: "0 0",
                  }}
                />

                {/* Additional Blur Effect for Pattern */}
                <div
                  className="absolute inset-0 rounded-full"
                  style={{
                    background:
                      "radial-gradient(circle at center, transparent 0%, rgba(255, 111, 0, 0.05) 70%, transparent 100%)",
                    filter: "blur(1px)",
                  }}
                />

                {/* Quiz Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="relative z-10 w-full h-full flex items-center justify-center"
                >
                  <Image
                    src="/images/quiz-image.png"
                    alt="Quiz illustration"
                    width={300}
                    height={300}
                    className="object-contain max-w-full max-h-full"
                    priority
                  />
                </motion.div>
              </div>

              {/* Floating Animation Elements */}
              <motion.div
                className="absolute -top-4 -right-4 w-8 h-8 bg-white/20 rounded-full"
                animate={{
                  y: [0, -10, 0],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <motion.div
                className="absolute -bottom-6 -left-6 w-6 h-6 bg-orange-200/30 rounded-full"
                animate={{
                  y: [0, 10, 0],
                  x: [0, 5, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

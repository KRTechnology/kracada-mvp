"use client";

import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-br from-warm-50 via-peach-50 to-coral-50 flex items-center justify-center px-4">
        <div className="max-w-2xl text-center">
          {/* Logo/Brand Animation */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8"
          >
            <h1 className="text-6xl font-bold bg-gradient-to-r from-warm-300 via-peach-300 to-coral-300 bg-clip-text text-transparent">
              Kracada
            </h1>
          </motion.div>

          {/* Main Message */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mb-8"
          >
            <h2 className="text-3xl font-semibold text-neutral-600 mb-4">
              We're Building Something Amazing
            </h2>
            <p className="text-lg text-neutral-500 leading-relaxed">
              Our team is working hard to bring you an exceptional experience.
              We'll be launching soon with exciting features that will transform
              how you explore opportunities and optimize your career.
            </p>
          </motion.div>

          {/* Animated Construction Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="mb-8"
          >
            <motion.div
              animate={{
                rotate: [0, 5, -5, 0],
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="inline-block"
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-warm-200 to-peach-200 rounded-full flex items-center justify-center shadow-lg">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="w-8 h-8 border-3 border-warm-400 border-t-transparent rounded-full"
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            className="mb-8"
          >
            <div className="bg-neutral-200 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: "0%" }}
                animate={{ width: "75%" }}
                transition={{ duration: 2, delay: 1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-warm-300 via-peach-300 to-coral-300 rounded-full"
              />
            </div>
            <p className="text-sm text-neutral-500 mt-2">Almost there...</p>
          </motion.div>

          {/* Floating Particles */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  x: Math.random() * 1200,
                  y: Math.random() * 800,
                }}
                animate={{
                  opacity: [0, 0.3, 0],
                  x: Math.random() * 1200,
                  y: Math.random() * 800,
                }}
                transition={{
                  duration: Math.random() * 10 + 10,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
                className="absolute w-2 h-2 bg-warm-200 rounded-full"
              />
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

"use client";

import { motion } from "framer-motion";
import { Copy, Share2, Twitter, Facebook, Linkedin } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/common/button";

export const LifestyleArticleHeader = () => {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-[#0D0D0D] "
    >
      <div className="container mx-auto px-4 py-8">
        {/* Category and Read Time */}
        <div className="flex items-center gap-4 mb-6">
          <span className="px-3 py-1 bg-orange-500 text-white text-sm font-medium rounded-full">
            Personal Development
          </span>
          <span className="text-neutral-500 dark:text-neutral-400 text-sm">
            6 min read
          </span>
        </div>

        {/* Article Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6 leading-tight"
        >
          5 Morning Routines for Peak Productivity
        </motion.h1>

        {/* Article Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-lg md:text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed"
        >
          Start your day with intention and energy using these proven morning
          routines that successful people swear by. Transform your productivity
          and well-being with simple, actionable steps.
        </motion.p>

        {/* Author and Publication Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                Written by
              </span>
              <span className="text-neutral-900 dark:text-white font-semibold">
                Sarah Johnson
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-neutral-500 dark:text-neutral-400 text-sm">
                Published on
              </span>
              <span className="text-neutral-900 dark:text-white font-semibold">
                17 Jan 2025
              </span>
            </div>
          </div>

          {/* Social Sharing */}
          <div className="flex items-center gap-3">
            <Button
              onClick={handleCopyLink}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? "Copied!" : "Copy link"}
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="p-2">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="p-2">
                <Linkedin className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.header>
  );
};

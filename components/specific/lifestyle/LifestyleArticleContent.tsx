"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { LifestyleArticleFooter } from "./LifestyleArticleFooter";

export const LifestyleArticleContent = () => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white dark:bg-[#0D0D0D]"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Introduction Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Why Morning Routines Matter
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              The way you start your morning sets the tone for your entire day.
              Research shows that people who follow consistent morning routines
              are more productive, less stressed, and generally happier. A
              well-designed morning routine can transform your life by giving
              you control over your day before it controls you.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Whether you're a busy professional, a student, or someone looking
              to improve their overall well-being, these five morning routine
              strategies can help you create a foundation for success and
              personal growth.
            </p>
          </div>
        </motion.section>

        {/* First Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/images/landing-hero-image.jpg"
              alt="Person doing morning yoga and meditation"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <ExternalLink className="w-4 h-4" />
            <span>Image courtesy of Lifestyle Photography via Unsplash</span>
          </div>
        </motion.div>

        {/* Morning Routine Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            The 5 Essential Morning Routine Steps
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              These proven strategies have been tested by thousands of
              successful individuals across different industries and lifestyles.
              Choose the ones that resonate with you and adapt them to your
              unique situation.
            </p>
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-12"
        >
          <blockquote className="border-l-4 border-orange-500 pl-6 py-4">
            <p className="text-lg md:text-xl italic text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
              "The way you start your day is the way you live your day. The way
              you live your day is the way you live your life."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  SJ
                </span>
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  Sarah Johnson
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Lifestyle Coach
                </p>
              </div>
            </div>
          </blockquote>
        </motion.div>

        {/* Health and Wellness Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Health and Wellness Integration
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              A truly effective morning routine goes beyond productivity hacks.
              It should nourish your body, mind, and spirit. This holistic
              approach ensures that you're not just getting things done, but
              also taking care of your overall well-being.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Consider incorporating elements like hydration, light exercise,
              mindfulness practices, and nutritious breakfast choices into your
              morning routine. These small habits compound over time to create
              significant positive changes in your life.
            </p>
          </div>
        </motion.section>

        {/* Practical Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Practical Implementation Tips
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Starting a new morning routine can feel overwhelming, but remember
              that consistency is more important than perfection. Begin with
              just one or two elements and gradually build from there.
            </p>
            <ol className="list-decimal list-inside space-y-3 text-neutral-700 dark:text-neutral-300">
              <li>Start small with 5-10 minutes of your chosen activity</li>
              <li>Prepare everything the night before to remove friction</li>
              <li>Track your progress and celebrate small wins</li>
              <li>
                Be flexible and adjust based on what works for your lifestyle
              </li>
              <li>Give yourself at least 21 days to form the habit</li>
            </ol>
          </div>
        </motion.section>

        {/* Second Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mb-12"
        >
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/images/news-sample-image.jpg"
              alt="Person enjoying a healthy breakfast and planning their day"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <ExternalLink className="w-4 h-4" />
            <span>Image courtesy of Wellness Photography via Unsplash</span>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Your Journey to Better Mornings
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Remember that the perfect morning routine is the one that you can
              consistently follow. It's not about copying someone else's
              routine, but about creating something that works for your unique
              lifestyle, goals, and preferences.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Start tomorrow morning with just one small change. Whether it's
              drinking a glass of water first thing, taking five deep breaths,
              or writing down three things you're grateful for, every step
              forward is progress. Your future self will thank you for the
              investment you make in your morning routine today.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Article Footer with Disclaimer and Comments */}
      <LifestyleArticleFooter />
    </motion.article>
  );
};

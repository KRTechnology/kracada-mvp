"use client";

import { Button } from "@/components/common/button";
import { AuthSidebar } from "@/components/layout/AuthSidebar";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SignupConfirmationPage() {
  // Animation variants
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
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
      },
    },
  };

  return (
    <div className="flex h-full w-full min-h-screen">
      {/* Left side: marketing/branding (hidden on mobile) */}
      <AuthSidebar />

      {/* Right side: confirmation content */}
      <div className="w-full md:w-2/5 flex flex-col justify-center items-center px-8 py-16 bg-white dark:bg-neutral-900">
        <motion.div
          className="w-full md:w-[68%] flex flex-col items-center text-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            variants={itemVariants}
            className="w-16 h-16 bg-peach-50 dark:bg-peach-900/20 rounded-full flex items-center justify-center mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-peach-200"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-2xl font-bold mb-4 text-neutral-900 dark:text-neutral-200"
          >
            Check Your Email
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="text-neutral-500 dark:text-neutral-400 mb-6"
          >
            We've sent a verification link to your email. Please check your
            inbox and click the link to verify your account.
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="bg-warm-50 dark:bg-warm-900/20 border border-warm-100 dark:border-warm-800 rounded-lg p-4 mb-8 text-left"
          >
            <p className="text-neutral-700 dark:text-neutral-300 text-sm">
              <span className="font-semibold">Tip:</span> If you don't see the
              email in your inbox, please check your spam folder. The
              verification link will expire in 24 hours.
            </p>
          </motion.div>

          <motion.div variants={itemVariants} className="w-full">
            <Button
              asChild
              className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark w-full"
            >
              <Link href="/login">Go to Login</Link>
            </Button>
          </motion.div>

          <motion.p
            variants={itemVariants}
            className="mt-6 text-neutral-500 dark:text-neutral-400 text-sm"
          >
            Didn't receive an email?{" "}
            <Link
              href="/request-verification"
              className="text-peach-200 font-semibold hover:underline"
            >
              Resend verification email
            </Link>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
}

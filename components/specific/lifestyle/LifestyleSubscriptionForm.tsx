"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Spinner } from "@/components/common/spinner";

const subscriptionSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export const LifestyleSubscriptionForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    try {
      setIsSubmitting(true);

      // Simulate API request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Lifestyle subscription data:", data);

      // Simulate success
      setIsSubmitted(true);
      reset();

      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error("Lifestyle subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-4"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 mx-auto bg-white/20 rounded-full flex items-center justify-center"
        >
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </motion.div>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-white text-lg font-medium"
        >
          Thank you for subscribing!
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="text-white/80 text-sm"
        >
          You'll receive the latest lifestyle updates straight to your inbox.
        </motion.p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
        className="space-y-4"
      >
        {/* Email Input */}
        <div className="relative">
          <Input
            {...register("email")}
            type="email"
            placeholder="Enter your email"
            className={`w-full h-14 px-4 text-base bg-black/30 border-0 rounded-lg text-white placeholder:text-white/60 focus:ring-2 focus:ring-white/30 focus:outline-none transition-all duration-200 ${
              errors.email ? "ring-2 ring-red-400" : ""
            }`}
            style={{
              backdropFilter: "blur(10px)",
            }}
          />
          {errors.email && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute -bottom-6 left-0 text-red-300 text-sm"
            >
              {errors.email.message}
            </motion.p>
          )}
        </div>

        {/* Get Started Button */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <Spinner size="sm" className="w-5 h-5" />
                <span>Getting started...</span>
              </div>
            ) : (
              "Get started"
            )}
          </Button>
        </motion.div>
      </motion.div>
    </form>
  );
};

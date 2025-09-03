"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface PricingPackage {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  additionalDescription?: string;
  isPopular?: boolean;
}

const packages: PricingPackage[] = [
  {
    id: "deluxe",
    name: "Deluxe Package",
    price: "₦20,000",
    description: "Professional CV Writing.",
    additionalDescription:
      "We will style your CV to Professional Standard acceptable to most organizations and firms in Nigeria",
    features: [
      "Up To two revisions",
      "Feedback on each draft and we will make revisions up to a maximum of two times",
      "Turn around time",
      "The first draft of your CV will be sent to you within 3 working days",
    ],
  },
  {
    id: "supreme",
    name: "Supreme Package",
    price: "₦30,000",
    description: "International Standard",
    additionalDescription:
      "We will style your CV to International Standard acceptable to most organizations and firms in any country of your choice",
    features: [
      "Up To Three Revisions.",
      "Feedback on each draft and we will make revisions up to a maximum of three times",
      "Turn around time",
      "The first draft of your CV will be sent to you within 5 working days. + cover letter",
    ],
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium Package",
    price: "₦45,000",
    description:
      "All features of Supreme plus Standard LinkedIn profile writing and Interview preparatory session",
    features: [
      "Up To five Revisions",
      "Feedback on each draft and we will make revisions up to a maximum of five times",
      "Interview preparatory session",
      "Interview preparatory and guidance sessions for up to two hours",
      "Turn around time",
      "The first draft of your CV will be sent to you within 7 working days. Standard LinkedIn profile writing",
      "Includes Standard LinkedIn profile writing",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function CVOptimizationContent() {
  const [isAnimated, setIsAnimated] = useState(false);
  const router = useRouter();

  const handleGetStarted = (packageId: string) => {
    // Store selected package in localStorage or pass as query param
    localStorage.setItem("selectedPackage", packageId);
    router.push("/cv-optimization/upload");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-warm-100 dark:text-warm-200 text-base mb-3 font-medium">
              CV Optimization
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pricing plans
            </h1>
          </motion.div>

          {/* Mobile Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-6"
            onAnimationComplete={() => setIsAnimated(true)}
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                variants={cardVariants}
                className="relative bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl transition-all duration-300"
              >
                {/* Package Badge */}
                <div className="mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-warm-50 dark:bg-warm-900/20 border border-warm-200/20">
                    <div className="w-2 h-2 bg-warm-200 rounded-full mr-2"></div>
                    <span className="text-warm-700 dark:text-warm-200 text-sm font-medium">
                      {pkg.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {pkg.price}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
                    {pkg.description}
                  </p>
                </div>

                {/* Additional Description */}
                {pkg.additionalDescription && (
                  <div className="mb-4">
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {pkg.additionalDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isAnimated ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-4 h-4 rounded-full bg-warm-100 dark:bg-warm-900/50 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-warm-600 dark:text-warm-400" />
                        </div>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGetStarted(pkg.id)}
                  className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Get started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-warm-100 dark:text-warm-200 text-lg mb-4 font-medium">
              CV Optimization
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Pricing plans
            </h1>
          </motion.div>

          {/* Desktop Pricing Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-8 max-w-6xl mx-auto"
            onAnimationComplete={() => setIsAnimated(true)}
          >
            {packages.map((pkg, index) => (
              <motion.div
                key={pkg.id}
                variants={cardVariants}
                className="relative bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Package Badge */}
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-warm-50 dark:bg-warm-900/20 border border-warm-200/20">
                    <div className="w-2 h-2 bg-warm-200 rounded-full mr-2"></div>
                    <span className="text-warm-700 dark:text-warm-200 text-sm font-medium">
                      {pkg.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                    {pkg.price}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {pkg.description}
                  </p>
                </div>

                {/* Additional Description */}
                {pkg.additionalDescription && (
                  <div className="mb-6">
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {pkg.additionalDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isAnimated ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-warm-100 dark:bg-warm-900/50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-warm-600 dark:text-warm-400" />
                        </div>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleGetStarted(pkg.id)}
                  className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                >
                  Get started
                </motion.button>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

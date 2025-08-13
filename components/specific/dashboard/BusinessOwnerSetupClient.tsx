"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/common/button";

export function BusinessOwnerSetupClient() {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Top Section - White Background */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1010px] mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[#334155] dark:text-neutral-100 mb-2">
                Complete your profile
              </h1>
              <p className="text-[#64748B] dark:text-neutral-100">
                Let's get to know you better. Complete your profile to get
                started.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - #F1F5F9 Background */}
      <div className="bg-slate-100 dark:bg-neutral-800 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1010px] mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-12 text-center"
            >
              <h3 className="text-xl font-semibold text-[#334155] dark:text-neutral-100 mb-4">
                Business Owner Setup
              </h3>
              <p className="text-[#64748B] dark:text-neutral-400 mb-6">
                This setup flow is coming soon. Business owners will have a
                specialized onboarding experience.
              </p>
              <Button
                className="bg-warm-200 hover:bg-warm-300 text-white px-6 py-2 rounded-lg"
                onClick={() => window.history.back()}
              >
                Go Back
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

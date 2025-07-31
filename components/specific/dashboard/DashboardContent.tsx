"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabSwitcher, TabType } from "./TabSwitcher";

export function DashboardContent() {
  const [activeTab, setActiveTab] = useState<TabType>("Profile");

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  return (
    <div className="space-y-6">
      {/* Tab Switcher */}
      <div className="pt-6">
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={handleTabChange}
          applicationsCount={2} // This will be dynamic in the future
        />
      </div>

      {/* Tab Content */}
      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-[400px]"
          >
            {activeTab === "Profile" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Profile Content
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Profile tab content will be implemented here.
                </p>
              </div>
            )}

            {activeTab === "Activities" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Activities
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Activities tab content will be implemented here.
                </p>
              </div>
            )}

            {activeTab === "Bookmarks" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Bookmarks
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Bookmarks tab content will be implemented here.
                </p>
              </div>
            )}

            {activeTab === "Applications" && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
                  Applications
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400">
                  Applications tab content will be implemented here.
                </p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

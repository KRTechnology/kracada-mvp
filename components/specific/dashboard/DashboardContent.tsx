"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabSwitcher, TabType } from "./TabSwitcher";
import { ProfileContent } from "./ProfileContent";
import { BookmarksContent } from "./BookmarksContent";
import { ApplicationsContent } from "./ApplicationsContent";
import { ChevronDown } from "lucide-react";

interface DashboardContentProps {
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    website?: string | null;
    portfolio?: string | null;
    skills?: string[];
    jobPreferences?: string[];
  };
  experiences: Array<{
    id: string;
    jobTitle: string;
    employmentType: string;
    company: string;
    currentlyWorking: boolean;
    startMonth: string | null;
    startYear: string | null;
    endMonth: string | null;
    endYear: string | null;
    description: string | null;
    skills: string[];
  }>;
}

const tabOptions = [
  { value: "Profile", label: "Profile", count: 0 },
  { value: "Activities", label: "Activities", count: 0 },
  { value: "Bookmarks", label: "Bookmarks", count: 0 },
  { value: "Applications", label: "Applications", count: 0 },
] as const;

export function DashboardContent({
  userData,
  experiences,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Profile");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  const currentTabLabel = tabOptions.find(
    (option) => option.value === activeTab
  )?.label;

  return (
    <div className="space-y-6">
      {/* Desktop Tab Switcher */}
      <div className="pt-6 hidden md:block">
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={handleTabChange}
          applicationsCount={2}
        />
      </div>

      {/* Mobile Dropdown */}
      <div className="pt-6 md:hidden px-6">
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg text-left"
          >
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">
              {currentTabLabel}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-neutral-500 transition-transform ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isDropdownOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 rounded-lg shadow-lg z-10"
            >
              {tabOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    handleTabChange(option.value as TabType);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                    activeTab === option.value
                      ? "text-warm-200 dark:text-warm-300 font-medium"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.label}</span>
                    {option.count && option.count > 0 && (
                      <span className="text-xs bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 px-2 py-1 rounded-full">
                        {option.count}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
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
              <ProfileContent userData={userData} experiences={experiences} />
            )}

            {activeTab === "Activities" && (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                  <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                    No activities yet
                  </h4>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                    Your recent activities will appear here. This could include
                    job applications, profile updates, and other interactions.
                  </p>
                </div>
              </div>
            )}

            {activeTab === "Bookmarks" && <BookmarksContent />}

            {activeTab === "Applications" && <ApplicationsContent />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

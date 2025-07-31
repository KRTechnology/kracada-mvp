"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TabSwitcher, TabType } from "./TabSwitcher";
import { ProfileContent } from "./ProfileContent";
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
  { value: "Profile", label: "Profile" },
  { value: "Activities", label: "Activities" },
  { value: "Bookmarks", label: "Bookmarks" },
  { value: "Applications", label: "Applications" },
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
          applicationsCount={2} // This will be dynamic in the future
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
                  {option.label}
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

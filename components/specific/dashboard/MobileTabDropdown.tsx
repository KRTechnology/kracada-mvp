"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { TabType } from "./TabSwitcher";

interface MobileTabDropdownProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  accountType?: string;
}

interface TabOption {
  value: TabType;
  label: string;
  count: number;
}

const getTabOptionsForAccountType = (accountType?: string): TabOption[] => {
  const baseTabs = [
    { value: "Profile" as TabType, label: "Profile", count: 0 },
    { value: "Activities" as TabType, label: "Activities", count: 0 },
    { value: "Bookmarks" as TabType, label: "Bookmarks", count: 0 },
  ];

  // Add account-specific tab
  if (accountType === "Employer" || accountType === "Business Owner") {
    return [
      ...baseTabs,
      { value: "Job Posts" as TabType, label: "Job Posts", count: 0 },
    ];
  } else {
    return [
      ...baseTabs,
      { value: "Applications" as TabType, label: "Applications", count: 2 },
    ];
  }
};

export function MobileTabDropdown({
  activeTab,
  onTabChange,
  accountType,
}: MobileTabDropdownProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const tabOptions = getTabOptionsForAccountType(accountType);

  const currentTabLabel = tabOptions.find(
    (option) => option.value === activeTab
  )?.label;

  return (
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
                  onTabChange(option.value);
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
  );
}

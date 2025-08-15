"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type TabType =
  | "Profile"
  | "Activities"
  | "Bookmarks"
  | "Applications"
  | "Job Posts";

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  applicationsCount?: number;
  accountType?: string;
}

interface TabItem {
  id: TabType;
  label: string;
  badge?: number;
}

const getTabsForAccountType = (accountType?: string): TabItem[] => {
  const baseTabs = [
    { id: "Profile" as TabType, label: "Profile" },
    { id: "Activities" as TabType, label: "Activities" },
    { id: "Bookmarks" as TabType, label: "Bookmarks" },
  ];

  // Add account-specific tab
  if (accountType === "Employer" || accountType === "Business Owner") {
    return [...baseTabs, { id: "Job Posts" as TabType, label: "Job Posts" }];
  } else {
    return [
      ...baseTabs,
      { id: "Applications" as TabType, label: "Applications" },
    ];
  }
};

export function TabSwitcher({
  activeTab,
  onTabChange,
  applicationsCount = 0,
  accountType,
}: TabSwitcherProps) {
  const tabs = getTabsForAccountType(accountType);

  const [tabsWithBadge] = useState(() =>
    tabs.map((tab) => {
      if (tab.id === "Applications") {
        return { ...tab, badge: applicationsCount };
      }
      if (tab.id === "Job Posts") {
        return { ...tab, badge: 0 }; // TODO: Add job posts count
      }
      return tab;
    })
  );

  const activeTabIndex = tabsWithBadge.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="mx-[30px]">
      <div className="relative bg-tab-light-bg dark:bg-tab-dark-bg border border-tab-light-border dark:border-tab-dark-border rounded-[10px] p-1">
        {/* Animated Background Slider */}
        <motion.div
          className="absolute top-1 left-1 h-[calc(100%-8px)] bg-tab-light-active-bg dark:bg-tab-dark-active-bg rounded-[8px]"
          initial={false}
          animate={{
            x: `${activeTabIndex * 100}%`,
            width: `calc(100%/${tabs.length} - 2px)`,
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        />

        {/* Tab Buttons */}
        <div className="relative flex">
          {tabsWithBadge.map((tab, index) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex-1 flex items-center justify-center py-3 px-4 rounded-[8px] transition-colors duration-200 ${
                activeTab === tab.id
                  ? "text-tab-light-active-text dark:text-tab-dark-active-text"
                  : "text-tab-light-inactive-text dark:text-tab-dark-inactive-text hover:text-tab-light-active-text dark:hover:text-tab-dark-active-text"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{tab.label}</span>
                {tab.badge && tab.badge > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 500,
                      damping: 30,
                    }}
                    className="flex items-center justify-center min-w-[20px] h-5 px-1.5 bg-neutral-200 dark:bg-neutral-600 border border-neutral-300 dark:border-neutral-500 rounded-full"
                  >
                    <span className="text-xs font-medium text-neutral-700 dark:text-neutral-200">
                      {tab.badge}
                    </span>
                  </motion.div>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

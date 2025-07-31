"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type TabType = "Profile" | "Activities" | "Bookmarks" | "Applications";

interface TabSwitcherProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  applicationsCount?: number;
}

interface TabItem {
  id: TabType;
  label: string;
  badge?: number;
}

const tabs: TabItem[] = [
  { id: "Profile", label: "Profile" },
  { id: "Activities", label: "Activities" },
  { id: "Bookmarks", label: "Bookmarks" },
  { id: "Applications", label: "Applications" },
];

export function TabSwitcher({
  activeTab,
  onTabChange,
  applicationsCount = 0,
}: TabSwitcherProps) {
  const [tabsWithBadge] = useState(() =>
    tabs.map((tab) =>
      tab.id === "Applications" ? { ...tab, badge: applicationsCount } : tab
    )
  );

  const activeTabIndex = tabsWithBadge.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="mx-[30px]">
      <div className="relative bg-tab-light-bg dark:bg-tab-dark-bg border border-tab-light-border dark:border-tab-dark-border rounded-[10px] p-1">
        {/* Animated Background Slider */}
        <motion.div
          className="absolute top-1 left-1 w-[calc(100%/4-2px)] h-[calc(100%-8px)] bg-tab-light-active-bg dark:bg-tab-dark-active-bg rounded-[8px]"
          initial={false}
          animate={{
            x: `${activeTabIndex * (100)}%`,
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

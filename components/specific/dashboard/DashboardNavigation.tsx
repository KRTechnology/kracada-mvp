"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export type TabType =
  | "Profile"
  | "Activities"
  | "Bookmarks"
  | "Applications"
  | "Job Posts";

interface DashboardNavigationProps {
  accountType?: string;
  applicationsCount?: number;
}

interface TabItem {
  id: TabType;
  label: string;
  path: string;
  badge?: number;
}

const getTabsForAccountType = (accountType?: string): TabItem[] => {
  const baseTabs = [
    { id: "Profile" as TabType, label: "Profile", path: "/dashboard" },
    {
      id: "Activities" as TabType,
      label: "Activities",
      path: "/dashboard/activities",
    },
    {
      id: "Bookmarks" as TabType,
      label: "Bookmarks",
      path: "/dashboard/bookmarks",
    },
  ];

  // Add account-specific tab
  if (accountType === "Recruiter" || accountType === "Business Owner") {
    return [
      ...baseTabs,
      {
        id: "Job Posts" as TabType,
        label: "Job Posts",
        path: "/dashboard/job-posts",
      },
    ];
  } else {
    return [
      ...baseTabs,
      {
        id: "Applications" as TabType,
        label: "Applications",
        path: "/dashboard/applications",
      },
    ];
  }
};

const getActiveTabFromPath = (pathname: string): TabType => {
  if (pathname === "/dashboard") return "Profile";
  if (pathname.includes("/dashboard/activities")) return "Activities";
  if (pathname.includes("/dashboard/bookmarks")) return "Bookmarks";
  if (pathname.includes("/dashboard/applications")) return "Applications";
  if (pathname.includes("/dashboard/job-posts")) return "Job Posts";
  return "Profile"; // Default fallback
};

export function DashboardNavigation({
  accountType,
  applicationsCount = 0,
}: DashboardNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const tabs = getTabsForAccountType(accountType);
  const activeTab = getActiveTabFromPath(pathname);

  const tabsWithBadge = tabs.map((tab) => {
    if (tab.id === "Applications") {
      return { ...tab, badge: applicationsCount };
    }
    if (tab.id === "Job Posts") {
      return { ...tab, badge: 0 }; // TODO: Add job posts count
    }
    return tab;
  });

  const activeTabIndex = tabsWithBadge.findIndex((tab) => tab.id === activeTab);
  const currentTabLabel = tabsWithBadge.find(
    (tab) => tab.id === activeTab
  )?.label;

  const handleTabChange = (tab: TabItem) => {
    router.push(tab.path);
  };

  return (
    <>
      {/* Desktop Tab Switcher */}
      <div className="pt-6 hidden md:block">
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
                  onClick={() => handleTabChange(tab)}
                  className={`relative flex-1 flex items-center justify-center py-3 px-4 rounded-[8px] transition-colors duration-200 ${
                    activeTab === tab.id
                      ? "text-tab-light-active-text dark:text-tab-dark-active-text"
                      : "text-tab-light-inactive-text dark:text-tab-dark-inactive-text hover:text-tab-light-active-text dark:hover:text-tab-dark-active-text"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{tab.label}</span>
                    {/* {tab.badge && tab.badge > 0 && (
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
                    )} */}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Tab Dropdown */}
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
              {tabsWithBadge.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    handleTabChange(tab);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                    activeTab === tab.id
                      ? "text-warm-200 dark:text-warm-300 font-medium"
                      : "text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{tab.label}</span>
                    {/* {tab.badge && tab.badge > 0 && (
                      <span className="text-xs bg-neutral-200 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-200 px-2 py-1 rounded-full">
                        {tab.badge}
                      </span>
                    )} */}
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </>
  );
}

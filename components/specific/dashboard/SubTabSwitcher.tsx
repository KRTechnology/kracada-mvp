"use client";

import { useState } from "react";
import { motion } from "framer-motion";

export type SubTabType = "Jobs" | "Articles" | "Videos" | "Hotels";

interface SubTabSwitcherProps {
  activeTab: SubTabType;
  onTabChange: (tab: SubTabType) => void;
}

interface SubTabItem {
  id: SubTabType;
  label: string;
  count: number;
}

const subTabs: SubTabItem[] = [
  { id: "Jobs", label: "Jobs", count: 20 },
  { id: "Articles", label: "Articles", count: 0 },
  { id: "Videos", label: "Videos", count: 0 },
  { id: "Hotels", label: "Hotels", count: 2 },
];

export function SubTabSwitcher({
  activeTab,
  onTabChange,
}: SubTabSwitcherProps) {
  const activeTabIndex = subTabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div>
      <div className="flex justify-between">
        {subTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative pb-3 transition-colors duration-200 flex-1 flex justify-center items-center"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "text-warm-200 dark:text-warm-200"
                    : "text-[#717680] dark:text-[#717680]"
                }`}
              >
                {tab.label}
              </span>
              {tab.count > 0 && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {tab.count}
                </span>
              )}
            </div>

            {/* Animated underline */}
            {activeTab === tab.id && (
              <motion.div
                layoutId="subtab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-200 dark:bg-warm-200"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

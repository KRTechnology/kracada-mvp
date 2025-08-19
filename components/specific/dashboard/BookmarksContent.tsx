"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SubTabSwitcher, SubTabType } from "./SubTabSwitcher";
import { JobCard } from "./JobCard";
import { ArticleCard } from "./ArticleCard";
import { VideoCard } from "./VideoCard";
import { HotelCard } from "./HotelCard";
import { Pagination } from "./Pagination";
import {
  jobsBookmarks,
  articlesBookmarks,
  videosBookmarks,
  hotelsBookmarks,
  JobBookmark,
  ArticleBookmark,
  VideoBookmark,
  HotelBookmark,
} from "@/lib/data/bookmarks-data";

const ITEMS_PER_PAGE = 9;

export function BookmarksContent() {
  const [activeSubTab, setActiveSubTab] = useState<SubTabType>("Jobs");
  const [currentPage, setCurrentPage] = useState(1);

  // Default tabs for bookmarks
  const defaultTabs = [
    { id: "Jobs" as SubTabType, label: "Jobs", count: 20 },
    { id: "Articles" as SubTabType, label: "Articles", count: 0 },
    { id: "Videos" as SubTabType, label: "Videos", count: 0 },
    { id: "Hotels" as SubTabType, label: "Hotels", count: 2 },
  ];

  const getDataForTab = (tab: SubTabType) => {
    switch (tab) {
      case "Jobs":
        return jobsBookmarks;
      case "Articles":
        return articlesBookmarks;
      case "Videos":
        return videosBookmarks;
      case "Hotels":
        return hotelsBookmarks;
      default:
        return [];
    }
  };

  const data = getDataForTab(activeSubTab);
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handleSubTabChange = (tab: SubTabType) => {
    setActiveSubTab(tab);
    setCurrentPage(1); // Reset to first page when changing tabs
  };

  // Wrapper function to handle type conversion for SubTabSwitcher
  const handleTabChangeWrapper = (tab: any) => {
    if (
      tab === "Jobs" ||
      tab === "Articles" ||
      tab === "Videos" ||
      tab === "Hotels"
    ) {
      handleSubTabChange(tab);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderEmptyState = (tab: SubTabType) => {
    const emptyStates = {
      Jobs: {
        icon: "💼",
        title: "No job bookmarks yet",
        description:
          "Save interesting job postings to your bookmarks to easily access them later.",
      },
      Articles: {
        icon: "📰",
        title: "No article bookmarks yet",
        description:
          "Bookmark interesting articles to read them later when you have time.",
      },
      Videos: {
        icon: "🎥",
        title: "No video bookmarks yet",
        description:
          "Save helpful videos to your bookmarks to watch them later.",
      },
      Hotels: {
        icon: "🏨",
        title: "No hotel bookmarks yet",
        description:
          "Bookmark hotels you're interested in for future travel planning.",
      },
    };

    const state = emptyStates[tab];

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">{state.icon}</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          {state.title}
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          {state.description}
        </p>
      </div>
    );
  };

  const renderContent = () => {
    if (currentData.length === 0) {
      return renderEmptyState(activeSubTab);
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="wait">
          {currentData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              {activeSubTab === "Jobs" && <JobCard job={item as JobBookmark} />}
              {activeSubTab === "Articles" && (
                <ArticleCard article={item as ArticleBookmark} />
              )}
              {activeSubTab === "Videos" && (
                <VideoCard video={item as VideoBookmark} />
              )}
              {activeSubTab === "Hotels" && (
                <HotelCard hotel={item as HotelBookmark} />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* SubTab Switcher */}
      <div className="pb-4">
        <SubTabSwitcher
          activeTab={activeSubTab}
          onTabChange={handleTabChangeWrapper}
          tabs={defaultTabs}
        />
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSubTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
}

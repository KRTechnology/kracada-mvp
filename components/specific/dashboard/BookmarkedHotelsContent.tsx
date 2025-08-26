"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HotelCard } from "./HotelCard";
import { Pagination } from "./Pagination";
import { hotelsBookmarks, HotelBookmark } from "@/lib/data/bookmarks-data";

const ITEMS_PER_PAGE = 9;

export function BookmarkedHotelsContent() {
  const [currentPage, setCurrentPage] = useState(1);

  const data = hotelsBookmarks;
  const totalPages = Math.ceil(data.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = data.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderEmptyState = () => {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">🏨</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No hotel bookmarks yet
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Bookmark hotels you're interested in for future travel planning.
        </p>
      </div>
    );
  };

  if (currentData.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-6">
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
              <HotelCard hotel={item} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { RestaurantCard } from "@/components/specific/hotels-restaurants/RestaurantCard";
import { Pagination } from "./Pagination";
import { BookmarkedRestaurantItem } from "@/app/(dashboard)/actions/bookmark-actions";

const ITEMS_PER_PAGE = 9;

interface BookmarkedRestaurantsContentProps {
  bookmarkedRestaurants: BookmarkedRestaurantItem[];
}

export function BookmarkedRestaurantsContent({
  bookmarkedRestaurants,
}: BookmarkedRestaurantsContentProps) {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(bookmarkedRestaurants.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = bookmarkedRestaurants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderEmptyState = () => {
    if (status === "unauthenticated") {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
            Sign in to view bookmarks
          </h4>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
            Please sign in to see your saved restaurant bookmarks.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">🍽️</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No restaurant bookmarks yet
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Save interesting restaurants to your bookmarks to easily access them
          later.
        </p>
      </div>
    );
  };

  if (currentData.length === 0 && bookmarkedRestaurants.length === 0) {
    return renderEmptyState();
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {currentData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <RestaurantCard
                restaurant={{
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  location: item.location,
                  category: item.category,
                  cuisine: item.cuisine,
                  priceRange: item.priceRange,
                  rating: item.rating,
                  reviewCount: item.reviewCount,
                  featuredImage: item.featuredImage,
                  isPublished: true,
                  images: [],
                  menuHighlights: [],
                  specialties: [],
                  ambiance: [],
                  features: [],
                  openingHours: "",
                  fullDescription: item.description,
                  address: null,
                  policies: {
                    reservations: "",
                    dressCode: "",
                    minimumAge: "",
                    cancellation: "",
                    payment: "",
                  },
                  contact: {
                    phone: "",
                    email: "",
                    website: "",
                  },
                  createdAt: item.bookmarkedAt,
                  updatedAt: item.bookmarkedAt,
                  ownerId: "",
                }}
                index={index}
              />
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

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { HotelCard } from "@/components/specific/hotels-restaurants/HotelCard";
import { Pagination } from "./Pagination";
import { BookmarkedHotelItem } from "@/app/(dashboard)/actions/bookmark-actions";

const ITEMS_PER_PAGE = 9;

interface BookmarkedHotelsContentProps {
  bookmarkedHotels: BookmarkedHotelItem[];
}

export function BookmarkedHotelsContent({
  bookmarkedHotels,
}: BookmarkedHotelsContentProps) {
  const { data: session, status } = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(bookmarkedHotels.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentData = bookmarkedHotels.slice(startIndex, endIndex);

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
            Please sign in to see your saved hotel bookmarks.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-4xl mb-4">🏨</div>
        <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
          No hotel bookmarks yet
        </h4>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
          Save interesting hotels to your bookmarks to easily access them later.
        </p>
      </div>
    );
  };

  if (currentData.length === 0 && bookmarkedHotels.length === 0) {
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
              <HotelCard
                hotel={{
                  id: item.id,
                  name: item.name,
                  description: item.description,
                  location: item.location,
                  category: item.category,
                  pricePerNight: item.pricePerNight,
                  currency: item.currency,
                  rating: item.rating,
                  reviewCount: item.reviewCount,
                  featuredImage: item.featuredImage,
                  isPublished: true,
                  amenities: [],
                  features: [],
                  images: [],
                  policies: {
                    checkIn: "",
                    checkOut: "",
                    cancellation: "",
                    pets: "",
                    smoking: "",
                  },
                  contact: {
                    phone: "",
                    email: "",
                    website: "",
                  },
                  fullDescription: item.description,
                  address: null,
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

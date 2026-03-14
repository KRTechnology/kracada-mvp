"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import TravelCard from "@/components/specific/landing/TravelCard";
import { Pagination } from "@/components/common/Pagination";

// Travel data in Naira currency
const travelData: Array<{
  id: number;
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: number;
  currency: string;
  image: string;
  badge?: string;
}> = [
  {
    id: 1,
    category: "Entire apartment rental in Victoria Island",
    title: "Luxury Waterfront Apartment with Lagos Lagoon Views",
    rating: 4.9,
    reviewCount: 156,
    location: "Victoria Island, Lagos",
    price: 85000,
    currency: "NGN",
    image: "/images/hotel-image-one.jpg",
    badge: "Rare find",
  },
  {
    id: 2,
    category: "Entire villa in Lekki",
    title: "Modern Villa with Private Pool and Garden",
    rating: 4.8,
    reviewCount: 89,
    location: "Lekki Phase 1, Lagos",
    price: 120000,
    currency: "NGN",
    image: "/images/hotel-image-two.jpg",
  },
  {
    id: 3,
    category: "Entire house in Ikoyi",
    title: "Executive Mansion in the Heart of Ikoyi",
    rating: 4.7,
    reviewCount: 203,
    location: "Ikoyi, Lagos",
    price: 95000,
    currency: "NGN",
    image: "/images/hotel-image-three.jpg",
  },
  {
    id: 4,
    category: "Entire apartment in Ikeja",
    title: "Business District Apartment Near Airport",
    rating: 4.6,
    reviewCount: 127,
    location: "Ikeja GRA, Lagos",
    price: 65000,
    currency: "NGN",
    image: "/images/hotel-image-four.jpg",
  },
  {
    id: 5,
    category: "Entire penthouse in VI",
    title: "Penthouse Suite with Ocean Views",
    rating: 4.9,
    reviewCount: 78,
    location: "Victoria Island, Lagos",
    price: 150000,
    currency: "NGN",
    image: "/images/detail-image-one.jpg",
    badge: "Luxury",
  },
  {
    id: 6,
    category: "Entire villa in Banana Island",
    title: "Ultra-Luxury Villa with Private Beach Access",
    rating: 5.0,
    reviewCount: 34,
    location: "Banana Island, Lagos",
    price: 350000,
    currency: "NGN",
    image: "/images/detail-image-two.jpg",
    badge: "Premium",
  },
  {
    id: 7,
    category: "Entire apartment in Surulere",
    title: "Cozy Apartment in Cultural District",
    rating: 4.5,
    reviewCount: 167,
    location: "Surulere, Lagos",
    price: 45000,
    currency: "NGN",
    image: "/images/hotel-image-one.jpg",
  },
  {
    id: 8,
    category: "Entire house in Ajah",
    title: "Family Home with Garden and Security",
    rating: 4.4,
    reviewCount: 92,
    location: "Ajah, Lagos",
    price: 75000,
    currency: "NGN",
    image: "/images/hotel-image-two.jpg",
  },
];

export const TravelTourismListingSection = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("Most Recent");
  const itemsPerPage = 4;
  const sectionRef = useRef<HTMLElement>(null);

  const totalPages = Math.ceil(travelData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = travelData.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the section start instead of top
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop;
      const offset = 100; // Add some offset from the top
      window.scrollTo({
        top: sectionTop - offset,
        behavior: "smooth",
      });
    }
  };

  return (
    <section ref={sectionRef} className="py-16 lg:py-24 bg-white dark:bg-dark">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end gap-6">
              {/* Search and Filters */}
              <div className="flex-1">
                <div className="bg-gradient-to-r from-blue-50 via-cyan-50 to-teal-50 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-2xl p-8 shadow-lg border border-blue-100 dark:border-neutral-700">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="Search destinations..."
                          className="w-full px-6 py-4 rounded-xl border-2 border-blue-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
                        />
                        <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <svg
                            className="w-5 h-5 text-neutral-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <select className="px-6 py-4 rounded-xl border-2 border-blue-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all min-w-[140px]">
                        <option>Select Category</option>
                        <option>Apartment</option>
                        <option>Villa</option>
                        <option>House</option>
                        <option>Penthouse</option>
                      </select>
                      <select className="px-6 py-4 rounded-xl border-2 border-blue-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all min-w-[140px]">
                        <option>Price range</option>
                        <option>₦30,000 - ₦60,000</option>
                        <option>₦60,000 - ₦100,000</option>
                        <option>₦100,000 - ₦200,000</option>
                        <option>₦200,000+</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-neutral-700 dark:text-neutral-300 font-medium">
                      Displaying{" "}
                      <span className="text-blue-500 font-bold">100</span>{" "}
                      results
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Sort by:
                      </span>
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="text-sm bg-transparent text-neutral-900 dark:text-white border-none focus:outline-none"
                      >
                        <option value="Most Recent">Most Recent</option>
                        <option value="Price: Low to High">
                          Price: Low to High
                        </option>
                        <option value="Price: High to Low">
                          Price: High to Low
                        </option>
                        <option value="Rating">Rating</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Travel Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-6 lg:space-y-8 mb-12"
          >
            {currentItems.map((travel, index) => (
              <motion.div
                key={travel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="h-full"
              >
                <TravelCard travel={travel} index={index} />
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

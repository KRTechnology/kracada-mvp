"use client";

import { HotelsRestaurantsSubTabType } from "@/components/specific/dashboard/SubTabSwitcher";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { HotelCard } from "./HotelCard";
import { RestaurantCard } from "./RestaurantCard";
import { Pagination } from "@/components/common/Pagination";
import { Hotel, Restaurant } from "@/lib/db/schema";

interface HotelsRestaurantsListingSectionProps {
  activeTab?: HotelsRestaurantsSubTabType;
  initialHotels?: Hotel[];
  initialRestaurants?: Restaurant[];
}

export const HotelsRestaurantsListingSection = ({
  activeTab = "Hotels",
  initialHotels = [],
  initialRestaurants = [],
}: HotelsRestaurantsListingSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const sectionRef = useRef<HTMLElement>(null);

  // Get data based on active tab
  const getData = () => {
    switch (activeTab) {
      case "Restaurants":
        return initialRestaurants;
      case "Hotels":
      default:
        return initialHotels;
    }
  };

  const data = getData();
  const totalPages = Math.ceil(data.length / itemsPerPage);

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

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  return (
    <section ref={sectionRef} className="bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-warm-50 via-orange-50 to-peach-50 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-2xl p-8 shadow-lg border border-warm-100 dark:border-neutral-700">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab?.toLowerCase()}...`}
                    className="w-full px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all"
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
                <select className="px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all min-w-[140px]">
                  <option>Location</option>
                  <option>Victoria Island</option>
                  <option>Ikoyi</option>
                  <option>Lekki</option>
                  <option>Ikeja</option>
                </select>
                <select className="px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all min-w-[120px]">
                  <option>Rating</option>
                  <option>4+ Stars</option>
                  <option>3+ Stars</option>
                  <option>2+ Stars</option>
                </select>
                <select className="px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all min-w-[140px]">
                  <option>Price range</option>
                  <option>$ - Budget</option>
                  <option>$$ - Moderate</option>
                  <option>$$$ - Expensive</option>
                  <option>$$$$ - Luxury</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-neutral-700 dark:text-neutral-300 font-medium">
                Displaying{" "}
                <span className="text-warm-200 font-bold">{data.length}</span>{" "}
                results
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              {activeTab === "Restaurants" ? (
                <RestaurantCard restaurant={item as Restaurant} index={index} />
              ) : (
                <HotelCard hotel={item as Hotel} index={index} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};

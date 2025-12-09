"use client";

import { Search, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { Input } from "@/components/common/input";
import { Button } from "@/components/common/button";
import { useState } from "react";
interface NewsListingHeaderProps {
  totalResults?: number;
}

export const TvListingHeader = ({
  totalResults = 0,
}: NewsListingHeaderProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Recent");

  const categories = [
    "All Categories",
    "Technology",
    "Business",
    "Politics",
    "Sports",
    "Entertainment",
    "Health",
    "Science",
    "Education",
  ];

  const sortOptions = [
    "Most Recent",
    "Oldest First",
    "Most Popular",
    "Alphabetical",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-dark border-b border-neutral-200 dark:border-neutral-800"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Q Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-warm-200 dark:focus:ring-warm-200"
            />
          </div>

          {/* Categories Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              className="h-10 px-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            >
              <span className="mr-2">Categories</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>

          {/* Results Count */}
          <div className="text-sm text-neutral-600 dark:text-neutral-400">
            Displaying {totalResults}{" "}
            {totalResults === 1 ? "result" : "results"}
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <Button
              variant="outline"
              className="h-10 px-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
            >
              <span className="mr-2">Sort: Most Recent</span>
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

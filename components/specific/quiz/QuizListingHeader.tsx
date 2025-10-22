"use client";

import { Search, ChevronDown, X } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Input } from "@/components/common/input";
import { Button } from "@/components/common/button";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";

interface QuizListingHeaderProps {
  totalResults?: number;
  categories?: string[];
  initialCategory?: string;
  initialDifficulty?: string;
  initialSearch?: string;
  initialSortBy?: string;
}

export const QuizListingHeader = ({
  totalResults = 0,
  categories = [],
  initialCategory,
  initialDifficulty,
  initialSearch,
  initialSortBy,
}: QuizListingHeaderProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(initialSearch || "");
  const [selectedCategory, setSelectedCategory] = useState(
    initialCategory || "All Categories"
  );
  const [selectedDifficulty, setSelectedDifficulty] = useState(
    initialDifficulty || "All Levels"
  );
  const [sortBy, setSortBy] = useState(initialSortBy || "recent");

  const allCategories = ["All Categories", ...categories];
  const difficulties = ["All Levels", "Beginner", "Intermediate", "Advanced"];

  const sortOptions = [
    { value: "recent", label: "Most Recent" },
    { value: "oldest", label: "Oldest First" },
    { value: "popular", label: "Most Popular" },
    { value: "difficulty", label: "By Difficulty" },
    { value: "alphabetical", label: "Alphabetical" },
  ];

  // Update URL with filters
  const updateFilters = (updates: {
    category?: string;
    difficulty?: string;
    search?: string;
    sortBy?: string;
    page?: string;
  }) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or remove parameters
    Object.entries(updates).forEach(([key, value]) => {
      if (value && value !== "All Categories" && value !== "All Levels") {
        params.set(key, value);
      } else if (key !== "page") {
        params.delete(key);
      }
    });

    // Reset to page 1 when filters change (except when explicitly setting page)
    if (!updates.page) {
      params.delete("page");
    }

    router.push(`/quiz?${params.toString()}`);
  };

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== (initialSearch || "")) {
        updateFilters({ search: searchQuery });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, initialSearch]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    updateFilters({ category });
  };

  const handleDifficultySelect = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    updateFilters({ difficulty });
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
    updateFilters({ sortBy: value });
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedDifficulty("All Levels");
    setSortBy("recent");
    router.push("/quiz");
  };

  const hasActiveFilters =
    selectedCategory !== "All Categories" ||
    selectedDifficulty !== "All Levels" ||
    searchQuery !== "" ||
    sortBy !== "recent";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white dark:bg-dark border-b border-neutral-200 dark:border-neutral-800"
    >
      <div className="container mx-auto px-4 py-6">
        <div className="space-y-4">
          {/* Top Row - Search and Results */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search quizzes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-warm-200 dark:focus:ring-warm-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Results Count */}
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Displaying {totalResults}{" "}
              {totalResults === 1 ? "quiz" : "quizzes"}
            </div>
          </div>

          {/* Bottom Row - Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 px-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <span className="mr-2">
                    {selectedCategory === "All Categories"
                      ? "Category"
                      : selectedCategory}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {allCategories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className={
                      selectedCategory === category
                        ? "bg-warm-50 dark:bg-warm-900/20 text-warm-700 dark:text-warm-300"
                        : ""
                    }
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Difficulty Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 px-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <span className="mr-2">
                    {selectedDifficulty === "All Levels"
                      ? "Difficulty"
                      : selectedDifficulty}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {difficulties.map((difficulty) => (
                  <DropdownMenuItem
                    key={difficulty}
                    onClick={() => handleDifficultySelect(difficulty)}
                    className={
                      selectedDifficulty === difficulty
                        ? "bg-warm-50 dark:bg-warm-900/20 text-warm-700 dark:text-warm-300"
                        : ""
                    }
                  >
                    {difficulty}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Sort Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="h-10 px-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
                >
                  <span className="mr-2">
                    Sort:{" "}
                    {sortOptions.find((opt) => opt.value === sortBy)?.label ||
                      "Most Recent"}
                  </span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {sortOptions.map((option) => (
                  <DropdownMenuItem
                    key={option.value}
                    onClick={() => handleSortChange(option.value)}
                    className={
                      sortBy === option.value
                        ? "bg-warm-50 dark:bg-warm-900/20 text-warm-700 dark:text-warm-300"
                        : ""
                    }
                  >
                    {option.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                onClick={clearFilters}
                className="h-10 px-4 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <X className="w-4 h-4 mr-2" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

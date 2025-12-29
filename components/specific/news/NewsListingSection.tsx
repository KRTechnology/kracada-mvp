"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { NewsArticleCard } from "./NewsArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/common/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";

interface NewsPost {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  featuredImage: string | null;
  categories: string[];
  publishedAt: Date | null;
  createdAt: Date;
  author: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
}

interface NewsListingSectionProps {
  initialPosts?: NewsPost[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  apiPost: any;
}

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "alphabetical", label: "Alphabetical (A–Z)" },
];

const ITEMS_PER_PAGE = 6;

// Memoized card component to prevent unnecessary re-renders
const MemoizedNewsCard = memo(NewsArticleCard);

export const NewsListingSection = ({
  initialPosts,
  initialPagination,
  apiPost,
}: NewsListingSectionProps) => {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);

  // Update state when props change
  useEffect(() => {
    setPosts(initialPosts);
    setPagination(initialPagination);
  }, [initialPosts, initialPagination]);

  // Extract unique categories - only recalculate when apiPost changes
  const categories = useMemo(() => {
    if (!apiPost?.articles) return ["all"];

    const categorySet = new Set<string>();
    apiPost.articles.forEach((article: any) => {
      if (article.category && Array.isArray(article.category)) {
        article.category.forEach((cat: string) => {
          if (cat && cat.trim()) {
            categorySet.add(cat.toLowerCase());
          }
        });
      }
    });

    return ["all", ...Array.from(categorySet).sort()];
  }, [apiPost?.articles]);

  // Pre-process articles once for better performance
  const processedArticles = useMemo(() => {
    if (!apiPost?.articles) return [];

    return apiPost.articles.map((article: any) => ({
      ...article,
      searchText:
        `${article.title || ""} ${article.description || ""}`.toLowerCase(),
      normalizedCategories: (article.category || []).map((cat: string) =>
        cat.toLowerCase()
      ),
      pubDateTime: article.pubDate ? new Date(article.pubDate).getTime() : 0,
    }));
  }, [apiPost?.articles]);

  // Filter and sort articles with optimized logic
  const filteredAndSortedPosts = useMemo(() => {
    if (processedArticles.length === 0) return [];

    let filtered = processedArticles;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((article: any) =>
        article.searchText.includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article: any) =>
        article.normalizedCategories.includes(selectedCategory)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return b.pubDateTime - a.pubDateTime;
        case "oldest":
          return a.pubDateTime - b.pubDateTime;
        case "alphabetical":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [processedArticles, searchQuery, selectedCategory, sortBy]);

  // Paginate filtered results
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);

  // Transform articles for display - memoized to prevent recalculation
  const newsArticleCardData = useMemo(() => {
    return paginatedPosts.map((article: any) => ({
      id: article.article_id,
      author: article.creator?.length ? article.creator.join(", ") : "Unknown",
      date: article.pubDate
        ? new Date(article.pubDate).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "",
      title: article.title,
      description: article.description || article.title,
      image: article.image_url || "/images/news-sample-image.jpg",
      categories: article.category || [],
      link: article.link,
      source: article.source_name || "",
    }));
  }, [paginatedPosts]);

  // Reset to page 1 when filters change - with debouncing effect
  useEffect(() => {
    setIsProcessing(true);
    setCurrentPage(1);

    // Simulate processing time for visual feedback
    const timer = setTimeout(() => {
      setIsProcessing(false);
    }, 100);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, sortBy]);

  // Optimized page change handler
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Debounced search handler
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  return (
    <>
      {/* Filters Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-dark border-t border-b border-neutral-200 dark:border-neutral-800"
      >
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-warm-200 dark:focus:ring-warm-200"
              />
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-full sm:w-[200px]">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                  <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                    <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                      Category:
                    </span>
                    <SelectValue placeholder="All" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.slice(1).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading...
                </span>
              ) : (
                <>
                  Displaying {paginatedPosts.length} of{" "}
                  {filteredAndSortedPosts.length}{" "}
                  {filteredAndSortedPosts.length === 1 ? "result" : "results"}
                </>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-[220px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700">
                  <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                    <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                      Sort by:
                    </span>
                    <SelectValue placeholder="Most Recent" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content Section */}
      <section className="bg-white dark:bg-dark">
        <div className="container mx-auto px-4 py-8">
          {/* Section Title */}
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-neutral-900 dark:text-white mb-8"
          >
            All News Posts
          </motion.h2>

          {/* News Articles Grid or Empty State */}
          {isProcessing ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            </div>
          ) : newsArticleCardData.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                {searchQuery || selectedCategory !== "all"
                  ? "No articles match your filters. Try adjusting your search."
                  : "No news posts available yet. Check back soon!"}
              </p>
            </div>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
              >
                {newsArticleCardData.map((article: any, index: number) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-full"
                  >
                    <MemoizedNewsCard article={article} index={index} />
                  </motion.div>
                ))}
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
};

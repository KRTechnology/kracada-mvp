"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { NewsArticleCard } from "./NewsArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import { Search, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Input } from "@/components/common/input";

import { getNewsApi } from "@/app/(dashboard)/actions/news-actions";

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

const ITEMS_PER_PAGE = 10;

// Memoized card component to prevent unnecessary re-renders
const MemoizedNewsCard = memo(NewsArticleCard);

export const NewsListingSection = ({
  initialPosts,
  initialPagination,
  apiPost,
}: NewsListingSectionProps) => {
  const router = useRouter();
  const [posts, setPosts] = useState<NewsPost[]>([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [isProcessing, setIsProcessing] = useState(true);

  const [nextToken, setNextToken] = useState<string | null>(null);
  const [maxPages, setMaxPages] = useState<number | null>(null);

  const fetchPosts = async (pageToken?: string) => {
    try {
      setIsProcessing(true);
      const apiPosts = await getNewsApi(pageToken);
      setIsProcessing(false);

      if (!apiPosts) return;

      if (apiPosts.raw.nextPage) {
        setNextToken(apiPosts.raw.nextPage);
      }

      if (apiPosts.raw.totalResults) {
        setMaxPages(Math.ceil(apiPosts.raw.totalResults / ITEMS_PER_PAGE));
      }

      setPosts(
        (prevPosts: NewsPost[]) =>
          pageToken
            ? [...prevPosts, ...apiPosts.articles] // Append when loading more
            : apiPosts.articles, // Replace on initial load
      );
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []); // Run only once on mount

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleNext = () => {
    if (nextToken) {
      if (maxPages && currentPage >= maxPages) {
        return;
      }
      fetchPosts(nextToken);
      setCurrentPage((prevPage) => prevPage + 1);
      console.log("posts", posts);
    }
  };
  // Update state when props change

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
    if (!posts) return [];

    return apiPost.articles.map((article: any) => ({
      ...article,
      searchText:
        `${article.title || ""} ${article.description || ""}`.toLowerCase(),
      normalizedCategories: (article.category || []).map((cat: string) =>
        cat.toLowerCase(),
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
        article.searchText.includes(query),
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article: any) =>
        article.normalizedCategories.includes(selectedCategory),
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

  const newsData = posts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const newsArticleCardData = useMemo(() => {
    const uniqueMap = new Map<string, any>();

    newsData.forEach((article: any) => {
      if (!article.title) return;

      // Normalize the title and use the first 5 words as the similarity key
      const similarityKey = article.title
        .toLowerCase()
        .replace(/[^\w\s]/g, "") // Remove punctuation
        .trim()
        .split(/\s+/)
        .slice(0, 5)
        .join(" ");

      const existing = uniqueMap.get(similarityKey);

      // Keep the most recent article
      if (
        !existing ||
        new Date(article.pubDate).getTime() >
          new Date(existing.pubDate).getTime()
      ) {
        uniqueMap.set(similarityKey, article);
      }
    });

    return Array.from(uniqueMap.values()).map((article: any) => ({
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
  }, [newsData]);
  // Transform articles for display - memoized to prevent recalculation

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
    [],
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
                  Displaying {newsArticleCardData.length} of {posts.length}{" "}
                  {posts.length === 1 ? "result" : "results"}
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
          ) : maxPages && currentPage >= maxPages ? (
            <div className="text-center py-12">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                {searchQuery || selectedCategory !== "all" ? (
                  "No articles match your filters. Try adjusting your search."
                ) : (
                  <>
                    <p>No news posts available yet. Check back soon!</p>
                  </>
                )}
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
                {isProcessing ? (
                  <div className="col-span-full flex justify-center items-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  newsArticleCardData.map((article: any, index: number) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                      className="h-full"
                    >
                      <MemoizedNewsCard article={article} index={index} />
                    </motion.div>
                  ))
                )}
              </motion.div>

              {/* Pagination */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex items-center justify-center space-x-2 mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePrevious()}
                  disabled={currentPage === 1}
                  className="flex items-center px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-warm-200 dark:hover:text-warm-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </motion.button>

                <div className="flex items-center space-x-1">
                  {Array.from({ length: currentPage }, (_, index) => {
                    const page = index + 1;

                    return (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          if (page !== currentPage) {
                            handlePageChange(page);
                          }
                        }}
                        className={`px-3 py-2 text-sm font-medium rounded-full transition-colors ${
                          page === currentPage
                            ? "bg-gradient-to-r from-warm-200 to-peach-200 text-white shadow-lg"
                            : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        }`}
                      >
                        {page}
                      </motion.button>
                    );
                  })}
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNext()}
                  disabled={
                    !nextToken ||
                    (maxPages !== null && currentPage >= maxPages - 1)
                  }
                  className="flex items-center px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-warm-200 dark:hover:text-warm-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </motion.button>
              </motion.div>

              {/* {totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              )} */}
            </>
          )}
        </div>
      </section>
    </>
  );
};

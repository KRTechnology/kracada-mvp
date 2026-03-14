"use client";

import { TabType } from "@/components/specific/dashboard/TabSwitcher";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { LifestyleArticleCard } from "./LifestyleArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { LifestyleVideoCard } from "./LifestyleVideoCard";
import { getLifestylePostsAction } from "@/app/actions/lifestyle-actions";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/common/input";
import { Button } from "@/components/common/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";

// Types for content items
interface LifestyleArticle {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  isVideo?: false;
}

interface LifestyleVideo {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  isVideo: true;
}

type LifestyleContent = LifestyleArticle | LifestyleVideo;

interface LifestyleListingSectionProps {
  activeTab?: TabType;
  initialPosts?: any[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const sortOptions = [
  { value: "recent", label: "Most Recent" },
  { value: "oldest", label: "Oldest" },
  { value: "popular", label: "Most Popular" },
  { value: "alphabetical", label: "Alphabetical (A–Z)" },
];
export const LifestyleListingSection = ({
  activeTab = "All posts",
  initialPosts = [],
  initialPagination = { page: 1, limit: 6, total: 0, totalPages: 0 },
}: LifestyleListingSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Recent");
  const { data: session } = useSession();
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 6;

  // Check if user is a Contributor
  const isContributor =
    session?.user && (session.user as any).accountType === "Contributor";
  // Fetch posts when page changes
  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await getLifestylePostsAction({
        page,
        limit: 6,
        status: "published",
      });

      if (result.success && result.data) {
        setPosts(result.data.posts);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const handlePageChange = (page: number) => {
  //   // Update URL with page parameter
  //   const params = new URLSearchParams(window.location.search);
  //   params.set("page", page.toString());
  //   router.push(`${pathname}?${params.toString()}`);

  //   // Fetch new posts
  //   fetchPosts(page);

  //   // Scroll to top
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.description?.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((post) =>
        post.categories.includes(selectedCategory)
      );
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.publishedAt).getTime() -
            new Date(a.publishedAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.publishedAt).getTime() -
            new Date(b.publishedAt).getTime()
          );
        case "popular":
          return b.viewCount - a.viewCount;
        case "alphabetical":
          return a.title.localeCompare(b.title);
        default:
          return 0;
      }
    });

    return sorted;
  }, [posts, searchQuery, selectedCategory, sortBy]);

  const categories = useMemo(() => {
    const allCategories = new Set<string>();
    posts.forEach((post) => {
      post.categories?.forEach((cat: any) => allCategories.add(cat));
    });
    return ["All Categories", ...Array.from(allCategories).sort()];
  }, [posts]);
  console.log(categories);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);
  // Transform database posts to match the expected format

  const transformedPosts = paginatedPosts.map((post: any) => ({
    id: post.id,
    author: post.author
      ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
        "Anonymous"
      : "Anonymous",
    date: new Date(post.publishedAt || post.createdAt).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ),
    title: post.title,
    description: post.description || post.content.substring(0, 150) + "...",
    image: post.featuredImage || "/images/news-sample-image.jpg",
    categories: post.categories || [],
    isVideo: false,
  }));

  // const lifestyleTabs = [
  //   { id: "All posts" as TabType, label: "All posts" },
  //   { id: "Videos" as TabType, label: "Videos" },
  // ];

  return (
    <>
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-warm-200 dark:focus:ring-warm-200"
              />
            </div>

            {/* Categories Dropdown */}
            <div className="relative w-[200px]">
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                <SelectTrigger className="h-10 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center justify-between gap-2 px-3">
                  <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                    <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
                      Category:
                    </span>
                    <SelectValue placeholder="All" />
                  </div>
                </SelectTrigger>

                <SelectContent>
                  {/* <SelectItem value="all">All Categories</SelectItem> */}
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Results Count */}
            <div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
              Displaying {paginatedPosts.length} of{" "}
              {filteredAndSortedPosts.length}{" "}
              {filteredAndSortedPosts.length === 1 ? "result" : "results"}
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-[220px]">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="h-10 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center justify-between gap-2 px-3">
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
      <div className="bg-white dark:bg-dark">
        <div className="container mx-auto px-4 py-8">
          {/* Header with Title and Create Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
          >
            <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
              All Lifestyle Posts
            </h2>

            {isContributor && (
              <Button
                onClick={() => {
                  router.push("/lifestyle/create");
                }}
                className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Create a lifestyle post
              </Button>
            )}
          </motion.div>

          {/* Tab Switcher */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8"
          >
            {/* <TabSwitcher
            activeTab={getActiveTab()}
            onTabChange={handleTabChange}
            customTabs={lifestyleTabs}
            removeMargin={true}
          /> */}
          </motion.div>
        </div>
      </div>
      <section className="bg-white dark:bg-dark">
        <div className="container mx-auto px-4 py-8">
          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
            </div>
          ) : transformedPosts.length === 0 ? (
            /* Empty State */
            <div className="text-center py-20">
              <p className="text-neutral-600 dark:text-neutral-400 text-lg">
                No posts found. Check back later for new content!
              </p>
            </div>
          ) : (
            <>
              {/* Lifestyle Content Grid */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
              >
                {transformedPosts.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="h-full"
                  >
                    {activeTab === "Videos" || item.isVideo ? (
                      <LifestyleVideoCard video={item} index={index} />
                    ) : (
                      <LifestyleArticleCard article={item} index={index} />
                    )}
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

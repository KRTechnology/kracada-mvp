// "use client";

// import { motion } from "framer-motion";
// import { useState, useEffect, useMemo } from "react";
// import { NewsArticleCard } from "./NewsArticleCard";
// import { Pagination } from "@/components/common/Pagination";
// import { useRouter } from "next/navigation";
// import { Search, ChevronDown } from "lucide-react";
// import { Input } from "@/components/common/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/common/select";

// interface NewsPost {
//   id: string;
//   title: string;
//   slug: string;
//   description: string | null;
//   featuredImage: string | null;
//   categories: string[];
//   publishedAt: Date | null;
//   createdAt: Date;
//   author: {
//     id: string;
//     firstName: string;
//     lastName: string;
//   } | null;
// }

// interface NewsListingSectionProps {
//   initialPosts: NewsPost[];
//   initialPagination: {
//     page: number;
//     limit: number;
//     total: number;
//     totalPages: number;
//   };
//   apiPost: any;
// }

// const sortOptions = [
//   { value: "recent", label: "Most Recent" },
//   { value: "oldest", label: "Oldest" },
//   { value: "popular", label: "Most Popular" },
//   { value: "alphabetical", label: "Alphabetical (A–Z)" },
// ];
// export const NewsListingSection = ({
//   initialPosts,
//   initialPagination,
//   apiPost,
// }: NewsListingSectionProps) => {
//   const router = useRouter();
//   const [posts, setPosts] = useState(initialPosts);
//   const [pagination, setPagination] = useState(initialPagination);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [selectedCategory, setSelectedCategory] = useState("All Categories");
//   const [sortBy, setSortBy] = useState("Most Recent");
//   const [currentPage, setCurrentPage] = useState(1);

//   const ITEMS_PER_PAGE = 6;

//   // Update state when props change
//   useEffect(() => {
//     setPosts(initialPosts);
//     setPagination(initialPagination);
//   }, [initialPosts, initialPagination]);

//   const handlePageChange = (page: number) => {
//     // make a new api call to get page 2
//     router.push(`/news?page=${page}`);
//   };
//   console.log(apiPost);
//   const filteredAndSortedPosts = useMemo(() => {
//     let filtered = apiPost.articles;

//     // Apply search filter
//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       filtered = filtered.filter(
//         (post: any) =>
//           post.title.toLowerCase().includes(query) ||
//           post.description?.toLowerCase().includes(query) ||
//           post.content.toLowerCase().includes(query)
//       );
//     }

//     // Apply category filter
//     if (selectedCategory !== "All Categories") {
//       filtered = filtered.filter((post: any) =>
//         post.categories.includes(selectedCategory)
//       );
//     }

//     // Apply sorting
//     const sorted = [...filtered].sort((a, b) => {
//       switch (sortBy) {
//         case "recent":
//           return (
//             new Date(b.publishedAt).getTime() -
//             new Date(a.publishedAt).getTime()
//           );
//         case "oldest":
//           return (
//             new Date(a.publishedAt).getTime() -
//             new Date(b.publishedAt).getTime()
//           );
//         case "popular":
//           return b.viewCount - a.viewCount;
//         case "alphabetical":
//           return a.title.localeCompare(b.title);
//         default:
//           return 0;
//       }
//     });

//     return sorted;
//   }, [posts, searchQuery, selectedCategory, sortBy]);
//   const paginatedPosts = useMemo(() => {
//     const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
//     const endIndex = startIndex + ITEMS_PER_PAGE;
//     return filteredAndSortedPosts.slice(startIndex, endIndex);
//   }, [filteredAndSortedPosts, currentPage]);
//   const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);
//   const categories = useMemo(() => {
//     const allCategories = new Set<string>();
//     posts.forEach((post) => {
//       apiPost.categories?.forEach((cat: any) => allCategories.add(cat));
//     });
//     return ["All Categories", ...Array.from(allCategories).sort()];
//   }, [posts]);
//   console.log(categories);
//   const newArticleCardData = paginatedPosts.map((post: any) => ({
//     id: post.article_id,
//     author: post.creator?.length ? post.creator.join(", ") : "Unknown",
//     date: post.pubDate
//       ? new Date(post.pubDate).toLocaleDateString("en-US", {
//           day: "numeric",
//           month: "short",
//           year: "numeric",
//         })
//       : "",
//     title: post.title,
//     description: post.description || post.title,
//     image: post.image_url || "/images/news-sample-image.jpg",
//     categories: post.category || [],
//     link: post.link,
//     source: post.source_name || "",
//   }));

//   return (
//     <>
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.6 }}
//         className="bg-white dark:bg-dark border-t border-b border-neutral-200 dark:border-neutral-800"
//       >
//         <div className="container mx-auto px-4 py-6">
//           <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
//             {/* Search Bar */}
//             <div className="relative flex-1 max-w-md">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
//               <Input
//                 type="text"
//                 placeholder="Search..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-warm-200 dark:focus:ring-warm-200"
//               />
//             </div>

//             {/* Categories Dropdown */}
//             <div className="relative w-[200px]">
//               <Select
//                 value={selectedCategory}
//                 onValueChange={setSelectedCategory}
//               >
//                 <SelectTrigger className="h-10 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center justify-between gap-2 px-3">
//                   <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
//                     <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
//                       Category:
//                     </span>
//                     <SelectValue placeholder="All" />
//                   </div>
//                 </SelectTrigger>

//                 <SelectContent>
//                   {/* <SelectItem value="all">All Categories</SelectItem> */}
//                   {categories.map((category) => (
//                     <SelectItem key={category} value={category}>
//                       {category}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             {/* Results Count */}
//             <div className="text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
//               Displaying {paginatedPosts.length} of{" "}
//               {filteredAndSortedPosts.length}{" "}
//               {filteredAndSortedPosts.length === 1 ? "result" : "results"}
//             </div>

//             {/* Sort Dropdown */}
//             <div className="relative w-[220px]">
//               <Select value={sortBy} onValueChange={setSortBy}>
//                 <SelectTrigger className="h-10 w-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700 flex items-center justify-between gap-2 px-3">
//                   <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
//                     <span className="text-neutral-500 dark:text-neutral-400 shrink-0">
//                       Sort by:
//                     </span>
//                     <SelectValue placeholder="Most Recent" />
//                   </div>
//                 </SelectTrigger>

//                 <SelectContent>
//                   {sortOptions.map((option) => (
//                     <SelectItem key={option.value} value={option.value}>
//                       {option.label}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
//         </div>
//       </motion.div>
//       <div className="bg-white dark:bg-dark">
//         <div className="container mx-auto px-4 py-8">
//           {/* Header with Title and Create Button */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
//           >
//             <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
//               All Lifestyle Posts
//             </h2>
//           </motion.div>

//           {/* Tab Switcher */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6, delay: 0.1 }}
//             className="mb-8"
//           >
//             {/* <TabSwitcher
//               activeTab={getActiveTab()}
//               onTabChange={handleTabChange}
//               customTabs={lifestyleTabs}
//               removeMargin={true}
//             /> */}
//           </motion.div>
//         </div>
//       </div>
//       <section className="bg-white dark:bg-dark">
//         <div className="container mx-auto px-4 py-8">
//           {/* Section Title */}
//           <motion.h2
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ duration: 0.6 }}
//             className="text-3xl font-bold text-neutral-900 dark:text-white mb-8"
//           >
//             All News Posts
//           </motion.h2>

//           {/* News Articles Grid */}
//           {newArticleCardData.length === 0 ? (
//             <div className="text-center py-12">
//               <p className="text-neutral-600 dark:text-neutral-400 text-lg">
//                 No news posts available yet. Check back soon!
//               </p>
//             </div>
//           ) : (
//             <>
//               <motion.div
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 transition={{ duration: 0.6, delay: 0.2 }}
//                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
//               >
//                 {newArticleCardData.map((item: any, index: any) => (
//                   <motion.div
//                     key={item.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.6, delay: index * 0.1 }}
//                     className="h-full"
//                   >
//                     <NewsArticleCard article={item} index={index} />

//                     {/* <p>{item.image}</p> */}
//                   </motion.div>
//                 ))}
//               </motion.div>

//               {/* Pagination */}
//               {pagination.totalPages > 1 && (
//                 <Pagination
//                   currentPage={pagination.page}
//                   totalPages={pagination.totalPages}
//                   onPageChange={handlePageChange}
//                 />
//               )}
//             </>
//           )}
//         </div>
//       </section>
//     </>
//   );
// };
"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { NewsArticleCard } from "./NewsArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
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
  initialPosts: NewsPost[];
  initialPagination: {
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

  const ITEMS_PER_PAGE = 6;

  // Update state when props change
  useEffect(() => {
    setPosts(initialPosts);
    setPagination(initialPagination);
  }, [initialPosts, initialPagination]);

  // Extract unique categories from API data
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
  }, [apiPost]);

  // Filter and sort articles
  const filteredAndSortedPosts = useMemo(() => {
    if (!apiPost?.articles) return [];

    let filtered = [...apiPost.articles];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article: any) =>
          article.title?.toLowerCase().includes(query) ||
          article.description?.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((article: any) => {
        if (!article.category || !Array.isArray(article.category)) return false;
        return article.category.some(
          (cat: string) => cat.toLowerCase() === selectedCategory
        );
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return (
            new Date(b.pubDate || 0).getTime() -
            new Date(a.pubDate || 0).getTime()
          );
        case "oldest":
          return (
            new Date(a.pubDate || 0).getTime() -
            new Date(b.pubDate || 0).getTime()
          );
        case "alphabetical":
          return (a.title || "").localeCompare(b.title || "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [apiPost, searchQuery, selectedCategory, sortBy]);

  // Paginate filtered results
  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAndSortedPosts.slice(startIndex, endIndex);
  }, [filteredAndSortedPosts, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedPosts.length / ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  // Transform articles for display
  const newsArticleCardData = paginatedPosts.map((article: any) => ({
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
                onChange={(e) => setSearchQuery(e.target.value)}
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
              Displaying {paginatedPosts.length} of{" "}
              {filteredAndSortedPosts.length}{" "}
              {filteredAndSortedPosts.length === 1 ? "result" : "results"}
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
          {newsArticleCardData.length === 0 ? (
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
                    <NewsArticleCard article={article} index={index} />
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

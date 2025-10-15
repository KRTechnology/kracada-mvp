"use client";

import { motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Pagination } from "@/components/common/Pagination";
import { EntertainmentArticle } from "@/app/actions/entertainment-actions";

interface EntertainmentTrendingArticlesProps {
  initialArticles: EntertainmentArticle[];
}

// Sample fallback data if no real data is available
const fallbackArticlesData = [
  {
    id: 1,
    author: "Alec Whitten",
    date: "17 Jan 2025",
    title: "Bill Walsh leadership lessons",
    description:
      "Like to know the secrets of transforming a 2-14 team into a 3x Super Bowl winning Dynasty?",
    image: "/images/news-sample-image.jpg",
    categories: ["Leadership", "Sports"],
  },
  {
    id: 2,
    author: "Demi Wilkinson",
    date: "16 Jan 2025",
    title: "PM mental models",
    description:
      "Mental models are simple expressions of complex processes or relationships.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Business", "Entertainment"],
  },
  {
    id: 3,
    author: "Sarah Johnson",
    date: "15 Jan 2025",
    title: "The Future of Cinema",
    description:
      "Exploring how technology is reshaping the movie industry and audience experiences.",
    image: "/images/news-sample-image.jpg",
    categories: ["Movies", "Technology"],
  },
  {
    id: 4,
    author: "Michael Chen",
    date: "14 Jan 2025",
    title: "Music Streaming Revolution",
    description:
      "How streaming platforms are changing the way we discover and consume music.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Music", "Technology"],
  },
  {
    id: 5,
    author: "Emma Rodriguez",
    date: "13 Jan 2025",
    title: "Gaming Industry Trends",
    description:
      "Latest trends in gaming from virtual reality to mobile gaming innovations.",
    image: "/images/news-sample-image.jpg",
    categories: ["Gaming", "Technology"],
  },
  {
    id: 6,
    author: "James Wilson",
    date: "12 Jan 2025",
    title: "Celebrity Culture Impact",
    description:
      "Understanding the influence of celebrity culture on modern society and social media.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Celebrity", "Social Media"],
  },
  {
    id: 7,
    author: "Lisa Park",
    date: "11 Jan 2025",
    title: "Netflix Original Series Analysis",
    description:
      "Breaking down the success factors behind Netflix's most popular original content.",
    image: "/images/news-sample-image.jpg",
    categories: ["Movies", "Streaming"],
  },
  {
    id: 8,
    author: "David Kim",
    date: "10 Jan 2025",
    title: "Podcast Industry Growth",
    description:
      "How podcasts are becoming the new radio and what it means for content creators.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Podcasts", "Media"],
  },
  {
    id: 9,
    author: "Maria Garcia",
    date: "9 Jan 2025",
    title: "Social Media Influencers",
    description:
      "The rise of influencer culture and its impact on traditional entertainment media.",
    image: "/images/news-sample-image.jpg",
    categories: ["Social Media", "Influencers"],
  },
  {
    id: 10,
    author: "Alex Thompson",
    date: "8 Jan 2025",
    title: "Virtual Reality Entertainment",
    description:
      "Exploring how VR is revolutionizing gaming, movies, and live entertainment experiences.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Gaming", "Technology", "VR"],
  },
  {
    id: 11,
    author: "Rachel Brown",
    date: "7 Jan 2025",
    title: "Stand-up Comedy Evolution",
    description:
      "How stand-up comedy has adapted to digital platforms and streaming services.",
    image: "/images/news-sample-image.jpg",
    categories: ["Comedy", "Streaming"],
  },
  {
    id: 12,
    author: "Kevin Martinez",
    date: "6 Jan 2025",
    title: "Esports Championship Series",
    description:
      "The growing popularity of competitive gaming and its impact on traditional sports.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Gaming", "Sports", "Esports"],
  },
  {
    id: 13,
    author: "Sophie Anderson",
    date: "5 Jan 2025",
    title: "TikTok Entertainment Trends",
    description:
      "How TikTok is reshaping short-form content and creating new entertainment stars.",
    image: "/images/news-sample-image.jpg",
    categories: ["Social Media", "TikTok", "Viral"],
  },
  {
    id: 14,
    author: "Daniel White",
    date: "4 Jan 2025",
    title: "Live Streaming Platforms",
    description:
      "The rise of Twitch, YouTube Live, and other platforms changing entertainment consumption.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Streaming", "Live", "Technology"],
  },
  {
    id: 15,
    author: "Jessica Moore",
    date: "3 Jan 2025",
    title: "Broadway Digital Transformation",
    description:
      "How Broadway shows are adapting to digital platforms and virtual performances.",
    image: "/images/news-sample-image.jpg",
    categories: ["Theater", "Digital", "Performance"],
  },
  {
    id: 16,
    author: "Robert Taylor",
    date: "2 Jan 2025",
    title: "AI in Entertainment",
    description:
      "Artificial intelligence is changing how we create, consume, and interact with entertainment.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Technology", "AI", "Innovation"],
  },
  {
    id: 17,
    author: "Amanda Clark",
    date: "1 Jan 2025",
    title: "Reality TV Evolution",
    description:
      "From traditional reality shows to social media-based reality content and its impact.",
    image: "/images/news-sample-image.jpg",
    categories: ["Reality TV", "Social Media", "Television"],
  },
  {
    id: 18,
    author: "Marcus Johnson",
    date: "31 Dec 2024",
    title: "Music Festival Digital Experience",
    description:
      "How music festivals are incorporating virtual and augmented reality experiences.",
    image: "/images/news-sample-image.jpg",
    categories: ["Music", "Festivals", "Technology"],
  },
];

const categories = [
  "All Categories",
  "Movies",
  "Music",
  "Gaming",
  "Celebrity",
  "Sports",
  "Technology",
  "Business",
  "Streaming",
  "Social Media",
  "Podcasts",
  "Comedy",
  "Esports",
  "Theater",
  "AI",
  "Reality TV",
  "Festivals",
  "Influencers",
  "VR",
  "Viral",
  "Live",
  "Digital",
  "Performance",
  "Innovation",
  "Television",
  "Media",
];

const sortOptions = [
  { value: "date", label: "Date" },
  { value: "popularity", label: "Popularity" },
  { value: "relevance", label: "Relevance" },
];

interface ArticleCardProps {
  article: {
    id: string | number;
    slug?: string;
    author: string;
    date: string;
    title: string;
    description: string;
    image: string;
    categories: string[];
  };
  index: number;
}

const ArticleCard = ({ article, index }: ArticleCardProps) => {
  // Function to get category color based on index
  const getCategoryColor = (categoryIndex: number) => {
    const colors = [
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
      "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    ];
    return colors[categoryIndex % colors.length];
  };

  const articleLink = article.slug ? `/lifestyle/${article.id}` : "#";

  return (
    <Link href={articleLink} className="group cursor-pointer h-full block">
      <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 dark:border-neutral-700 h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={article.image}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Author and Date */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-orange-500">
              {article.author}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              • {article.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
            {article.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3 flex-1">
            {article.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {article.categories.slice(0, 2).map((category, categoryIndex) => (
              <span
                key={categoryIndex}
                className={`px-2 py-1 text-xs font-medium rounded-full ${getCategoryColor(
                  categoryIndex
                )}`}
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const EntertainmentTrendingArticles = ({
  initialArticles,
}: EntertainmentTrendingArticlesProps) => {
  const [articles, setArticles] = useState(initialArticles);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;
  const sectionRef = useRef<HTMLElement>(null);

  // Update articles when initialArticles changes
  useEffect(() => {
    setArticles(initialArticles);
  }, [initialArticles]);

  // Filter and sort articles based on current state
  const filteredArticles = articles.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      article.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentArticles = filteredArticles.slice(
    startIndex,
    startIndex + articlesPerPage
  );

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
    <section ref={sectionRef} className="py-8 lg:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Trending Articles
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Displaying {filteredArticles.length} results
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6">
              {/* Categories Dropdown */}
              <div className="min-w-48">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <SelectValue placeholder="Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                  Sort:
                </span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-12 w-32 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700">
                    <SelectValue />
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

        {/* Articles Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
        >
          {currentArticles.map((article, index) => (
            <motion.div
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <ArticleCard article={article} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredArticles.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-4">
              No articles found matching your criteria
            </p>
            <Button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Categories");
                setCurrentPage(1);
              }}
              variant="outline"
            >
              Clear Filters
            </Button>
          </motion.div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
};

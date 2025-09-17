"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Pagination } from "@/components/specific/dashboard/Pagination";

// Sample trending news data
const trendingNewsData = [
  {
    id: 1,
    author: "Sarah Mitchell",
    date: "17 Jan 2025",
    title: "Tech Giants Announce Major AI Breakthrough",
    description:
      "Leading technology companies unveil revolutionary artificial intelligence capabilities that could transform multiple industries.",
    image: "/images/news-sample-image.jpg",
    categories: ["Technology", "AI"],
  },
  {
    id: 2,
    author: "James Rodriguez",
    date: "16 Jan 2025",
    title: "Global Climate Summit Reaches Historic Agreement",
    description:
      "World leaders commit to ambitious new targets for carbon emission reduction and renewable energy adoption.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Environment", "Politics"],
  },
  {
    id: 3,
    author: "Emily Chen",
    date: "15 Jan 2025",
    title: "Space Mission Returns with Groundbreaking Discoveries",
    description:
      "Astronauts return from extended space mission with samples that could reveal new insights about our solar system.",
    image: "/images/news-sample-image.jpg",
    categories: ["Space", "Science"],
  },
  {
    id: 4,
    author: "Michael Thompson",
    date: "14 Jan 2025",
    title: "Economic Markets Show Strong Recovery Signs",
    description:
      "Financial analysts report positive indicators as global markets demonstrate resilience and growth potential.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Economy", "Finance"],
  },
  {
    id: 5,
    author: "Dr. Lisa Park",
    date: "13 Jan 2025",
    title: "Medical Breakthrough in Cancer Treatment",
    description:
      "Researchers announce successful trials of innovative cancer therapy with unprecedented success rates.",
    image: "/images/news-sample-image.jpg",
    categories: ["Health", "Medical"],
  },
  {
    id: 6,
    author: "David Wilson",
    date: "12 Jan 2025",
    title: "Renewable Energy Milestone Achieved",
    description:
      "Solar and wind power generation reaches record highs, surpassing fossil fuel production in several regions.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Energy", "Environment"],
  },
  {
    id: 7,
    author: "Anna Kowalski",
    date: "11 Jan 2025",
    title: "International Trade Agreement Signed",
    description:
      "Major economies finalize comprehensive trade deal aimed at boosting global commerce and cooperation.",
    image: "/images/news-sample-image.jpg",
    categories: ["Politics", "Economy"],
  },
  {
    id: 8,
    author: "Robert Garcia",
    date: "10 Jan 2025",
    title: "Educational Technology Revolution Underway",
    description:
      "Schools worldwide adopt innovative digital learning platforms, transforming traditional education methods.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Education", "Technology"],
  },
  {
    id: 9,
    author: "Maria Santos",
    date: "9 Jan 2025",
    title: "Cultural Heritage Sites Receive Protection Status",
    description:
      "UNESCO designates new world heritage sites, ensuring preservation of important cultural landmarks.",
    image: "/images/news-sample-image.jpg",
    categories: ["Culture", "Heritage"],
  },
  {
    id: 10,
    author: "Kevin Chang",
    date: "8 Jan 2025",
    title: "Sports Championship Breaking Records",
    description:
      "Athletic competitions see unprecedented viewership and participation, setting new standards for sporting events.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Sports", "Entertainment"],
  },
  {
    id: 11,
    author: "Jessica Adams",
    date: "7 Jan 2025",
    title: "Ocean Conservation Initiative Launched",
    description:
      "International coalition announces ambitious plan to protect marine ecosystems and combat ocean pollution.",
    image: "/images/news-sample-image.jpg",
    categories: ["Environment", "Conservation"],
  },
  {
    id: 12,
    author: "Alex Kumar",
    date: "6 Jan 2025",
    title: "Cybersecurity Measures Enhanced Globally",
    description:
      "Government agencies and private companies implement advanced security protocols to protect digital infrastructure.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Technology", "Security"],
  },
  {
    id: 13,
    author: "Rachel Green",
    date: "5 Jan 2025",
    title: "Innovative Transportation Solutions Unveiled",
    description:
      "Cities worldwide pilot new sustainable transportation systems aimed at reducing congestion and emissions.",
    image: "/images/news-sample-image.jpg",
    categories: ["Transportation", "Innovation"],
  },
  {
    id: 14,
    author: "Marcus Johnson",
    date: "4 Jan 2025",
    title: "Social Media Platform Policy Changes",
    description:
      "Major social media companies announce significant updates to privacy policies and content moderation systems.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Technology", "Social Media"],
  },
  {
    id: 15,
    author: "Sophie Taylor",
    date: "3 Jan 2025",
    title: "Mental Health Awareness Campaign Expands",
    description:
      "Healthcare organizations launch comprehensive mental health support programs to address growing wellness needs.",
    image: "/images/news-sample-image.jpg",
    categories: ["Health", "Mental Health"],
  },
  {
    id: 16,
    author: "Daniel Lee",
    date: "2 Jan 2025",
    title: "Artificial Intelligence Ethics Guidelines Released",
    description:
      "Technology leaders establish comprehensive ethical frameworks for responsible AI development and deployment.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Technology", "Ethics"],
  },
  {
    id: 17,
    author: "Amanda Foster",
    date: "1 Jan 2025",
    title: "Global Food Security Initiative Announced",
    description:
      "Agricultural organizations collaborate on innovative solutions to address worldwide food distribution challenges.",
    image: "/images/news-sample-image.jpg",
    categories: ["Agriculture", "Global"],
  },
  {
    id: 18,
    author: "Chris Anderson",
    date: "31 Dec 2024",
    title: "Year in Review: Top Scientific Discoveries",
    description:
      "Scientists reflect on breakthrough research and discoveries that shaped our understanding of the world in 2024.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Science", "Review"],
  },
];

const newsCategories = [
  "All Categories",
  "Technology",
  "Politics",
  "Environment",
  "Health",
  "Science",
  "Economy",
  "Sports",
  "Culture",
  "Education",
  "Transportation",
  "Security",
  "Innovation",
  "Social Media",
  "Mental Health",
  "Ethics",
  "Agriculture",
  "Conservation",
  "Finance",
  "Medical",
  "Energy",
  "Heritage",
  "Global",
  "Review",
];

const sortOptions = [
  { value: "date", label: "Date" },
  { value: "popularity", label: "Popularity" },
  { value: "relevance", label: "Relevance" },
];

interface NewsCardProps {
  article: {
    id: number;
    author: string;
    date: string;
    title: string;
    description: string;
    image: string;
    categories: string[];
  };
  index: number;
}

const NewsCard = ({ article, index }: NewsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group cursor-pointer"
    >
      <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 dark:border-neutral-700">
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
        <div className="p-6">
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
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3">
            {article.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {article.categories.slice(0, 2).map((category, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export const EntertainmentTrendingNews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("date");
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 6;

  // Filter and sort articles based on current state
  const filteredNews = trendingNewsData.filter((article) => {
    const matchesSearch = article.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      article.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredNews.length / articlesPerPage);
  const startIndex = (currentPage - 1) * articlesPerPage;
  const currentNews = filteredNews.slice(
    startIndex,
    startIndex + articlesPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <section className="py-8 lg:py-12 bg-white dark:bg-[#0D0D0D]">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Trending News
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Displaying {filteredNews.length} results
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
                    {newsCategories.map((category) => (
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

        {/* News Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {currentNews.map((article, index) => (
            <NewsCard key={article.id} article={article} index={index} />
          ))}
        </motion.div>

        {/* No Results */}
        {filteredNews.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-4">
              No news found matching your criteria
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

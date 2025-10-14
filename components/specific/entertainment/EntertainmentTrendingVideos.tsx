"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import { Search, Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { Pagination } from "@/components/common/Pagination";

// Sample trending videos data
const trendingVideosData = [
  {
    id: 1,
    author: "Demi Wilkinson",
    date: "16 Jan 2025",
    title: "PM mental models",
    description:
      "Mental models are simple expressions of complex processes or relationships.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "12:34",
    categories: ["Product Management", "Strategy"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 2,
    author: "Sarah Johnson",
    date: "15 Jan 2025",
    title: "Design System Best Practices",
    description:
      "Learn how to build scalable design systems that improve team collaboration and product consistency.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "18:45",
    categories: ["Design", "UX/UI"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 3,
    author: "Michael Chen",
    date: "14 Jan 2025",
    title: "JavaScript Performance Optimization",
    description:
      "Advanced techniques for optimizing JavaScript applications and improving user experience.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "25:12",
    categories: ["Programming", "Web Development"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 4,
    author: "Emma Rodriguez",
    date: "13 Jan 2025",
    title: "Building Remote Teams",
    description:
      "Strategies for creating effective remote work cultures and managing distributed teams successfully.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "14:28",
    categories: ["Leadership", "Remote Work"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 5,
    author: "David Kim",
    date: "12 Jan 2025",
    title: "Machine Learning Fundamentals",
    description:
      "Introduction to machine learning concepts, algorithms, and practical applications in modern software.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "32:15",
    categories: ["AI/ML", "Data Science"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 6,
    author: "Lisa Park",
    date: "11 Jan 2025",
    title: "Agile Project Management",
    description:
      "Complete guide to implementing agile methodologies in your development projects and teams.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "22:30",
    categories: ["Project Management", "Agile"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 7,
    author: "Alex Thompson",
    date: "10 Jan 2025",
    title: "Cloud Architecture Patterns",
    description:
      "Essential cloud architecture patterns for building scalable and resilient applications.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "28:45",
    categories: ["Cloud Computing", "Architecture"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 8,
    author: "Maria Garcia",
    date: "9 Jan 2025",
    title: "Content Marketing Strategies",
    description:
      "Proven content marketing techniques to grow your audience and increase engagement.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "16:20",
    categories: ["Marketing", "Content Strategy"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 9,
    author: "James Wilson",
    date: "8 Jan 2025",
    title: "Cybersecurity Essentials",
    description:
      "Critical cybersecurity practices every developer and business professional should know.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "21:10",
    categories: ["Security", "Best Practices"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 10,
    author: "Rachel Brown",
    date: "7 Jan 2025",
    title: "Data Visualization Techniques",
    description:
      "Create compelling data visualizations that tell stories and drive decision-making.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "19:35",
    categories: ["Data Science", "Visualization"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 11,
    author: "Kevin Martinez",
    date: "6 Jan 2025",
    title: "Mobile App Development Trends",
    description:
      "Latest trends in mobile development including cross-platform frameworks and native technologies.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "24:18",
    categories: ["Mobile Development", "Technology Trends"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 12,
    author: "Sophie Anderson",
    date: "5 Jan 2025",
    title: "Startup Funding Strategies",
    description:
      "Navigate the world of startup funding from seed rounds to Series A and beyond.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "30:42",
    categories: ["Startup", "Funding"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 13,
    author: "Daniel White",
    date: "4 Jan 2025",
    title: "E-commerce Growth Hacking",
    description:
      "Proven growth strategies for scaling e-commerce businesses and increasing conversions.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "27:55",
    categories: ["E-commerce", "Growth"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 14,
    author: "Amanda Clark",
    date: "3 Jan 2025",
    title: "Blockchain Development Tutorial",
    description:
      "Step-by-step guide to building your first blockchain application using modern frameworks.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "35:20",
    categories: ["Blockchain", "Programming"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 15,
    author: "Marcus Johnson",
    date: "2 Jan 2025",
    title: "Personal Productivity Systems",
    description:
      "Build effective productivity systems to manage your time, tasks, and professional goals.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "15:48",
    categories: ["Productivity", "Personal Development"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 16,
    author: "Elena Vasquez",
    date: "1 Jan 2025",
    title: "API Design Best Practices",
    description:
      "Design robust and scalable APIs that are easy to use, maintain, and integrate.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "23:15",
    categories: ["API Development", "Software Architecture"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 17,
    author: "Robert Taylor",
    date: "31 Dec 2024",
    title: "DevOps Culture Transformation",
    description:
      "Transform your organization's culture to embrace DevOps principles and continuous delivery.",
    thumbnail: "/images/landing-hero-image.jpg",
    duration: "26:40",
    categories: ["DevOps", "Culture"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
  {
    id: 18,
    author: "Jessica Moore",
    date: "30 Dec 2024",
    title: "User Research Methodologies",
    description:
      "Master different user research methods to better understand your users and improve product design.",
    thumbnail: "/images/news-sample-image.jpg",
    duration: "20:25",
    categories: ["User Research", "UX Design"],
    videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
  },
];

const videoCategories = [
  "All Categories",
  "Product Management",
  "Design",
  "UX/UI",
  "Programming",
  "Web Development",
  "Leadership",
  "Remote Work",
  "AI/ML",
  "Data Science",
  "Project Management",
  "Agile",
  "Cloud Computing",
  "Architecture",
  "Marketing",
  "Content Strategy",
  "Security",
  "Best Practices",
  "Visualization",
  "Mobile Development",
  "Technology Trends",
  "Startup",
  "Funding",
  "E-commerce",
  "Growth",
  "Blockchain",
  "Productivity",
  "Personal Development",
  "API Development",
  "Software Architecture",
  "DevOps",
  "Culture",
  "User Research",
  "UX Design",
];

const sortOptions = [
  { value: "date", label: "Date" },
  { value: "popularity", label: "Popularity" },
  { value: "relevance", label: "Relevance" },
  { value: "duration", label: "Duration" },
];

interface VideoCardProps {
  video: {
    id: number;
    author: string;
    date: string;
    title: string;
    description: string;
    thumbnail: string;
    duration: string;
    categories: string[];
    videoUrl: string;
  };
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  const handleVideoClick = () => {
    window.open(video.videoUrl, "_blank");
  };

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

  return (
    <div className="group cursor-pointer h-full" onClick={handleVideoClick}>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 dark:border-neutral-700 h-full flex flex-col">
        {/* Video Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center shadow-lg"
            >
              <Play
                className="w-6 h-6 text-neutral-800 ml-1"
                fill="currentColor"
              />
            </motion.div>
          </div>

          {/* Video Duration */}
          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 text-white text-xs font-medium rounded">
            {video.duration}
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <Play className="w-4 h-4 text-white" fill="currentColor" />
            </button>
            <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <svg
                className="w-4 h-4 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM15.657 6.343a1 1 0 011.414 0A9.972 9.972 0 0119 12a9.972 9.972 0 01-1.929 5.657 1 1 0 11-1.414-1.414A7.972 7.972 0 0017 12a7.972 7.972 0 00-1.343-4.243 1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
                <path
                  fillRule="evenodd"
                  d="M13.828 8.172a1 1 0 011.414 0A5.983 5.983 0 0117 12a5.983 5.983 0 01-1.758 3.828 1 1 0 11-1.414-1.414A3.983 3.983 0 0015 12a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
            <button className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
                />
              </svg>
            </button>
          </div>

          {/* External Link Icon */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <ExternalLink className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Video Info */}
        <div className="p-6 flex-1 flex flex-col">
          {/* Author and Date */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-medium text-orange-500">
              {video.author}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              • {video.date}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors line-clamp-2">
            {video.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-4 line-clamp-3 flex-1">
            {video.description}
          </p>

          {/* Categories */}
          <div className="flex flex-wrap gap-2 mt-auto">
            {video.categories.slice(0, 2).map((category, categoryIndex) => (
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
    </div>
  );
};

export const EntertainmentTrendingVideos = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("popularity");
  const [currentPage, setCurrentPage] = useState(1);
  const videosPerPage = 6;
  const sectionRef = useRef<HTMLElement>(null);

  // Filter and sort videos based on current state
  const filteredVideos = trendingVideosData.filter((video) => {
    const matchesSearch = video.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All Categories" ||
      video.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredVideos.length / videosPerPage);
  const startIndex = (currentPage - 1) * videosPerPage;
  const currentVideos = filteredVideos.slice(
    startIndex,
    startIndex + videosPerPage
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
    <section
      ref={sectionRef}
      className="py-8 lg:py-12 bg-white dark:bg-[#0D0D0D]"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Trending Videos
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Displaying {filteredVideos.length} results
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
                    {videoCategories.map((category) => (
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

        {/* Videos Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
        >
          {currentVideos.map((video, index) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <VideoCard video={video} index={index} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredVideos.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-12"
          >
            <p className="text-neutral-500 dark:text-neutral-400 text-lg mb-4">
              No videos found matching your criteria
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

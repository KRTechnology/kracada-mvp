"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Play, ExternalLink, Bookmark } from "lucide-react";
import { Button } from "@/components/common/button";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";
import { Pagination } from "../dashboard/Pagination";
import { Search, ChevronDown } from "lucide-react";
import { Input } from "@/components/common/input";
interface Video {
  id: string;
  title: string;
  description: string | null;
  thumbnailImage: string;
  duration: string;
  videoUrl: string;
}

interface VideoCardProps {
  video: Video;
  index: number;
}

const VideoCard = ({ video, index }: VideoCardProps) => {
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (status === "authenticated" && session?.user?.id) {
        try {
          const result = await checkBookmarkStatusAction("video", video.id);
          setIsBookmarked(result.isBookmarked);
        } catch (error) {
          console.error("Error checking bookmark status:", error);
        } finally {
          setIsCheckingStatus(false);
        }
      } else {
        setIsCheckingStatus(false);
      }
    };

    checkStatus();
  }, [status, session?.user?.id, video.id]);

  const handleVideoClick = () => {
    window.open(video.videoUrl, "_blank");
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (status !== "authenticated") {
      toast.error("Please log in to bookmark videos");
      return;
    }

    setIsTogglingBookmark(true);

    try {
      const result = await toggleBookmarkAction({
        contentType: "video",
        contentId: video.id,
      });

      if (result.success) {
        setIsBookmarked(result.isBookmarked || false);
        toast.success(
          result.isBookmarked
            ? "Video added to bookmarks"
            : "Video removed from bookmarks"
        );
      } else {
        toast.error(result.message || "Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  return (
    <div className="group cursor-pointer h-full" onClick={handleVideoClick}>
      <div className="bg-white dark:bg-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-neutral-100 dark:border-neutral-700 h-full flex flex-col">
        {/* Video Thumbnail */}
        <div className="relative aspect-video overflow-hidden">
          <Image
            src={video.thumbnailImage}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
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

          {/* Bookmark Button */}
          <button
            onClick={handleBookmarkClick}
            disabled={isTogglingBookmark}
            className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              isBookmarked
                ? "bg-orange-500 text-white"
                : "bg-white/90 text-neutral-700 hover:bg-white"
            } ${isTogglingBookmark ? "opacity-50 cursor-not-allowed" : ""}`}
            aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          >
            <Bookmark
              className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </button>

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
        </div>

        {/* Video Info */}
        <div className="p-4 lg:p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-orange-500 transition-colors">
            {video.title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed flex-1">
            {video.description}
          </p>

          {/* External Link Icon */}
          <div className="flex items-center justify-end mt-3">
            <ExternalLink className="w-4 h-4 text-neutral-400 group-hover:text-orange-500 transition-colors" />
          </div>
        </div>
      </div>
    </div>
  );
};

interface EntertainmentKracadaTVProps {
  videos: Video[]; // Array of Video objects
  totalResults?: number; // Optional
}

export const TvListingSection = ({
  videos,
  totalResults = 0,
}: EntertainmentKracadaTVProps) => {
  const handleGoToKracadaTV = () => {
    window.open("https://www.youtube.com/@kracada01", "_blank");
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [sortBy, setSortBy] = useState("Most Recent");

  const sortOptions = ["Most Recent", "Oldest", "A-Z", "Z-A"];

  // 1. FUNCTION TO EXTRACT CATEGORIES FROM VIDEO ARRAY
  const extractCategories = (videos: any[]): string[] => {
    const categoriesSet = new Set<string>();

    videos.forEach((video) => {
      try {
        const cats =
          typeof video.categories === "string"
            ? JSON.parse(video.categories)
            : video.categories;

        if (Array.isArray(cats)) {
          cats.forEach((cat: string) => categoriesSet.add(cat));
        }
      } catch (e) {
        console.error("Error parsing categories:", e);
      }
    });

    return ["All Categories", ...Array.from(categoriesSet).sort()];
  };

  const categories = extractCategories(videos);

  const filterVideos = (videos: any[]) => {
    let filtered = [...videos];

    // 1. SEARCH
    if (searchQuery.trim() !== "") {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(q) ||
          (v.description && v.description.toLowerCase().includes(q)) ||
          (v.author && v.author.toLowerCase().includes(q))
      );
    }

    // 2. CATEGORY FILTER
    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((v) => {
        try {
          const cats =
            typeof v.categories === "string"
              ? JSON.parse(v.categories)
              : v.categories;
          return cats.includes(selectedCategory);
        } catch (e) {
          return false;
        }
      });
    }

    // 3. SORT
    if (sortBy === "Most Recent") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    } else if (sortBy === "Oldest") {
      filtered = filtered.sort(
        (a, b) =>
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      );
    } else if (sortBy === "A-Z") {
      // Fixed: removed spaces
      filtered = filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Z-A") {
      // Fixed: removed spaces
      filtered = filtered.sort((a, b) => b.title.localeCompare(a.title));
    }

    return filtered;
  };
  console.log(filterVideos(videos));
  // Don't render the section if there are no videos
  if (videos.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-600 dark:text-neutral-400 text-lg">
          No videos available yet. Check back soon!
        </p>
      </div>
    );
  }
  console.log(videos);

  return (
    <>
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
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 bg-neutral-50 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 focus:ring-2 focus:ring-warm-200 dark:focus:ring-warm-200"
              />
            </div>

            {/* Categories Dropdown */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="text-sm text-neutral-600 dark:text-neutral-400">
              Displaying {2} {totalResults === 1 ? "result" : "results"}
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              {/* <Button
                variant="outline"
                className="h-10 px-4 bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"
              >
                <span className="mr-2">Sort: Most Recent</span>
                <ChevronDown className="w-4 h-4" />
              </Button> */}
              <select
                defaultValue="Most Recent"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-neutral-300 dark:border-neutral-600 rounded-lg px-3 py-2 text-sm z-1 "
              >
                {sortOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </motion.div>
      <section className="py-8 lg:py-12 bg-gradient-to-br  dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 lg:mb-12"
          >
            <div>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-sm font-medium text-orange-200 dark:text-orange-300 mb-2"
              >
                Kracada TV
              </motion.p>
              {/* <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
              Latest Updates
            </h2> */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-3xl font-bold text-neutral-900 dark:text-white mb-8"
              >
                All Video Posts
              </motion.h2>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                onClick={handleGoToKracadaTV}
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Go to Kracada TV
                <ExternalLink className="w-4 h-4" />
              </Button>
            </motion.div>
          </motion.div>

          {/* Video Grid */}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filterVideos(videos).map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="h-full"
              >
                <VideoCard video={video} index={index} />
              </motion.div>
            ))}
          </div>

          {/* Mobile View All Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-8 text-center sm:hidden"
          >
            <Button
              onClick={handleGoToKracadaTV}
              variant="outline"
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 font-medium py-3 rounded-xl"
            >
              View All Videos
              <ExternalLink className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>
          <div>
            <Pagination
              currentPage={1}
              totalPages={2}
              onPageChange={() => {}}
            />
          </div>
        </div>
      </section>
    </>
  );
};

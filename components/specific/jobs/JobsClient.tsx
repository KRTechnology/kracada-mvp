"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, MapPin, ChevronDown } from "lucide-react";
import { JobItem } from "@/lib/data/jobs-data";
import JobCard from "@/components/specific/landing/JobCard";
import { Toggle } from "@/components/common/Toggle";
import { Pagination } from "@/components/specific/dashboard/Pagination";

interface JobsClientProps {
  initialJobs: JobItem[];
  locations: string[];
}

const ITEMS_PER_PAGE = 12;

export function JobsClient({ initialJobs, locations }: JobsClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);

  // Filter jobs based on search query and location
  const filteredJobs = useMemo(() => {
    return initialJobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.skills.some((skill) =>
          skill.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesLocation =
        selectedLocation === "" || job.location === selectedLocation;

      return matchesSearch && matchesLocation;
    });
  }, [initialJobs, searchQuery, selectedLocation]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentJobs = filteredJobs.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleLocationChange = (location: string) => {
    setSelectedLocation(location);
    setCurrentPage(1); // Reset to first page when filtering
    setIsLocationDropdownOpen(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 pt-20">
      <div className="container mx-auto px-4 py-8 bg-white dark:bg-neutral-900 rounded-lg">
        {/* Search and Filter Section */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Find a job by title, skill or company"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent transition-colors"
            />
          </div>

          {/* Location Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsLocationDropdownOpen(!isLocationDropdownOpen)}
              className="flex items-center justify-between w-full lg:w-48 px-4 py-3 border border-neutral-200 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent transition-colors"
            >
              <div className="flex items-center min-w-0 flex-1">
                <MapPin className="w-5 h-5 text-neutral-400 mr-2 flex-shrink-0" />
                <span
                  className={`truncate ${
                    selectedLocation
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-500 dark:text-neutral-400"
                  }`}
                  title={selectedLocation || "Location"}
                >
                  {selectedLocation || "Location"}
                </span>
              </div>
              <ChevronDown
                className={`w-5 h-5 text-neutral-400 transition-transform flex-shrink-0 ml-2 ${isLocationDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isLocationDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto"
                >
                  <button
                    onClick={() => handleLocationChange("")}
                    className="w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                  >
                    All Locations
                  </button>
                  {locations.map((location) => (
                    <button
                      key={location}
                      onClick={() => handleLocationChange(location)}
                      className="w-full px-4 py-3 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-600 transition-colors"
                    >
                      {location}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Search Button */}
          <button className="bg-warm-200 hover:bg-warm-300 text-white px-8 py-3 rounded-lg font-medium transition-colors shadow-sm">
            Search
          </button>
        </div>

        {/* Job Count and Notification Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
          <div className="text-neutral-700 dark:text-neutral-300 mb-4 sm:mb-0">
            <span className="font-semibold">
              [{filteredJobs.length.toLocaleString()}]
            </span>{" "}
            Number of jobs found
          </div>

          <div className="flex items-center space-x-3">
            <Toggle
              isOn={isNotificationEnabled}
              onToggle={setIsNotificationEnabled}
              size="md"
            />
            <span className="text-neutral-700 dark:text-neutral-300 text-sm">
              Receive notifications for this job postings
            </span>
          </div>
        </div>

        {/* Job Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          <AnimatePresence mode="wait">
            {currentJobs.length > 0 ? (
              currentJobs.map((job, index) => (
                <JobCard key={job.id} job={job} index={index} />
              ))
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12"
              >
                <div className="text-neutral-500 dark:text-neutral-400 text-lg">
                  No jobs found matching your criteria.
                </div>
                <div className="text-neutral-400 dark:text-neutral-500 text-sm mt-2">
                  Try adjusting your search terms or location filter.
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

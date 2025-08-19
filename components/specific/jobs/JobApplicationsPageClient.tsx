"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MoreVertical,
  MapPin,
  Search,
  ChevronDown,
  Info,
  Download,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { JobItem } from "@/lib/data/jobs-data";
import { Pagination } from "@/components/specific/dashboard/Pagination";

interface Application {
  id: string;
  name: string;
  email: string;
  role: string;
  status:
    | "Submitted"
    | "Under review"
    | "Shortlisted"
    | "Rejected"
    | "Interviewed"
    | "Offer";
  avatar: string;
  hasAvatar: boolean;
}

interface JobApplicationsPageClientProps {
  job: JobItem;
  applications: Application[];
}

const ITEMS_PER_PAGE = 10;

export function JobApplicationsPageClient({
  job,
  applications,
}: JobApplicationsPageClientProps) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedApplications, setSelectedApplications] = useState<string[]>(
    []
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");
  const [selectedExperience, setSelectedExperience] =
    useState("All Experience");
  const [selectedSkills, setSelectedSkills] = useState("All Skills");
  const [sortBy, setSortBy] = useState("Most Recent");
  const [activeFilter, setActiveFilter] = useState<
    "all" | "interviewed" | "reject" | "shortlist"
  >("all");
  const [openStatusDropdown, setOpenStatusDropdown] = useState<string | null>(
    null
  );

  const totalPages = Math.ceil(applications.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentApplications = applications.slice(startIndex, endIndex);

  const handleGoBack = () => {
    router.back();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSelectAll = () => {
    if (selectedApplications.length === currentApplications.length) {
      setSelectedApplications([]);
    } else {
      setSelectedApplications(currentApplications.map((app) => app.id));
    }
  };

  const handleSelectApplication = (id: string) => {
    setSelectedApplications((prev) =>
      prev.includes(id) ? prev.filter((appId) => appId !== id) : [...prev, id]
    );
  };

  const handleStatusClick = (id: string) => {
    setOpenStatusDropdown(openStatusDropdown === id ? null : id);
  };

  const handleStatusChange = (id: string, newStatus: Application["status"]) => {
    // Here you would typically update the application status in your backend
    console.log(`Changing status for application ${id} to ${newStatus}`);

    // Close the dropdown
    setOpenStatusDropdown(null);

    // For now, we'll just log the change
    // In a real implementation, you'd update the applications array or make an API call
  };

  // Reset to first page when applications change
  useEffect(() => {
    setCurrentPage(1);
  }, [applications]);

  const getStatusColor = (status: Application["status"]) => {
    switch (status) {
      case "Submitted":
        return "bg-white dark:bg-dark border-tab-light-border dark:border-tab-dark-border text-neutral-700 dark:text-neutral-300";
      case "Under review":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400";
      case "Shortlisted":
        return "bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400";
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400";
      case "Interviewed":
        return "bg-blue-100 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400";
      case "Offer":
        return "bg-yellow-100 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-400";
      default:
        return "bg-white dark:bg-dark border-tab-light-border dark:border-tab-dark-border text-neutral-700 dark:text-neutral-300";
    }
  };

  const getStatusBgColor = (status: Application["status"]) => {
    switch (status) {
      case "Submitted":
        return "bg-white dark:bg-dark";
      case "Under review":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "Shortlisted":
        return "bg-green-100 dark:bg-green-900/20";
      case "Rejected":
        return "bg-red-100 dark:bg-red-900/20";
      case "Interviewed":
        return "bg-blue-100 dark:bg-blue-900/20";
      case "Offer":
        return "bg-yellow-100 dark:bg-yellow-900/20";
      default:
        return "bg-white dark:bg-dark";
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Main Applications Card */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-dark rounded-2xl shadow-sm max-w-6xl mx-auto pb-6"
        >
          {/* Go Back Button */}
          <div className="p-6">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              onClick={handleGoBack}
              className="flex items-center space-x-2 px-4 py-2 border border-goBackButton-light dark:border-goBackButton-dark-border text-goBackButton-light dark:text-goBackButton-dark-text rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">Go Back</span>
            </motion.button>
          </div>

          {/* Job Details Header */}
          <div className="px-6 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                {/* Company Logo Placeholder */}
                <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
                  <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-600 rounded"></div>
                </div>

                {/* Job Info */}
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                    {job.title}
                  </h1>
                  <p className="text-lg text-neutral-600 dark:text-neutral-300 mb-2">
                    {job.company}
                  </p>
                  <div className="flex items-center text-neutral-500 dark:text-neutral-400">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>
                      {job.isRemote ? "Remote - " : ""}Based in {job.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* More Options */}
              <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="px-6 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg rounded-lg text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-neutral-300 focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent w-48"
                  />
                </div>

                {/* Location Filter */}
                <div className="relative">
                  <select
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent w-40"
                  >
                    <option>All Locations</option>
                    <option>Lagos, Nigeria</option>
                    <option>Abuja, Nigeria</option>
                    <option>Port Harcourt, Nigeria</option>
                    <option>Kano, Nigeria</option>
                    <option>Ibadan, Nigeria</option>
                    <option>Remote</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>

                {/* Experience Filter */}
                <div className="relative">
                  <select
                    value={selectedExperience}
                    onChange={(e) => setSelectedExperience(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:ring-warm-200 focus:border-transparent w-40"
                  >
                    <option>All Experience</option>
                    <option>Entry Level</option>
                    <option>Mid Level</option>
                    <option>Senior</option>
                    <option>Lead</option>
                    <option>Manager</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>

                {/* Skills Filter */}
                <div className="relative">
                  <select
                    value={selectedSkills}
                    onChange={(e) => setSelectedSkills(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent w-32"
                  >
                    <option>All Skills</option>
                    <option>React</option>
                    <option>TypeScript</option>
                    <option>JavaScript</option>
                    <option>Node.js</option>
                    <option>Python</option>
                    <option>UI/UX</option>
                    <option>Figma</option>
                    <option>AWS</option>
                    <option>Docker</option>
                    <option>Kubernetes</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>

              <div className="flex items-center space-x-4">
                {/* Results Count */}
                <span className="text-neutral-600 dark:text-neutral-400 text-sm">
                  Displaying {applications.length} results
                </span>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none pl-4 pr-10 py-2 bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg rounded-lg text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-transparent w-40"
                  >
                    <option>Most Recent</option>
                    <option>Name A-Z</option>
                    <option>Name Z-A</option>
                    <option>Status</option>
                    <option>Experience Level</option>
                    <option>Location</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Applications Section */}
          <div className="px-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
              <div className="flex items-center space-x-3 mb-4 sm:mb-0">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Applications
                </h2>
                <span className="px-3 py-1 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm font-medium">
                  {applications.length}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveFilter("interviewed")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "interviewed"
                      ? "bg-warm-200 text-white"
                      : "bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-600"
                  }`}
                >
                  Interviewed
                </button>
                <button
                  onClick={() => setActiveFilter("reject")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "reject"
                      ? "bg-warm-200 text-white"
                      : "bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-600"
                  }`}
                >
                  Rejected
                </button>
                <button
                  onClick={() => setActiveFilter("shortlist")}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeFilter === "shortlist"
                      ? "bg-warm-200 text-white"
                      : "bg-white dark:bg-neutral-700 border border-skillPill-light-bg dark:border-skillPill-dark-bg text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-600"
                  }`}
                >
                  Shortlist
                </button>
              </div>
            </div>

            {/* Applications Table */}
            <div className="bg-white dark:bg-neutral-800 rounded-lg border border-skillPill-light-bg dark:border-tab-dark-border overflow-hidden">
              {/* Table Header */}
              <div className="grid grid-cols-12 gap-2 px-6 py-4 bg-tab-light-bg dark:bg-neutral-700 border-b border-skillPill-light-bg dark:border-tab-dark-border">
                <div className="col-span-1">
                  <input
                    type="checkbox"
                    checked={
                      selectedApplications.length === currentApplications.length
                    }
                    onChange={handleSelectAll}
                    className="w-4 h-4 text-warm-200 bg-white dark:bg-neutral-600 border-neutral-300 dark:border-neutral-500 rounded focus:ring-warm-200 focus:ring-2"
                  />
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Name
                  </span>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Role
                  </span>
                  <Info className="w-4 h-4 ml-2 text-neutral-400" />
                </div>
                <div className="col-span-2">
                  <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Status
                  </span>
                </div>
                <div className="col-span-2">{/* Download Cover Letter */}</div>
                <div className="col-span-2">
                  {/* Download CV - increased from 1 to 2 */}
                </div>
                <div className="col-span-1">{/* Send Email */}</div>
              </div>

              {/* Applications List */}
              <div className="divide-y divide-skillPill-light-bg dark:divide-tab-dark-border">
                {currentApplications.map((application, index) => (
                  <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="grid grid-cols-12 gap-2 px-6 py-4 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
                  >
                    {/* Checkbox */}
                    <div className="col-span-1">
                      <input
                        type="checkbox"
                        checked={selectedApplications.includes(application.id)}
                        onChange={() => handleSelectApplication(application.id)}
                        className="w-4 h-4 text-warm-200 bg-white dark:bg-neutral-600 border-neutral-300 dark:border-neutral-500 rounded focus:ring-warm-200 focus:ring-2"
                      />
                    </div>

                    {/* Name and Email */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-600 rounded-full flex items-center justify-center text-sm font-medium text-neutral-700 dark:text-neutral-300">
                          {application.avatar}
                        </div>
                        <div>
                          <p className="font-medium text-neutral-900 dark:text-white">
                            {application.name}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-400">
                            {application.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Role */}
                    <div className="col-span-2">
                      <p className="text-neutral-900 dark:text-white">
                        {application.role}
                      </p>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="relative group">
                        <button
                          onClick={() => handleStatusClick(application.id)}
                          className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border hover:shadow-sm transition-all cursor-pointer ${getStatusColor(application.status)}`}
                        >
                          <span>{application.status}</span>
                          <ChevronDown className="w-3 h-3 ml-1 opacity-60 group-hover:opacity-100 transition-opacity" />
                        </button>

                        {/* Status Dropdown */}
                        {openStatusDropdown === application.id && (
                          <div
                            ref={(el) => {
                              if (el) {
                                const rect = el.getBoundingClientRect();
                                const viewportHeight = window.innerHeight;
                                const shouldShowAbove =
                                  rect.bottom > viewportHeight - 100;

                                if (shouldShowAbove) {
                                  el.style.top = "auto";
                                  el.style.bottom = "100%";
                                  el.style.marginBottom = "0.25rem";
                                  el.style.marginTop = "0";
                                } else {
                                  el.style.top = "100%";
                                  el.style.bottom = "auto";
                                  el.style.marginTop = "0.25rem";
                                  el.style.marginBottom = "0";
                                }
                              }
                            }}
                            className="absolute z-[9999] min-w-[140px] bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-600 shadow-lg py-1 top-full mt-1 left-0"
                          >
                            {[
                              "Submitted",
                              "Under review",
                              "Shortlisted",
                              "Interviewed",
                              "Rejected",
                              "Offer",
                            ].map((status) => (
                              <button
                                key={status}
                                onClick={() =>
                                  handleStatusChange(
                                    application.id,
                                    status as Application["status"]
                                  )
                                }
                                className={`w-full text-left px-3 py-2 text-xs hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center space-x-2 ${
                                  application.status === status
                                    ? "text-warm-200 font-medium"
                                    : "text-neutral-700 dark:text-neutral-300"
                                }`}
                              >
                                <div
                                  className={`w-2 h-2 rounded-full border border-neutral-200 dark:border-neutral-600 ${getStatusBgColor(status as Application["status"])}`}
                                ></div>
                                <span>{status}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Download Cover Letter */}
                    <div className="col-span-2">
                      <button
                        onClick={() =>
                          console.log(
                            "Download cover letter for:",
                            application.name
                          )
                        }
                        className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors w-full"
                        title="Download Cover Letter"
                      >
                        <span className="text-xs whitespace-nowrap">
                          Download Cover Letter
                        </span>
                        <Download className="w-4 h-4 flex-shrink-0" />
                      </button>
                    </div>

                    {/* Download CV - increased from 1 to 2 columns */}
                    <div className="col-span-2">
                      <button
                        onClick={() =>
                          console.log("Download CV for:", application.name)
                        }
                        className="flex items-center space-x-2 text-neutral-600 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors w-full"
                        title="Download CV"
                      >
                        <span className="text-xs whitespace-nowrap">
                          Download CV
                        </span>
                        <Download className="w-4 h-4 flex-shrink-0" />
                      </button>
                    </div>

                    {/* Send Email */}
                    <div className="col-span-1">
                      <button
                        onClick={() =>
                          console.log("Send email to:", application.name)
                        }
                        className="flex items-center justify-between text-neutral-600 dark:text-neutral-200 hover:text-neutral-900 dark:hover:text-white transition-colors w-full"
                        title="Send Email"
                      >
                        <span className="text-xs whitespace-nowrap">
                          Send Email
                        </span>
                        <Mail className="w-4 h-4 flex-shrink-0" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-6">
              <div className="text-center mb-4 text-sm text-neutral-600 dark:text-neutral-400">
                Showing {startIndex + 1}-
                {Math.min(endIndex, applications.length)} of{" "}
                {applications.length} applications
              </div>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

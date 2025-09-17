"use client";

import { useState } from "react";
import { LifestyleArticleHeader } from "@/components/specific/lifestyle/LifestyleArticleHeader";
import { LifestyleArticleContent } from "@/components/specific/lifestyle/LifestyleArticleContent";
import { LifestyleAuthorSidebar } from "@/components/specific/lifestyle/LifestyleAuthorSidebar";

interface LifestyleArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function LifestyleArticlePage({
  params,
}: LifestyleArticlePageProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D] relative">
      {/* Author Info Button - Fixed position when sidebar is closed */}
      {!isSidebarOpen && (
        <button
          onClick={toggleSidebar}
          className="fixed top-1/2 right-4 z-30 -translate-y-1/2 w-12 h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </button>
      )}

      {/* Main Content Container */}
      <div
        className={`transition-all duration-300 ${isSidebarOpen ? "lg:pr-96" : "pr-0"}`}
      >
        <LifestyleArticleHeader />
        <LifestyleArticleContent />
      </div>

      {/* Author Sidebar */}
      <LifestyleAuthorSidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
    </div>
  );
}

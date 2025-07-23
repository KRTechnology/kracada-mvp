"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const NewsPagination = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 10;

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      {/* Previous Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          currentPage === 1
            ? "bg-white bg-opacity-30 text-white opacity-50 cursor-not-allowed"
            : "bg-white text-neutral-800 hover:bg-opacity-90 shadow-lg"
        }`}
      >
        <ChevronLeft className="w-5 h-5" />
      </motion.button>

      {/* Page Indicator */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-2">
        <span className="text-white font-medium text-sm">
          Page {currentPage} of {totalPages}
        </span>
      </div>

      {/* Next Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
          currentPage === totalPages
            ? "bg-white bg-opacity-30 text-white opacity-50 cursor-not-allowed"
            : "bg-white text-neutral-800 hover:bg-opacity-90 shadow-lg"
        }`}
      >
        <ChevronRight className="w-5 h-5" />
      </motion.button>
    </div>
  );
};

export default NewsPagination;

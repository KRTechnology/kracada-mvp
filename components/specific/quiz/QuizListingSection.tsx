"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { QuizCard } from "./QuizCard";
import { Pagination } from "@/components/common/Pagination";

interface Quiz {
  id: string | number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  category: string;
  difficulty: string;
  questionsCount: number;
  estimatedTime: string;
}

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface QuizListingSectionProps {
  initialQuizzes: Quiz[];
  initialPagination: PaginationData;
}

export const QuizListingSection = ({
  initialQuizzes,
  initialPagination,
}: QuizListingSectionProps) => {
  const [quizzes] = useState<Quiz[]>(initialQuizzes);
  const [pagination, setPagination] =
    useState<PaginationData>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || isLoading) return;

    setIsLoading(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // In a real app, you would fetch new data here
    // For now, we'll just update the pagination state
    setPagination((prev) => ({ ...prev, page: newPage }));

    setIsLoading(false);
  };

  return (
    <section className="bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Section Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-3xl font-bold text-neutral-900 dark:text-white mb-8"
        >
          All Quizzes
        </motion.h2>

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        ) : quizzes.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No quizzes found. Check back later for new content!
            </p>
          </div>
        ) : (
          <>
            {/* Quiz Cards Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
            >
              {quizzes.map((quiz, index) => (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  <QuizCard quiz={quiz} index={index} />
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

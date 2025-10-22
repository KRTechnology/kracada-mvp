"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { QuizCard } from "./QuizCard";
import { Pagination } from "@/components/common/Pagination";
import { useSearchParams, useRouter } from "next/navigation";
import { getFilteredQuizzesAction } from "@/app/(dashboard)/actions/quiz-actions";
import { format } from "date-fns";

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [quizzes, setQuizzes] = useState<Quiz[]>(initialQuizzes);
  const [pagination, setPagination] =
    useState<PaginationData>(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch quizzes when search params change
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);

      const page = searchParams.get("page")
        ? parseInt(searchParams.get("page")!)
        : 1;
      const category = searchParams.get("category") || undefined;
      const difficulty = searchParams.get("difficulty") || undefined;
      const search = searchParams.get("search") || undefined;
      const sortBy = (searchParams.get("sortBy") as any) || "recent";

      try {
        const result = await getFilteredQuizzesAction({
          page,
          limit: 6,
          category,
          difficulty,
          search,
          sortBy,
        });

        if (result.success && result.data) {
          const transformedQuizzes = result.data.quizzes.map((quiz: any) => ({
            id: quiz.id,
            title: quiz.title,
            description: quiz.description,
            category: quiz.category,
            author: "Admin",
            date: quiz.publishedAt
              ? format(new Date(quiz.publishedAt), "dd MMM yyyy")
              : format(new Date(quiz.createdAt), "dd MMM yyyy"),
            image: quiz.featuredImage || "/images/landing-hero-image.jpg",
            difficulty: quiz.difficulty,
            questionsCount: quiz.questionsCount,
            estimatedTime: quiz.estimatedTime,
          }));

          setQuizzes(transformedQuizzes);
          setPagination(result.data.pagination);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuizzes();
  }, [searchParams]);

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages || isLoading) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/quiz?${params.toString()}`);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              No quizzes found. Try adjusting your filters or check back later
              for new content!
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

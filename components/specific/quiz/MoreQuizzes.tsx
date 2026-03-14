"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { formatEstimatedTime } from "@/lib/utils/quiz-utils";

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

interface MoreQuizzesProps {
  currentQuizId: string | number;
  relatedQuizzes?: Quiz[];
}

export function MoreQuizzes({
  currentQuizId,
  relatedQuizzes = [],
}: MoreQuizzesProps) {
  // If no related quizzes, don't show the section
  if (!relatedQuizzes || relatedQuizzes.length === 0) {
    return null;
  }

  return (
    <div className="hidden lg:block">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="sticky top-8"
      >
        <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-6">
          More Quizzes
        </h3>

        <div className="grid grid-cols-1 gap-4">
          {relatedQuizzes.map((quiz, index) => (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Link href={`/quiz/${quiz.id}`}>
                <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer">
                  {/* Quiz Image */}
                  <div className="relative w-full h-32 overflow-hidden">
                    <Image
                      src={quiz.image}
                      alt={quiz.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Quiz Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-orange-500 text-xs font-medium">
                        {quiz.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                          quiz.difficulty === "Beginner"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : quiz.difficulty === "Intermediate"
                              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight line-clamp-2">
                      {quiz.title}
                    </h4>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed line-clamp-2">
                      {quiz.description}
                    </p>

                    {/* Quiz Stats */}
                    <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                      <span>{quiz.questionsCount} questions</span>
                      <span>•</span>
                      <span>{formatEstimatedTime(quiz.estimatedTime)}</span>
                    </div>

                    {/* Author and Date - Bottom Left */}
                    <div className="flex items-center space-x-2 pt-2 border-t border-neutral-100 dark:border-neutral-700">
                      <div className="w-6 h-6 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-xs font-semibold">
                          {quiz.author.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-neutral-900 dark:text-white">
                          {quiz.author}
                        </div>
                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                          {quiz.date}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

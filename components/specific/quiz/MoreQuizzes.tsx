"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
}

export function MoreQuizzes({ currentQuizId }: MoreQuizzesProps) {
  // Sample quizzes data
  const quizzes: Quiz[] = [
    {
      id: "2",
      title: "UX review presentations",
      description:
        "How do you create compelling presentations that wow your colleagues and impress your managers?",
      category: "Quiz Category",
      author: "Olivia Rhye",
      date: "20 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Intermediate",
      questionsCount: 12,
      estimatedTime: "8 min",
    },
    {
      id: "3",
      title: "React Hooks Mastery",
      description:
        "Test your knowledge of React hooks including useState, useEffect, and custom hooks.",
      category: "Technology",
      author: "Sarah Johnson",
      date: "18 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Intermediate",
      questionsCount: 15,
      estimatedTime: "8 min",
    },
    {
      id: "4",
      title: "JavaScript Fundamentals",
      description:
        "Master the basics of JavaScript including variables, functions, and control structures.",
      category: "Programming",
      author: "Mike Chen",
      date: "17 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Beginner",
      questionsCount: 12,
      estimatedTime: "6 min",
    },
    {
      id: "5",
      title: "CSS Grid Layout",
      description:
        "Learn and test your understanding of CSS Grid layout system and its properties.",
      category: "Web Design",
      author: "Emma Wilson",
      date: "16 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Intermediate",
      questionsCount: 18,
      estimatedTime: "10 min",
    },
    {
      id: "6",
      title: "TypeScript Basics",
      description:
        "Get familiar with TypeScript features including types, interfaces, and generics.",
      category: "Programming",
      author: "David Kim",
      date: "15 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Intermediate",
      questionsCount: 14,
      estimatedTime: "7 min",
    },
    {
      id: "7",
      title: "Node.js Backend Development",
      description:
        "Test your knowledge of Node.js, Express, and backend development concepts.",
      category: "Backend",
      author: "Lisa Rodriguez",
      date: "14 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Advanced",
      questionsCount: 20,
      estimatedTime: "12 min",
    },
  ];

  // Filter out current quiz
  const filteredQuizzes = quizzes.filter((quiz) => quiz.id !== currentQuizId);

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

        <div className="grid grid-cols-1 gap-4 mb-6">
          {filteredQuizzes.slice(0, 6).map((quiz, index) => (
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
                    <div className="text-orange-500 text-xs font-medium">
                      {quiz.category}
                    </div>

                    <h4 className="text-sm font-bold text-neutral-900 dark:text-white leading-tight">
                      {quiz.title}
                    </h4>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {quiz.description}
                    </p>

                    {/* Author and Date - Bottom Left */}
                    <div className="flex items-center space-x-2">
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

        {/* Pagination */}
        <div className="flex items-center justify-center space-x-2 text-sm text-neutral-500 dark:text-neutral-400">
          <button className="hover:text-orange-500 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span>Page 1 of 10</span>
          <button className="hover:text-orange-500 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

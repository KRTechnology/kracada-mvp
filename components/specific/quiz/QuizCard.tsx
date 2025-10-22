"use client";

import { ExternalLink } from "lucide-react";
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

interface QuizCardProps {
  quiz: Quiz;
  index: number;
}

export function QuizCard({ quiz, index }: QuizCardProps) {
  // Function to get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "intermediate":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "advanced":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
    }
  };

  return (
    <Link href={`/quiz/${quiz.id}`} className="h-full">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Quiz Image */}
        <div className="relative w-full h-48 overflow-hidden">
          <Image
            src={quiz.image}
            alt={quiz.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Quiz Content */}
        <div className="p-6 space-y-4 flex-1 flex flex-col">
          {/* Category */}
          <div className="flex items-center justify-between">
            <span className="text-orange-500 text-sm font-medium">
              {quiz.category}
            </span>
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty)}`}
            >
              {quiz.difficulty}
            </span>
          </div>

          {/* Title with External Link Icon */}
          <div className="flex items-start justify-between">
            <h3 className="text-xl font-bold text-neutral-900 dark:text-white leading-tight flex-1 pr-2">
              {quiz.title}
            </h3>
            <ExternalLink className="w-5 h-5 text-neutral-400 dark:text-neutral-500 flex-shrink-0 mt-1" />
          </div>

          {/* Description */}
          <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed flex-1">
            {quiz.description}
          </p>

          {/* Quiz Stats */}
          <div className="flex items-center justify-between text-sm text-neutral-500 dark:text-neutral-400">
            <span>{quiz.questionsCount} questions</span>
            <span>•</span>
            <span>{formatEstimatedTime(quiz.estimatedTime)}</span>
          </div>
        </div>

        {/* Author and Date - Bottom Left */}
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {quiz.author.charAt(0)}
              </span>
            </div>
            <div>
              <div className="text-sm font-semibold text-neutral-900 dark:text-white">
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
  );
}

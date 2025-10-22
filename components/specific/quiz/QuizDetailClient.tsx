"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/common/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { MoreQuizzes } from "./MoreQuizzes";
import { Comments } from "./Comments";

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

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
  questions: Question[];
}

interface QuizDetailClientProps {
  quiz: Quiz;
}

export function QuizDetailClient({ quiz }: QuizDetailClientProps) {
  const [selectedAnswers, setSelectedAnswers] = useState<{
    [key: number]: number;
  }>({});
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    if (isQuizComplete) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }));
  };

  const handleSubmitQuiz = () => {
    let correctCount = 0;

    quiz.questions.forEach((question) => {
      const selectedAnswer = selectedAnswers[question.id];
      if (selectedAnswer === question.correctAnswer) {
        correctCount++;
      }
    });

    setScore(correctCount);
    setIsQuizComplete(true);
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setIsQuizComplete(false);
    setScore(0);
  };

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

  if (isQuizComplete) {
    return (
      <div className="min-h-screen bg-white dark:bg-dark">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Left Column */}
            <div className="lg:col-span-2">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <Link
                  href="/quiz"
                  className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Quizzes
                </Link>

                {/* Quiz Header */}
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-4 mb-4">
                      <span className="text-orange-500 text-sm font-medium">
                        {quiz.category}
                      </span>
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty)}`}
                      >
                        {quiz.difficulty}
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                      {quiz.title}
                    </h1>
                    <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                      {quiz.description}
                    </p>
                  </div>

                  {/* Quiz Image */}
                  <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={quiz.image}
                      alt={quiz.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </motion.div>

              {/* All Questions with Results */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="space-y-6"
              >
                {quiz.questions.map((question, questionIndex) => (
                  <div
                    key={question.id}
                    className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm"
                  >
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                      {questionIndex + 1}. {question.question}
                    </h3>

                    <div className="space-y-3">
                      {question.options.map((option, optionIndex) => {
                        const isSelected =
                          selectedAnswers[question.id] === optionIndex;
                        const isCorrect =
                          optionIndex === question.correctAnswer;
                        const isWrong = isSelected && !isCorrect;

                        return (
                          <div
                            key={optionIndex}
                            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                              isCorrect && isQuizComplete
                                ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                : isWrong && isQuizComplete
                                  ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                  : isSelected
                                    ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                                    : "border-neutral-200 dark:border-neutral-700 hover:border-orange-300 dark:hover:border-orange-600"
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                  isCorrect && isQuizComplete
                                    ? "border-green-500 bg-green-500"
                                    : isWrong && isQuizComplete
                                      ? "border-red-500 bg-red-500"
                                      : isSelected
                                        ? "border-orange-500 bg-orange-500"
                                        : "border-neutral-300 dark:border-neutral-600"
                                }`}
                              >
                                {isCorrect && isQuizComplete && (
                                  <CheckCircle className="w-3 h-3 text-white" />
                                )}
                                {isWrong && isQuizComplete && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                                {isSelected && !isQuizComplete && (
                                  <div className="w-2 h-2 bg-white rounded-full" />
                                )}
                              </div>
                              <span className="text-neutral-900 dark:text-white">
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </motion.div>

              {/* Score Display */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="mt-8"
              >
                <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                      Your Score:{" "}
                      <span className="text-orange-500">
                        {score}/{quiz.questions.length}
                      </span>
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400">
                      You got {score} out of {quiz.questions.length} questions
                      correct.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleRestart}
                      size="lg"
                      className="bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      Take another test
                    </Button>
                    <Link href="/quiz">
                      <Button
                        variant="outline"
                        size="lg"
                        className="border-orange-500 text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        Go to all quizzes
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>

              {/* Comments Section */}
              <Comments quizId={quiz.id} />
            </div>

            {/* Right Sidebar - More Quizzes */}
            <div className="lg:col-span-1">
              <MoreQuizzes currentQuizId={quiz.id} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Column */}
          <div className="lg:col-span-2">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <Link
                href="/quiz"
                className="inline-flex items-center text-orange-500 hover:text-orange-600 mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Quizzes
              </Link>

              {/* Quiz Header */}
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-orange-500 text-sm font-medium">
                      {quiz.category}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${getDifficultyColor(quiz.difficulty)}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
                    {quiz.title}
                  </h1>
                  <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                    {quiz.description}
                  </p>
                </div>

                {/* Quiz Image */}
                <div className="relative h-64 lg:h-80 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-800">
                  <Image
                    src={quiz.image}
                    alt={quiz.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </motion.div>

            {/* Quiz Questions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {quiz.questions.map((question, questionIndex) => (
                <div
                  key={question.id}
                  className="bg-white dark:bg-neutral-800 rounded-lg p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                    {questionIndex + 1}. {question.question}
                  </h3>

                  <div className="space-y-3">
                    {question.options.map((option, optionIndex) => {
                      const isSelected =
                        selectedAnswers[question.id] === optionIndex;

                      return (
                        <button
                          key={optionIndex}
                          onClick={() =>
                            handleAnswerSelect(question.id, optionIndex)
                          }
                          disabled={isQuizComplete}
                          className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-orange-500 bg-orange-50 dark:bg-orange-900/20"
                              : "border-neutral-200 dark:border-neutral-700 hover:border-orange-300 dark:hover:border-orange-600"
                          } ${isQuizComplete ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                isSelected
                                  ? "border-orange-500 bg-orange-500"
                                  : "border-neutral-300 dark:border-neutral-600"
                              }`}
                            >
                              {isSelected && (
                                <div className="w-2 h-2 bg-white rounded-full" />
                              )}
                            </div>
                            <span className="text-neutral-900 dark:text-white">
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Submit Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 flex justify-center"
            >
              <Button
                onClick={handleSubmitQuiz}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white px-8"
                disabled={
                  Object.keys(selectedAnswers).length !== quiz.questions.length
                }
              >
                Submit
              </Button>
            </motion.div>

            {/* Comments Section */}
            <Comments quizId={quiz.id} />
          </div>

          {/* Right Sidebar - More Quizzes */}
          <div className="lg:col-span-1">
            <MoreQuizzes currentQuizId={quiz.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

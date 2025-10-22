import { QuizListingHeader } from "@/components/specific/quiz/QuizListingHeader";
import { QuizListingSection } from "@/components/specific/quiz/QuizListingSection";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  // Sample quiz data - in a real app, this would come from a database
  const sampleQuizzes = [
    {
      id: "1",
      title: "Migrating to Linear 101",
      description:
        "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
      category: "Quiz Category",
      author: "Phoenix Baker",
      date: "19 Jan 2025",
      image: "/images/landing-hero-image.jpg",
      difficulty: "Beginner",
      questionsCount: 10,
      estimatedTime: "5 min",
    },
    {
      id: "2",
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
      id: "3",
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
      id: "4",
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
      id: "5",
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
      id: "6",
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

  // Pagination logic
  const itemsPerPage = 6;
  const totalQuizzes = sampleQuizzes.length;
  const totalPages = Math.ceil(totalQuizzes / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentQuizzes = sampleQuizzes.slice(startIndex, endIndex);

  const pagination = {
    page,
    limit: itemsPerPage,
    total: totalQuizzes,
    totalPages,
  };

  return (
    <div className="min-h-screen">
      <QuizListingHeader totalResults={pagination.total} />
      <QuizListingSection
        initialQuizzes={currentQuizzes}
        initialPagination={pagination}
      />
    </div>
  );
}

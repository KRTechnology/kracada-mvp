import { QuizListingHeader } from "@/components/specific/quiz/QuizListingHeader";
import { QuizListingSection } from "@/components/specific/quiz/QuizListingSection";
import {
  getFilteredQuizzesAction,
  getQuizCategoriesAction,
} from "@/app/(dashboard)/actions/quiz-actions";
import { format } from "date-fns";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function QuizPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    category?: string;
    difficulty?: string;
    search?: string;
    sortBy?: string;
  }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;
  const category = params.category || undefined;
  const difficulty = params.difficulty || undefined;
  const search = params.search || undefined;
  const sortBy = (params.sortBy as any) || "recent";

  // Fetch available categories
  const categoriesResult = await getQuizCategoriesAction();
  const categories = categoriesResult.success ? categoriesResult.data : [];

  // Fetch quizzes from database with filters
  const result = await getFilteredQuizzesAction({
    page,
    limit: 6,
    category,
    difficulty,
    search,
    sortBy,
  });

  if (!result.success || !result.data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
            Failed to load quizzes
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            {result.message || "Please try again later"}
          </p>
        </div>
      </div>
    );
  }

  // Transform quizzes data for display
  const quizzes = result.data.quizzes.map((quiz: any) => ({
    id: quiz.id,
    title: quiz.title,
    description: quiz.description,
    category: quiz.category,
    author: "Admin", // You can enhance this by fetching admin details
    date: quiz.publishedAt
      ? format(new Date(quiz.publishedAt), "dd MMM yyyy")
      : format(new Date(quiz.createdAt), "dd MMM yyyy"),
    image: quiz.featuredImage || "/images/landing-hero-image.jpg",
    difficulty: quiz.difficulty,
    questionsCount: quiz.questionsCount,
    estimatedTime: quiz.estimatedTime,
  }));

  const pagination = result.data.pagination;

  return (
    <div className="min-h-screen">
      <QuizListingHeader
        totalResults={pagination.total}
        categories={categories}
        initialCategory={category}
        initialDifficulty={difficulty}
        initialSearch={search}
        initialSortBy={sortBy}
      />
      <QuizListingSection
        initialQuizzes={quizzes}
        initialPagination={pagination}
      />
    </div>
  );
}

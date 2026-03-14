import { QuizDetailClient } from "@/components/specific/quiz/QuizDetailClient";
import {
  getQuizAction,
  getRelatedQuizzesAction,
} from "@/app/(dashboard)/actions/quiz-actions";
import { notFound } from "next/navigation";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface QuizDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  // Fetch quiz data from database
  const result = await getQuizAction(id);

  if (!result.success || !result.data) {
    notFound();
  }

  // Fetch related quizzes
  const relatedResult = await getRelatedQuizzesAction({
    currentQuizId: id,
    category: result.data.category,
    limit: 6,
  });

  const relatedQuizzes =
    relatedResult.success && relatedResult.data
      ? relatedResult.data.map((quiz: any) => ({
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
        }))
      : [];

  const quiz = {
    id: result.data.id,
    title: result.data.title,
    description: result.data.description,
    category: result.data.category,
    author: "Admin", // You can enhance this by fetching admin details
    date: result.data.publishedAt
      ? format(new Date(result.data.publishedAt), "dd MMM yyyy")
      : format(new Date(result.data.createdAt), "dd MMM yyyy"),
    image: result.data.featuredImage || "/images/landing-hero-image.jpg",
    difficulty: result.data.difficulty,
    questionsCount: result.data.questionsCount,
    estimatedTime: result.data.estimatedTime,
    questions: result.data.questions.map((q: any, index: number) => ({
      id: index + 1,
      question: q.question,
      options: q.options.map((opt: any) => opt.text),
      correctAnswer: q.correctAnswer,
    })),
  };

  return <QuizDetailClient quiz={quiz} relatedQuizzes={relatedQuizzes} />;
}

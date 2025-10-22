import { QuizDetailClient } from "@/components/specific/quiz/QuizDetailClient";

interface QuizDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function QuizDetailPage({ params }: QuizDetailPageProps) {
  const { id } = await params;

  // Sample quiz data - in a real app, this would come from a database
  const quiz = {
    id: id,
    title: "Migrating to Linear 101",
    description:
      "Linear helps streamline software projects, sprints, tasks, and bug tracking. Here's how to get started.",
    category: "Quiz Category",
    author: "Phoenix Baker",
    date: "19 Jan 2025",
    image: "/images/landing-hero-image.jpg",
    difficulty: "Beginner",
    questionsCount: 3,
    estimatedTime: "5 min",
    questions: [
      {
        id: 1,
        question: "What is Linear primarily used for?",
        options: [
          "Email management",
          "Project management and bug tracking",
          "Social media management",
          "File storage",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which of the following is NOT a core feature of Linear?",
        options: [
          "Issue tracking",
          "Sprint planning",
          "Video conferencing",
          "Team collaboration",
        ],
        correctAnswer: 2,
      },
      {
        id: 3,
        question: "How does Linear help with software development?",
        options: [
          "By providing video calls",
          "By streamlining project management",
          "By hosting websites",
          "By managing emails",
        ],
        correctAnswer: 1,
      },
    ],
  };

  return <QuizDetailClient quiz={quiz} />;
}

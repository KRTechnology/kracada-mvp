"use server";

// import { db } from "@/lib/db";
import {
  quizzes,
  quizQuestions,
  quizQuestionOptions,
  quizAttempts,
  quizComments,
  Quiz,
  NewQuiz,
  QuizQuestion,
  QuizQuestionOption,
} from "@/lib/db/schema";
import { eq, desc, and, like, or, sql, count } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db/drizzle";

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

interface CreateQuizData {
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  featuredImage?: string;
  featuredImageKey?: string;
  status: "draft" | "published";
  questions: {
    questionText: string;
    options: {
      optionText: string;
      isCorrect: boolean;
    }[];
  }[];
}

interface UpdateQuizData extends CreateQuizData {
  id: string;
}

/**
 * Create a new quiz with questions and options
 */
export async function createQuizAction(data: CreateQuizData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Check if user is an admin (you might want to add admin check here)
    // For now, we'll use the session user id as admin id

    // Generate slug
    let slug = generateSlug(data.title);

    // Check if slug exists and make it unique
    const existingQuiz = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.slug, slug))
      .limit(1);

    if (existingQuiz.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Create the quiz
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        featuredImage: data.featuredImage || null,
        featuredImageKey: data.featuredImageKey || null,
        status: data.status,
        adminId: session.user.id,
        publishedAt: data.status === "published" ? new Date() : null,
      })
      .returning();

    // Create questions and options
    for (let i = 0; i < data.questions.length; i++) {
      const questionData = data.questions[i];

      const [question] = await db
        .insert(quizQuestions)
        .values({
          quizId: newQuiz.id,
          questionText: questionData.questionText,
          questionOrder: i,
        })
        .returning();

      // Create options for the question
      for (let j = 0; j < questionData.options.length; j++) {
        const optionData = questionData.options[j];

        await db.insert(quizQuestionOptions).values({
          questionId: question.id,
          optionText: optionData.optionText,
          optionOrder: j,
          isCorrect: optionData.isCorrect,
        });
      }
    }

    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath("/quiz");

    return {
      success: true,
      message: "Quiz created successfully",
      data: newQuiz,
    };
  } catch (error) {
    console.error("Create quiz error:", error);
    return {
      success: false,
      message: "Failed to create quiz",
    };
  }
}

/**
 * Update an existing quiz
 */
export async function updateQuizAction(data: UpdateQuizData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Generate new slug if title changed
    let slug = generateSlug(data.title);

    // Check if slug exists (excluding current quiz)
    const existingQuiz = await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.slug, slug), sql`${quizzes.id} != ${data.id}`))
      .limit(1);

    if (existingQuiz.length > 0) {
      slug = `${slug}-${Date.now()}`;
    }

    // Update the quiz
    const [updatedQuiz] = await db
      .update(quizzes)
      .set({
        title: data.title,
        slug,
        description: data.description,
        category: data.category,
        difficulty: data.difficulty,
        estimatedTime: data.estimatedTime,
        featuredImage: data.featuredImage || null,
        featuredImageKey: data.featuredImageKey || null,
        status: data.status,
        publishedAt: data.status === "published" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(quizzes.id, data.id))
      .returning();

    // Delete existing questions and options (cascade will handle options)
    await db.delete(quizQuestions).where(eq(quizQuestions.quizId, data.id));

    // Create new questions and options
    for (let i = 0; i < data.questions.length; i++) {
      const questionData = data.questions[i];

      const [question] = await db
        .insert(quizQuestions)
        .values({
          quizId: updatedQuiz.id,
          questionText: questionData.questionText,
          questionOrder: i,
        })
        .returning();

      // Create options for the question
      for (let j = 0; j < questionData.options.length; j++) {
        const optionData = questionData.options[j];

        await db.insert(quizQuestionOptions).values({
          questionId: question.id,
          optionText: optionData.optionText,
          optionOrder: j,
          isCorrect: optionData.isCorrect,
        });
      }
    }

    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath("/quiz");
    revalidatePath(`/quiz/${updatedQuiz.id}`);

    return {
      success: true,
      message: "Quiz updated successfully",
      data: updatedQuiz,
    };
  } catch (error) {
    console.error("Update quiz error:", error);
    return {
      success: false,
      message: "Failed to update quiz",
    };
  }
}

/**
 * Delete a quiz
 */
export async function deleteQuizAction(quizId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    await db.delete(quizzes).where(eq(quizzes.id, quizId));

    revalidatePath("/admin/dashboard/quizzes");
    revalidatePath("/quiz");

    return {
      success: true,
      message: "Quiz deleted successfully",
    };
  } catch (error) {
    console.error("Delete quiz error:", error);
    return {
      success: false,
      message: "Failed to delete quiz",
    };
  }
}

/**
 * Get quizzes for admin dashboard with filtering and pagination
 */
export async function getAdminQuizzesAction({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived";
  search?: string;
}) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(quizzes.status, status));
    }

    if (search) {
      conditions.push(
        or(
          like(quizzes.title, `%${search}%`),
          like(quizzes.description, `%${search}%`),
          like(quizzes.category, `%${search}%`)
        )
      );
    }

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(quizzes)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Get quizzes with pagination
    const quizzesList = await db
      .select()
      .from(quizzes)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(quizzes.createdAt))
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: {
        quizzes: quizzesList,
        pagination: {
          page,
          limit,
          total: Number(totalCount),
          totalPages: Math.ceil(Number(totalCount) / limit),
        },
      },
    };
  } catch (error) {
    console.error("Get admin quizzes error:", error);
    return {
      success: false,
      message: "Failed to fetch quizzes",
    };
  }
}

/**
 * Get a single quiz with questions and options for editing
 */
export async function getQuizForEditAction(quizId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Get quiz
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz) {
      return {
        success: false,
        message: "Quiz not found",
      };
    }

    // Get questions
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.questionOrder);

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await db
          .select()
          .from(quizQuestionOptions)
          .where(eq(quizQuestionOptions.questionId, question.id))
          .orderBy(quizQuestionOptions.optionOrder);

        return {
          ...question,
          options,
        };
      })
    );

    return {
      success: true,
      data: {
        ...quiz,
        questions: questionsWithOptions,
      },
    };
  } catch (error) {
    console.error("Get quiz for edit error:", error);
    return {
      success: false,
      message: "Failed to fetch quiz",
    };
  }
}

/**
 * Get quizzes for public display with pagination
 */
export async function getQuizzesAction({
  page = 1,
  limit = 6,
}: {
  page?: number;
  limit?: number;
}) {
  try {
    const offset = (page - 1) * limit;

    // Get total count of published quizzes
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(quizzes)
      .where(eq(quizzes.status, "published"));

    // Get published quizzes with pagination
    const quizzesList = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.status, "published"))
      .orderBy(desc(quizzes.publishedAt))
      .limit(limit)
      .offset(offset);

    // Get question count for each quiz
    const quizzesWithCount = await Promise.all(
      quizzesList.map(async (quiz) => {
        const [{ count: questionsCount }] = await db
          .select({ count: count() })
          .from(quizQuestions)
          .where(eq(quizQuestions.quizId, quiz.id));

        return {
          ...quiz,
          questionsCount: Number(questionsCount),
        };
      })
    );

    return {
      success: true,
      data: {
        quizzes: quizzesWithCount,
        pagination: {
          page,
          limit,
          total: Number(totalCount),
          totalPages: Math.ceil(Number(totalCount) / limit),
        },
      },
    };
  } catch (error) {
    console.error("Get quizzes error:", error);
    return {
      success: false,
      message: "Failed to fetch quizzes",
    };
  }
}

/**
 * Get a single quiz with questions and options for taking the quiz
 */
export async function getQuizAction(quizId: string) {
  try {
    // Get quiz
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.status, "published")))
      .limit(1);

    if (!quiz) {
      return {
        success: false,
        message: "Quiz not found",
      };
    }

    // Increment view count
    await db
      .update(quizzes)
      .set({ viewCount: sql`${quizzes.viewCount} + 1` })
      .where(eq(quizzes.id, quizId));

    // Get questions
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(quizQuestions.questionOrder);

    // Get options for each question
    const questionsWithOptions = await Promise.all(
      questions.map(async (question) => {
        const options = await db
          .select()
          .from(quizQuestionOptions)
          .where(eq(quizQuestionOptions.questionId, question.id))
          .orderBy(quizQuestionOptions.optionOrder);

        return {
          id: question.id,
          question: question.questionText,
          options: options.map((opt) => ({
            id: opt.id,
            text: opt.optionText,
            isCorrect: opt.isCorrect,
          })),
          correctAnswer: options.findIndex((opt) => opt.isCorrect),
        };
      })
    );

    return {
      success: true,
      data: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        category: quiz.category,
        difficulty: quiz.difficulty,
        estimatedTime: quiz.estimatedTime,
        featuredImage: quiz.featuredImage,
        publishedAt: quiz.publishedAt,
        createdAt: quiz.createdAt,
        questions: questionsWithOptions,
        questionsCount: questionsWithOptions.length,
      },
    };
  } catch (error) {
    console.error("Get quiz error:", error);
    return {
      success: false,
      message: "Failed to fetch quiz",
    };
  }
}

/**
 * Submit quiz attempt
 */
export async function submitQuizAttemptAction({
  quizId,
  score,
  totalQuestions,
}: {
  quizId: string;
  score: number;
  totalQuestions: number;
}) {
  try {
    const session = await auth();

    // Create attempt record
    await db.insert(quizAttempts).values({
      quizId,
      userId: session?.user?.id || null, // Nullable for guest attempts
      score,
      totalQuestions,
    });

    // Increment attempt count
    await db
      .update(quizzes)
      .set({ attemptCount: sql`${quizzes.attemptCount} + 1` })
      .where(eq(quizzes.id, quizId));

    return {
      success: true,
      message: "Quiz attempt submitted successfully",
    };
  } catch (error) {
    console.error("Submit quiz attempt error:", error);
    return {
      success: false,
      message: "Failed to submit quiz attempt",
    };
  }
}

/**
 * Get comments for a quiz
 */
export async function getQuizCommentsAction(quizId: string) {
  try {
    const comments = await db
      .select()
      .from(quizComments)
      .where(eq(quizComments.quizId, quizId))
      .orderBy(desc(quizComments.createdAt));

    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error("Get quiz comments error:", error);
    return {
      success: false,
      message: "Failed to fetch comments",
      data: [],
    };
  }
}

/**
 * Add a comment to a quiz
 */
export async function addQuizCommentAction({
  quizId,
  commentText,
  userName,
}: {
  quizId: string;
  commentText: string;
  userName?: string;
}) {
  try {
    const session = await auth();

    // Get user data if logged in
    let userAvatar = null;
    let finalUserName = userName || "Anonymous";

    if (session?.user?.id) {
      // Fetch user details from database
      const [user] = await db
        .select()
        .from(quizzes)
        .where(eq(quizzes.id, session.user.id))
        .limit(1);

      if (user) {
        userAvatar = session.user.image || null;
        finalUserName = session.user.name || "User";
      }
    }

    // Create comment
    const [newComment] = await db
      .insert(quizComments)
      .values({
        quizId,
        userId: session?.user?.id || null,
        userName: finalUserName,
        userAvatar,
        commentText,
      })
      .returning();

    revalidatePath(`/quiz/${quizId}`);

    return {
      success: true,
      message: "Comment added successfully",
      data: newComment,
    };
  } catch (error) {
    console.error("Add quiz comment error:", error);
    return {
      success: false,
      message: "Failed to add comment",
    };
  }
}

/**
 * Delete a quiz comment
 */
export async function deleteQuizCommentAction(commentId: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "Unauthorized. Please log in.",
      };
    }

    // Get comment to check ownership
    const [comment] = await db
      .select()
      .from(quizComments)
      .where(eq(quizComments.id, commentId))
      .limit(1);

    if (!comment) {
      return {
        success: false,
        message: "Comment not found",
      };
    }

    // Only allow user to delete their own comments
    if (comment.userId !== session.user.id) {
      return {
        success: false,
        message: "You can only delete your own comments",
      };
    }

    await db.delete(quizComments).where(eq(quizComments.id, commentId));

    revalidatePath(`/quiz/${comment.quizId}`);

    return {
      success: true,
      message: "Comment deleted successfully",
    };
  } catch (error) {
    console.error("Delete quiz comment error:", error);
    return {
      success: false,
      message: "Failed to delete comment",
    };
  }
}

/**
 * Get quizzes with filtering by category, difficulty, and search
 */
export async function getFilteredQuizzesAction({
  page = 1,
  limit = 6,
  category,
  difficulty,
  search,
  sortBy = "recent",
}: {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
  sortBy?: "recent" | "oldest" | "popular" | "difficulty" | "alphabetical";
}) {
  try {
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [eq(quizzes.status, "published")];

    if (category && category !== "All Categories") {
      conditions.push(eq(quizzes.category, category));
    }

    if (difficulty && difficulty !== "All Levels") {
      conditions.push(eq(quizzes.difficulty, difficulty as any));
    }

    if (search) {
      const searchCondition = or(
        like(quizzes.title, `%${search}%`),
        like(quizzes.description, `%${search}%`)
      );
      if (searchCondition) {
        conditions.push(searchCondition);
      }
    }

    // Get total count
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(quizzes)
      .where(whereClause);

    // Determine sort order
    let orderByClause;
    switch (sortBy) {
      case "oldest":
        orderByClause = quizzes.publishedAt;
        break;
      case "popular":
        orderByClause = desc(quizzes.attemptCount);
        break;
      case "difficulty":
        orderByClause = quizzes.difficulty;
        break;
      case "alphabetical":
        orderByClause = quizzes.title;
        break;
      case "recent":
      default:
        orderByClause = desc(quizzes.publishedAt);
        break;
    }

    // Get quizzes with pagination
    const quizzesList = await db
      .select()
      .from(quizzes)
      .where(whereClause)
      .orderBy(orderByClause)
      .limit(limit)
      .offset(offset);

    // Get question count for each quiz
    const quizzesWithCount = await Promise.all(
      quizzesList.map(async (quiz) => {
        const [{ count: questionsCount }] = await db
          .select({ count: count() })
          .from(quizQuestions)
          .where(eq(quizQuestions.quizId, quiz.id));

        return {
          ...quiz,
          questionsCount: Number(questionsCount),
        };
      })
    );

    return {
      success: true,
      data: {
        quizzes: quizzesWithCount,
        pagination: {
          page,
          limit,
          total: Number(totalCount),
          totalPages: Math.ceil(Number(totalCount) / limit),
        },
      },
    };
  } catch (error) {
    console.error("Get filtered quizzes error:", error);
    return {
      success: false,
      message: "Failed to fetch quizzes",
    };
  }
}

/**
 * Get all unique categories from published quizzes
 */
export async function getQuizCategoriesAction() {
  try {
    const categories = await db
      .selectDistinct({ category: quizzes.category })
      .from(quizzes)
      .where(eq(quizzes.status, "published"));

    return {
      success: true,
      data: categories.map((c) => c.category),
    };
  } catch (error) {
    console.error("Get quiz categories error:", error);
    return {
      success: false,
      message: "Failed to fetch categories",
      data: [],
    };
  }
}

/**
 * Get related quizzes (same category or random if none)
 */
export async function getRelatedQuizzesAction({
  currentQuizId,
  category,
  limit = 6,
}: {
  currentQuizId: string;
  category?: string;
  limit?: number;
}) {
  try {
    let relatedQuizzes: any[] = [];

    // First, try to get quizzes from the same category
    if (category) {
      relatedQuizzes = await db
        .select()
        .from(quizzes)
        .where(
          and(
            eq(quizzes.status, "published"),
            eq(quizzes.category, category),
            sql`${quizzes.id} != ${currentQuizId}`
          )
        )
        .orderBy(desc(quizzes.publishedAt))
        .limit(limit);
    }

    // If not enough quizzes in the same category, get random published quizzes
    if (relatedQuizzes.length < limit) {
      const remainingLimit = limit - relatedQuizzes.length;
      const additionalQuizzes = await db
        .select()
        .from(quizzes)
        .where(
          and(
            eq(quizzes.status, "published"),
            sql`${quizzes.id} != ${currentQuizId}`
          )
        )
        .orderBy(desc(quizzes.publishedAt))
        .limit(remainingLimit);

      relatedQuizzes = [...relatedQuizzes, ...additionalQuizzes];
    }

    return {
      success: true,
      data: relatedQuizzes.slice(0, limit),
    };
  } catch (error) {
    console.error("Get related quizzes error:", error);
    return {
      success: false,
      message: "Failed to fetch related quizzes",
      data: [],
    };
  }
}

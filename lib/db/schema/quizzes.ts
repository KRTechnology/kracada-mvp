import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { admins } from "./admins";
import { users } from "./users";

// Quiz status enum
export const quizStatusEnum = pgEnum("quiz_status", [
  "draft",
  "published",
  "archived",
]);

// Quiz difficulty enum
export const quizDifficultyEnum = pgEnum("quiz_difficulty", [
  "Beginner",
  "Intermediate",
  "Advanced",
]);

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 550 }).notNull().unique(),
  description: text("description").notNull(),
  category: varchar("category", { length: 255 }).notNull(),
  difficulty: quizDifficultyEnum("difficulty").notNull().default("Beginner"),
  featuredImage: varchar("featured_image", { length: 500 }), // URL to featured image
  featuredImageKey: varchar("featured_image_key", { length: 500 }), // Cloudflare R2 key for deletion
  estimatedTime: varchar("estimated_time", { length: 50 }).notNull(), // e.g., "5 min"
  status: quizStatusEnum("status").default("draft").notNull(),
  adminId: varchar("admin_id", { length: 128 })
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),
  attemptCount: integer("attempt_count").default(0).notNull(),
  viewCount: integer("view_count").default(0).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quiz questions table
export const quizQuestions = pgTable("quiz_questions", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quizId: varchar("quiz_id", { length: 128 })
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  questionText: text("question_text").notNull(),
  questionOrder: integer("question_order").notNull(), // Order of questions in the quiz
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Quiz question options table
export const quizQuestionOptions = pgTable("quiz_question_options", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  questionId: varchar("question_id", { length: 128 })
    .notNull()
    .references(() => quizQuestions.id, { onDelete: "cascade" }),
  optionText: text("option_text").notNull(),
  optionOrder: integer("option_order").notNull(), // Order of options (0-3)
  isCorrect: boolean("is_correct").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quiz attempts table (for tracking user quiz attempts)
export const quizAttempts = pgTable("quiz_attempts", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quizId: varchar("quiz_id", { length: 128 })
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 128 }).references(() => users.id, {
    onDelete: "set null",
  }), // Nullable for guest attempts
  score: integer("score").notNull(),
  totalQuestions: integer("total_questions").notNull(),
  completedAt: timestamp("completed_at").defaultNow().notNull(),
});

// Quiz comments table
export const quizComments = pgTable("quiz_comments", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  quizId: varchar("quiz_id", { length: 128 })
    .notNull()
    .references(() => quizzes.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 128 }).references(() => users.id, {
    onDelete: "set null",
  }), // Nullable for guest comments
  userName: varchar("user_name", { length: 255 }), // For non-logged-in users or to cache user name
  userAvatar: varchar("user_avatar", { length: 500 }), // Cache user avatar URL
  commentText: text("comment_text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Quiz = typeof quizzes.$inferSelect;
export type NewQuiz = typeof quizzes.$inferInsert;
export type QuizQuestion = typeof quizQuestions.$inferSelect;
export type NewQuizQuestion = typeof quizQuestions.$inferInsert;
export type QuizQuestionOption = typeof quizQuestionOptions.$inferSelect;
export type NewQuizQuestionOption = typeof quizQuestionOptions.$inferInsert;
export type QuizAttempt = typeof quizAttempts.$inferSelect;
export type NewQuizAttempt = typeof quizAttempts.$inferInsert;
export type QuizComment = typeof quizComments.$inferSelect;
export type NewQuizComment = typeof quizComments.$inferInsert;

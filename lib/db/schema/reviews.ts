import { createId } from "@paralleldrive/cuid2";
import {
  pgEnum,
  pgTable,
  varchar,
  text,
  integer,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users } from "./index";

// Define review content type enum
export const reviewContentTypeEnum = pgEnum("review_content_type", [
  "hotel",
  "restaurant",
]);

// Reviews/Comments table
export const reviews = pgTable("reviews", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // User who made the review
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Content being reviewed
  contentType: reviewContentTypeEnum("content_type").notNull(),
  contentId: varchar("content_id", { length: 128 }).notNull(),

  // Review details
  rating: integer("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),

  // Likes count (denormalized for performance)
  likesCount: integer("likes_count").default(0).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Review likes table (many-to-many: users like reviews)
export const reviewLikes = pgTable(
  "review_likes",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),

    // User who liked the review
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Review being liked
    reviewId: varchar("review_id", { length: 128 })
      .notNull()
      .references(() => reviews.id, { onDelete: "cascade" }),

    // Timestamp
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    // Ensure unique like per user per review
    userReviewUnique: unique().on(table.userId, table.reviewId),
  })
);

// Types
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;
export type ReviewLike = typeof reviewLikes.$inferSelect;
export type NewReviewLike = typeof reviewLikes.$inferInsert;
export type ReviewContentType = "hotel" | "restaurant";

// Extended review types for frontend use
export interface ReviewWithUser extends Review {
  user: {
    id: string;
    fullName: string;
    profilePicture?: string | null;
    emailVerified: boolean;
  };
  isLikedByCurrentUser?: boolean;
}

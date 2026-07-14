import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Post status enum
export const articleStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "flagged",
  "archived",
]);

// Entertainment posts table
export const entertainmentPosts = pgTable("entertainment_posts", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 550 }).notNull().unique(),
  description: text("description"), // Short description/excerpt for listing pages
  content: text("content").notNull(), // Rich text content from Tiptap (stored as HTML or JSON)
  featuredImage: varchar("featured_image", { length: 500 }), // URL to featured image
  featuredImageKey: varchar("featured_image_key", { length: 500 }), // Cloudflare R2 key for deletion
  categories: text("categories"), // JSON array of category strings
  status: articleStatusEnum("status").default("published").notNull(),
  authorId: varchar("author_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  viewCount: integer("view_count").default(0).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  publishedAt: timestamp("published_at"), // When it was first published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Entertainment post likes table (for tracking who liked what)
export const entertainmentPostLikes = pgTable("entertainment_post_likes", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  postId: varchar("post_id", { length: 128 })
    .notNull()
    .references(() => entertainmentPosts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Entertainment post comments table
export const entertainmentComments = pgTable("entertainment_comments", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  postId: varchar("post_id", { length: 128 })
    .notNull()
    .references(() => entertainmentPosts.id, { onDelete: "cascade" }),
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
export type EntertainmentPost = typeof entertainmentPosts.$inferSelect;
export type NewEntertainmentPost = typeof entertainmentPosts.$inferInsert;
export type EntertainmentPostLike = typeof entertainmentPostLikes.$inferSelect;
export type NewEntertainmentPostLike =
  typeof entertainmentPostLikes.$inferInsert;
export type EntertainmentComment = typeof entertainmentComments.$inferSelect;
export type NewEntertainmentComment = typeof entertainmentComments.$inferInsert;

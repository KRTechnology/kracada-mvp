import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { admins } from "./admins";
import { users } from "./users";

// News post status enum
export const newsStatusEnum = pgEnum("news_status", [
  "draft",
  "published",
  "archived",
]);

// News posts table
export const newsPosts = pgTable("news_posts", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  title: varchar("title", { length: 500 }).notNull(),
  slug: varchar("slug", { length: 550 }).notNull().unique(),
  description: text("description"), // Short description/excerpt for listing pages
  content: text("content").notNull(), // Rich text content from Tiptap (stored as HTML)
  featuredImage: varchar("featured_image", { length: 500 }), // URL to featured image
  featuredImageKey: varchar("featured_image_key", { length: 500 }), // Cloudflare R2 key for deletion
  categories: text("categories"), // JSON array of category strings
  status: newsStatusEnum("status").default("published").notNull(),
  authorId: varchar("author_id", { length: 128 })
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }), // Admin who created the post
  viewCount: integer("view_count").default(0).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  commentCount: integer("comment_count").default(0).notNull(),
  publishedAt: timestamp("published_at"), // When it was first published
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// News post likes table (for tracking who liked what)
export const newsPostLikes = pgTable("news_post_likes", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  postId: varchar("post_id", { length: 128 })
    .notNull()
    .references(() => newsPosts.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// News post comments table
export const newsComments = pgTable("news_comments", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  postId: varchar("post_id", { length: 128 })
    .notNull()
    .references(() => newsPosts.id, { onDelete: "cascade" }),
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
export type NewsPost = typeof newsPosts.$inferSelect;
export type NewNewsPost = typeof newsPosts.$inferInsert;
export type NewsPostLike = typeof newsPostLikes.$inferSelect;
export type NewNewsPostLike = typeof newsPostLikes.$inferInsert;
export type NewsComment = typeof newsComments.$inferSelect;
export type NewNewsComment = typeof newsComments.$inferInsert;

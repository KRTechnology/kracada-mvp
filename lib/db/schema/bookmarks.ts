import { createId } from "@paralleldrive/cuid2";
import {
  pgEnum,
  pgTable,
  varchar,
  timestamp,
  unique,
} from "drizzle-orm/pg-core";
import { users, jobs } from "./index";

// Define bookmark content type enum
export const bookmarkContentTypeEnum = pgEnum("bookmark_content_type", [
  "job",
  "article",
  "video",
  "hotel",
  "restaurant",
]);

// Bookmarks table - polymorphic bookmarks for different content types
export const bookmarks = pgTable(
  "bookmarks",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),

    // User who bookmarked the content
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Content type and reference
    contentType: bookmarkContentTypeEnum("content_type").notNull(),
    contentId: varchar("content_id", { length: 128 }).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Ensure unique bookmark per user per content item
    userContentUnique: unique().on(
      table.userId,
      table.contentType,
      table.contentId
    ),
  })
);

// Types
export type Bookmark = typeof bookmarks.$inferSelect;
export type NewBookmark = typeof bookmarks.$inferInsert;
export type BookmarkContentType =
  | "job"
  | "article"
  | "video"
  | "hotel"
  | "restaurant";

// Extended bookmark types for frontend use
export interface BookmarkWithContent extends Bookmark {
  content?: {
    id: string;
    title: string;
    description?: string;
    companyName?: string; // for jobs
    companyLogo?: string; // for jobs
    location?: string; // for jobs
    skills?: string[]; // for jobs
    // Add more fields as needed for other content types
  };
}

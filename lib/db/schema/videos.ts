import { createId } from "@paralleldrive/cuid2";
import {
  pgEnum,
  pgTable,
  varchar,
  text,
  timestamp,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { admins } from "./admins";

// Define video type enum
export const videoTypeEnum = pgEnum("video_type", ["kracada_tv", "trending"]);

// Define video status enum
export const videoStatusEnum = pgEnum("video_status", [
  "draft",
  "published",
  "hidden",
]);

// Videos table
export const videos = pgTable("videos", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // Basic Info
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  videoUrl: varchar("video_url", { length: 1000 }).notNull(),
  thumbnailImage: varchar("thumbnail_image", { length: 1000 }).notNull(),
  duration: varchar("duration", { length: 20 }).notNull(), // e.g., "12:34"

  // Classification
  type: videoTypeEnum("type").notNull(), // kracada_tv or trending
  categories: text("categories").notNull(), // JSON array of category strings
  author: varchar("author", { length: 255 }).notNull(), // Display name (e.g., "Demi Wilkinson")

  // Status
  status: videoStatusEnum("status").notNull().default("draft"),

  // Metrics
  viewCount: integer("view_count").notNull().default(0),
  likeCount: integer("like_count").notNull().default(0),

  // Admin Reference
  createdBy: varchar("created_by", { length: 128 })
    .notNull()
    .references(() => admins.id, { onDelete: "cascade" }),

  // Timestamps
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Video = typeof videos.$inferSelect;
export type NewVideo = typeof videos.$inferInsert;

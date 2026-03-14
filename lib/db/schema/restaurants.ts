import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  varchar,
  decimal,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Restaurants table
export const restaurants = pgTable("restaurants", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // Owner information
  ownerId: varchar("owner_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Basic information
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  fullDescription: text("full_description").notNull(),

  // Location
  location: varchar("location", { length: 255 }).notNull(),
  address: text("address"),

  // Pricing and cuisine
  priceRange: varchar("price_range", { length: 10 }).notNull(), // $, $$, $$$, $$$$
  cuisine: varchar("cuisine", { length: 100 }).notNull(), // e.g., "Nigerian", "Italian"

  // Category
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Fine Dining", "Casual Dining"

  // Operating hours
  openingHours: varchar("opening_hours", { length: 100 }).notNull(),

  // Images (stored as JSON array of URLs)
  images: jsonb("images").$type<string[]>().notNull().default([]),
  featuredImage: varchar("featured_image", { length: 500 }),

  // Contact information (stored as JSON object)
  contact: jsonb("contact")
    .$type<{
      phone: string;
      email: string;
      website: string;
    }>()
    .notNull(),

  // Features and specialties (stored as JSON arrays)
  features: jsonb("features").$type<string[]>().notNull().default([]),
  specialties: jsonb("specialties").$type<string[]>().notNull().default([]),
  ambiance: jsonb("ambiance").$type<string[]>().notNull().default([]),

  // Menu highlights (stored as JSON array)
  menuHighlights: jsonb("menu_highlights")
    .$type<
      Array<{
        category: string;
        items: Array<{
          name: string;
          description: string;
          price: string;
        }>;
      }>
    >()
    .notNull()
    .default([]),

  // Policies (stored as JSON object)
  policies: jsonb("policies")
    .$type<{
      reservations: string;
      dressCode: string;
      minimumAge: string;
      cancellation: string;
      payment: string;
    }>()
    .notNull(),

  // Rating and reviews (can be calculated from reviews later)
  rating: decimal("rating", { precision: 3, scale: 2 }).default("0.00"),
  reviewCount: integer("review_count").default(0).notNull(),

  // Status
  isPublished: boolean("is_published").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;

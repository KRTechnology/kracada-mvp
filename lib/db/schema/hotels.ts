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

// Hotels table
export const hotels = pgTable("hotels", {
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

  // Pricing
  pricePerNight: integer("price_per_night").notNull(),
  currency: varchar("currency", { length: 10 }).default("₦").notNull(),

  // Category and classification
  category: varchar("category", { length: 100 }).notNull(), // e.g., "Luxury Hotel", "Business Hotel"

  // Images (stored as JSON array of URLs)
  images: jsonb("images").$type<string[]>().notNull().default([]),
  featuredImage: varchar("featured_image", { length: 500 }),

  // Amenities and features (stored as JSON arrays)
  amenities: jsonb("amenities").$type<string[]>().notNull().default([]),
  features: jsonb("features").$type<string[]>().notNull().default([]),

  // Policies (stored as JSON object)
  policies: jsonb("policies")
    .$type<{
      checkIn: string;
      checkOut: string;
      cancellation: string;
      pets: string;
      smoking: string;
    }>()
    .notNull(),

  // Contact information (stored as JSON object)
  contact: jsonb("contact")
    .$type<{
      phone: string;
      email: string;
      website: string;
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
export type Hotel = typeof hotels.$inferSelect;
export type NewHotel = typeof hotels.$inferInsert;

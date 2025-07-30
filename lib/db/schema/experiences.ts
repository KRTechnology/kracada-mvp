import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  text,
  pgEnum,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Define employment type enum
export const employmentTypeEnum = pgEnum("employment_type", [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
  "Temporary",
]);

// Experiences table
export const experiences = pgTable("experiences", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Job details
  jobTitle: varchar("job_title", { length: 255 }).notNull(),
  employmentType: employmentTypeEnum("employment_type").notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  currentlyWorking: boolean("currently_working").default(false).notNull(),

  // Dates
  startMonth: varchar("start_month", { length: 20 }),
  startYear: varchar("start_year", { length: 4 }),
  endMonth: varchar("end_month", { length: 20 }),
  endYear: varchar("end_year", { length: 4 }),

  // Description
  description: text("description"),

  // Skills for this experience (stored as JSON array)
  skills: text("skills"), // JSON array of strings

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type Experience = typeof experiences.$inferSelect;
export type NewExperience = typeof experiences.$inferInsert;

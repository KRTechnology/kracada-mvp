import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  pgEnum,
  pgTable,
  serial,
  timestamp,
  varchar,
  text,
  integer,
} from "drizzle-orm/pg-core";

// Define account type enum
export const accountTypeEnum = pgEnum("account_type", [
  "Job Seeker",
  "Employer",
  "Business Owner",
  "Contributor",
]);

// Users table
export const users = pgTable("users", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  accountType: accountTypeEnum("account_type").notNull(),

  // Profile fields
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  phone: varchar("phone", { length: 50 }),
  location: varchar("location", { length: 255 }),
  bio: text("bio"),
  website: varchar("website", { length: 255 }),
  portfolio: varchar("portfolio", { length: 255 }),
  yearsOfExperience: integer("years_of_experience"),

  // Skills and preferences (stored as JSON arrays)
  skills: text("skills"), // JSON array of strings
  jobPreferences: text("job_preferences"), // JSON array of strings

  // File uploads
  profilePicture: varchar("profile_picture", { length: 500 }),
  cv: varchar("cv", { length: 500 }),

  // Profile completion flag
  hasCompletedProfile: boolean("has_completed_profile")
    .default(false)
    .notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  termsAccepted: boolean("terms_accepted").default(false).notNull(),
});

// Password reset tokens table
export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Email verification tokens table
export const emailVerificationTokens = pgTable("email_verification_tokens", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type NewPasswordResetToken = typeof passwordResetTokens.$inferInsert;
export type EmailVerificationToken =
  typeof emailVerificationTokens.$inferSelect;
export type NewEmailVerificationToken =
  typeof emailVerificationTokens.$inferInsert;

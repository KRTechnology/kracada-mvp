import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

// Define admin role enum
export const adminRoleEnum = pgEnum("admin_role", ["Super Admin", "Admin"]);

// Admins table
export const admins = pgTable("admins", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  role: adminRoleEnum("role").notNull().default("Admin"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastLoginAt: timestamp("last_login_at"),
});

// Types
export type Admin = typeof admins.$inferSelect;
export type NewAdmin = typeof admins.$inferInsert;

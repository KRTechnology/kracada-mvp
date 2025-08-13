import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  varchar,
  timestamp,
  text,
  boolean,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

export const userSessions = pgTable(
  "user_sessions",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Session identifiers
    sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
    refreshToken: varchar("refresh_token", { length: 255 }),

    // Device information (what we can reliably get)
    userAgent: text("user_agent"), // Browser/OS info
    ipAddress: varchar("ip_address", { length: 45 }), // IPv4/IPv6

    // Session metadata
    isActive: boolean("is_active").default(true).notNull(),
    lastActive: timestamp("last_active").defaultNow().notNull(),
    expiresAt: timestamp("expires_at").notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint to ensure one active session per user per device
    userActiveSessionUnique: uniqueIndex("user_active_session_unique_idx").on(
      table.userId,
      table.userAgent
    ),
  })
);

// Types
export type UserSession = typeof userSessions.$inferSelect;
export type NewUserSession = typeof userSessions.$inferInsert;

// Helper interface for frontend display
export interface SessionDisplayData {
  id: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrentSession: boolean;
  userAgent: string;
}

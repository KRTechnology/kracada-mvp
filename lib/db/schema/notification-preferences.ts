import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  pgEnum,
  pgTable,
  varchar,
  timestamp,
  text,
  integer,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Define notification category enum
export const notificationCategoryEnum = pgEnum("notification_category", [
  "alerts",
  "jobs",
  "articles",
  "news",
]);

// Define notification type enum
export const notificationTypeEnum = pgEnum("notification_type", [
  "none",
  "in_app",
  "email",
]);

// Define notification event enum for specific events within each category
export const notificationEventEnum = pgEnum("notification_event", [
  // Alerts category
  "password_change",
  "new_browser_signin",
  "new_device_linked",

  // Jobs category
  "new_job_post",
  "job_application_status",

  // Articles category
  "new_topics",
  "new_comment_on_article",
  "likes_on_article",

  // News category
  "news_updates",
]);

// Main notification preferences table
export const userNotificationPreferences = pgTable(
  "user_notification_preferences",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),

    // User reference
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Notification category
    category: notificationCategoryEnum("category").notNull(),

    // Specific notification event
    event: notificationEventEnum("event").notNull(),

    // Notification type preferences
    noneEnabled: boolean("none_enabled").default(false).notNull(),
    inAppEnabled: boolean("in_app_enabled").default(false).notNull(),
    emailEnabled: boolean("email_enabled").default(false).notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint to ensure one preference per user per event
    userEventUnique: uniqueIndex("user_event_unique_idx").on(
      table.userId,
      table.event
    ),
  })
);

// Notification preference overrides table for user-specific customizations
export const userNotificationOverrides = pgTable(
  "user_notification_overrides",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),

    // User reference
    userId: varchar("user_id", { length: 128 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    // Category and event
    category: notificationCategoryEnum("category").notNull(),
    event: notificationEventEnum("event").notNull(),

    // Override settings
    noneEnabled: boolean("none_enabled"),
    inAppEnabled: boolean("in_app_enabled"),
    emailEnabled: boolean("email_enabled"),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint to ensure one override per user per event
    userEventOverrideUnique: uniqueIndex("user_event_override_unique_idx").on(
      table.userId,
      table.event
    ),
  })
);

// Default notification preferences template table
// This stores the default preferences that new users inherit
export const defaultNotificationPreferences = pgTable(
  "default_notification_preferences",
  {
    id: varchar("id", { length: 128 })
      .primaryKey()
      .$defaultFn(() => createId()),

    // Category and event
    category: notificationCategoryEnum("category").notNull(),
    event: notificationEventEnum("event").notNull(),

    // Default notification type preferences
    noneEnabled: boolean("none_enabled").default(false).notNull(),
    inAppEnabled: boolean("in_app_enabled").default(false).notNull(),
    emailEnabled: boolean("email_enabled").default(false).notNull(),

    // Description for UI display
    eventDescription: text("event_description").notNull(),

    // Category description
    categoryDescription: text("category_description").notNull(),

    // Order for UI display
    displayOrder: integer("display_order").notNull(),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    // Unique constraint to ensure one default preference per event
    eventUnique: uniqueIndex("event_unique_idx").on(table.event),
  })
);

// Types
export type UserNotificationPreference =
  typeof userNotificationPreferences.$inferSelect;
export type NewUserNotificationPreference =
  typeof userNotificationPreferences.$inferInsert;
export type UserNotificationOverride =
  typeof userNotificationOverrides.$inferSelect;
export type NewUserNotificationOverride =
  typeof userNotificationOverrides.$inferInsert;
export type DefaultNotificationPreference =
  typeof defaultNotificationPreferences.$inferSelect;
export type NewDefaultNotificationPreference =
  typeof defaultNotificationPreferences.$inferInsert;

// Helper type for notification settings
export interface NotificationSetting {
  id: string;
  category: string;
  event: string;
  noneEnabled: boolean;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  eventDescription: string;
  categoryDescription: string;
  displayOrder: number;
}

// Helper type for grouped notification preferences
export interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  settings: NotificationSetting[];
}

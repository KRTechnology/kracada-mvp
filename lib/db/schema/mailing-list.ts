import { createId } from "@paralleldrive/cuid2";
import {
  pgTable,
  varchar,
  timestamp,
  boolean,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Subscription Status Enum
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "active",
  "unsubscribed",
  "bounced",
]);

// Subscription Source Enum
export const subscriptionSourceEnum = pgEnum("subscription_source", [
  "news_page",
  "homepage",
  "footer",
  "popup",
  "other",
]);

// Mailing List Subscribers Table
export const mailingListSubscribers = pgTable("mailing_list_subscribers", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  email: varchar("email", { length: 255 }).notNull().unique(),
  status: subscriptionStatusEnum("status").default("active").notNull(),
  source: subscriptionSourceEnum("source").default("other").notNull(),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribed_at"),
  lastEmailSentAt: timestamp("last_email_sent_at"),
  emailsSentCount: varchar("emails_sent_count", { length: 50 }).default("0"),
  isVerified: boolean("is_verified").default(false).notNull(),
  verificationToken: varchar("verification_token", { length: 128 }),
  ipAddress: varchar("ip_address", { length: 45 }), // IPv4 or IPv6
  userAgent: varchar("user_agent", { length: 500 }),
  tags: varchar("tags", { length: 500 }), // JSON string array of tags
  metadata: varchar("metadata", { length: 1000 }), // JSON string for additional data
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Email Campaigns Table (optional for future use)
export const emailCampaigns = pgTable("email_campaigns", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  name: varchar("name", { length: 255 }).notNull(),
  subject: varchar("subject", { length: 500 }).notNull(),
  content: varchar("content", { length: 10000 }).notNull(),
  sentCount: varchar("sent_count", { length: 50 }).default("0"),
  openedCount: varchar("opened_count", { length: 50 }).default("0"),
  clickedCount: varchar("clicked_count", { length: 50 }).default("0"),
  scheduledAt: timestamp("scheduled_at"),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Relations
export const mailingListSubscribersRelations = relations(
  mailingListSubscribers,
  ({ many }) => ({
    // Future: campaigns sent to this subscriber
  })
);

// Types
export type MailingListSubscriber = typeof mailingListSubscribers.$inferSelect;
export type NewMailingListSubscriber =
  typeof mailingListSubscribers.$inferInsert;
export type EmailCampaign = typeof emailCampaigns.$inferSelect;
export type NewEmailCampaign = typeof emailCampaigns.$inferInsert;

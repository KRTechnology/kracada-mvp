import { createId } from "@paralleldrive/cuid2";
import { pgTable, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { users } from "./users";

// CVs table
export const cvs = pgTable("cvs", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),

  // Relationship to user
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // CV identification and metadata
  name: varchar("name", { length: 255 }).notNull(), // User-defined name for the CV
  fileUrl: varchar("file_url", { length: 500 }).notNull(), // Cloudflare storage URL

  // Default CV flag - only one CV per user can be default
  isDefault: boolean("is_default").default(false).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type CV = typeof cvs.$inferSelect;
export type NewCV = typeof cvs.$inferInsert;

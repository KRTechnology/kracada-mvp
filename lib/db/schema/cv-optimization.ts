import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  decimal,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Define package type enum
export const packageTypeEnum = pgEnum("package_type", [
  "deluxe",
  "supreme",
  "premium",
]);

// Define payment status enum
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "successful",
  "failed",
  "refunded",
]);

// Define order status enum
export const orderStatusEnum = pgEnum("order_status", [
  "pending_payment",
  "payment_verified",
  "cv_uploaded",
  "in_progress",
  "completed",
  "cancelled",
]);

// CV Optimization Orders table
export const cvOptimizationOrders = pgTable("cv_optimization_orders", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Package details
  packageType: packageTypeEnum("package_type").notNull(),
  packageName: varchar("package_name", { length: 255 }).notNull(),
  packagePrice: decimal("package_price", { precision: 10, scale: 2 }).notNull(),
  packageDescription: text("package_description"),

  // Payment details
  paymentReference: varchar("payment_reference", { length: 255 }).unique(),
  paystackTransactionId: varchar("paystack_transaction_id", { length: 255 }),
  paymentStatus: paymentStatusEnum("payment_status")
    .default("pending")
    .notNull(),
  paymentAmount: decimal("payment_amount", { precision: 10, scale: 2 }),
  paymentCurrency: varchar("payment_currency", { length: 10 }).default("NGN"),

  // Order details
  orderStatus: orderStatusEnum("order_status")
    .default("pending_payment")
    .notNull(),
  cvFileUrl: varchar("cv_file_url", { length: 500 }),
  cvFileKey: varchar("cv_file_key", { length: 500 }),
  optimizedCvUrl: varchar("optimized_cv_url", { length: 500 }),

  // Additional services (for premium package)
  includesCoverLetter: boolean("includes_cover_letter").default(false),
  includesLinkedInProfile: boolean("includes_linkedin_profile").default(false),
  includesInterviewPrep: boolean("includes_interview_prep").default(false),

  // Revision tracking
  maxRevisions: integer("max_revisions").default(2),
  revisionsUsed: integer("revisions_used").default(0),

  // Delivery details
  estimatedDeliveryDays: integer("estimated_delivery_days"),
  deliveredAt: timestamp("delivered_at"),

  // Notes and feedback
  customerNotes: text("customer_notes"),
  adminNotes: text("admin_notes"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Payment transactions table for detailed tracking
export const cvPaymentTransactions = pgTable("cv_payment_transactions", {
  id: varchar("id", { length: 128 })
    .primaryKey()
    .$defaultFn(() => createId()),
  orderId: varchar("order_id", { length: 128 })
    .notNull()
    .references(() => cvOptimizationOrders.id, { onDelete: "cascade" }),
  userId: varchar("user_id", { length: 128 })
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Paystack transaction details
  paystackReference: varchar("paystack_reference", { length: 255 })
    .unique()
    .notNull(),
  paystackTransactionId: varchar("paystack_transaction_id", { length: 255 }),
  paystackStatus: varchar("paystack_status", { length: 50 }),

  // Payment details
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 10 }).default("NGN"),

  // Customer details
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),

  // Transaction metadata
  channel: varchar("channel", { length: 50 }), // card, bank, ussd, etc.
  gatewayResponse: text("gateway_response"),
  paymentMethod: varchar("payment_method", { length: 100 }),

  // Raw webhook data
  webhookData: text("webhook_data"), // JSON string of the full webhook payload

  // Verification details
  verifiedAt: timestamp("verified_at"),
  verificationStatus: varchar("verification_status", { length: 50 }),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Types
export type CVOptimizationOrder = typeof cvOptimizationOrders.$inferSelect;
export type NewCVOptimizationOrder = typeof cvOptimizationOrders.$inferInsert;
export type CVPaymentTransaction = typeof cvPaymentTransactions.$inferSelect;
export type NewCVPaymentTransaction = typeof cvPaymentTransactions.$inferInsert;

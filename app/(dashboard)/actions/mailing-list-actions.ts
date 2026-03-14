"use server";

import { db } from "@/lib/db/drizzle";
import {
  mailingListSubscribers,
  NewMailingListSubscriber,
} from "@/lib/db/schema/mailing-list";
import { eq, desc, sql, and, or, like, count } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import crypto from "crypto";

// Validation Schemas
const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  source: z
    .enum([
      "news_page",
      "lifestyle_page",
      "homepage",
      "footer",
      "popup",
      "other",
    ])
    .default("other"),
  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

const updateSubscriberSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["active", "unsubscribed", "bounced"]).optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.any()).optional(),
});

const bulkActionSchema = z.object({
  subscriberIds: z.array(z.string()).min(1, "Select at least one subscriber"),
  action: z.enum(["delete", "unsubscribe", "resubscribe"]),
});

/**
 * Subscribe a new email to the mailing list
 */
export async function subscribeToMailingListAction(
  data: z.infer<typeof subscribeSchema>
) {
  const validation = subscribeSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: "Invalid email address",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const { email, source, ipAddress, userAgent } = validation.data;

    // Check if email already exists
    const [existingSubscriber] = await db
      .select()
      .from(mailingListSubscribers)
      .where(eq(mailingListSubscribers.email, email))
      .limit(1);

    if (existingSubscriber) {
      // If already subscribed and active
      if (existingSubscriber.status === "active") {
        return {
          success: true,
          message: "You're already subscribed!",
          alreadySubscribed: true,
        };
      }

      // If previously unsubscribed, resubscribe
      await db
        .update(mailingListSubscribers)
        .set({
          status: "active",
          subscribedAt: new Date(),
          unsubscribedAt: null,
          source,
          updatedAt: new Date(),
        })
        .where(eq(mailingListSubscribers.id, existingSubscriber.id));

      return {
        success: true,
        message: "Welcome back! You've been resubscribed.",
      };
    }

    // Create new subscriber
    const verificationToken = crypto.randomBytes(32).toString("hex");

    await db.insert(mailingListSubscribers).values({
      email,
      source,
      status: "active",
      isVerified: false,
      verificationToken,
      ipAddress: ipAddress || null,
      userAgent: userAgent || null,
      emailsSentCount: "0",
    });

    revalidatePath("/admin/dashboard/mailing-list");

    return {
      success: true,
      message: "Thank you for subscribing! Check your email to confirm.",
    };
  } catch (error) {
    console.error("Subscribe error:", error);
    return {
      success: false,
      message: "Failed to subscribe. Please try again later.",
    };
  }
}

/**
 * Get all subscribers with pagination and filters (Admin only)
 */
export async function getMailingListSubscribersAction({
  page = 1,
  limit = 10,
  search,
  status,
  source,
}: {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "unsubscribed" | "bounced";
  source?: "news_page" | "homepage" | "footer" | "popup" | "other";
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (status) {
      conditions.push(eq(mailingListSubscribers.status, status));
    }

    if (source) {
      conditions.push(eq(mailingListSubscribers.source, source));
    }

    if (search) {
      conditions.push(like(mailingListSubscribers.email, `%${search}%`));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ count: totalCount }] = await db
      .select({ count: count() })
      .from(mailingListSubscribers)
      .where(whereClause);

    // Get subscribers with pagination
    const subscribers = await db
      .select()
      .from(mailingListSubscribers)
      .where(whereClause)
      .orderBy(desc(mailingListSubscribers.subscribedAt))
      .limit(limit)
      .offset(offset);

    return {
      success: true,
      data: {
        subscribers,
        pagination: {
          page,
          limit,
          total: Number(totalCount),
          totalPages: Math.ceil(Number(totalCount) / limit),
        },
      },
    };
  } catch (error) {
    console.error("Get subscribers error:", error);
    return {
      success: false,
      message: "Failed to fetch subscribers",
    };
  }
}

/**
 * Get mailing list statistics (Admin only)
 */
export async function getMailingListStatsAction() {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const [stats] = await db
      .select({
        total: count(),
        active: sql<number>`count(*) filter (where ${mailingListSubscribers.status} = 'active')`,
        unsubscribed: sql<number>`count(*) filter (where ${mailingListSubscribers.status} = 'unsubscribed')`,
        bounced: sql<number>`count(*) filter (where ${mailingListSubscribers.status} = 'bounced')`,
        verified: sql<number>`count(*) filter (where ${mailingListSubscribers.isVerified} = true)`,
        unverified: sql<number>`count(*) filter (where ${mailingListSubscribers.isVerified} = false)`,
      })
      .from(mailingListSubscribers);

    // Get subscribers by source
    const sourceStats = await db
      .select({
        source: mailingListSubscribers.source,
        count: count(),
      })
      .from(mailingListSubscribers)
      .groupBy(mailingListSubscribers.source);

    // Get recent subscribers (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [recentStats] = await db
      .select({
        last7Days: sql<number>`count(*) filter (where ${mailingListSubscribers.subscribedAt} >= NOW() - INTERVAL '7 days')`,
        last30Days: sql<number>`count(*) filter (where ${mailingListSubscribers.subscribedAt} >= NOW() - INTERVAL '30 days')`,
      })
      .from(mailingListSubscribers);

    return {
      success: true,
      data: {
        ...stats,
        sourceStats,
        recentStats,
      },
    };
  } catch (error) {
    console.error("Get stats error:", error);
    return {
      success: false,
      message: "Failed to fetch statistics",
    };
  }
}

/**
 * Update a subscriber (Admin only)
 */
export async function updateSubscriberAction(
  data: z.infer<typeof updateSubscriberSchema>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const validation = updateSubscriberSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const { id, status, tags, metadata } = validation.data;

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (status) {
      updateData.status = status;
      if (status === "unsubscribed") {
        updateData.unsubscribedAt = new Date();
      }
    }

    if (tags) {
      updateData.tags = JSON.stringify(tags);
    }

    if (metadata) {
      updateData.metadata = JSON.stringify(metadata);
    }

    await db
      .update(mailingListSubscribers)
      .set(updateData)
      .where(eq(mailingListSubscribers.id, id));

    revalidatePath("/admin/dashboard/mailing-list");

    return {
      success: true,
      message: "Subscriber updated successfully",
    };
  } catch (error) {
    console.error("Update subscriber error:", error);
    return {
      success: false,
      message: "Failed to update subscriber",
    };
  }
}

/**
 * Delete a subscriber (Admin only)
 */
export async function deleteSubscriberAction(subscriberId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    await db
      .delete(mailingListSubscribers)
      .where(eq(mailingListSubscribers.id, subscriberId));

    revalidatePath("/admin/dashboard/mailing-list");

    return {
      success: true,
      message: "Subscriber deleted successfully",
    };
  } catch (error) {
    console.error("Delete subscriber error:", error);
    return {
      success: false,
      message: "Failed to delete subscriber",
    };
  }
}

/**
 * Bulk actions on subscribers (Admin only)
 */
export async function bulkSubscriberActionAction(
  data: z.infer<typeof bulkActionSchema>
) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  const validation = bulkActionSchema.safeParse(data);
  if (!validation.success) {
    return {
      success: false,
      message: "Invalid data",
      errors: validation.error.flatten().fieldErrors,
    };
  }

  try {
    const { subscriberIds, action } = validation.data;

    if (action === "delete") {
      await db
        .delete(mailingListSubscribers)
        .where(
          sql`${mailingListSubscribers.id} = ANY(${subscriberIds}::varchar[])`
        );
    } else if (action === "unsubscribe") {
      await db
        .update(mailingListSubscribers)
        .set({
          status: "unsubscribed",
          unsubscribedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(
          sql`${mailingListSubscribers.id} = ANY(${subscriberIds}::varchar[])`
        );
    } else if (action === "resubscribe") {
      await db
        .update(mailingListSubscribers)
        .set({
          status: "active",
          unsubscribedAt: null,
          updatedAt: new Date(),
        })
        .where(
          sql`${mailingListSubscribers.id} = ANY(${subscriberIds}::varchar[])`
        );
    }

    revalidatePath("/admin/dashboard/mailing-list");

    return {
      success: true,
      message: `Successfully ${action === "delete" ? "deleted" : action === "unsubscribe" ? "unsubscribed" : "resubscribed"} ${subscriberIds.length} subscriber(s)`,
    };
  } catch (error) {
    console.error("Bulk action error:", error);
    return {
      success: false,
      message: "Failed to perform bulk action",
    };
  }
}

/**
 * Export subscribers as CSV (Admin only)
 */
export async function exportSubscribersAction(filters?: {
  status?: string;
  source?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized" };
  }

  try {
    const conditions = [];

    if (filters?.status) {
      conditions.push(eq(mailingListSubscribers.status, filters.status as any));
    }

    if (filters?.source) {
      conditions.push(eq(mailingListSubscribers.source, filters.source as any));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    const subscribers = await db
      .select()
      .from(mailingListSubscribers)
      .where(whereClause)
      .orderBy(desc(mailingListSubscribers.subscribedAt));

    return {
      success: true,
      data: subscribers,
    };
  } catch (error) {
    console.error("Export subscribers error:", error);
    return {
      success: false,
      message: "Failed to export subscribers",
    };
  }
}

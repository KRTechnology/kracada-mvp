"use server";

import { db } from "@/lib/db/drizzle";
import {
  lifestylePosts,
  users,
  lifestyleComments,
  lifestylePostLikes,
  admins,
} from "@/lib/db/schema";
import { eq, and, desc, sql, or, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Admin authentication helpers
async function getAdminSession() {
  const { auth } = await import("@/auth");
  const session = await auth();
  return session;
}

async function getCurrentAdmin() {
  const session = await getAdminSession();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Verify user is an admin
  const [admin] = await db
    .select()
    .from(admins)
    .where(eq(admins.email, session.user.email || ""))
    .limit(1);

  if (!admin) {
    throw new Error("Not authorized - Admin access required");
  }

  return admin;
}

/**
 * Get all lifestyle posts for admin management
 */
export async function getAdminLifestylePostsAction(params?: {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "flagged" | "archived" | "all";
  search?: string;
}) {
  try {
    // Verify user is admin
    const admin = await getCurrentAdmin();

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (params?.status && params.status !== "all") {
      conditions.push(eq(lifestylePosts.status, params.status));
    }

    if (params?.search) {
      conditions.push(
        or(
          ilike(lifestylePosts.title, `%${params.search}%`),
          ilike(lifestylePosts.description, `%${params.search}%`)
        )
      );
    }

    // Query all posts with author info
    const posts = await db
      .select({
        id: lifestylePosts.id,
        title: lifestylePosts.title,
        slug: lifestylePosts.slug,
        description: lifestylePosts.description,
        featuredImage: lifestylePosts.featuredImage,
        categories: lifestylePosts.categories,
        status: lifestylePosts.status,
        authorId: lifestylePosts.authorId,
        viewCount: lifestylePosts.viewCount,
        likeCount: lifestylePosts.likeCount,
        commentCount: lifestylePosts.commentCount,
        publishedAt: lifestylePosts.publishedAt,
        createdAt: lifestylePosts.createdAt,
        updatedAt: lifestylePosts.updatedAt,
        author: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(lifestylePosts)
      .leftJoin(users, eq(lifestylePosts.authorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(lifestylePosts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lifestylePosts)
      .where(conditions.length > 0 ? and(...conditions) : undefined);

    // Parse categories
    const postsWithParsedCategories = posts.map((post) => ({
      ...post,
      categories: post.categories ? JSON.parse(post.categories) : [],
    }));

    return {
      success: true,
      data: {
        posts: postsWithParsedCategories,
        pagination: {
          page,
          limit,
          total: count,
          totalPages: Math.ceil(count / limit),
        },
      },
    };
  } catch (error) {
    console.error("Error fetching admin lifestyle posts:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to fetch lifestyle posts",
    };
  }
}

/**
 * Flag a lifestyle post (toggle between published and flagged)
 */
export async function flagLifestylePostAction(postId: string) {
  try {
    // Verify user is admin
    const admin = await getCurrentAdmin();

    // Get current post status
    const [post] = await db
      .select({ status: lifestylePosts.status })
      .from(lifestylePosts)
      .where(eq(lifestylePosts.id, postId))
      .limit(1);

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Toggle flag status
    const newStatus = post.status === "flagged" ? "published" : "flagged";

    await db
      .update(lifestylePosts)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(lifestylePosts.id, postId));

    revalidatePath("/admin/dashboard/lifestyle");
    revalidatePath(`/lifestyle/${postId}`);
    revalidatePath("/lifestyle");

    return {
      success: true,
      message:
        newStatus === "flagged"
          ? "Post flagged successfully"
          : "Post unflagged successfully",
      newStatus,
    };
  } catch (error) {
    console.error("Error flagging lifestyle post:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to flag post",
    };
  }
}

/**
 * Delete a lifestyle post (admin only)
 */
export async function deleteLifestylePostAction(postId: string) {
  try {
    // Verify user is admin
    const admin = await getCurrentAdmin();

    // Check if post exists
    const [post] = await db
      .select({ id: lifestylePosts.id })
      .from(lifestylePosts)
      .where(eq(lifestylePosts.id, postId))
      .limit(1);

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Delete the post (cascade will handle comments and likes)
    await db.delete(lifestylePosts).where(eq(lifestylePosts.id, postId));

    revalidatePath("/admin/dashboard/lifestyle");
    revalidatePath("/lifestyle");

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting lifestyle post:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to delete post",
    };
  }
}

/**
 * Archive a lifestyle post
 */
export async function archiveLifestylePostAction(postId: string) {
  try {
    // Verify user is admin
    const admin = await getCurrentAdmin();

    // Get current post status
    const [post] = await db
      .select({ status: lifestylePosts.status })
      .from(lifestylePosts)
      .where(eq(lifestylePosts.id, postId))
      .limit(1);

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Toggle archive status
    const newStatus = post.status === "archived" ? "published" : "archived";

    await db
      .update(lifestylePosts)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(lifestylePosts.id, postId));

    revalidatePath("/admin/dashboard/lifestyle");
    revalidatePath(`/lifestyle/${postId}`);
    revalidatePath("/lifestyle");

    return {
      success: true,
      message:
        newStatus === "archived"
          ? "Post archived successfully"
          : "Post unarchived successfully",
      newStatus,
    };
  } catch (error) {
    console.error("Error archiving lifestyle post:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to archive post",
    };
  }
}

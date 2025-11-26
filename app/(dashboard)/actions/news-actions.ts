"use server";

import { db } from "@/lib/db/drizzle";
import {
  newsPosts,
  newsComments,
  newsPostLikes,
  admins,
  users,
} from "@/lib/db/schema";
import { eq, and, desc, sql, or, ilike } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Note: This uses admin authentication instead of regular user auth
// You'll need to import and use admin auth when available
async function getAdminSession() {
  // TODO: Replace with actual admin session check
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

// Validation schemas
const createNewsSchema = z.object({
  title: z.string().min(1, "Title is required").max(500, "Title is too long"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(550, "Slug is too long")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase with hyphens"),
  description: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().url().optional(),
  featuredImageKey: z.string().optional(),
  categories: z.array(z.string()).optional(),
  status: z.enum(["draft", "published", "archived"]).optional(),
});

const updateNewsSchema = createNewsSchema.extend({
  id: z.string().min(1, "Post ID is required"),
});

const createCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentText: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(2000, "Comment is too long"),
  userName: z.string().optional(), // For non-logged-in users
});

export type CreateNewsData = z.infer<typeof createNewsSchema>;
export type UpdateNewsData = z.infer<typeof updateNewsSchema>;
export type CreateNewsCommentData = z.infer<typeof createCommentSchema>;

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 550);
}

/**
 * Create a new news post (Admin only)
 */
export async function createNewsPostAction(data: CreateNewsData) {
  try {
    const admin = await getCurrentAdmin();

    // Validate data
    const validatedData = createNewsSchema.parse(data);

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(newsPosts)
      .where(eq(newsPosts.slug, validatedData.slug))
      .limit(1);

    if (existingPost.length > 0) {
      return {
        success: false,
        message:
          "A news post with this slug already exists. Please use a different title or slug.",
      };
    }

    // Create the post
    const [newPost] = await db
      .insert(newsPosts)
      .values({
        title: validatedData.title,
        slug: validatedData.slug,
        description: validatedData.description ?? null,
        content: validatedData.content,
        featuredImage: validatedData.featuredImage ?? null,
        featuredImageKey: validatedData.featuredImageKey ?? null,
        categories: validatedData.categories
          ? JSON.stringify(validatedData.categories)
          : null,
        status: validatedData.status ?? "published",
        authorId: admin.id,
        publishedAt:
          validatedData.status === "published" || !validatedData.status
            ? new Date()
            : null,
      })
      .returning();

    revalidatePath("/news");
    revalidatePath("/admin/dashboard/news");

    return {
      success: true,
      message: "News post created successfully",
      data: {
        ...newPost,
        categories: newPost.categories ? JSON.parse(newPost.categories) : [],
      },
    };
  } catch (error) {
    console.error("Error creating news post:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to create news post",
    };
  }
}

/**
 * Update a news post (Admin only - must be author)
 */
export async function updateNewsPostAction(data: UpdateNewsData) {
  try {
    const admin = await getCurrentAdmin();

    // Validate data
    const validatedData = updateNewsSchema.parse(data);

    // Verify admin owns the post
    const [existingPost] = await db
      .select()
      .from(newsPosts)
      .where(
        and(
          eq(newsPosts.id, validatedData.id),
          eq(newsPosts.authorId, admin.id)
        )
      )
      .limit(1);

    if (!existingPost) {
      return { success: false, message: "Post not found or unauthorized" };
    }

    // Check if slug is being changed and if it already exists
    if (validatedData.slug !== existingPost.slug) {
      const slugExists = await db
        .select()
        .from(newsPosts)
        .where(eq(newsPosts.slug, validatedData.slug))
        .limit(1);

      if (slugExists.length > 0) {
        return {
          success: false,
          message: "A post with this slug already exists",
        };
      }
    }

    // Prepare update data
    const updateData: any = {
      title: validatedData.title,
      slug: validatedData.slug,
      description: validatedData.description ?? null,
      content: validatedData.content,
      featuredImage: validatedData.featuredImage ?? null,
      featuredImageKey: validatedData.featuredImageKey ?? null,
      categories: validatedData.categories
        ? JSON.stringify(validatedData.categories)
        : null,
      status: validatedData.status ?? existingPost.status,
      updatedAt: new Date(),
    };

    // If status is being changed to published and post wasn't published before
    if (
      updateData.status === "published" &&
      existingPost.status !== "published" &&
      !existingPost.publishedAt
    ) {
      updateData.publishedAt = new Date();
    }

    // Update the post
    const [updatedPost] = await db
      .update(newsPosts)
      .set(updateData)
      .where(eq(newsPosts.id, validatedData.id))
      .returning();

    revalidatePath("/news");
    revalidatePath("/admin/dashboard/news");
    revalidatePath(`/news/${validatedData.id}`);

    return {
      success: true,
      message: "News post updated successfully",
      data: {
        ...updatedPost,
        categories: updatedPost.categories
          ? JSON.parse(updatedPost.categories)
          : [],
      },
    };
  } catch (error) {
    console.error("Error updating news post:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to update news post",
    };
  }
}

/**
 * Delete a news post (Admin only - must be author or Super Admin)
 */
export async function deleteNewsPostAction(postId: string) {
  try {
    const admin = await getCurrentAdmin();

    // Verify admin owns the post or is Super Admin
    const [existingPost] = await db
      .select()
      .from(newsPosts)
      .where(eq(newsPosts.id, postId))
      .limit(1);

    if (!existingPost) {
      return { success: false, message: "Post not found" };
    }

    // Check if user is the author or Super Admin
    if (existingPost.authorId !== admin.id && admin.role !== "Super Admin") {
      return { success: false, message: "Unauthorized to delete this post" };
    }

    // Delete the post (cascade will handle comments and likes)
    await db.delete(newsPosts).where(eq(newsPosts.id, postId));

    revalidatePath("/news");
    revalidatePath("/admin/dashboard/news");

    return {
      success: true,
      message: "News post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting news post:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to delete news post",
    };
  }
}

/**
 * Get news posts with pagination and filtering
 */
export async function getNewsPostsAction(params?: {
  page?: number;
  limit?: number;
  authorId?: string;
  status?: "draft" | "published" | "archived";
  categories?: string[];
}) {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 6;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (params?.authorId) {
      conditions.push(eq(newsPosts.authorId, params.authorId));
    }

    if (params?.status) {
      conditions.push(eq(newsPosts.status, params.status));
    } else {
      // By default, only show published posts
      conditions.push(eq(newsPosts.status, "published"));
    }

    // Query posts with author info
    const posts = await db
      .select({
        id: newsPosts.id,
        title: newsPosts.title,
        slug: newsPosts.slug,
        description: newsPosts.description,
        content: newsPosts.content,
        featuredImage: newsPosts.featuredImage,
        featuredImageKey: newsPosts.featuredImageKey,
        categories: newsPosts.categories,
        status: newsPosts.status,
        authorId: newsPosts.authorId,
        viewCount: newsPosts.viewCount,
        likeCount: newsPosts.likeCount,
        commentCount: newsPosts.commentCount,
        publishedAt: newsPosts.publishedAt,
        createdAt: newsPosts.createdAt,
        updatedAt: newsPosts.updatedAt,
        author: {
          id: admins.id,
          firstName: admins.firstName,
          lastName: admins.lastName,
          email: admins.email,
        },
      })
      .from(newsPosts)
      .leftJoin(admins, eq(newsPosts.authorId, admins.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(newsPosts.publishedAt), desc(newsPosts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(newsPosts)
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
    console.error("Error fetching news posts:", error);
    return {
      success: false,
      message: "Failed to fetch news posts",
    };
  }
}

export async function getNewsApi(query = "human resources nigeria") {
  const apiKey = process.env.NEWSDATA_API_KEY;

  if (!apiKey) {
    throw new Error("Missing NEWSData API key.");
  }

  const url = new URL("https://newsdata.io/api/1/latest");

  url.searchParams.append("apikey", apiKey);
  url.searchParams.append("q", query);

  try {
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(
        `News API error: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      status: "success",
      total: data.totalResults || 0,
      articles: data.results || [],
      raw: data, // keep raw response in case you need fields like nextPage later
    };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";

    console.error("Error fetching news:", message);

    return {
      status: "error",
      message,
      articles: [],
    };
  }
}

/**
 * Get a single news post by ID or slug
 */
export async function getNewsPostAction(identifier: string) {
  try {
    // Try to find by ID first, then by slug
    const [post] = await db
      .select({
        id: newsPosts.id,
        title: newsPosts.title,
        slug: newsPosts.slug,
        description: newsPosts.description,
        content: newsPosts.content,
        featuredImage: newsPosts.featuredImage,
        featuredImageKey: newsPosts.featuredImageKey,
        categories: newsPosts.categories,
        status: newsPosts.status,
        authorId: newsPosts.authorId,
        viewCount: newsPosts.viewCount,
        likeCount: newsPosts.likeCount,
        commentCount: newsPosts.commentCount,
        publishedAt: newsPosts.publishedAt,
        createdAt: newsPosts.createdAt,
        updatedAt: newsPosts.updatedAt,
        author: {
          id: admins.id,
          firstName: admins.firstName,
          lastName: admins.lastName,
          email: admins.email,
        },
      })
      .from(newsPosts)
      .leftJoin(admins, eq(newsPosts.authorId, admins.id))
      .where(or(eq(newsPosts.id, identifier), eq(newsPosts.slug, identifier)))
      .limit(1);

    if (!post) {
      return {
        success: false,
        message: "News post not found",
      };
    }

    // Increment view count
    await db
      .update(newsPosts)
      .set({ viewCount: sql`${newsPosts.viewCount} + 1` })
      .where(eq(newsPosts.id, post.id));

    return {
      success: true,
      data: {
        ...post,
        categories: post.categories ? JSON.parse(post.categories) : [],
      },
    };
  } catch (error) {
    console.error("Error fetching news post:", error);
    return {
      success: false,
      message: "Failed to fetch news post",
    };
  }
}

/**
 * Toggle like on a news post (Requires login)
 */
export async function toggleNewsPostLikeAction(postId: string) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return {
        success: false,
        message: "You must be logged in to like posts",
      };
    }

    const userId = session.user.id;

    // Check if user has already liked the post
    const existingLike = await db
      .select()
      .from(newsPostLikes)
      .where(
        and(eq(newsPostLikes.postId, postId), eq(newsPostLikes.userId, userId))
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike: Remove the like
      await db
        .delete(newsPostLikes)
        .where(
          and(
            eq(newsPostLikes.postId, postId),
            eq(newsPostLikes.userId, userId)
          )
        );

      // Decrement like count
      await db
        .update(newsPosts)
        .set({ likeCount: sql`${newsPosts.likeCount} - 1` })
        .where(eq(newsPosts.id, postId));

      revalidatePath(`/news/${postId}`);

      return {
        success: true,
        liked: false,
        message: "Post unliked",
      };
    } else {
      // Like: Add the like
      await db.insert(newsPostLikes).values({
        postId,
        userId,
      });

      // Increment like count
      await db
        .update(newsPosts)
        .set({ likeCount: sql`${newsPosts.likeCount} + 1` })
        .where(eq(newsPosts.id, postId));

      revalidatePath(`/news/${postId}`);

      return {
        success: true,
        liked: true,
        message: "Post liked",
      };
    }
  } catch (error) {
    console.error("Error toggling post like:", error);
    return {
      success: false,
      message: "Failed to toggle like",
    };
  }
}

/**
 * Check if current user has liked a post
 */
export async function checkNewsPostLikedAction(postId: string) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();

    if (!session?.user?.id) {
      return { success: true, liked: false };
    }

    const userId = session.user.id;

    const existingLike = await db
      .select()
      .from(newsPostLikes)
      .where(
        and(eq(newsPostLikes.postId, postId), eq(newsPostLikes.userId, userId))
      )
      .limit(1);

    return {
      success: true,
      liked: existingLike.length > 0,
    };
  } catch (error) {
    console.error("Error checking post like:", error);
    return {
      success: false,
      message: "Failed to check like status",
    };
  }
}

/**
 * Create a comment on a news post
 */
export async function createNewsCommentAction(data: CreateNewsCommentData) {
  try {
    const { auth } = await import("@/auth");
    const session = await auth();
    let userId: string | null = null;
    let userName: string | null = null;
    let userAvatar: string | null = null;

    // If user is logged in, get their info
    if (session?.user?.id) {
      userId = session.user.id;
      const [user] = await db
        .select({
          firstName: users.firstName,
          lastName: users.lastName,
          fullName: users.fullName,
          profilePicture: users.profilePicture,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (user) {
        userName =
          user.firstName && user.lastName
            ? `${user.firstName} ${user.lastName}`
            : user.fullName;
        userAvatar = user.profilePicture;
      }
    } else {
      // For non-logged-in users, require a username
      if (!data.userName || data.userName.trim().length === 0) {
        return {
          success: false,
          message: "Please provide your name",
        };
      }
      userName = data.userName.trim();
    }

    // Validate data
    const validatedData = createCommentSchema.parse(data);

    // Create the comment
    const [newComment] = await db
      .insert(newsComments)
      .values({
        postId: validatedData.postId,
        userId,
        userName: userName || "Anonymous",
        userAvatar,
        commentText: validatedData.commentText,
      })
      .returning();

    // Increment comment count
    await db
      .update(newsPosts)
      .set({ commentCount: sql`${newsPosts.commentCount} + 1` })
      .where(eq(newsPosts.id, validatedData.postId));

    revalidatePath(`/news/${validatedData.postId}`);

    return {
      success: true,
      message: "Comment posted successfully",
      data: newComment,
    };
  } catch (error) {
    console.error("Error creating comment:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return {
      success: false,
      message: "Failed to post comment",
    };
  }
}

/**
 * Get comments for a news post
 */
export async function getNewsCommentsAction(postId: string) {
  try {
    const comments = await db
      .select()
      .from(newsComments)
      .where(eq(newsComments.postId, postId))
      .orderBy(desc(newsComments.createdAt));

    return {
      success: true,
      data: comments,
    };
  } catch (error) {
    console.error("Error fetching comments:", error);
    return {
      success: false,
      message: "Failed to fetch comments",
    };
  }
}

/**
 * Helper function to generate a unique slug
 */
export async function generateUniqueNewsSlugAction(title: string) {
  try {
    let slug = generateSlug(title);
    let counter = 1;

    // Check if slug exists
    while (true) {
      const existing = await db
        .select()
        .from(newsPosts)
        .where(eq(newsPosts.slug, slug))
        .limit(1);

      if (existing.length === 0) {
        break;
      }

      // Append counter to make it unique
      slug = `${generateSlug(title)}-${counter}`;
      counter++;
    }

    return {
      success: true,
      slug,
    };
  } catch (error) {
    console.error("Error generating slug:", error);
    return {
      success: false,
      message: "Failed to generate slug",
    };
  }
}

/**
 * Get all news posts for admin management (includes all statuses)
 */
export async function getAdminNewsPostsAction(params?: {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "archived" | "all";
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
      conditions.push(eq(newsPosts.status, params.status));
    }

    if (params?.search) {
      conditions.push(
        or(
          ilike(newsPosts.title, `%${params.search}%`),
          ilike(newsPosts.description, `%${params.search}%`)
        )
      );
    }

    // Query all posts (regardless of status) with author info
    const posts = await db
      .select({
        id: newsPosts.id,
        title: newsPosts.title,
        slug: newsPosts.slug,
        description: newsPosts.description,
        categories: newsPosts.categories,
        status: newsPosts.status,
        authorId: newsPosts.authorId,
        viewCount: newsPosts.viewCount,
        likeCount: newsPosts.likeCount,
        commentCount: newsPosts.commentCount,
        publishedAt: newsPosts.publishedAt,
        createdAt: newsPosts.createdAt,
        updatedAt: newsPosts.updatedAt,
        author: {
          id: admins.id,
          firstName: admins.firstName,
          lastName: admins.lastName,
        },
      })
      .from(newsPosts)
      .leftJoin(admins, eq(newsPosts.authorId, admins.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(newsPosts.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(newsPosts)
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
    console.error("Error fetching admin news posts:", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return {
      success: false,
      message: "Failed to fetch news posts",
    };
  }
}

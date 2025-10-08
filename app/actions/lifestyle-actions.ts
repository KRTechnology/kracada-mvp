"use server";

import { db } from "@/lib/db/drizzle";
import {
  lifestylePosts,
  lifestyleComments,
  lifestylePostLikes,
  users,
} from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, and, desc, sql, or, inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Validation schemas
const createPostSchema = z.object({
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
  status: z.enum(["draft", "published", "flagged", "archived"]).optional(),
});

const updatePostSchema = createPostSchema.extend({
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

export type CreatePostData = z.infer<typeof createPostSchema>;
export type UpdatePostData = z.infer<typeof updatePostSchema>;
export type CreateCommentData = z.infer<typeof createCommentSchema>;

// Helper to get current user
async function getCurrentUser() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }
  return session.user;
}

// Helper to check if user is a Contributor
async function checkIsContributor(userId: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return user?.accountType === "Contributor";
}

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
 * Create a new lifestyle post
 */
export async function createLifestylePostAction(data: CreatePostData) {
  try {
    const user = await getCurrentUser();
    const userId = user.id as string;

    // Verify user is a Contributor
    const isContributor = await checkIsContributor(userId);
    if (!isContributor) {
      return {
        success: false,
        message: "Only Contributors can create lifestyle posts",
      };
    }

    // Validate data
    const validatedData = createPostSchema.parse(data);

    // Check if slug already exists
    const existingPost = await db
      .select()
      .from(lifestylePosts)
      .where(eq(lifestylePosts.slug, validatedData.slug))
      .limit(1);

    if (existingPost.length > 0) {
      return {
        success: false,
        message:
          "A post with this slug already exists. Please use a different title or slug.",
      };
    }

    // Create the post
    const [newPost] = await db
      .insert(lifestylePosts)
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
        authorId: userId,
        publishedAt:
          validatedData.status === "published" || !validatedData.status
            ? new Date()
            : null,
      })
      .returning();

    revalidatePath("/lifestyle");
    revalidatePath("/lifestyle/videos");

    return {
      success: true,
      message: "Post created successfully",
      data: {
        ...newPost,
        categories: newPost.categories ? JSON.parse(newPost.categories) : [],
      },
    };
  } catch (error) {
    console.error("Error creating lifestyle post:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return {
      success: false,
      message: "Failed to create post",
    };
  }
}

/**
 * Update a lifestyle post
 */
export async function updateLifestylePostAction(data: UpdatePostData) {
  try {
    const user = await getCurrentUser();
    const userId = user.id as string;

    // Validate data
    const validatedData = updatePostSchema.parse(data);

    // Verify user owns the post
    const [existingPost] = await db
      .select()
      .from(lifestylePosts)
      .where(
        and(
          eq(lifestylePosts.id, validatedData.id),
          eq(lifestylePosts.authorId, userId)
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
        .from(lifestylePosts)
        .where(eq(lifestylePosts.slug, validatedData.slug))
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
      .update(lifestylePosts)
      .set(updateData)
      .where(eq(lifestylePosts.id, validatedData.id))
      .returning();

    revalidatePath("/lifestyle");
    revalidatePath("/lifestyle/videos");
    revalidatePath(`/lifestyle/${validatedData.id}`);

    return {
      success: true,
      message: "Post updated successfully",
      data: {
        ...updatedPost,
        categories: updatedPost.categories
          ? JSON.parse(updatedPost.categories)
          : [],
      },
    };
  } catch (error) {
    console.error("Error updating lifestyle post:", error);

    if (error instanceof z.ZodError) {
      return { success: false, message: error.errors[0].message };
    }

    return {
      success: false,
      message: "Failed to update post",
    };
  }
}

/**
 * Delete a lifestyle post
 */
export async function deleteLifestylePostAction(postId: string) {
  try {
    const user = await getCurrentUser();
    const userId = user.id as string;

    // Verify user owns the post
    const [existingPost] = await db
      .select()
      .from(lifestylePosts)
      .where(
        and(eq(lifestylePosts.id, postId), eq(lifestylePosts.authorId, userId))
      )
      .limit(1);

    if (!existingPost) {
      return { success: false, message: "Post not found or unauthorized" };
    }

    // Delete the post (cascade will handle comments and likes)
    await db.delete(lifestylePosts).where(eq(lifestylePosts.id, postId));

    revalidatePath("/lifestyle");
    revalidatePath("/lifestyle/videos");

    return {
      success: true,
      message: "Post deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting lifestyle post:", error);
    return {
      success: false,
      message: "Failed to delete post",
    };
  }
}

/**
 * Get lifestyle posts with pagination and filtering
 */
export async function getLifestylePostsAction(params?: {
  page?: number;
  limit?: number;
  authorId?: string;
  status?: "draft" | "published" | "flagged" | "archived";
  categories?: string[];
}) {
  try {
    const page = params?.page || 1;
    const limit = params?.limit || 6;
    const offset = (page - 1) * limit;

    // Build where conditions
    const conditions = [];

    if (params?.authorId) {
      conditions.push(eq(lifestylePosts.authorId, params.authorId));
    }

    if (params?.status) {
      conditions.push(eq(lifestylePosts.status, params.status));
    } else {
      // By default, only show published posts (unless filtering by specific status)
      conditions.push(eq(lifestylePosts.status, "published"));
    }

    // Query posts with author info
    const posts = await db
      .select({
        id: lifestylePosts.id,
        title: lifestylePosts.title,
        slug: lifestylePosts.slug,
        description: lifestylePosts.description,
        content: lifestylePosts.content,
        featuredImage: lifestylePosts.featuredImage,
        featuredImageKey: lifestylePosts.featuredImageKey,
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
          firstName: users.firstName,
          lastName: users.lastName,
          profilePicture: users.profilePicture,
        },
      })
      .from(lifestylePosts)
      .leftJoin(users, eq(lifestylePosts.authorId, users.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(lifestylePosts.publishedAt), desc(lifestylePosts.createdAt))
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
    console.error("Error fetching lifestyle posts:", error);
    return {
      success: false,
      message: "Failed to fetch posts",
    };
  }
}

/**
 * Get a single lifestyle post by ID or slug
 */
export async function getLifestylePostAction(identifier: string) {
  try {
    // Try to find by ID first, then by slug
    const [post] = await db
      .select({
        id: lifestylePosts.id,
        title: lifestylePosts.title,
        slug: lifestylePosts.slug,
        description: lifestylePosts.description,
        content: lifestylePosts.content,
        featuredImage: lifestylePosts.featuredImage,
        featuredImageKey: lifestylePosts.featuredImageKey,
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
          firstName: users.firstName,
          lastName: users.lastName,
          fullName: users.fullName,
          profilePicture: users.profilePicture,
          bio: users.bio,
          website: users.website,
        },
      })
      .from(lifestylePosts)
      .leftJoin(users, eq(lifestylePosts.authorId, users.id))
      .where(
        or(
          eq(lifestylePosts.id, identifier),
          eq(lifestylePosts.slug, identifier)
        )
      )
      .limit(1);

    if (!post) {
      return {
        success: false,
        message: "Post not found",
      };
    }

    // Increment view count
    await db
      .update(lifestylePosts)
      .set({ viewCount: sql`${lifestylePosts.viewCount} + 1` })
      .where(eq(lifestylePosts.id, post.id));

    return {
      success: true,
      data: {
        ...post,
        categories: post.categories ? JSON.parse(post.categories) : [],
      },
    };
  } catch (error) {
    console.error("Error fetching lifestyle post:", error);
    return {
      success: false,
      message: "Failed to fetch post",
    };
  }
}

/**
 * Toggle like on a lifestyle post
 */
export async function toggleLifestylePostLikeAction(postId: string) {
  try {
    const user = await getCurrentUser();
    const userId = user.id as string;

    // Check if user has already liked the post
    const existingLike = await db
      .select()
      .from(lifestylePostLikes)
      .where(
        and(
          eq(lifestylePostLikes.postId, postId),
          eq(lifestylePostLikes.userId, userId)
        )
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike: Remove the like
      await db
        .delete(lifestylePostLikes)
        .where(
          and(
            eq(lifestylePostLikes.postId, postId),
            eq(lifestylePostLikes.userId, userId)
          )
        );

      // Decrement like count
      await db
        .update(lifestylePosts)
        .set({ likeCount: sql`${lifestylePosts.likeCount} - 1` })
        .where(eq(lifestylePosts.id, postId));

      return {
        success: true,
        liked: false,
        message: "Post unliked",
      };
    } else {
      // Like: Add the like
      await db.insert(lifestylePostLikes).values({
        postId,
        userId,
      });

      // Increment like count
      await db
        .update(lifestylePosts)
        .set({ likeCount: sql`${lifestylePosts.likeCount} + 1` })
        .where(eq(lifestylePosts.id, postId));

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
export async function checkPostLikedAction(postId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: true, liked: false };
    }

    const userId = session.user.id;

    const existingLike = await db
      .select()
      .from(lifestylePostLikes)
      .where(
        and(
          eq(lifestylePostLikes.postId, postId),
          eq(lifestylePostLikes.userId, userId)
        )
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
 * Create a comment on a lifestyle post
 */
export async function createLifestyleCommentAction(data: CreateCommentData) {
  try {
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
      .insert(lifestyleComments)
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
      .update(lifestylePosts)
      .set({ commentCount: sql`${lifestylePosts.commentCount} + 1` })
      .where(eq(lifestylePosts.id, validatedData.postId));

    revalidatePath(`/lifestyle/${validatedData.postId}`);

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
 * Get comments for a lifestyle post
 */
export async function getLifestyleCommentsAction(postId: string) {
  try {
    const comments = await db
      .select()
      .from(lifestyleComments)
      .where(eq(lifestyleComments.postId, postId))
      .orderBy(desc(lifestyleComments.createdAt));

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
export async function generateUniqueSlugAction(title: string) {
  try {
    let slug = generateSlug(title);
    let counter = 1;

    // Check if slug exists
    while (true) {
      const existing = await db
        .select()
        .from(lifestylePosts)
        .where(eq(lifestylePosts.slug, slug))
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
 * Get author statistics and recent posts
 */
export async function getAuthorStatsAndPostsAction(authorId: string) {
  try {
    // Get author's posts
    const authorPosts = await db
      .select({
        id: lifestylePosts.id,
        title: lifestylePosts.title,
        slug: lifestylePosts.slug,
        publishedAt: lifestylePosts.publishedAt,
        createdAt: lifestylePosts.createdAt,
        likeCount: lifestylePosts.likeCount,
        commentCount: lifestylePosts.commentCount,
      })
      .from(lifestylePosts)
      .where(
        and(
          eq(lifestylePosts.authorId, authorId),
          eq(lifestylePosts.status, "published")
        )
      )
      .orderBy(desc(lifestylePosts.publishedAt))
      .limit(5);

    // Calculate total stats
    const totalPosts = authorPosts.length;
    const totalLikes = authorPosts.reduce(
      (sum, post) => sum + (post.likeCount || 0),
      0
    );
    const totalComments = authorPosts.reduce(
      (sum, post) => sum + (post.commentCount || 0),
      0
    );

    // Get total count of all posts (not just the 5 shown)
    const [{ count: allPostsCount }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(lifestylePosts)
      .where(
        and(
          eq(lifestylePosts.authorId, authorId),
          eq(lifestylePosts.status, "published")
        )
      );

    return {
      success: true,
      data: {
        stats: {
          totalPosts: allPostsCount || 0,
          totalComments: totalComments,
          totalLikes: totalLikes,
        },
        recentPosts: authorPosts.map((post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          year: new Date(post.publishedAt || post.createdAt)
            .getFullYear()
            .toString(),
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching author stats:", error);
    return {
      success: false,
      message: "Failed to fetch author stats",
    };
  }
}

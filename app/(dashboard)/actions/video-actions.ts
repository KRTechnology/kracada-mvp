"use server";

import { db } from "@/lib/db/drizzle";
import { videos, Video, admins } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, desc, asc, and, or, like, SQL, sql } from "drizzle-orm";
import { z } from "zod";

// Helper function to check if user is admin
async function checkAdminAuth() {
  const session = await auth();
  if (!session?.user?.email) {
    throw new Error("Unauthorized");
  }

  // Get admin from database
  const adminResult = await db
    .select()
    .from(admins)
    .where(eq(admins.email, session.user.email!))
    .limit(1);

  if (!adminResult || adminResult.length === 0) {
    throw new Error("Unauthorized: Admin access required");
  }

  return adminResult[0];
}

// Validation schemas
const createVideoSchema = z.object({
  title: z.string().min(1, "Title is required").max(500),
  description: z.string().optional(),
  videoUrl: z.string().url("Valid video URL is required"),
  thumbnailImage: z.string().url("Thumbnail image is required"),
  duration: z.string().min(1, "Duration is required"),
  type: z.enum(["kracada_tv", "trending"]),
  categories: z.array(z.string()).min(1, "At least one category is required"),
  author: z.string().min(1, "Author name is required"),
  status: z.enum(["draft", "published", "hidden"]).default("draft"),
});

const updateVideoSchema = createVideoSchema.partial().extend({
  id: z.string(),
});

// Response types
export type ActionResponse<T = any> = {
  success: boolean;
  message?: string;
  data?: T;
};

/**
 * Create a new video
 */
export async function createVideoAction(
  data: z.infer<typeof createVideoSchema>
): Promise<ActionResponse<Video>> {
  try {
    const admin = await checkAdminAuth();

    // Validate input
    const validatedData = createVideoSchema.parse(data);

    // Create video
    const [video] = await db
      .insert(videos)
      .values({
        ...validatedData,
        categories: JSON.stringify(validatedData.categories),
        createdBy: admin.id,
        publishedAt:
          validatedData.status === "published" ? new Date() : undefined,
      })
      .returning();

    return {
      success: true,
      message: "Video created successfully",
      data: video,
    };
  } catch (error) {
    console.error("Create video error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: "Failed to create video",
    };
  }
}

/**
 * Update a video
 */
export async function updateVideoAction(
  data: z.infer<typeof updateVideoSchema>
): Promise<ActionResponse<Video>> {
  try {
    await checkAdminAuth();

    // Validate input
    const validatedData = updateVideoSchema.parse(data);
    const { id, ...updateData } = validatedData;

    // Get existing video
    const [existingVideo] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, id))
      .limit(1);

    if (!existingVideo) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    // Prepare update data
    const dataToUpdate: any = {
      ...updateData,
      updatedAt: new Date(),
    };

    // Handle categories if provided
    if (updateData.categories) {
      dataToUpdate.categories = JSON.stringify(updateData.categories);
    }

    // Handle published status
    if (
      updateData.status === "published" &&
      existingVideo.status !== "published"
    ) {
      dataToUpdate.publishedAt = new Date();
    }

    // Update video
    const [updatedVideo] = await db
      .update(videos)
      .set(dataToUpdate)
      .where(eq(videos.id, id))
      .returning();

    return {
      success: true,
      message: "Video updated successfully",
      data: updatedVideo,
    };
  } catch (error) {
    console.error("Update video error:", error);

    if (error instanceof z.ZodError) {
      return {
        success: false,
        message: error.errors[0].message,
      };
    }

    return {
      success: false,
      message: "Failed to update video",
    };
  }
}

/**
 * Delete a video
 */
export async function deleteVideoAction(
  videoId: string
): Promise<ActionResponse> {
  try {
    await checkAdminAuth();

    await db.delete(videos).where(eq(videos.id, videoId));

    return {
      success: true,
      message: "Video deleted successfully",
    };
  } catch (error) {
    console.error("Delete video error:", error);
    return {
      success: false,
      message: "Failed to delete video",
    };
  }
}

/**
 * Get a single video by ID
 */
export async function getVideoByIdAction(
  videoId: string
): Promise<ActionResponse<Video>> {
  try {
    const [video] = await db
      .select()
      .from(videos)
      .where(eq(videos.id, videoId))
      .limit(1);

    if (!video) {
      return {
        success: false,
        message: "Video not found",
      };
    }

    return {
      success: true,
      data: video,
    };
  } catch (error) {
    console.error("Get video error:", error);
    return {
      success: false,
      message: "Failed to fetch video",
    };
  }
}

/**
 * Get videos for admin dashboard with filtering and pagination
 */
export async function getAdminVideosAction({
  page = 1,
  limit = 10,
  status,
  type,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "draft" | "published" | "hidden";
  type?: "kracada_tv" | "trending";
  search?: string;
} = {}): Promise<
  ActionResponse<{
    videos: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>
> {
  try {
    await checkAdminAuth();

    // Build where conditions
    const conditions: SQL[] = [];

    if (status) {
      conditions.push(eq(videos.status, status));
    }

    if (type) {
      conditions.push(eq(videos.type, type));
    }

    if (search) {
      conditions.push(
        or(
          like(videos.title, `%${search}%`),
          like(videos.description, `%${search}%`),
          like(videos.author, `%${search}%`)
        )!
      );
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(videos)
      .where(whereClause);

    // Get paginated videos
    const offset = (page - 1) * limit;
    const videosList = await db
      .select()
      .from(videos)
      .where(whereClause)
      .orderBy(desc(videos.createdAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: {
        videos: videosList,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Get admin videos error:", error);
    return {
      success: false,
      message: "Failed to fetch videos",
    };
  }
}

/**
 * Get published Kracada TV videos for frontend
 */
export async function getKracadaTVVideosAction({
  limit = 3,
}: {
  limit?: number;
} = {}): Promise<ActionResponse<Video[]>> {
  try {
    const videosList = await db
      .select()
      .from(videos)
      .where(and(eq(videos.status, "published"), eq(videos.type, "kracada_tv")))
      .orderBy(desc(videos.publishedAt))
      .limit(limit);

    return {
      success: true,
      data: videosList,
    };
  } catch (error) {
    console.error("Get Kracada TV videos error:", error);
    return {
      success: false,
      message: "Failed to fetch Kracada TV videos",
      data: [],
    };
  }
}

/**
 * Get published trending videos for frontend with filtering and pagination
 */
export async function getTrendingVideosAction({
  page = 1,
  limit = 6,
  search,
  category,
}: {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
} = {}): Promise<
  ActionResponse<{
    videos: Video[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }>
> {
  try {
    // Build where conditions
    const conditions: SQL[] = [
      eq(videos.status, "published"),
      eq(videos.type, "trending"),
    ];

    if (search) {
      conditions.push(
        or(
          like(videos.title, `%${search}%`),
          like(videos.description, `%${search}%`),
          like(videos.author, `%${search}%`)
        )!
      );
    }

    if (category && category !== "All Categories") {
      // Search in JSON array using PostgreSQL JSON operators
      conditions.push(
        sql`${videos.categories}::jsonb @> ${JSON.stringify([category])}::jsonb`
      );
    }

    const whereClause = and(...conditions);

    // Get total count
    const [{ count }] = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(videos)
      .where(whereClause);

    // Get paginated videos
    const offset = (page - 1) * limit;
    const videosList = await db
      .select()
      .from(videos)
      .where(whereClause)
      .orderBy(desc(videos.publishedAt))
      .limit(limit)
      .offset(offset);

    const totalPages = Math.ceil(count / limit);

    return {
      success: true,
      data: {
        videos: videosList,
        pagination: {
          page,
          limit,
          total: count,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Get trending videos error:", error);
    return {
      success: false,
      message: "Failed to fetch trending videos",
      data: {
        videos: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      },
    };
  }
}

/**
 * Increment video view count
 */
export async function incrementVideoViewCountAction(
  videoId: string
): Promise<ActionResponse> {
  try {
    await db
      .update(videos)
      .set({
        viewCount: sql`${videos.viewCount} + 1`,
      })
      .where(eq(videos.id, videoId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Increment view count error:", error);
    return {
      success: false,
      message: "Failed to increment view count",
    };
  }
}

/**
 * Toggle video like
 */
export async function toggleVideoLikeAction(
  videoId: string,
  increment: boolean
): Promise<ActionResponse> {
  try {
    await db
      .update(videos)
      .set({
        likeCount: increment
          ? sql`${videos.likeCount} + 1`
          : sql`${videos.likeCount} - 1`,
      })
      .where(eq(videos.id, videoId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Toggle video like error:", error);
    return {
      success: false,
      message: "Failed to toggle like",
    };
  }
}

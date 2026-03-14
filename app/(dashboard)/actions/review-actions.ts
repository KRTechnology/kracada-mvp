"use server";

import { db } from "@/lib/db/drizzle";
import {
  reviews,
  reviewLikes,
  users,
  ReviewContentType,
  ReviewWithUser,
} from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, and, desc, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Types
export interface CreateReviewData {
  contentType: ReviewContentType;
  contentId: string;
  rating: number;
  comment: string;
}

export interface UpdateReviewData {
  reviewId: string;
  rating?: number;
  comment?: string;
}

export interface ReviewResult {
  success: boolean;
  message: string;
  data?: any;
}

// Helper function to get current user
async function getCurrentUser(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// Helper function to check if user is authenticated
export async function checkAuthAction(): Promise<{
  success: boolean;
  isAuthenticated: boolean;
  userId?: string;
}> {
  try {
    const session = await auth();
    return {
      success: true,
      isAuthenticated: !!session?.user?.id,
      userId: session?.user?.id,
    };
  } catch (error) {
    return {
      success: true,
      isAuthenticated: false,
    };
  }
}

// Create a new review
export async function createReviewAction(
  data: CreateReviewData
): Promise<ReviewResult> {
  try {
    // Allow unauthenticated users to comment
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) {
      return {
        success: false,
        message: "You must be logged in to post a review",
      };
    }

    // Check if user already reviewed this content
    const existingReview = await db
      .select()
      .from(reviews)
      .where(
        and(
          eq(reviews.userId, userId),
          eq(reviews.contentType, data.contentType),
          eq(reviews.contentId, data.contentId)
        )
      )
      .limit(1);

    if (existingReview.length > 0) {
      return {
        success: false,
        message: "You have already reviewed this",
      };
    }

    // Create review
    const [newReview] = await db
      .insert(reviews)
      .values({
        userId,
        contentType: data.contentType,
        contentId: data.contentId,
        rating: data.rating,
        comment: data.comment,
        likesCount: 0,
      })
      .returning();

    // Update the hotel/restaurant average rating and review count
    // This will be done in a separate function

    revalidatePath(
      `/hotels-restaurants/${data.contentType}s/${data.contentId}`
    );

    return {
      success: true,
      message: "Review posted successfully",
      data: newReview,
    };
  } catch (error) {
    console.error("Error creating review:", error);
    return {
      success: false,
      message: "Failed to post review",
    };
  }
}

// Get all reviews for a specific hotel or restaurant
export async function getReviewsAction(
  contentType: ReviewContentType,
  contentId: string,
  page: number = 1,
  limit: number = 5
): Promise<{
  success: boolean;
  data?: ReviewWithUser[];
  totalCount?: number;
  message?: string;
}> {
  try {
    const session = await auth();
    const currentUserId = session?.user?.id;
    const offset = (page - 1) * limit;

    // Get reviews with user information
    const reviewsData = await db
      .select({
        review: reviews,
        user: {
          id: users.id,
          fullName: users.fullName,
          profilePicture: users.profilePicture,
          emailVerified: users.emailVerified,
        },
      })
      .from(reviews)
      .innerJoin(users, eq(reviews.userId, users.id))
      .where(
        and(
          eq(reviews.contentType, contentType),
          eq(reviews.contentId, contentId)
        )
      )
      .orderBy(desc(reviews.likesCount), desc(reviews.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(reviews)
      .where(
        and(
          eq(reviews.contentType, contentType),
          eq(reviews.contentId, contentId)
        )
      );

    // Check which reviews are liked by current user
    let likedReviewIds: Set<string> = new Set();
    if (currentUserId) {
      const likedReviews = await db
        .select({ reviewId: reviewLikes.reviewId })
        .from(reviewLikes)
        .where(eq(reviewLikes.userId, currentUserId));

      likedReviewIds = new Set(likedReviews.map((r) => r.reviewId));
    }

    // Format the data
    const formattedReviews: ReviewWithUser[] = reviewsData.map((item) => ({
      ...item.review,
      user: item.user,
      isLikedByCurrentUser: likedReviewIds.has(item.review.id),
    }));

    return {
      success: true,
      data: formattedReviews,
      totalCount: Number(countResult.count),
    };
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return {
      success: false,
      message: "Failed to fetch reviews",
    };
  }
}

// Update a review
export async function updateReviewAction(
  data: UpdateReviewData
): Promise<ReviewResult> {
  try {
    const userId = await getCurrentUser();

    // Check if review exists and belongs to user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, data.reviewId))
      .limit(1);

    if (!existingReview) {
      return {
        success: false,
        message: "Review not found",
      };
    }

    if (existingReview.userId !== userId) {
      return {
        success: false,
        message: "Unauthorized to edit this review",
      };
    }

    // Update review
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.rating !== undefined) {
      updateData.rating = data.rating;
    }

    if (data.comment !== undefined) {
      updateData.comment = data.comment;
    }

    const [updatedReview] = await db
      .update(reviews)
      .set(updateData)
      .where(eq(reviews.id, data.reviewId))
      .returning();

    revalidatePath(
      `/hotels-restaurants/${updatedReview.contentType}s/${updatedReview.contentId}`
    );

    return {
      success: true,
      message: "Review updated successfully",
      data: updatedReview,
    };
  } catch (error) {
    console.error("Error updating review:", error);
    return {
      success: false,
      message: "Failed to update review",
    };
  }
}

// Delete a review
export async function deleteReviewAction(
  reviewId: string
): Promise<ReviewResult> {
  try {
    const userId = await getCurrentUser();

    // Check if review exists and belongs to user
    const [existingReview] = await db
      .select()
      .from(reviews)
      .where(eq(reviews.id, reviewId))
      .limit(1);

    if (!existingReview) {
      return {
        success: false,
        message: "Review not found",
      };
    }

    if (existingReview.userId !== userId) {
      return {
        success: false,
        message: "Unauthorized to delete this review",
      };
    }

    // Delete review (likes will cascade)
    await db.delete(reviews).where(eq(reviews.id, reviewId));

    revalidatePath(
      `/hotels-restaurants/${existingReview.contentType}s/${existingReview.contentId}`
    );

    return {
      success: true,
      message: "Review deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      message: "Failed to delete review",
    };
  }
}

// Toggle review like
export async function toggleReviewLikeAction(
  reviewId: string
): Promise<ReviewResult> {
  try {
    const userId = await getCurrentUser();

    // Check if like already exists
    const existingLike = await db
      .select()
      .from(reviewLikes)
      .where(
        and(eq(reviewLikes.userId, userId), eq(reviewLikes.reviewId, reviewId))
      )
      .limit(1);

    if (existingLike.length > 0) {
      // Unlike - remove like
      await db
        .delete(reviewLikes)
        .where(eq(reviewLikes.id, existingLike[0].id));

      // Decrement likes count
      await db
        .update(reviews)
        .set({
          likesCount: sql`${reviews.likesCount} - 1`,
        })
        .where(eq(reviews.id, reviewId));

      return {
        success: true,
        message: "Review unliked",
        data: { isLiked: false },
      };
    } else {
      // Like - add like
      await db.insert(reviewLikes).values({
        userId,
        reviewId,
      });

      // Increment likes count
      await db
        .update(reviews)
        .set({
          likesCount: sql`${reviews.likesCount} + 1`,
        })
        .where(eq(reviews.id, reviewId));

      return {
        success: true,
        message: "Review liked",
        data: { isLiked: true },
      };
    }
  } catch (error) {
    console.error("Error toggling review like:", error);
    return {
      success: false,
      message: "Failed to toggle like",
    };
  }
}

// Check if current user has liked a review
export async function checkReviewLikeStatusAction(
  reviewId: string
): Promise<{ success: boolean; isLiked: boolean }> {
  try {
    const userId = await getCurrentUser();

    const like = await db
      .select()
      .from(reviewLikes)
      .where(
        and(eq(reviewLikes.userId, userId), eq(reviewLikes.reviewId, reviewId))
      )
      .limit(1);

    return {
      success: true,
      isLiked: like.length > 0,
    };
  } catch (error) {
    return {
      success: false,
      isLiked: false,
    };
  }
}

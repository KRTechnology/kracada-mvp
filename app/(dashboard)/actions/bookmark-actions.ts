"use server";

import { db } from "@/lib/db/drizzle";
import { bookmarks, jobs, users, BookmarkContentType } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, and, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Types
export interface ToggleBookmarkData {
  contentType: BookmarkContentType;
  contentId: string;
}

export interface BookmarkResult {
  success: boolean;
  message: string;
  isBookmarked?: boolean;
}

export interface BookmarkedJobItem {
  id: string;
  title: string;
  company: string;
  companyLogo?: string | null;
  location: string;
  description: string;
  skills: string[];
  locationType?: "remote" | "onsite" | "hybrid";
  bookmarkedAt: Date;
}

// Helper function to get current user
async function getCurrentUser(): Promise<string> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }
  return session.user.id;
}

// Toggle bookmark (add if not exists, remove if exists)
export async function toggleBookmarkAction(
  data: ToggleBookmarkData
): Promise<BookmarkResult> {
  try {
    const userId = await getCurrentUser();

    // Check if bookmark already exists
    const existingBookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.contentType, data.contentType),
          eq(bookmarks.contentId, data.contentId)
        )
      )
      .limit(1);

    if (existingBookmark.length > 0) {
      // Remove bookmark
      await db
        .delete(bookmarks)
        .where(eq(bookmarks.id, existingBookmark[0].id));

      revalidatePath("/dashboard/bookmarks");

      return {
        success: true,
        message: "Bookmark removed successfully",
        isBookmarked: false,
      };
    } else {
      // Add bookmark
      await db.insert(bookmarks).values({
        userId,
        contentType: data.contentType,
        contentId: data.contentId,
      });

      revalidatePath("/dashboard/bookmarks");

      return {
        success: true,
        message: "Bookmark added successfully",
        isBookmarked: true,
      };
    }
  } catch (error) {
    console.error("Error toggling bookmark:", error);
    return {
      success: false,
      message: "Failed to toggle bookmark",
    };
  }
}

// Check if content is bookmarked by current user
export async function checkBookmarkStatusAction(
  contentType: BookmarkContentType,
  contentId: string
): Promise<{ success: boolean; isBookmarked: boolean }> {
  try {
    const userId = await getCurrentUser();

    const bookmark = await db
      .select()
      .from(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.contentType, contentType),
          eq(bookmarks.contentId, contentId)
        )
      )
      .limit(1);

    return {
      success: true,
      isBookmarked: bookmark.length > 0,
    };
  } catch (error) {
    console.error("Error checking bookmark status:", error);
    return {
      success: false,
      isBookmarked: false,
    };
  }
}

// Get all bookmarked jobs for current user
export async function getBookmarkedJobsAction(): Promise<{
  success: boolean;
  data?: BookmarkedJobItem[];
  message?: string;
}> {
  try {
    const userId = await getCurrentUser();

    const bookmarkedJobs = await db
      .select({
        bookmarkId: bookmarks.id,
        bookmarkedAt: bookmarks.createdAt,
        jobId: jobs.id,
        title: jobs.title,
        description: jobs.description,
        location: jobs.location,
        locationType: jobs.locationType,
        requiredSkills: jobs.requiredSkills,
        employerId: jobs.employerId,
        companyName: users.companyName,
        fullName: users.fullName,
        companyLogo: users.companyLogo,
      })
      .from(bookmarks)
      .innerJoin(jobs, eq(bookmarks.contentId, jobs.id))
      .innerJoin(users, eq(jobs.employerId, users.id))
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.contentType, "job"))
      )
      .orderBy(desc(bookmarks.createdAt));

    const formattedJobs: BookmarkedJobItem[] = bookmarkedJobs.map((item) => ({
      id: item.jobId,
      title: item.title,
      company: item.companyName || item.fullName,
      companyLogo: item.companyLogo,
      location: item.location,
      description: item.description,
      skills: JSON.parse(item.requiredSkills || "[]"),
      locationType: item.locationType,
      bookmarkedAt: item.bookmarkedAt,
    }));

    return {
      success: true,
      data: formattedJobs,
    };
  } catch (error) {
    console.error("Error fetching bookmarked jobs:", error);
    return {
      success: false,
      message: "Failed to fetch bookmarked jobs",
    };
  }
}

// Remove specific bookmark
export async function removeBookmarkAction(
  contentType: BookmarkContentType,
  contentId: string
): Promise<BookmarkResult> {
  try {
    const userId = await getCurrentUser();

    const result = await db
      .delete(bookmarks)
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.contentType, contentType),
          eq(bookmarks.contentId, contentId)
        )
      );

    revalidatePath("/dashboard/bookmarks");

    return {
      success: true,
      message: "Bookmark removed successfully",
      isBookmarked: false,
    };
  } catch (error) {
    console.error("Error removing bookmark:", error);
    return {
      success: false,
      message: "Failed to remove bookmark",
    };
  }
}

// Get bookmark counts by content type for current user
export async function getBookmarkCountsAction(): Promise<{
  success: boolean;
  data?: {
    jobs: number;
    articles: number;
    videos: number;
    hotels: number;
  };
  message?: string;
}> {
  try {
    const userId = await getCurrentUser();

    const counts = await db
      .select({
        contentType: bookmarks.contentType,
        count: db.$count(bookmarks.id),
      })
      .from(bookmarks)
      .where(eq(bookmarks.userId, userId))
      .groupBy(bookmarks.contentType);

    const result = {
      jobs: 0,
      articles: 0,
      videos: 0,
      hotels: 0,
    };

    counts.forEach((item) => {
      const key =
        item.contentType === "job"
          ? "jobs"
          : item.contentType === "article"
            ? "articles"
            : item.contentType === "video"
              ? "videos"
              : "hotels";
      result[key] = Number(item.count);
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("Error fetching bookmark counts:", error);
    return {
      success: false,
      message: "Failed to fetch bookmark counts",
    };
  }
}

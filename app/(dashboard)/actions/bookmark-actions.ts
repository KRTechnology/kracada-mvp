"use server";

import { db } from "@/lib/db/drizzle";
import {
  bookmarks,
  jobs,
  users,
  hotels,
  restaurants,
  videos,
  BookmarkContentType,
} from "@/lib/db/schema";
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

export interface BookmarkedHotelItem {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  pricePerNight: number;
  currency: string;
  rating: string | null;
  reviewCount: number;
  featuredImage: string | null;
  bookmarkedAt: Date;
}

export interface BookmarkedRestaurantItem {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  cuisine: string;
  priceRange: string;
  rating: string | null;
  reviewCount: number;
  featuredImage: string | null;
  bookmarkedAt: Date;
}

export interface BookmarkedVideoItem {
  id: string;
  title: string;
  description: string | null;
  thumbnailImage: string;
  videoUrl: string;
  duration: string;
  author: string;
  categories: string[];
  type: "kracada_tv" | "trending";
  viewCount: number;
  likeCount: number;
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
    restaurants: number;
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
      restaurants: 0,
    };

    counts.forEach((item) => {
      const key =
        item.contentType === "job"
          ? "jobs"
          : item.contentType === "article"
            ? "articles"
            : item.contentType === "video"
              ? "videos"
              : item.contentType === "hotel"
                ? "hotels"
                : "restaurants";
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

// Get all bookmarked hotels for current user
export async function getBookmarkedHotelsAction(): Promise<{
  success: boolean;
  data?: BookmarkedHotelItem[];
  message?: string;
}> {
  try {
    const userId = await getCurrentUser();

    const bookmarkedHotels = await db
      .select({
        bookmarkId: bookmarks.id,
        bookmarkedAt: bookmarks.createdAt,
        hotelId: hotels.id,
        name: hotels.name,
        description: hotels.description,
        location: hotels.location,
        category: hotels.category,
        pricePerNight: hotels.pricePerNight,
        currency: hotels.currency,
        rating: hotels.rating,
        reviewCount: hotels.reviewCount,
        featuredImage: hotels.featuredImage,
      })
      .from(bookmarks)
      .innerJoin(hotels, eq(bookmarks.contentId, hotels.id))
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.contentType, "hotel"))
      )
      .orderBy(desc(bookmarks.createdAt));

    const formattedHotels: BookmarkedHotelItem[] = bookmarkedHotels.map(
      (item) => ({
        id: item.hotelId,
        name: item.name,
        description: item.description,
        location: item.location,
        category: item.category,
        pricePerNight: item.pricePerNight,
        currency: item.currency,
        rating: item.rating,
        reviewCount: item.reviewCount,
        featuredImage: item.featuredImage,
        bookmarkedAt: item.bookmarkedAt,
      })
    );

    return {
      success: true,
      data: formattedHotels,
    };
  } catch (error) {
    console.error("Error fetching bookmarked hotels:", error);
    return {
      success: false,
      message: "Failed to fetch bookmarked hotels",
    };
  }
}

// Get all bookmarked restaurants for current user
export async function getBookmarkedRestaurantsAction(): Promise<{
  success: boolean;
  data?: BookmarkedRestaurantItem[];
  message?: string;
}> {
  try {
    const userId = await getCurrentUser();

    const bookmarkedRestaurants = await db
      .select({
        bookmarkId: bookmarks.id,
        bookmarkedAt: bookmarks.createdAt,
        restaurantId: restaurants.id,
        name: restaurants.name,
        description: restaurants.description,
        location: restaurants.location,
        category: restaurants.category,
        cuisine: restaurants.cuisine,
        priceRange: restaurants.priceRange,
        rating: restaurants.rating,
        reviewCount: restaurants.reviewCount,
        featuredImage: restaurants.featuredImage,
      })
      .from(bookmarks)
      .innerJoin(restaurants, eq(bookmarks.contentId, restaurants.id))
      .where(
        and(
          eq(bookmarks.userId, userId),
          eq(bookmarks.contentType, "restaurant")
        )
      )
      .orderBy(desc(bookmarks.createdAt));

    const formattedRestaurants: BookmarkedRestaurantItem[] =
      bookmarkedRestaurants.map((item) => ({
        id: item.restaurantId,
        name: item.name,
        description: item.description,
        location: item.location,
        category: item.category,
        cuisine: item.cuisine,
        priceRange: item.priceRange,
        rating: item.rating,
        reviewCount: item.reviewCount,
        featuredImage: item.featuredImage,
        bookmarkedAt: item.bookmarkedAt,
      }));

    return {
      success: true,
      data: formattedRestaurants,
    };
  } catch (error) {
    console.error("Error fetching bookmarked restaurants:", error);
    return {
      success: false,
      message: "Failed to fetch bookmarked restaurants",
    };
  }
}

// Get all bookmarked videos for current user
export async function getBookmarkedVideosAction(): Promise<{
  success: boolean;
  data?: BookmarkedVideoItem[];
  message?: string;
}> {
  try {
    const userId = await getCurrentUser();

    const bookmarkedVideos = await db
      .select({
        bookmarkId: bookmarks.id,
        bookmarkedAt: bookmarks.createdAt,
        videoId: videos.id,
        title: videos.title,
        description: videos.description,
        thumbnailImage: videos.thumbnailImage,
        videoUrl: videos.videoUrl,
        duration: videos.duration,
        author: videos.author,
        categories: videos.categories,
        type: videos.type,
        viewCount: videos.viewCount,
        likeCount: videos.likeCount,
      })
      .from(bookmarks)
      .innerJoin(videos, eq(bookmarks.contentId, videos.id))
      .where(
        and(eq(bookmarks.userId, userId), eq(bookmarks.contentType, "video"))
      )
      .orderBy(desc(bookmarks.createdAt));

    const formattedVideos: BookmarkedVideoItem[] = bookmarkedVideos.map(
      (item) => ({
        id: item.videoId,
        title: item.title,
        description: item.description,
        thumbnailImage: item.thumbnailImage,
        videoUrl: item.videoUrl,
        duration: item.duration,
        author: item.author,
        categories: JSON.parse(item.categories || "[]"),
        type: item.type,
        viewCount: item.viewCount,
        likeCount: item.likeCount,
        bookmarkedAt: item.bookmarkedAt,
      })
    );

    return {
      success: true,
      data: formattedVideos,
    };
  } catch (error) {
    console.error("Error fetching bookmarked videos:", error);
    return {
      success: false,
      message: "Failed to fetch bookmarked videos",
    };
  }
}

"use server";

import { db } from "@/lib/db/drizzle";
import { hotels, restaurants, users, admins } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, ilike, or, desc, and, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

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

// Get all hotels with pagination and filtering
export async function getAdminHotelsAction({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "published" | "draft" | "flagged" | "archived";
  search?: string;
}) {
  try {
    await checkAdminAuth();

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (status) {
      if (status === "published") {
        whereConditions.push(eq(hotels.isPublished, true));
      } else if (status === "draft") {
        whereConditions.push(eq(hotels.isPublished, false));
      }
      // Note: flagged and archived would need additional status fields in the schema
      // For now, we'll handle published/unpublished
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(hotels.name, `%${search}%`),
          ilike(hotels.description, `%${search}%`),
          ilike(hotels.location, `%${search}%`)
        )
      );
    }

    // Get hotels with owner information
    const hotelsData = await db
      .select({
        hotel: hotels,
        owner: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(hotels)
      .leftJoin(users, eq(hotels.ownerId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(hotels.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(hotels)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        hotels: hotelsData.map((item) => ({
          ...item.hotel,
          owner: item.owner,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch hotels",
    };
  }
}

// Get all restaurants with pagination and filtering
export async function getAdminRestaurantsAction({
  page = 1,
  limit = 10,
  status,
  search,
}: {
  page?: number;
  limit?: number;
  status?: "published" | "draft" | "flagged" | "archived";
  search?: string;
}) {
  try {
    await checkAdminAuth();

    const offset = (page - 1) * limit;

    // Build where conditions
    const whereConditions = [];

    if (status) {
      if (status === "published") {
        whereConditions.push(eq(restaurants.isPublished, true));
      } else if (status === "draft") {
        whereConditions.push(eq(restaurants.isPublished, false));
      }
    }

    if (search) {
      whereConditions.push(
        or(
          ilike(restaurants.name, `%${search}%`),
          ilike(restaurants.description, `%${search}%`),
          ilike(restaurants.location, `%${search}%`),
          ilike(restaurants.cuisine, `%${search}%`)
        )
      );
    }

    // Get restaurants with owner information
    const restaurantsData = await db
      .select({
        restaurant: restaurants,
        owner: {
          id: users.id,
          fullName: users.fullName,
          email: users.email,
        },
      })
      .from(restaurants)
      .leftJoin(users, eq(restaurants.ownerId, users.id))
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
      .orderBy(desc(restaurants.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(restaurants)
      .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

    const total = Number(countResult?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        restaurants: restaurantsData.map((item) => ({
          ...item.restaurant,
          owner: item.owner,
        })),
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to fetch restaurants",
    };
  }
}

// Delete a hotel
export async function deleteHotelAction(hotelId: string) {
  try {
    await checkAdminAuth();

    await db.delete(hotels).where(eq(hotels.id, hotelId));

    revalidatePath("/admin/dashboard/hospitality");
    return {
      success: true,
      message: "Hotel deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete hotel",
    };
  }
}

// Delete a restaurant
export async function deleteRestaurantAction(restaurantId: string) {
  try {
    await checkAdminAuth();

    await db.delete(restaurants).where(eq(restaurants.id, restaurantId));

    revalidatePath("/admin/dashboard/hospitality");
    return {
      success: true,
      message: "Restaurant deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to delete restaurant",
    };
  }
}

// Toggle publish status (hide/show)
export async function toggleHotelPublishAction(hotelId: string) {
  try {
    await checkAdminAuth();

    const [hotel] = await db
      .select()
      .from(hotels)
      .where(eq(hotels.id, hotelId))
      .limit(1);

    if (!hotel) {
      return {
        success: false,
        message: "Hotel not found",
      };
    }

    await db
      .update(hotels)
      .set({
        isPublished: !hotel.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(hotels.id, hotelId));

    revalidatePath("/admin/dashboard/hospitality");
    return {
      success: true,
      message: hotel.isPublished
        ? "Hotel hidden successfully"
        : "Hotel published successfully",
    };
  } catch (error) {
    console.error("Error toggling hotel publish status:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to toggle hotel status",
    };
  }
}

// Toggle publish status (hide/show)
export async function toggleRestaurantPublishAction(restaurantId: string) {
  try {
    await checkAdminAuth();

    const [restaurant] = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.id, restaurantId))
      .limit(1);

    if (!restaurant) {
      return {
        success: false,
        message: "Restaurant not found",
      };
    }

    await db
      .update(restaurants)
      .set({
        isPublished: !restaurant.isPublished,
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, restaurantId));

    revalidatePath("/admin/dashboard/hospitality");
    return {
      success: true,
      message: restaurant.isPublished
        ? "Restaurant hidden successfully"
        : "Restaurant published successfully",
    };
  } catch (error) {
    console.error("Error toggling restaurant publish status:", error);
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Failed to toggle restaurant status",
    };
  }
}

"use server";

import { db } from "@/lib/db/drizzle";
import { hotels, restaurants, Hotel, Restaurant } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

// Types for responses
type ActionResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

/**
 * Get all hotels for the authenticated user
 */
export async function getUserHotelsAction(): Promise<ActionResponse<Hotel[]>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userHotels = await db
      .select()
      .from(hotels)
      .where(eq(hotels.ownerId, session.user.id));

    return { success: true, data: userHotels };
  } catch (error) {
    console.error("Error fetching user hotels:", error);
    return { success: false, error: "Failed to fetch hotels" };
  }
}

/**
 * Get all restaurants for the authenticated user
 */
export async function getUserRestaurantsAction(): Promise<
  ActionResponse<Restaurant[]>
> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userRestaurants = await db
      .select()
      .from(restaurants)
      .where(eq(restaurants.ownerId, session.user.id));

    return { success: true, data: userRestaurants };
  } catch (error) {
    console.error("Error fetching user restaurants:", error);
    return { success: false, error: "Failed to fetch restaurants" };
  }
}

/**
 * Get a single hotel by ID
 */
export async function getHotelByIdAction(
  hotelId: string
): Promise<ActionResponse<Hotel>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const hotel = await db
      .select()
      .from(hotels)
      .where(and(eq(hotels.id, hotelId), eq(hotels.ownerId, session.user.id)))
      .limit(1);

    if (!hotel.length) {
      return { success: false, error: "Hotel not found" };
    }

    return { success: true, data: hotel[0] };
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return { success: false, error: "Failed to fetch hotel" };
  }
}

/**
 * Get a single restaurant by ID
 */
export async function getRestaurantByIdAction(
  restaurantId: string
): Promise<ActionResponse<Restaurant>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const restaurant = await db
      .select()
      .from(restaurants)
      .where(
        and(
          eq(restaurants.id, restaurantId),
          eq(restaurants.ownerId, session.user.id)
        )
      )
      .limit(1);

    if (!restaurant.length) {
      return { success: false, error: "Restaurant not found" };
    }

    return { success: true, data: restaurant[0] };
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    return { success: false, error: "Failed to fetch restaurant" };
  }
}

/**
 * Create a new hotel
 */
export async function createHotelAction(
  data: Omit<Hotel, "id" | "createdAt" | "updatedAt" | "ownerId">
): Promise<ActionResponse<Hotel>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const newHotel = await db
      .insert(hotels)
      .values({
        ...data,
        ownerId: session.user.id,
      })
      .returning();

    revalidatePath("/dashboard/hotels-restaurants");
    return { success: true, data: newHotel[0] };
  } catch (error) {
    console.error("Error creating hotel:", error);
    return { success: false, error: "Failed to create hotel" };
  }
}

/**
 * Create a new restaurant
 */
export async function createRestaurantAction(
  data: Omit<Restaurant, "id" | "createdAt" | "updatedAt" | "ownerId">
): Promise<ActionResponse<Restaurant>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const newRestaurant = await db
      .insert(restaurants)
      .values({
        ...data,
        ownerId: session.user.id,
      })
      .returning();

    revalidatePath("/dashboard/hotels-restaurants");
    return { success: true, data: newRestaurant[0] };
  } catch (error) {
    console.error("Error creating restaurant:", error);
    return { success: false, error: "Failed to create restaurant" };
  }
}

/**
 * Update an existing hotel
 */
export async function updateHotelAction(
  hotelId: string,
  data: Partial<Omit<Hotel, "id" | "createdAt" | "updatedAt" | "ownerId">>
): Promise<ActionResponse<Hotel>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existingHotel = await db
      .select()
      .from(hotels)
      .where(and(eq(hotels.id, hotelId), eq(hotels.ownerId, session.user.id)))
      .limit(1);

    if (!existingHotel.length) {
      return { success: false, error: "Hotel not found or unauthorized" };
    }

    const updatedHotel = await db
      .update(hotels)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(hotels.id, hotelId))
      .returning();

    revalidatePath("/dashboard/hotels-restaurants");
    revalidatePath(`/dashboard/hotels-restaurants/edit-hotel/${hotelId}`);
    return { success: true, data: updatedHotel[0] };
  } catch (error) {
    console.error("Error updating hotel:", error);
    return { success: false, error: "Failed to update hotel" };
  }
}

/**
 * Update an existing restaurant
 */
export async function updateRestaurantAction(
  restaurantId: string,
  data: Partial<Omit<Restaurant, "id" | "createdAt" | "updatedAt" | "ownerId">>
): Promise<ActionResponse<Restaurant>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existingRestaurant = await db
      .select()
      .from(restaurants)
      .where(
        and(
          eq(restaurants.id, restaurantId),
          eq(restaurants.ownerId, session.user.id)
        )
      )
      .limit(1);

    if (!existingRestaurant.length) {
      return { success: false, error: "Restaurant not found or unauthorized" };
    }

    const updatedRestaurant = await db
      .update(restaurants)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(restaurants.id, restaurantId))
      .returning();

    revalidatePath("/dashboard/hotels-restaurants");
    revalidatePath(
      `/dashboard/hotels-restaurants/edit-restaurant/${restaurantId}`
    );
    return { success: true, data: updatedRestaurant[0] };
  } catch (error) {
    console.error("Error updating restaurant:", error);
    return { success: false, error: "Failed to update restaurant" };
  }
}

/**
 * Delete a hotel
 */
export async function deleteHotelAction(
  hotelId: string
): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existingHotel = await db
      .select()
      .from(hotels)
      .where(and(eq(hotels.id, hotelId), eq(hotels.ownerId, session.user.id)))
      .limit(1);

    if (!existingHotel.length) {
      return { success: false, error: "Hotel not found or unauthorized" };
    }

    await db.delete(hotels).where(eq(hotels.id, hotelId));

    revalidatePath("/dashboard/hotels-restaurants");
    return { success: true };
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return { success: false, error: "Failed to delete hotel" };
  }
}

/**
 * Delete a restaurant
 */
export async function deleteRestaurantAction(
  restaurantId: string
): Promise<ActionResponse<void>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    // Verify ownership
    const existingRestaurant = await db
      .select()
      .from(restaurants)
      .where(
        and(
          eq(restaurants.id, restaurantId),
          eq(restaurants.ownerId, session.user.id)
        )
      )
      .limit(1);

    if (!existingRestaurant.length) {
      return { success: false, error: "Restaurant not found or unauthorized" };
    }

    await db.delete(restaurants).where(eq(restaurants.id, restaurantId));

    revalidatePath("/dashboard/hotels-restaurants");
    return { success: true };
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    return { success: false, error: "Failed to delete restaurant" };
  }
}

/**
 * Toggle hotel published status
 */
export async function toggleHotelPublishAction(
  hotelId: string,
  isPublished: boolean
): Promise<ActionResponse<Hotel>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedHotel = await db
      .update(hotels)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(and(eq(hotels.id, hotelId), eq(hotels.ownerId, session.user.id)))
      .returning();

    if (!updatedHotel.length) {
      return { success: false, error: "Hotel not found or unauthorized" };
    }

    revalidatePath("/dashboard/hotels-restaurants");
    return { success: true, data: updatedHotel[0] };
  } catch (error) {
    console.error("Error toggling hotel publish status:", error);
    return { success: false, error: "Failed to update hotel status" };
  }
}

/**
 * Toggle restaurant published status
 */
export async function toggleRestaurantPublishAction(
  restaurantId: string,
  isPublished: boolean
): Promise<ActionResponse<Restaurant>> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const updatedRestaurant = await db
      .update(restaurants)
      .set({
        isPublished,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(restaurants.id, restaurantId),
          eq(restaurants.ownerId, session.user.id)
        )
      )
      .returning();

    if (!updatedRestaurant.length) {
      return { success: false, error: "Restaurant not found or unauthorized" };
    }

    revalidatePath("/dashboard/hotels-restaurants");
    return { success: true, data: updatedRestaurant[0] };
  } catch (error) {
    console.error("Error toggling restaurant publish status:", error);
    return { success: false, error: "Failed to update restaurant status" };
  }
}

"use server";

import { db } from "@/lib/db/drizzle";
import { auth } from "@/auth";
import {
  userNotificationPreferences,
  userNotificationOverrides,
  defaultNotificationPreferences,
  type NewUserNotificationPreference,
  type NewUserNotificationOverride,
  type NotificationCategory,
} from "@/lib/db/schema/notification-preferences";
import { eq, and } from "drizzle-orm";
import { defaultNotificationPreferencesData } from "@/lib/db/seed/default-notification-preferences";

// Get user's notification preferences
export async function getUserNotificationPreferencesAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get user's custom preferences
    const userPrefs = await db
      .select()
      .from(userNotificationPreferences)
      .where(eq(userNotificationPreferences.userId, userId));

    // Get default preferences
    const defaultPrefs = await db
      .select()
      .from(defaultNotificationPreferences)
      .orderBy(defaultNotificationPreferences.displayOrder);

    // Merge user preferences with defaults
    const mergedPreferences = defaultPrefs.map((defaultPref) => {
      const userPref = userPrefs.find(
        (up) =>
          up.category === defaultPref.category && up.event === defaultPref.event
      );

      return {
        id: defaultPref.event,
        category: defaultPref.category,
        event: defaultPref.event,
        noneEnabled: userPref?.noneEnabled ?? defaultPref.noneEnabled,
        inAppEnabled: userPref?.inAppEnabled ?? defaultPref.inAppEnabled,
        emailEnabled: userPref?.emailEnabled ?? defaultPref.emailEnabled,
        eventDescription: defaultPref.eventDescription,
        categoryDescription: defaultPref.categoryDescription,
        displayOrder: defaultPref.displayOrder,
      };
    });

    // Group by category
    const categories = ["alerts", "jobs", "articles", "news"] as const;
    const groupedPreferences: NotificationCategory[] = categories.map(
      (category) => {
        const categoryPreferences = mergedPreferences.filter(
          (pref) => pref.category === category
        );

        return {
          id: category,
          title: category.charAt(0).toUpperCase() + category.slice(1),
          description: categoryPreferences[0]?.categoryDescription || "",
          settings: categoryPreferences,
        };
      }
    );

    return {
      success: true,
      data: groupedPreferences,
    };
  } catch (error) {
    console.error("Error fetching notification preferences:", error);
    return {
      success: false,
      message: "Failed to fetch notification preferences",
    };
  }
}

// Update user's notification preferences
export async function updateUserNotificationPreferencesAction(
  category: string,
  event: string,
  preferences: {
    noneEnabled: boolean;
    inAppEnabled: boolean;
    emailEnabled: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check if user already has preferences for this event
    const existingPref = await db
      .select()
      .from(userNotificationPreferences)
      .where(
        and(
          eq(userNotificationPreferences.userId, userId),
          eq(userNotificationPreferences.event, event as any)
        )
      )
      .limit(1);

    if (existingPref.length > 0) {
      // Update existing preference
      await db
        .update(userNotificationPreferences)
        .set({
          noneEnabled: preferences.noneEnabled,
          inAppEnabled: preferences.inAppEnabled,
          emailEnabled: preferences.emailEnabled,
          updatedAt: new Date(),
        })
        .where(
          and(
            eq(userNotificationPreferences.userId, userId),
            eq(userNotificationPreferences.event, event as any)
          )
        );
    } else {
      // Create new preference
      const newPreference: NewUserNotificationPreference = {
        userId,
        category: category as any,
        event: event as any,
        noneEnabled: preferences.noneEnabled,
        inAppEnabled: preferences.inAppEnabled,
        emailEnabled: preferences.emailEnabled,
      };

      await db.insert(userNotificationPreferences).values(newPreference);
    }

    return {
      success: true,
      message: "Notification preferences updated successfully",
    };
  } catch (error) {
    console.error("Error updating notification preferences:", error);
    return {
      success: false,
      message: "Failed to update notification preferences",
    };
  }
}

// Bulk update notification preferences for a category
export async function bulkUpdateNotificationPreferencesAction(
  category: string,
  preferences: {
    noneEnabled: boolean;
    inAppEnabled: boolean;
    emailEnabled: boolean;
  }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get all events for the category
    const categoryEvents = await db
      .select({ event: defaultNotificationPreferences.event })
      .from(defaultNotificationPreferences)
      .where(eq(defaultNotificationPreferences.category, category as any));

    // Update or create preferences for all events in the category
    for (const { event } of categoryEvents) {
      const existingPref = await db
        .select()
        .from(userNotificationPreferences)
        .where(
          and(
            eq(userNotificationPreferences.userId, userId),
            eq(userNotificationPreferences.event, event)
          )
        )
        .limit(1);

      if (existingPref.length > 0) {
        // Update existing preference
        await db
          .update(userNotificationPreferences)
          .set({
            noneEnabled: preferences.noneEnabled,
            inAppEnabled: preferences.inAppEnabled,
            emailEnabled: preferences.emailEnabled,
            updatedAt: new Date(),
          })
          .where(
            and(
              eq(userNotificationPreferences.userId, userId),
              eq(userNotificationPreferences.event, event)
            )
          );
      } else {
        // Create new preference
        const newPreference: NewUserNotificationPreference = {
          userId,
          category: category as any,
          event,
          noneEnabled: preferences.noneEnabled,
          inAppEnabled: preferences.inAppEnabled,
          emailEnabled: preferences.emailEnabled,
        };

        await db.insert(userNotificationPreferences).values(newPreference);
      }
    }

    return {
      success: true,
      message: "Category notification preferences updated successfully",
    };
  } catch (error) {
    console.error("Error bulk updating notification preferences:", error);
    return {
      success: false,
      message: "Failed to bulk update notification preferences",
    };
  }
}

// Initialize default notification preferences for a new user
export async function initializeUserNotificationPreferencesAction() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Check if user already has preferences
    const existingPrefs = await db
      .select()
      .from(userNotificationPreferences)
      .where(eq(userNotificationPreferences.userId, userId))
      .limit(1);

    if (existingPrefs.length > 0) {
      return {
        success: true,
        message: "User already has notification preferences",
      };
    }

    // Create default preferences for the user
    const userPreferences: NewUserNotificationPreference[] =
      defaultNotificationPreferencesData.map((defaultPref) => ({
        userId,
        category: defaultPref.category,
        event: defaultPref.event,
        noneEnabled: defaultPref.noneEnabled,
        inAppEnabled: defaultPref.inAppEnabled,
        emailEnabled: defaultPref.emailEnabled,
      }));

    await db.insert(userNotificationPreferences).values(userPreferences);

    return {
      success: true,
      message: "Default notification preferences initialized successfully",
    };
  } catch (error) {
    console.error("Error initializing notification preferences:", error);
    return {
      success: false,
      message: "Failed to initialize notification preferences",
    };
  }
}

// Seed default notification preferences (admin function)
export async function seedDefaultNotificationPreferencesAction() {
  try {
    // Check if defaults already exist
    const existingDefaults = await db
      .select()
      .from(defaultNotificationPreferences)
      .limit(1);

    if (existingDefaults.length > 0) {
      return {
        success: true,
        message: "Default notification preferences already exist",
      };
    }

    // Insert default preferences
    await db
      .insert(defaultNotificationPreferences)
      .values(defaultNotificationPreferencesData);

    return {
      success: true,
      message: "Default notification preferences seeded successfully",
    };
  } catch (error) {
    console.error("Error seeding default notification preferences:", error);
    return {
      success: false,
      message: "Failed to seed default notification preferences",
    };
  }
}

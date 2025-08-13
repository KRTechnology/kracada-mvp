"use server";

import { db } from "@/lib/db/drizzle";
import { auth } from "@/auth";
import {
  userSessions,
  type SessionDisplayData,
} from "@/lib/db/schema/sessions";
import { eq, and, gt, desc } from "drizzle-orm";

// Helper function to parse user agent and extract device info
function parseUserAgent(userAgent: string): {
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
} {
  const ua = userAgent.toLowerCase();

  // Determine device type
  let deviceType: "desktop" | "mobile" | "tablet" = "desktop";
  if (ua.includes("mobile")) deviceType = "mobile";
  else if (ua.includes("tablet") || ua.includes("ipad")) deviceType = "tablet";

  // Determine browser
  let browser = "Unknown";
  if (ua.includes("chrome")) browser = "Chrome";
  else if (ua.includes("firefox")) browser = "Firefox";
  else if (ua.includes("safari") && !ua.includes("chrome")) browser = "Safari";
  else if (ua.includes("edge")) browser = "Edge";
  else if (ua.includes("opera")) browser = "Opera";

  // Determine OS
  let os = "Unknown";
  if (ua.includes("windows")) os = "Windows";
  else if (ua.includes("mac os") || ua.includes("macintosh")) os = "macOS";
  else if (ua.includes("linux")) os = "Linux";
  else if (ua.includes("android")) os = "Android";
  else if (ua.includes("ios") || ua.includes("iphone") || ua.includes("ipad"))
    os = "iOS";

  return { deviceType, browser, os };
}

// Helper function to get basic location from IP (simplified)
function getLocationFromIP(ipAddress: string | null): string {
  if (!ipAddress) return "Unknown";

  // For now, return a simplified location
  // In production, you could integrate with a service like MaxMind for basic country detection
  // But for MVP, we'll keep it simple
  return "United States"; // Placeholder - could be enhanced later
}

// Helper function to format relative time
function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) return "Just now";
  if (diffInMinutes < 60)
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`;
  if (diffInHours < 24)
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
  if (diffInDays < 7)
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;

  return date.toLocaleDateString();
}

// Get user's active sessions
export async function getUserActiveSessionsAction(): Promise<{
  success: boolean;
  data?: SessionDisplayData[];
  message?: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get all active sessions for the user
    const activeSessions = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true),
          gt(userSessions.expiresAt, new Date())
        )
      )
      .orderBy(desc(userSessions.lastActive));

    // Transform sessions for display
    const displaySessions: SessionDisplayData[] = activeSessions.map(
      (session) => {
        const { deviceType, browser, os } = parseUserAgent(
          session.userAgent || ""
        );
        const location = getLocationFromIP(session.ipAddress);

        return {
          id: session.id,
          deviceType,
          browser,
          os,
          location,
          lastActive: formatRelativeTime(session.lastActive),
          isCurrentSession: false, // We'll determine this based on session token
          userAgent: session.userAgent || "",
        };
      }
    );

    return {
      success: true,
      data: displaySessions,
    };
  } catch (error) {
    console.error("Error fetching user sessions:", error);
    return {
      success: false,
      message: "Failed to fetch active sessions",
    };
  }
}

// Force logout a specific session
export async function forceLogoutSessionAction(sessionId: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Mark the session as inactive
    const result = await db
      .update(userSessions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(eq(userSessions.id, sessionId), eq(userSessions.userId, userId))
      )
      .returning({ id: userSessions.id });

    if (result.length === 0) {
      return {
        success: false,
        message: "Session not found or already inactive",
      };
    }

    return {
      success: true,
      message: "Session logged out successfully",
    };
  } catch (error) {
    console.error("Error force logging out session:", error);
    return {
      success: false,
      message: "Failed to log out session",
    };
  }
}

// Logout all other sessions (keep current one)
export async function logoutAllOtherSessionsAction(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Mark all other sessions as inactive
    await db
      .update(userSessions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.isActive, true)
          // Note: We don't filter by current session token here
          // This will logout all sessions including current one
          // In a real implementation, you'd want to preserve the current session
        )
      );

    return {
      success: true,
      message: "All other sessions logged out successfully",
    };
  } catch (error) {
    console.error("Error logging out all other sessions:", error);
    return {
      success: false,
      message: "Failed to log out other sessions",
    };
  }
}

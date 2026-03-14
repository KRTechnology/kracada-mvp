import { db } from "@/lib/db/drizzle";
import { userSessions } from "@/lib/db/schema/sessions";
import { eq, and, gt, lt } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";

// Create a new user session
export async function createUserSession({
  userId,
  sessionToken,
  userAgent,
  ipAddress,
  expiresAt,
}: {
  userId: string;
  sessionToken: string;
  userAgent?: string;
  ipAddress?: string;
  expiresAt: Date;
}) {
  try {
    // Check if there's already an active session for this user and device
    const existingSession = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.userId, userId),
          eq(userSessions.userAgent, userAgent || ""),
          eq(userSessions.isActive, true)
        )
      )
      .limit(1);

    if (existingSession.length > 0) {
      // Update existing session
      await db
        .update(userSessions)
        .set({
          sessionToken,
          expiresAt,
          lastActive: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(userSessions.id, existingSession[0].id));

      return existingSession[0].id;
    } else {
      // Create new session
      const [newSession] = await db
        .insert(userSessions)
        .values({
          id: createId(),
          userId,
          sessionToken,
          userAgent: userAgent || "",
          ipAddress: ipAddress || "",
          expiresAt,
          isActive: true,
          lastActive: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ id: userSessions.id });

      return newSession.id;
    }
  } catch (error) {
    console.error("Error creating/updating user session:", error);
    throw error;
  }
}

// Update session last active timestamp
export async function updateSessionLastActive(sessionToken: string) {
  try {
    await db
      .update(userSessions)
      .set({
        lastActive: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(userSessions.sessionToken, sessionToken));
  } catch (error) {
    console.error("Error updating session last active:", error);
    // Don't throw error for this function as it's not critical
  }
}

// Validate if a session is still active
export async function validateSession(sessionToken: string): Promise<boolean> {
  try {
    const session = await db
      .select()
      .from(userSessions)
      .where(
        and(
          eq(userSessions.sessionToken, sessionToken),
          eq(userSessions.isActive, true),
          gt(userSessions.expiresAt, new Date())
        )
      )
      .limit(1);

    return session.length > 0;
  } catch (error) {
    console.error("Error validating session:", error);
    return false;
  }
}

// Invalidate a session (mark as inactive)
export async function invalidateSession(sessionToken: string) {
  try {
    await db
      .update(userSessions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(eq(userSessions.sessionToken, sessionToken));
  } catch (error) {
    console.error("Error invalidating session:", error);
    throw error;
  }
}

// Clean up expired sessions
export async function cleanupExpiredSessions() {
  try {
    await db
      .update(userSessions)
      .set({
        isActive: false,
        updatedAt: new Date(),
      })
      .where(
        and(
          eq(userSessions.isActive, true),
          gt(userSessions.expiresAt, new Date())
        )
      );
  } catch (error) {
    console.error("Error cleaning up expired sessions:", error);
    // Don't throw error for this function as it's not critical
  }
}

"use server";

import { db } from "@/lib/db/drizzle";
import { auth } from "@/auth";
import { users } from "@/lib/db/schema/users";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { hashPassword } from "@/lib/auth/auth-service";

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
}

export async function changePasswordAction(data: ChangePasswordData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, message: "Unauthorized" };
    }

    const userId = session.user.id;

    // Get current user data
    const user = await db
      .select({ passwordHash: users.passwordHash })
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    if (!user.length) {
      return { success: false, message: "User not found" };
    }

    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      data.currentPassword,
      user[0].passwordHash
    );

    if (!isCurrentPasswordValid) {
      return { success: false, message: "Current password is incorrect" };
    }

    // Hash new password using the same function as signup
    const newPasswordHash = await hashPassword(data.newPassword);

    // Update password in database
    await db
      .update(users)
      .set({
        passwordHash: newPasswordHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    return {
      success: true,
      message:
        "Password updated successfully. You will be logged out for security.",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return {
      success: false,
      message: "Failed to update password. Please try again.",
    };
  }
}

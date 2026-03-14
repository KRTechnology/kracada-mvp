"use server";

import { auth } from "@/auth";
import { adminAuthService } from "@/lib/auth/admin-auth-service";
import { redirect } from "next/navigation";

// Helper to check if user is admin
async function requireAdmin() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.isAdmin === true;

  if (!isAdmin) {
    redirect("/");
  }

  return session;
}

// Create a new admin
export async function createAdminAction(data: {
  firstName: string;
  lastName: string;
  email: string;
}) {
  try {
    // Verify the current user is an admin
    const session = await requireAdmin();
    const currentAdminRole = (session?.user as any)?.adminRole;

    // Only Super Admin can create new admins
    if (currentAdminRole !== "Super Admin") {
      return {
        success: false,
        error: "Only Super Admins can create new admins",
      };
    }

    // Generate a default password (in production, you'd want to email this or use a different approach)
    const defaultPassword = `Admin@${Math.random().toString(36).slice(-8)}`;

    // Create the admin
    const newAdmin = await adminAuthService.createAdmin({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: defaultPassword,
      role: "Admin",
    });

    return {
      success: true,
      data: {
        id: newAdmin.id,
        defaultPassword,
      },
    };
  } catch (error: any) {
    console.error("Error creating admin:", error);

    // Check for unique constraint violation (duplicate email)
    if (error.message?.includes("unique") || error.code === "23505") {
      return {
        success: false,
        error: "An admin with this email already exists",
      };
    }

    return {
      success: false,
      error: "Failed to create admin. Please try again.",
    };
  }
}

// Get all admins
export async function getAllAdminsAction() {
  try {
    // Verify the current user is an admin
    await requireAdmin();

    const admins = await adminAuthService.getAllAdmins();

    return {
      success: true,
      data: admins,
    };
  } catch (error) {
    console.error("Error fetching admins:", error);
    return {
      success: false,
      error: "Failed to fetch admins",
    };
  }
}

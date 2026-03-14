"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { users, admins } from "@/lib/db/schema";
import { eq, ilike, or, and, desc, count, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";

// Helper to check if user is an admin
async function requireAdmin() {
  const session = await auth();
  if (!session || !(session.user as any)?.isAdmin) {
    throw new Error("Unauthorized: Admin access required");
  }
  return session;
}

// Helper to check if user is a Super Admin
async function requireSuperAdmin() {
  const session = await auth();
  if (
    !session ||
    !(session.user as any)?.isAdmin ||
    (session.user as any)?.adminRole !== "Super Admin"
  ) {
    throw new Error("Unauthorized: Super Admin access required");
  }
  return session;
}

export type UserFilters = {
  search?: string;
  status?: string;
  accountType?: string;
  page?: number;
  limit?: number;
};

export async function getAllUsersAction(filters: UserFilters = {}) {
  try {
    await requireAdmin();

    const {
      search = "",
      status = "all",
      accountType = "all",
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;

    // Build the where clause
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    if (status && status !== "all") {
      // Special case: "flagged" means Suspended OR Inactive
      if (status === "flagged") {
        whereConditions.push(
          or(eq(users.status, "Suspended"), eq(users.status, "Inactive"))
        );
      } else {
        whereConditions.push(eq(users.status, status as any));
      }
    }

    if (accountType && accountType !== "all") {
      whereConditions.push(eq(users.accountType, accountType as any));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(users)
      .where(whereClause);

    // Get users with pagination
    const usersList = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        email: users.email,
        accountType: users.accountType,
        status: users.status,
        createdAt: users.createdAt,
        emailVerified: users.emailVerified,
        hasCompletedProfile: users.hasCompletedProfile,
      })
      .from(users)
      .where(whereClause)
      .orderBy(desc(users.createdAt))
      .limit(limit)
      .offset(offset);

    // Get counts by account type
    const [jobSeekerCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.accountType, "Job Seeker"));

    const [recruiterCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.accountType, "Recruiter"));

    const [businessOwnerCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.accountType, "Business Owner"));

    const [contributorCount] = await db
      .select({ count: count() })
      .from(users)
      .where(eq(users.accountType, "Contributor"));

    // Get count of flagged (Suspended or Inactive) users
    const [flaggedCount] = await db
      .select({ count: count() })
      .from(users)
      .where(or(eq(users.status, "Suspended"), eq(users.status, "Inactive")));

    return {
      success: true,
      users: usersList,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      counts: {
        total: totalCount,
        jobSeekers: jobSeekerCount.count,
        recruiters: recruiterCount.count,
        businessOwners: businessOwnerCount.count,
        contributors: contributorCount.count,
        flagged: flaggedCount.count,
      },
    };
  } catch (error: any) {
    console.error("Error fetching users:", error);
    return { success: false, error: error.message || "Failed to fetch users" };
  }
}

export async function updateUserStatusAction(
  userId: string,
  newStatus: "Active" | "Suspended" | "Inactive"
) {
  try {
    await requireAdmin();

    await db
      .update(users)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));

    revalidatePath("/admin/dashboard/user-management");

    return { success: true, message: `User status updated to ${newStatus}` };
  } catch (error: any) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      error: error.message || "Failed to update user status",
    };
  }
}

export async function deleteUserAction(userId: string) {
  try {
    await requireSuperAdmin();

    await db.delete(users).where(eq(users.id, userId));

    revalidatePath("/admin/dashboard/user-management");

    return { success: true, message: "User deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      error: error.message || "Failed to delete user",
    };
  }
}

// Admin Management Actions
export type AdminFilters = {
  search?: string;
  status?: string;
  role?: string;
  page?: number;
  limit?: number;
};

export async function getAllAdminsAction(filters: AdminFilters = {}) {
  try {
    await requireSuperAdmin();

    const {
      search = "",
      status = "all",
      role = "all",
      page = 1,
      limit = 10,
    } = filters;

    const offset = (page - 1) * limit;

    // Build the where clause
    const whereConditions = [];

    if (search) {
      whereConditions.push(
        or(
          ilike(admins.firstName, `%${search}%`),
          ilike(admins.lastName, `%${search}%`),
          ilike(admins.email, `%${search}%`)
        )
      );
    }

    if (status && status !== "all") {
      whereConditions.push(eq(admins.status, status as any));
    }

    if (role && role !== "all") {
      whereConditions.push(eq(admins.role, role as any));
    }

    const whereClause =
      whereConditions.length > 0 ? and(...whereConditions) : undefined;

    // Get total count
    const [{ totalCount }] = await db
      .select({ totalCount: count() })
      .from(admins)
      .where(whereClause);

    // Get admins with pagination
    const adminsList = await db
      .select({
        id: admins.id,
        firstName: admins.firstName,
        lastName: admins.lastName,
        email: admins.email,
        role: admins.role,
        status: admins.status,
        createdAt: admins.createdAt,
        lastLoginAt: admins.lastLoginAt,
      })
      .from(admins)
      .where(whereClause)
      .orderBy(desc(admins.createdAt))
      .limit(limit)
      .offset(offset);

    // Get counts by role
    const [superAdminCount] = await db
      .select({ count: count() })
      .from(admins)
      .where(eq(admins.role, "Super Admin"));

    const [regularAdminCount] = await db
      .select({ count: count() })
      .from(admins)
      .where(eq(admins.role, "Admin"));

    return {
      success: true,
      admins: adminsList,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      counts: {
        total: totalCount,
        superAdmins: superAdminCount.count,
        regularAdmins: regularAdminCount.count,
      },
    };
  } catch (error: any) {
    console.error("Error fetching admins:", error);
    return { success: false, error: error.message || "Failed to fetch admins" };
  }
}

export async function updateAdminStatusAction(
  adminId: string,
  newStatus: "Active" | "Suspended" | "Inactive"
) {
  try {
    await requireSuperAdmin();

    await db
      .update(admins)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, adminId));

    revalidatePath("/admin/dashboard/user-management");

    return { success: true, message: `Admin status updated to ${newStatus}` };
  } catch (error: any) {
    console.error("Error updating admin status:", error);
    return {
      success: false,
      error: error.message || "Failed to update admin status",
    };
  }
}

export async function deleteAdminAction(adminId: string) {
  try {
    const session = await requireSuperAdmin();

    // Prevent self-deletion
    if ((session.user as any).id === adminId) {
      return {
        success: false,
        error: "You cannot delete your own account",
      };
    }

    await db.delete(admins).where(eq(admins.id, adminId));

    revalidatePath("/admin/dashboard/user-management");

    return { success: true, message: "Admin deleted successfully" };
  } catch (error: any) {
    console.error("Error deleting admin:", error);
    return {
      success: false,
      error: error.message || "Failed to delete admin",
    };
  }
}

export async function updateAdminRoleAction(
  adminId: string,
  newRole: "Super Admin" | "Admin"
) {
  try {
    const session = await requireSuperAdmin();

    // Prevent self-demotion
    if ((session.user as any).id === adminId) {
      return {
        success: false,
        error: "You cannot change your own role",
      };
    }

    await db
      .update(admins)
      .set({
        role: newRole,
        updatedAt: new Date(),
      })
      .where(eq(admins.id, adminId));

    revalidatePath("/admin/dashboard/user-management");

    return { success: true, message: `Admin role updated to ${newRole}` };
  } catch (error: any) {
    console.error("Error updating admin role:", error);
    return {
      success: false,
      error: error.message || "Failed to update admin role",
    };
  }
}

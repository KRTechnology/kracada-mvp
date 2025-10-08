import { db } from "@/lib/db/drizzle";
import { admins, type NewAdmin, type Admin } from "@/lib/db/schema/admins";
import { eq } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import bcrypt from "bcryptjs";

// Generate a salt and hash the password
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Verify a password against a hash
export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// Admin Authentication Service
export const adminAuthService = {
  // Create a new admin
  async createAdmin(
    adminData: Omit<NewAdmin, "id" | "passwordHash"> & { password: string }
  ): Promise<{ id: string }> {
    const passwordHash = await hashPassword(adminData.password);

    const [newAdmin] = await db
      .insert(admins)
      .values({
        id: createId(),
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
        passwordHash,
        role: adminData.role || "Admin",
      })
      .returning({ id: admins.id });

    return { id: newAdmin.id };
  },

  // Find an admin by email
  async getAdminByEmail(email: string): Promise<Admin | null> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.email, email))
      .limit(1);
    return admin || null;
  },

  // Find an admin by ID
  async getAdminById(id: string): Promise<Admin | null> {
    const [admin] = await db
      .select()
      .from(admins)
      .where(eq(admins.id, id))
      .limit(1);
    return admin || null;
  },

  // Authenticate an admin
  async authenticateAdmin(
    email: string,
    password: string
  ): Promise<{
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  } | null> {
    const admin = await this.getAdminByEmail(email);

    if (!admin) return null;

    const passwordValid = await verifyPassword(password, admin.passwordHash);

    if (!passwordValid) return null;

    // Update last login time
    await db
      .update(admins)
      .set({ lastLoginAt: new Date() })
      .where(eq(admins.id, admin.id));

    return {
      id: admin.id,
      email: admin.email,
      firstName: admin.firstName,
      lastName: admin.lastName,
      role: admin.role,
    };
  },

  // Get all admins (for listing)
  async getAllAdmins(): Promise<Omit<Admin, "passwordHash">[]> {
    const allAdmins = await db
      .select({
        id: admins.id,
        firstName: admins.firstName,
        lastName: admins.lastName,
        email: admins.email,
        role: admins.role,
        createdAt: admins.createdAt,
        updatedAt: admins.updatedAt,
        lastLoginAt: admins.lastLoginAt,
      })
      .from(admins);

    return allAdmins;
  },
};

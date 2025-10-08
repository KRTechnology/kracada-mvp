import { db, pool } from "@/lib/db/drizzle";
import { admins } from "@/lib/db/schema/admins";
import { adminAuthService } from "@/lib/auth/admin-auth-service";
import { eq } from "drizzle-orm";

async function seedSuperAdmin() {
  try {
    console.log("🌱 Starting super admin seed...");

    // Check if super admin already exists
    const existingSuperAdmin = await adminAuthService.getAdminByEmail(
      "super-admin@kimberly-ryan.net"
    );

    if (existingSuperAdmin) {
      console.log("✅ Super admin already exists. Skipping seed.");
      return;
    }

    // Create super admin
    const superAdmin = await adminAuthService.createAdmin({
      firstName: "Super",
      lastName: "Admin",
      email: "super-admin@kimberly-ryan.net",
      password: "Password@123",
      role: "Super Admin",
    });

    console.log("✅ Super admin created successfully!");
    console.log(`   ID: ${superAdmin.id}`);
    console.log(`   Email: super-admin@kimberly-ryan.net`);
    console.log(`   Password: Password@123`);
    console.log("\n🎉 Seed completed!");
  } catch (error) {
    console.error("❌ Error seeding super admin:", error);
    throw error;
  } finally {
    // Close the database connection
    await pool.end();
  }
}

// Run the seed function
seedSuperAdmin();

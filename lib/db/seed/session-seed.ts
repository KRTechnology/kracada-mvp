import { db } from "../drizzle";
import { userSessions } from "../schema/sessions";
import { createId } from "@paralleldrive/cuid2";

// Sample session data for testing
const sampleSessions = [
  {
    id: createId(),
    userId: "test-user-1", // Replace with actual user ID from your database
    sessionToken: createId(),
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ipAddress: "192.168.1.100",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 30),
  },
  {
    id: createId(),
    userId: "test-user-1", // Same user, different device
    sessionToken: createId(),
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1.2 Mobile/15E148 Safari/604.1",
    ipAddress: "192.168.1.101",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3), // 3 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60),
  },
  {
    id: createId(),
    userId: "test-user-1", // Same user, different device
    sessionToken: createId(),
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    ipAddress: "192.168.1.102",
    isActive: true,
    lastActive: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30), // 30 days from now
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
  },
];

export async function seedSessions() {
  try {
    console.log("🌱 Seeding sessions...");

    // Insert sample sessions
    for (const session of sampleSessions) {
      await db.insert(userSessions).values(session);
    }

    console.log("✅ Sessions seeded successfully!");
    console.log(`📊 Inserted ${sampleSessions.length} sample sessions`);
  } catch (error) {
    console.error("❌ Error seeding sessions:", error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  seedSessions()
    .then(() => {
      console.log("🎉 Session seeding completed!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("💥 Session seeding failed:", error);
      process.exit(1);
    });
}

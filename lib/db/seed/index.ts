#!/usr/bin/env tsx

import { db, pool } from "../drizzle";
import { seedDefaultNotificationPreferencesAction } from "@/app/(dashboard)/actions/notification-actions";
import { defaultNotificationPreferences } from "../schema/notification-preferences";

interface SeedOperation {
  name: string;
  description: string;
  run: () => Promise<{ success: boolean; message: string }>;
}

const seedOperations: SeedOperation[] = [
  {
    name: "notification-preferences",
    description: "Default notification preferences for all users",
    run: seedDefaultNotificationPreferencesAction,
  },
  // Add more seed operations here as needed
  // {
  //   name: "users",
  //   description: "Default user accounts",
  //   run: seedUsersAction,
  // },
];

async function runAllSeeds() {
  console.log("🌱 Starting database seeding process...\n");

  const results: Array<{ name: string; success: boolean; message: string }> =
    [];

  for (const operation of seedOperations) {
    console.log(`📋 Running: ${operation.name}`);
    console.log(`   Description: ${operation.description}`);

    try {
      const result = await operation.run();
      results.push({
        name: operation.name,
        success: result.success,
        message: result.message,
      });

      if (result.success) {
        console.log(`   ✅ Success: ${result.message}\n`);
      } else {
        console.log(`   ❌ Failed: ${result.message}\n`);
      }
    } catch (error) {
      console.error(`   💥 Error:`, error);
      results.push({
        name: operation.name,
        success: false,
        message: `Error: ${error instanceof Error ? error.message : "Unknown error"}`,
      });
      console.log("");
    }
  }

  // Summary
  console.log("📊 Seeding Summary:");
  console.log("==================");

  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    console.log("\n✅ Successful operations:");
    successful.forEach((result) => {
      console.log(`   • ${result.name}: ${result.message}`);
    });
  }

  if (failed.length > 0) {
    console.log("\n❌ Failed operations:");
    failed.forEach((result) => {
      console.log(`   • ${result.name}: ${result.message}`);
    });
    console.log("\n💡 Check the logs above for more details.");
  }

  if (failed.length === 0) {
    console.log("\n🎉 All seeds completed successfully!");
  } else {
    console.log("\n⚠️  Some seeds failed. Check the logs above.");
    process.exit(1);
  }
}

async function runSpecificSeed(seedName: string) {
  const operation = seedOperations.find((op) => op.name === seedName);

  if (!operation) {
    console.error(`❌ Seed operation '${seedName}' not found.`);
    console.log("Available operations:");
    seedOperations.forEach((op) => {
      console.log(`   • ${op.name}: ${op.description}`);
    });
    process.exit(1);
  }

  console.log(`🌱 Running specific seed: ${operation.name}`);
  console.log(`   Description: ${operation.description}\n`);

  try {
    const result = await operation.run();

    if (result.success) {
      console.log(`✅ Success: ${result.message}`);
    } else {
      console.error(`❌ Failed: ${result.message}`);
      process.exit(1);
    }
  } catch (error) {
    console.error(`💥 Error:`, error);
    process.exit(1);
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);

  try {
    if (args.length === 0) {
      // Run all seeds
      await runAllSeeds();
    } else if (args.length === 1) {
      // Run specific seed
      await runSpecificSeed(args[0]);
    } else {
      console.error("❌ Invalid arguments. Usage:");
      console.log(
        "  npm run db:seed:notifications                    # Run all seeds"
      );
      console.log(
        "  npm run db:seed:notifications <seed-name>        # Run specific seed"
      );
      console.log("\nAvailable seeds:");
      seedOperations.forEach((op) => {
        console.log(`   • ${op.name}: ${op.description}`);
      });
      process.exit(1);
    }
  } catch (error) {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
  } finally {
    // Close the database connection using the pool
    try {
      await pool.end();
      console.log("🔌 Database connection closed successfully");
    } catch (error) {
      console.warn("⚠️  Warning: Could not close database connection:", error);
    }
  }
}

// Handle process termination
process.on("SIGINT", async () => {
  console.log("\n🛑 Received SIGINT, shutting down gracefully...");
  try {
    await pool.end();
    console.log("🔌 Database connection closed successfully");
  } catch (error) {
    console.warn("⚠️  Warning: Could not close database connection:", error);
  }
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n🛑 Received SIGTERM, shutting down gracefully...");
  try {
    await pool.end();
    console.log("🔌 Database connection closed successfully");
  } catch (error) {
    console.warn("⚠️  Warning: Could not close database connection:", error);
  }
  process.exit(0);
});

// Run the main function
main().catch(async (error) => {
  console.error("💥 Unhandled error:", error);
  try {
    await pool.end();
    console.log("🔌 Database connection closed successfully");
  } catch (closeError) {
    console.warn(
      "⚠️  Warning: Could not close database connection:",
      closeError
    );
  }
  process.exit(1);
});

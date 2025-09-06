import { NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { cvOptimizationOrders } from "@/lib/db/schema";

export async function GET() {
  try {
    // Test database connection by attempting to query the cv_optimization_orders table
    const result = await db.select().from(cvOptimizationOrders).limit(1);
    
    return NextResponse.json({ 
      success: true, 
      message: "Database connected successfully",
      tableExists: true,
      recordCount: result.length
    });
  } catch (error: any) {
    console.error("Database test error:", error);
    
    // Check if it's a table not found error
    if (error.message?.includes("relation") && error.message?.includes("does not exist")) {
      return NextResponse.json({ 
        success: false, 
        error: "CV optimization tables not found. Run database migration.",
        needsMigration: true
      });
    }
    
    return NextResponse.json({ 
      success: false, 
      error: `Database error: ${error.message}`,
      needsMigration: false
    });
  }
}

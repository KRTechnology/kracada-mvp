"use server";

import { db } from "@/lib/db/drizzle";
import { cvOptimizationOrders } from "@/lib/db/schema/cv-optimization";
import { auth } from "@/auth";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { cloudflareUploadService } from "@/lib/cloudflare/upload-service";

// Request a revision
export async function requestRevisionAction(
  orderId: string,
  revisionNotes: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Get the order
    const [order] = await db
      .select()
      .from(cvOptimizationOrders)
      .where(
        and(
          eq(cvOptimizationOrders.id, orderId),
          eq(cvOptimizationOrders.userId, session.user.id)
        )
      )
      .limit(1);

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // Check if revisions are available
    const revisionsUsed = order.revisionsUsed || 0;
    const maxRevisions = order.maxRevisions || 0;

    if (revisionsUsed >= maxRevisions) {
      return {
        success: false,
        error: `You have used all ${maxRevisions} available revisions for this package.`,
      };
    }

    // Check if order is completed
    if (order.orderStatus !== "completed") {
      return {
        success: false,
        error: "You can only request revisions for completed orders.",
      };
    }

    // Increment revisionsUsed and set status to revision_requested
    await db
      .update(cvOptimizationOrders)
      .set({
        revisionsUsed: revisionsUsed + 1,
        orderStatus: "in_progress" as any, // Revision requested
        customerNotes: revisionNotes,
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, orderId));

    revalidatePath("/dashboard/my-cv-orders");
    revalidatePath("/admin/dashboard/cv-review");

    return {
      success: true,
      message:
        "Revision requested successfully. Our team will review your feedback.",
    };
  } catch (error) {
    console.error("Error requesting revision:", error);
    return {
      success: false,
      error: "Failed to request revision",
    };
  }
}

// Upload revised CV (used when requesting revision with new upload)
export async function uploadRevisionCVAction(
  orderId: string,
  formData: FormData,
  revisionNotes: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const file = formData.get("file") as File;
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];

    if (!allowedTypes.includes(file.type)) {
      return {
        success: false,
        error: "Invalid file type. Please upload a PDF or DOCX file.",
      };
    }

    // Validate file size (10MB limit)
    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File size exceeds 10MB limit.",
      };
    }

    // Get the order
    const [order] = await db
      .select()
      .from(cvOptimizationOrders)
      .where(
        and(
          eq(cvOptimizationOrders.id, orderId),
          eq(cvOptimizationOrders.userId, session.user.id)
        )
      )
      .limit(1);

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // Check revision limit
    const revisionsUsed = order.revisionsUsed || 0;
    const maxRevisions = order.maxRevisions || 0;

    if (revisionsUsed >= maxRevisions) {
      return {
        success: false,
        error: `You have used all ${maxRevisions} available revisions.`,
      };
    }

    // Upload to Cloudflare
    const customPath = `cvs/${session.user.id}-revision`;
    const filename = `cv-revision-${Date.now()}.pdf`;

    const uploadResult = await cloudflareUploadService.uploadFile({
      file,
      customPath,
      filename,
    });

    if (!uploadResult.success) {
      return {
        success: false,
        error: uploadResult.error || "Failed to upload file",
      };
    }

    // Update order
    await db
      .update(cvOptimizationOrders)
      .set({
        cvFileUrl: uploadResult.url,
        cvFileKey: uploadResult.key,
        revisionsUsed: revisionsUsed + 1,
        orderStatus: "in_progress" as any,
        customerNotes: revisionNotes,
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, orderId));

    revalidatePath("/dashboard/my-cv-orders");
    revalidatePath("/admin/dashboard/cv-review");

    return {
      success: true,
      message: "Revision CV uploaded successfully. Our team will review it.",
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error uploading revision CV:", error);
    return {
      success: false,
      error: "Failed to upload revision CV",
    };
  }
}

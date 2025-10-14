"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db/drizzle";
import { cvOptimizationOrders } from "@/lib/db/schema/cv-optimization";
import { users } from "@/lib/db/schema/users";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { cloudflareUploadService } from "@/lib/cloudflare/upload-service";
import { revalidatePath } from "next/cache";

// Helper to check if user is admin
async function requireAdmin() {
  const session = await auth();
  const isAdmin = (session?.user as any)?.isAdmin === true;

  if (!isAdmin) {
    redirect("/");
  }

  return session;
}

// Get all CV optimization orders with user details
export async function getAllCVOrdersAction() {
  try {
    await requireAdmin();

    const orders = await db
      .select({
        id: cvOptimizationOrders.id,
        userId: cvOptimizationOrders.userId,
        packageType: cvOptimizationOrders.packageType,
        packageName: cvOptimizationOrders.packageName,
        packagePrice: cvOptimizationOrders.packagePrice,
        paymentReference: cvOptimizationOrders.paymentReference,
        paymentStatus: cvOptimizationOrders.paymentStatus,
        orderStatus: cvOptimizationOrders.orderStatus,
        cvFileUrl: cvOptimizationOrders.cvFileUrl,
        cvFileKey: cvOptimizationOrders.cvFileKey,
        optimizedCvUrl: cvOptimizationOrders.optimizedCvUrl,
        maxRevisions: cvOptimizationOrders.maxRevisions,
        revisionsUsed: cvOptimizationOrders.revisionsUsed,
        estimatedDeliveryDays: cvOptimizationOrders.estimatedDeliveryDays,
        customerNotes: cvOptimizationOrders.customerNotes,
        adminNotes: cvOptimizationOrders.adminNotes,
        createdAt: cvOptimizationOrders.createdAt,
        updatedAt: cvOptimizationOrders.updatedAt,
        // User details
        userEmail: users.email,
        userFullName: users.fullName,
      })
      .from(cvOptimizationOrders)
      .leftJoin(users, eq(cvOptimizationOrders.userId, users.id))
      .orderBy(desc(cvOptimizationOrders.createdAt));

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Error fetching CV orders:", error);
    return {
      success: false,
      error: "Failed to fetch CV orders",
    };
  }
}

// Update order status
export async function updateOrderStatusAction(
  orderId: string,
  status:
    | "pending_payment"
    | "payment_verified"
    | "cv_uploaded"
    | "in_progress"
    | "completed"
    | "cancelled",
  adminNotes?: string
) {
  try {
    await requireAdmin();

    await db
      .update(cvOptimizationOrders)
      .set({
        orderStatus: status,
        ...(adminNotes !== undefined && { adminNotes }),
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, orderId));

    revalidatePath("/admin/dashboard/cv-review");

    return {
      success: true,
      message: "Order status updated successfully",
    };
  } catch (error) {
    console.error("Error updating order status:", error);
    return {
      success: false,
      error: "Failed to update order status",
    };
  }
}

// Upload optimized CV
export async function uploadOptimizedCVAction(
  orderId: string,
  formData: FormData
) {
  try {
    await requireAdmin();

    const file = formData.get("file") as File;
    if (!file) {
      return {
        success: false,
        error: "No file provided",
      };
    }

    // Get order details
    const [order] = await db
      .select()
      .from(cvOptimizationOrders)
      .where(eq(cvOptimizationOrders.id, orderId))
      .limit(1);

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    // Validate file type (PDF or DOCX)
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
    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_FILE_SIZE) {
      return {
        success: false,
        error: "File size exceeds 10MB limit.",
      };
    }

    // Upload to Cloudflare using the same service as CV uploads
    const customPath = `optimized-cvs/${orderId}`;
    const filename = `optimized-cv-${Date.now()}.pdf`;

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

    // Update order with optimized CV URL
    await db
      .update(cvOptimizationOrders)
      .set({
        optimizedCvUrl: uploadResult.url,
        orderStatus: "completed",
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, orderId));

    revalidatePath("/admin/dashboard/cv-review");

    return {
      success: true,
      message: "Optimized CV uploaded successfully",
      url: uploadResult.url,
    };
  } catch (error) {
    console.error("Error uploading optimized CV:", error);
    return {
      success: false,
      error: "Failed to upload optimized CV",
    };
  }
}

// Get single order details
export async function getOrderDetailsAction(orderId: string) {
  try {
    await requireAdmin();

    const [order] = await db
      .select({
        id: cvOptimizationOrders.id,
        userId: cvOptimizationOrders.userId,
        packageType: cvOptimizationOrders.packageType,
        packageName: cvOptimizationOrders.packageName,
        packagePrice: cvOptimizationOrders.packagePrice,
        paymentReference: cvOptimizationOrders.paymentReference,
        paymentStatus: cvOptimizationOrders.paymentStatus,
        orderStatus: cvOptimizationOrders.orderStatus,
        cvFileUrl: cvOptimizationOrders.cvFileUrl,
        cvFileKey: cvOptimizationOrders.cvFileKey,
        optimizedCvUrl: cvOptimizationOrders.optimizedCvUrl,
        maxRevisions: cvOptimizationOrders.maxRevisions,
        revisionsUsed: cvOptimizationOrders.revisionsUsed,
        estimatedDeliveryDays: cvOptimizationOrders.estimatedDeliveryDays,
        customerNotes: cvOptimizationOrders.customerNotes,
        adminNotes: cvOptimizationOrders.adminNotes,
        createdAt: cvOptimizationOrders.createdAt,
        updatedAt: cvOptimizationOrders.updatedAt,
        includesCoverLetter: cvOptimizationOrders.includesCoverLetter,
        includesLinkedInProfile: cvOptimizationOrders.includesLinkedInProfile,
        includesInterviewPrep: cvOptimizationOrders.includesInterviewPrep,
        // User details
        userEmail: users.email,
        userFullName: users.fullName,
        userPhone: users.phone,
      })
      .from(cvOptimizationOrders)
      .leftJoin(users, eq(cvOptimizationOrders.userId, users.id))
      .where(eq(cvOptimizationOrders.id, orderId))
      .limit(1);

    if (!order) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Error fetching order details:", error);
    return {
      success: false,
      error: "Failed to fetch order details",
    };
  }
}

"use server";

import { db } from "@/lib/db/drizzle";
import { cvOptimizationOrders, cvPaymentTransactions } from "@/lib/db/schema";
import { auth } from "@/auth";
import { eq, and, desc } from "drizzle-orm";
import { createId } from "@paralleldrive/cuid2";
import { z } from "zod";

// Package definitions (matching the frontend)
const packages = {
  deluxe: {
    name: "Deluxe Package",
    price: 20000, // Price in naira (₦20,000)
    description: "Professional CV Writing",
    maxRevisions: 2,
    estimatedDeliveryDays: 3,
    includesCoverLetter: false,
    includesLinkedInProfile: false,
    includesInterviewPrep: false,
  },
  supreme: {
    name: "Supreme Package", 
    price: 30000, // Price in naira (₦30,000)
    description: "International Standard",
    maxRevisions: 3,
    estimatedDeliveryDays: 5,
    includesCoverLetter: true,
    includesLinkedInProfile: false,
    includesInterviewPrep: false,
  },
  premium: {
    name: "Premium Package",
    price: 45000, // Price in naira (₦45,000)
    description:
      "All features of Supreme plus Standard LinkedIn profile writing and Interview preparatory session",
    maxRevisions: 5,
    estimatedDeliveryDays: 7,
    includesCoverLetter: true,
    includesLinkedInProfile: true,
    includesInterviewPrep: true,
  },
} as const;

const createOrderSchema = z.object({
  packageType: z.enum(["deluxe", "supreme", "premium"]),
  paymentReference: z.string().min(1),
});

export type CreateOrderResult = {
  success: boolean;
  orderId?: string;
  error?: string;
};

export type VerifyPaymentResult = {
  success: boolean;
  verified?: boolean;
  order?: any;
  error?: string;
};

/**
 * Create a new CV optimization order
 */
export async function createCVOptimizationOrder(
  packageType: "deluxe" | "supreme" | "premium",
  paymentReference: string
): Promise<CreateOrderResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized - Please login to continue",
      };
    }

    // Validate input
    const validation = createOrderSchema.safeParse({
      packageType,
      paymentReference,
    });

    if (!validation.success) {
      return {
        success: false,
        error: "Invalid input data",
      };
    }

    const packageInfo = packages[packageType];
    if (!packageInfo) {
      return {
        success: false,
        error: "Invalid package type",
      };
    }

    // Check if order with this payment reference already exists
    const existingOrder = await db
      .select()
      .from(cvOptimizationOrders)
      .where(eq(cvOptimizationOrders.paymentReference, paymentReference))
      .limit(1);

    if (existingOrder.length > 0) {
      return {
        success: false,
        error: "Order with this payment reference already exists",
      };
    }

    // Create the order
    const orderId = createId();
    await db.insert(cvOptimizationOrders).values({
      id: orderId,
      userId: session.user.id,
      packageType,
      packageName: packageInfo.name,
      packagePrice: packageInfo.price.toString(), // Price already in naira
      packageDescription: packageInfo.description,
      paymentReference,
      paymentAmount: packageInfo.price.toString(), // Price already in naira
      paymentCurrency: "NGN",
      maxRevisions: packageInfo.maxRevisions,
      estimatedDeliveryDays: packageInfo.estimatedDeliveryDays,
      includesCoverLetter: packageInfo.includesCoverLetter,
      includesLinkedInProfile: packageInfo.includesLinkedInProfile,
      includesInterviewPrep: packageInfo.includesInterviewPrep,
      orderStatus: "pending_payment",
      paymentStatus: "pending",
    });

    return {
      success: true,
      orderId,
    };
  } catch (error) {
    console.error("Create CV optimization order error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Verify payment and update order status
 */
export async function verifyPaymentAndUpdateOrder(
  paymentReference: string
): Promise<VerifyPaymentResult> {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Verify payment with Paystack
    const verificationResult = await verifyPaystackPayment(paymentReference);

    if (!verificationResult.success) {
      return {
        success: false,
        error: verificationResult.error || "Payment verification failed",
      };
    }

    const paymentData = verificationResult.data;

    // Find the order
    const order = await db
      .select()
      .from(cvOptimizationOrders)
      .where(
        and(
          eq(cvOptimizationOrders.paymentReference, paymentReference),
          eq(cvOptimizationOrders.userId, session.user.id)
        )
      )
      .limit(1);

    if (order.length === 0) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    const orderRecord = order[0];

    // Update order with payment details
    if (paymentData.status === "success") {
      // Only update if not already successful to avoid unnecessary updates
      if (orderRecord.paymentStatus !== "successful") {
        await db
          .update(cvOptimizationOrders)
          .set({
            paymentStatus: "successful",
            orderStatus: "payment_verified",
            paystackTransactionId: paymentData.id?.toString(),
            updatedAt: new Date(),
          })
          .where(eq(cvOptimizationOrders.id, orderRecord.id));
        console.log("Updated order status to payment_verified");
      } else {
        console.log("Order already marked as successful, skipping update");
      }

      // Create or update payment transaction record
      const existingTransaction = await db
        .select()
        .from(cvPaymentTransactions)
        .where(eq(cvPaymentTransactions.paystackReference, paymentReference))
        .limit(1);

      if (existingTransaction.length === 0) {
        // Create new transaction record
        await db.insert(cvPaymentTransactions).values({
          orderId: orderRecord.id,
          userId: session.user.id,
          paystackReference: paymentReference,
          paystackTransactionId: paymentData.id?.toString(),
          paystackStatus: paymentData.status,
          amount: (paymentData.amount / 100).toString(), // Convert from kobo to naira
          currency: paymentData.currency || "NGN",
          customerEmail: paymentData.customer?.email || session.user.email,
          channel: paymentData.channel,
          gatewayResponse: paymentData.gateway_response,
          paymentMethod: paymentData.authorization?.brand,
          webhookData: JSON.stringify(paymentData),
          verifiedAt: new Date(),
          verificationStatus: "verified",
        });
        console.log("Created new payment transaction record");
      } else {
        // Update existing transaction
        await db
          .update(cvPaymentTransactions)
          .set({
            paystackTransactionId: paymentData.id?.toString(),
            paystackStatus: paymentData.status,
            gatewayResponse: paymentData.gateway_response,
            paymentMethod: paymentData.authorization?.brand,
            webhookData: JSON.stringify(paymentData),
            verifiedAt: new Date(),
            verificationStatus: "verified",
            updatedAt: new Date(),
          })
          .where(eq(cvPaymentTransactions.paystackReference, paymentReference));
        console.log("Updated existing payment transaction record");
      }

      return {
        success: true,
        verified: true,
        order: {
          ...orderRecord,
          paymentStatus: "successful",
          orderStatus: "payment_verified",
        },
      };
    } else {
      // Payment failed
      await db
        .update(cvOptimizationOrders)
        .set({
          paymentStatus: "failed",
          orderStatus: "pending_payment",
          updatedAt: new Date(),
        })
        .where(eq(cvOptimizationOrders.id, orderRecord.id));

      return {
        success: true,
        verified: false,
        error: "Payment was not successful",
      };
    }
  } catch (error: any) {
    console.error("Verify payment error:", error);

    // Handle specific database constraint errors
    if (
      error.code === "23505" &&
      error.constraint?.includes("paystack_reference")
    ) {
      console.log(
        "Payment transaction already exists, attempting to retrieve order"
      );

      // Try to get the order one more time
      try {
        const orderResult = await getOrderByPaymentReference(paymentReference);
        if (
          orderResult.success &&
          orderResult.order?.paymentStatus === "successful"
        ) {
          return {
            success: true,
            verified: true,
            order: orderResult.order,
          };
        }
      } catch (retryError) {
        console.error("Error during retry:", retryError);
      }
    }

    return {
      success: false,
      error: "An unexpected error occurred during verification",
    };
  }
}

/**
 * Get user's CV optimization orders
 */
export async function getUserCVOptimizationOrders() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const orders = await db
      .select()
      .from(cvOptimizationOrders)
      .where(eq(cvOptimizationOrders.userId, session.user.id))
      .orderBy(desc(cvOptimizationOrders.createdAt));

    return {
      success: true,
      orders,
    };
  } catch (error) {
    console.error("Get user CV optimization orders error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Get order by payment reference
 */
export async function getOrderByPaymentReference(paymentReference: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const orders = await db
      .select()
      .from(cvOptimizationOrders)
      .where(
        and(
          eq(cvOptimizationOrders.paymentReference, paymentReference),
          eq(cvOptimizationOrders.userId, session.user.id)
        )
      )
      .limit(1);

    if (orders.length === 0) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    return {
      success: true,
      order: orders[0],
    };
  } catch (error) {
    console.error("Get order by payment reference error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const orders = await db
      .select()
      .from(cvOptimizationOrders)
      .where(
        and(
          eq(cvOptimizationOrders.id, orderId),
          eq(cvOptimizationOrders.userId, session.user.id)
        )
      )
      .limit(1);

    if (orders.length === 0) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    return {
      success: true,
      order: orders[0],
    };
  } catch (error) {
    console.error("Get order by ID error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Update order with uploaded CV
 */
export async function updateOrderWithCV(
  orderId: string,
  cvFileUrl: string,
  cvFileKey: string,
  customerNotes?: string
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    // Verify the order belongs to the user
    const orders = await db
      .select()
      .from(cvOptimizationOrders)
      .where(
        and(
          eq(cvOptimizationOrders.id, orderId),
          eq(cvOptimizationOrders.userId, session.user.id)
        )
      )
      .limit(1);

    if (orders.length === 0) {
      return {
        success: false,
        error: "Order not found",
      };
    }

    const order = orders[0];

    // Check if payment is verified
    if (order.paymentStatus !== "successful") {
      return {
        success: false,
        error: "Payment not verified",
      };
    }

    // Update order with CV details
    await db
      .update(cvOptimizationOrders)
      .set({
        cvFileUrl,
        cvFileKey,
        customerNotes,
        orderStatus: "cv_uploaded",
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, orderId));

    return {
      success: true,
    };
  } catch (error) {
    console.error("Update order with CV error:", error);
    return {
      success: false,
      error: "An unexpected error occurred",
    };
  }
}

/**
 * Verify payment with Paystack API
 */
async function verifyPaystackPayment(reference: string): Promise<{
  success: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // Try both possible environment variable names
    const secretKey =
      process.env.PAYSTACK_SECRET_KEY ||
      process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
    if (!secretKey) {
      console.error(
        "Paystack secret key not found. Checked PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_SECRET_KEY"
      );
      return {
        success: false,
        error: "Paystack secret key not configured",
      };
    }

    console.log("Verifying payment with reference:", reference);

    const response = await fetch(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.message || "Paystack verification failed",
      };
    }

    if (result.status === true) {
      return {
        success: true,
        data: result.data,
      };
    } else {
      return {
        success: false,
        error: result.message || "Payment verification failed",
      };
    }
  } catch (error) {
    console.error("Paystack verification error:", error);
    return {
      success: false,
      error: "Network error during payment verification",
    };
  }
}

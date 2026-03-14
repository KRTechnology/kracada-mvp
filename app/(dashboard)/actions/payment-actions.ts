"use server";

import { db } from "@/lib/db/drizzle";
import {
  cvPaymentTransactions,
  cvOptimizationOrders,
  users,
  admins,
} from "@/lib/db/schema";
import { eq, desc, ilike, or, and, sql } from "drizzle-orm";
import { auth } from "@/auth";

/**
 * Helper function to get admin session
 */
async function getAdminSession() {
  const session = await auth();
  if (!session?.user?.email) {
    return null;
  }
  return session;
}

/**
 * Helper function to get current admin
 */
async function getCurrentAdmin() {
  const session = await getAdminSession();
  if (!session?.user?.email) {
    return null;
  }

  const admin = await db
    .select()
    .from(admins)
    .where(eq(admins.email, session.user.email))
    .limit(1);

  return admin[0] || null;
}

/**
 * Get payment transactions for admin dashboard
 */
export async function getAdminPaymentTransactionsAction(params?: {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}): Promise<{
  success: boolean;
  data?: {
    transactions: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
  message?: string;
}> {
  try {
    // Check admin authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };
    }

    const page = params?.page || 1;
    const limit = params?.limit || 10;
    const offset = (page - 1) * limit;
    const search = params?.search?.trim();
    const status = params?.status;

    // Build where conditions
    const conditions = [];

    // Search filter - search by reference, email, or user name
    if (search) {
      conditions.push(
        or(
          ilike(cvPaymentTransactions.paystackReference, `%${search}%`),
          ilike(cvPaymentTransactions.customerEmail, `%${search}%`),
          ilike(users.fullName, `%${search}%`),
          ilike(users.email, `%${search}%`)
        )
      );
    }

    // Status filter
    if (status && status !== "all") {
      conditions.push(eq(cvPaymentTransactions.paystackStatus, status));
    }

    // Combine conditions
    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

    // Fetch transactions with user and order details
    const transactions = await db
      .select({
        id: cvPaymentTransactions.id,
        orderId: cvPaymentTransactions.orderId,
        userId: cvPaymentTransactions.userId,
        paystackReference: cvPaymentTransactions.paystackReference,
        paystackTransactionId: cvPaymentTransactions.paystackTransactionId,
        paystackStatus: cvPaymentTransactions.paystackStatus,
        amount: cvPaymentTransactions.amount,
        currency: cvPaymentTransactions.currency,
        customerEmail: cvPaymentTransactions.customerEmail,
        customerPhone: cvPaymentTransactions.customerPhone,
        channel: cvPaymentTransactions.channel,
        paymentMethod: cvPaymentTransactions.paymentMethod,
        verifiedAt: cvPaymentTransactions.verifiedAt,
        verificationStatus: cvPaymentTransactions.verificationStatus,
        createdAt: cvPaymentTransactions.createdAt,
        updatedAt: cvPaymentTransactions.updatedAt,
        // User details
        userFullName: users.fullName,
        userEmail: users.email,
        // Order details
        orderPackageType: cvOptimizationOrders.packageType,
        orderPackageName: cvOptimizationOrders.packageName,
        orderStatus: cvOptimizationOrders.orderStatus,
      })
      .from(cvPaymentTransactions)
      .leftJoin(users, eq(cvPaymentTransactions.userId, users.id))
      .leftJoin(
        cvOptimizationOrders,
        eq(cvPaymentTransactions.orderId, cvOptimizationOrders.id)
      )
      .where(whereClause)
      .orderBy(desc(cvPaymentTransactions.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count for pagination
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(cvPaymentTransactions)
      .leftJoin(users, eq(cvPaymentTransactions.userId, users.id))
      .where(whereClause);

    const total = Number(countResult[0]?.count || 0);
    const totalPages = Math.ceil(total / limit);

    return {
      success: true,
      data: {
        transactions,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching payment transactions:", error);
    return {
      success: false,
      message: "Failed to fetch payment transactions",
    };
  }
}

/**
 * Get payment transaction details by ID
 */
export async function getPaymentTransactionAction(
  transactionId: string
): Promise<{
  success: boolean;
  data?: any;
  message?: string;
}> {
  try {
    // Check admin authentication
    const admin = await getCurrentAdmin();
    if (!admin) {
      return {
        success: false,
        message: "Unauthorized. Admin access required.",
      };
    }

    const transaction = await db
      .select({
        id: cvPaymentTransactions.id,
        orderId: cvPaymentTransactions.orderId,
        userId: cvPaymentTransactions.userId,
        paystackReference: cvPaymentTransactions.paystackReference,
        paystackTransactionId: cvPaymentTransactions.paystackTransactionId,
        paystackStatus: cvPaymentTransactions.paystackStatus,
        amount: cvPaymentTransactions.amount,
        currency: cvPaymentTransactions.currency,
        customerEmail: cvPaymentTransactions.customerEmail,
        customerPhone: cvPaymentTransactions.customerPhone,
        channel: cvPaymentTransactions.channel,
        gatewayResponse: cvPaymentTransactions.gatewayResponse,
        paymentMethod: cvPaymentTransactions.paymentMethod,
        webhookData: cvPaymentTransactions.webhookData,
        verifiedAt: cvPaymentTransactions.verifiedAt,
        verificationStatus: cvPaymentTransactions.verificationStatus,
        createdAt: cvPaymentTransactions.createdAt,
        updatedAt: cvPaymentTransactions.updatedAt,
        // User details
        userFullName: users.fullName,
        userEmail: users.email,
        userFirstName: users.firstName,
        userLastName: users.lastName,
        // Order details
        orderPackageType: cvOptimizationOrders.packageType,
        orderPackageName: cvOptimizationOrders.packageName,
        orderPackagePrice: cvOptimizationOrders.packagePrice,
        orderStatus: cvOptimizationOrders.orderStatus,
        orderPaymentStatus: cvOptimizationOrders.paymentStatus,
      })
      .from(cvPaymentTransactions)
      .leftJoin(users, eq(cvPaymentTransactions.userId, users.id))
      .leftJoin(
        cvOptimizationOrders,
        eq(cvPaymentTransactions.orderId, cvOptimizationOrders.id)
      )
      .where(eq(cvPaymentTransactions.id, transactionId))
      .limit(1);

    if (!transaction || transaction.length === 0) {
      return {
        success: false,
        message: "Transaction not found",
      };
    }

    return {
      success: true,
      data: transaction[0],
    };
  } catch (error) {
    console.error("Error fetching transaction details:", error);
    return {
      success: false,
      message: "Failed to fetch transaction details",
    };
  }
}

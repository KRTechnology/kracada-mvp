import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { cvOptimizationOrders, cvPaymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {

  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");


    // Verify webhook signature
    if (!verifyPaystackSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        await handleChargeSuccess(event.data);
        break;
      case "charge.failed":
        await handleChargeFailed(event.data);
        break;
      default:
        // Unhandled webhook event
        break;
    }

    return NextResponse.json({ status: "success" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}

function verifyPaystackSignature(
  body: string,
  signature: string | null
): boolean {
  if (!signature) {
    return false;
  }

  // Try both possible environment variable names
  const secretKey =
    process.env.PAYSTACK_SECRET_KEY ||
    process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error(
      "Paystack secret key not configured. Checked PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_SECRET_KEY"
    );
    return false;
  }


  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(body, "utf8")
    .digest("hex");

  const isValid = hash === signature;

  return isValid;
}

async function handleChargeSuccess(data: any) {
  try {
    const reference = data.reference;

    // Find the order
    const orders = await db
      .select()
      .from(cvOptimizationOrders)
      .where(eq(cvOptimizationOrders.paymentReference, reference))
      .limit(1);

    if (orders.length === 0) {
      console.error("Order not found for reference:", reference);
      return;
    }

    const order = orders[0];

    // Update order status
    await db
      .update(cvOptimizationOrders)
      .set({
        paymentStatus: "successful",
        orderStatus: "payment_verified",
        paystackTransactionId: data.id?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, order.id));

    // Create or update payment transaction record
    const existingTransaction = await db
      .select()
      .from(cvPaymentTransactions)
      .where(eq(cvPaymentTransactions.paystackReference, reference))
      .limit(1);

    if (existingTransaction.length === 0) {
      // Create new transaction record
      await db.insert(cvPaymentTransactions).values({
        orderId: order.id,
        userId: order.userId,
        paystackReference: reference,
        paystackTransactionId: data.id?.toString(),
        paystackStatus: data.status,
        amount: (data.amount / 100).toString(),
        currency: data.currency || "NGN",
        customerEmail: data.customer?.email,
        channel: data.channel,
        gatewayResponse: data.gateway_response,
        paymentMethod: data.authorization?.brand,
        webhookData: JSON.stringify(data),
        verifiedAt: new Date(),
        verificationStatus: "verified",
      });
    } else {
      // Update existing transaction
      await db
        .update(cvPaymentTransactions)
        .set({
          paystackTransactionId: data.id?.toString(),
          paystackStatus: data.status,
          gatewayResponse: data.gateway_response,
          webhookData: JSON.stringify(data),
          verifiedAt: new Date(),
          verificationStatus: "verified",
          updatedAt: new Date(),
        })
        .where(eq(cvPaymentTransactions.paystackReference, reference));
    }

  } catch (error) {
    console.error("Error handling charge success:", error);
  }
}

async function handleChargeFailed(data: any) {
  try {
    const reference = data.reference;

    // Find the order
    const orders = await db
      .select()
      .from(cvOptimizationOrders)
      .where(eq(cvOptimizationOrders.paymentReference, reference))
      .limit(1);

    if (orders.length === 0) {
      console.error("Order not found for reference:", reference);
      return;
    }

    const order = orders[0];

    // Update order status
    await db
      .update(cvOptimizationOrders)
      .set({
        paymentStatus: "failed",
        orderStatus: "pending_payment",
        paystackTransactionId: data.id?.toString(),
        updatedAt: new Date(),
      })
      .where(eq(cvOptimizationOrders.id, order.id));

    // Create or update payment transaction record
    const existingTransaction = await db
      .select()
      .from(cvPaymentTransactions)
      .where(eq(cvPaymentTransactions.paystackReference, reference))
      .limit(1);

    if (existingTransaction.length === 0) {
      await db.insert(cvPaymentTransactions).values({
        orderId: order.id,
        userId: order.userId,
        paystackReference: reference,
        paystackTransactionId: data.id?.toString(),
        paystackStatus: data.status,
        amount: (data.amount / 100).toString(),
        currency: data.currency || "NGN",
        customerEmail: data.customer?.email,
        channel: data.channel,
        gatewayResponse: data.gateway_response,
        paymentMethod: data.authorization?.brand,
        webhookData: JSON.stringify(data),
        verificationStatus: "failed",
      });
    } else {
      await db
        .update(cvPaymentTransactions)
        .set({
          paystackTransactionId: data.id?.toString(),
          paystackStatus: data.status,
          gatewayResponse: data.gateway_response,
          webhookData: JSON.stringify(data),
          verificationStatus: "failed",
          updatedAt: new Date(),
        })
        .where(eq(cvPaymentTransactions.paystackReference, reference));
    }

  } catch (error) {
    console.error("Error handling charge failed:", error);
  }
}

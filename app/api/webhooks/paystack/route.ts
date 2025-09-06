import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/drizzle";
import { cvOptimizationOrders, cvPaymentTransactions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";

export async function POST(request: NextRequest) {
  console.log("=== PAYSTACK WEBHOOK RECEIVED ===");
  
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");
    
    console.log("Webhook body length:", body.length);
    console.log("Signature header:", signature ? "Present" : "Missing");

    // Verify webhook signature
    if (!verifyPaystackSignature(body, signature)) {
      console.log("❌ Webhook signature verification failed");
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    console.log("✅ Webhook signature verified");

    const event = JSON.parse(body);
    console.log("Event type:", event.event);
    console.log("Event data preview:", {
      reference: event.data?.reference,
      status: event.data?.status,
      amount: event.data?.amount,
    });

    // Handle different event types
    switch (event.event) {
      case "charge.success":
        console.log("Processing charge.success event");
        await handleChargeSuccess(event.data);
        break;
      case "charge.failed":
        console.log("Processing charge.failed event");
        await handleChargeFailed(event.data);
        break;
      default:
        console.log("Unhandled webhook event:", event.event);
    }

    console.log("=== WEBHOOK PROCESSING COMPLETE ===");
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
    console.log("No signature provided in webhook");
    return false;
  }

  // Try both possible environment variable names
  const secretKey = process.env.PAYSTACK_SECRET_KEY || process.env.NEXT_PUBLIC_PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    console.error("Paystack secret key not configured. Checked PAYSTACK_SECRET_KEY and NEXT_PUBLIC_PAYSTACK_SECRET_KEY");
    return false;
  }

  console.log("Using secret key:", secretKey.substring(0, 10) + "...");

  const hash = crypto
    .createHmac("sha512", secretKey)
    .update(body, "utf8")
    .digest("hex");

  console.log("Generated hash:", hash.substring(0, 10) + "...");
  console.log("Received signature:", signature.substring(0, 10) + "...");

  const isValid = hash === signature;
  console.log("Signature verification:", isValid ? "VALID" : "INVALID");

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

    console.log("Payment success webhook processed for order:", order.id);
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

    console.log("Payment failed webhook processed for order:", order.id);
  } catch (error) {
    console.error("Error handling charge failed:", error);
  }
}

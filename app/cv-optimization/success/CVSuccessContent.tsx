"use client";

import { motion } from "framer-motion";
import {
  CheckCircle,
  FileText,
  Clock,
  ArrowRight,
  Home,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { getOrderById } from "@/app/(dashboard)/actions/cv-optimization-actions";

interface OrderDetails {
  id: string;
  packageName: string;
  packagePrice: string;
  packageDescription?: string;
  orderStatus: string;
  paymentStatus: string;
  paymentReference: string;
  estimatedDeliveryDays?: number;
  maxRevisions?: number;
  includesCoverLetter?: boolean;
  includesLinkedInProfile?: boolean;
  includesInterviewPrep?: boolean;
  customerNotes?: string;
  createdAt: Date;
}

export default function CVSuccessContent() {
  const [orderDetails, setOrderDetails] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const orderId = searchParams.get("orderId");

  useEffect(() => {
    async function fetchOrderDetails() {
      if (!orderId || !session?.user?.id) {
        setError("Missing order information or user not authenticated");
        setIsLoading(false);
        return;
      }

      try {
        // Fetch order details using server action
        const result = await getOrderById(orderId);

        if (!result.success) {
          setError(result.error || "Order not found");
          setIsLoading(false);
          return;
        }

        const order = result.order!;
        setOrderDetails({
          id: order.id,
          packageName: order.packageName,
          packagePrice: `₦${parseFloat(order.packagePrice).toLocaleString()}`,
          packageDescription: order.packageDescription || undefined,
          orderStatus: order.orderStatus,
          paymentStatus: order.paymentStatus,
          paymentReference: order.paymentReference || "",
          estimatedDeliveryDays: order.estimatedDeliveryDays || undefined,
          maxRevisions: order.maxRevisions || undefined,
          includesCoverLetter: order.includesCoverLetter || false,
          includesLinkedInProfile: order.includesLinkedInProfile || false,
          includesInterviewPrep: order.includesInterviewPrep || false,
          customerNotes: order.customerNotes || undefined,
          createdAt: order.createdAt,
        });
      } catch (error) {
        console.error("Error fetching order details:", error);
        setError("Failed to load order details");
      } finally {
        setIsLoading(false);
      }
    }

    fetchOrderDetails();
  }, [orderId, session]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const getEstimatedDeliveryDate = (deliveryDays?: number) => {
    if (!deliveryDays) return "TBD";

    const today = new Date();
    const deliveryDate = new Date(today);
    deliveryDate.setDate(today.getDate() + deliveryDays);

    return deliveryDate.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getIncludedServices = (order: OrderDetails) => {
    const services = ["Professional CV Writing"];

    if (order.includesCoverLetter) {
      services.push("Cover Letter");
    }

    if (order.includesLinkedInProfile) {
      services.push("LinkedIn Profile Writing");
    }

    if (order.includesInterviewPrep) {
      services.push("Interview Preparation Session");
    }

    return services;
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-warm-200 border-t-transparent mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Loading Order Details
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Please wait while we fetch your order information...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !orderDetails) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black flex items-center justify-center">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl p-8 shadow-xl max-w-md mx-auto text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
            Order Not Found
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            {error || "We couldn't find your order details."}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/cv-optimization")}
              className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Back to CV Optimization
            </button>
            <button
              onClick={() => router.push("/dashboard")}
              className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-md mx-auto"
          >
            {/* Success Icon */}
            <motion.div variants={itemVariants} className="text-center mb-8">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                CV Submitted Successfully!
              </h1>
              <p className="text-warm-100 dark:text-warm-200 text-sm">
                Your CV has been received and will be optimized according to
                your selected package.
              </p>
            </motion.div>

            {/* Order Details Card */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl mb-6"
            >
              <div className="space-y-4">
                {/* Order ID */}
                <div className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                  <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                    Order ID
                  </span>
                  <span className="text-sm font-mono font-bold text-neutral-900 dark:text-white">
                    {orderDetails.id.slice(-8).toUpperCase()}
                  </span>
                </div>

                {/* Package Details */}
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Package Details
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Package
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        {orderDetails.packageName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Price
                      </span>
                      <span className="text-sm font-medium text-warm-200">
                        {orderDetails.packagePrice}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Estimated Delivery
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white text-right">
                        {getEstimatedDeliveryDate(
                          orderDetails.estimatedDeliveryDays
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">
                        Revisions
                      </span>
                      <span className="text-sm font-medium text-neutral-900 dark:text-white">
                        Up to {orderDetails.maxRevisions || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Included Services */}
                <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Included Services
                  </h3>
                  <div className="space-y-2">
                    {getIncludedServices(orderDetails).map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Customer Notes */}
                {orderDetails.customerNotes && (
                  <div className="border-t border-neutral-200 dark:border-neutral-600 pt-4">
                    <h3 className="font-semibold text-neutral-900 dark:text-white mb-2">
                      Your Notes
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 p-3 rounded-lg">
                      {orderDetails.customerNotes}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl mb-6"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                What happens next?
              </h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-warm-600 dark:text-warm-400">
                      1
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Our team will review your CV and begin the optimization
                    process
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-warm-600 dark:text-warm-400">
                      2
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    You'll receive the first draft via email within{" "}
                    {orderDetails.estimatedDeliveryDays || "7"} working days
                  </p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-xs font-bold text-warm-600 dark:text-warm-400">
                      3
                    </span>
                  </div>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Provide feedback and we'll make revisions as needed
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div variants={itemVariants} className="space-y-3">
              <Link
                href="/dashboard"
                className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <ArrowRight className="w-4 h-4" />
                <span>Go to Dashboard</span>
              </Link>
              <Link
                href="/"
                className="w-full border border-white/20 text-white hover:bg-white/10 font-semibold py-3 px-6 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <Home className="w-4 h-4" />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto"
          >
            {/* Success Icon */}
            <motion.div variants={itemVariants} className="text-center mb-12">
              <div className="w-24 h-24 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                CV Submitted Successfully!
              </h1>
              <p className="text-warm-100 dark:text-warm-200 text-lg">
                Your CV has been received and will be optimized according to
                your selected package.
              </p>
            </motion.div>

            {/* Order Details Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8"
            >
              {/* Left Column - Order Info */}
              <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-6 text-xl">
                  Order Information
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <span className="font-medium text-neutral-600 dark:text-neutral-400">
                      Order ID
                    </span>
                    <span className="font-mono font-bold text-neutral-900 dark:text-white">
                      {orderDetails.id.slice(-8).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <FileText className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      CV file uploaded successfully
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <Clock className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      Submitted on {orderDetails.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Customer Notes */}
                {orderDetails.customerNotes && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
                      Your Notes
                    </h4>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-700 p-4 rounded-xl">
                      {orderDetails.customerNotes}
                    </p>
                  </div>
                )}
              </div>

              {/* Right Column - Package Details */}
              <div className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-6 text-xl">
                  Package Details
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Package
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      {orderDetails.packageName}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Price
                    </span>
                    <span className="font-medium text-warm-200">
                      {orderDetails.packagePrice}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Estimated Delivery
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white text-sm text-right">
                      {getEstimatedDeliveryDate(
                        orderDetails.estimatedDeliveryDays
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between p-4 bg-neutral-50 dark:bg-neutral-700 rounded-xl">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Revisions
                    </span>
                    <span className="font-medium text-neutral-900 dark:text-white">
                      Up to {orderDetails.maxRevisions || 0}
                    </span>
                  </div>
                </div>

                {/* Included Services */}
                <div className="mt-6">
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Included Services
                  </h4>
                  <div className="space-y-2">
                    {getIncludedServices(orderDetails).map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 p-2"
                      >
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {service}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl mb-8"
            >
              <h3 className="font-semibold text-neutral-900 dark:text-white mb-6 text-xl text-center">
                What happens next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-warm-600 dark:text-warm-400">
                      1
                    </span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    Review & Analysis
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Our team will review your CV and begin the optimization
                    process based on your selected package
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-warm-600 dark:text-warm-400">
                      2
                    </span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    First Draft Delivery
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    You'll receive the first draft via email within{" "}
                    {orderDetails.estimatedDeliveryDays || "7"} working days
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-lg font-bold text-warm-600 dark:text-warm-400">
                      3
                    </span>
                  </div>
                  <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                    Revisions & Finalization
                  </h4>
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    Provide feedback and we'll make revisions until you're
                    completely satisfied
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
            >
              <Link
                href="/dashboard"
                className="flex-1 bg-warm-200 hover:bg-warm-300 text-white font-semibold py-4 px-8 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <ArrowRight className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </Link>
              <Link
                href="/"
                className="flex-1 border border-white/20 text-white hover:bg-white/10 font-semibold py-4 px-8 rounded-xl transition-colors duration-200 flex items-center justify-center space-x-2 whitespace-nowrap"
              >
                <Home className="w-5 h-5" />
                <span>Back to Home</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

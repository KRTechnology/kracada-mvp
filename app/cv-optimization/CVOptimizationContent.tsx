"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createCVOptimizationOrder } from "@/app/(dashboard)/actions/cv-optimization-actions";
import dynamic from "next/dynamic";

// Dynamically import PaystackButton to avoid SSR issues
const PaystackButton = dynamic(
  () => import("react-paystack").then((mod) => mod.PaystackButton),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-neutral-300 dark:bg-neutral-600 text-neutral-500 dark:text-neutral-400 font-semibold py-3 px-6 rounded-xl">
        Loading...
      </div>
    ),
  }
);

interface PricingPackage {
  id: string;
  name: string;
  price: string;
  priceInKobo: number; // Price in kobo for Paystack
  description: string;
  features: string[];
  additionalDescription?: string;
  isPopular?: boolean;
}

const packages: PricingPackage[] = [
  {
    id: "deluxe",
    name: "Deluxe Package",
    price: "₦20,000",
    priceInKobo: 2000000, // ₦20,000 in kobo
    description: "Professional CV Writing.",
    additionalDescription:
      "We will style your CV to Professional Standard acceptable to most organizations and firms in Nigeria",
    features: [
      "Up To two revisions",
      "Feedback on each draft and we will make revisions up to a maximum of two times",
      "Turn around time",
      "The first draft of your CV will be sent to you within 3 working days",
    ],
  },
  {
    id: "supreme",
    name: "Supreme Package",
    price: "₦30,000",
    priceInKobo: 3000000, // ₦30,000 in kobo
    description: "International Standard",
    additionalDescription:
      "We will style your CV to International Standard acceptable to most organizations and firms in any country of your choice",
    features: [
      "Up To Three Revisions.",
      "Feedback on each draft and we will make revisions up to a maximum of three times",
      "Turn around time",
      "The first draft of your CV will be sent to you within 5 working days. + cover letter",
    ],
    isPopular: true,
  },
  {
    id: "premium",
    name: "Premium Package",
    price: "₦45,000",
    priceInKobo: 4500000, // ₦45,000 in kobo
    description:
      "All features of Supreme plus Standard LinkedIn profile writing and Interview preparatory session",
    features: [
      "Up To five Revisions",
      "Feedback on each draft and we will make revisions up to a maximum of five times",
      "Interview preparatory session",
      "Interview preparatory and guidance sessions for up to two hours",
      "Turn around time",
      "The first draft of your CV will be sent to you within 7 working days. Standard LinkedIn profile writing",
      "Includes Standard LinkedIn profile writing",
    ],
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

export default function CVOptimizationContent() {
  const [isAnimated, setIsAnimated] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();

  const publicKey = process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "";

  // Handle mounting to avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handlePackageSelect = (packageId: string) => {
    if (!session?.user) {
      toast.error("Please login to continue");
      router.push("/login");
      return;
    }
    setSelectedPackage(packageId);
  };

  const handlePaymentSuccess = async (reference: any) => {
    console.log("Payment success callback triggered:", reference);
    console.log("Reference object full:", JSON.stringify(reference, null, 2));

    // Extract package info from the payment reference metadata
    const packageType = reference.metadata?.packageType;

    console.log("Package type from metadata:", packageType);
    console.log("User session:", session?.user);

    if (!packageType || !session?.user) {
      console.error("Missing packageType or user session");
      console.error("packageType:", packageType);
      console.error("session?.user:", session?.user);
      toast.error("Missing payment information. Please try again.");
      return;
    }

    startTransition(async () => {
      try {
        console.log(
          "Creating order for package:",
          packageType,
          "with reference:",
          reference.reference
        );

        // Create order in database
        const result = await createCVOptimizationOrder(
          packageType as "deluxe" | "supreme" | "premium",
          reference.reference
        );

        console.log("Order creation result:", result);

        if (result.success) {
          toast.success("Payment successful! Redirecting to upload page...");
          // Clear selected package state
          setSelectedPackage(null);
          // Navigate to upload page with payment reference
          router.push(`/cv-optimization/upload?ref=${reference.reference}`);
        } else {
          console.error("Order creation failed:", result.error);
          toast.error(result.error || "Failed to create order");
        }
      } catch (error) {
        console.error("Payment success handler error:", error);
        toast.error("An error occurred while processing your payment");
      }
    });
  };

  const handlePaymentClose = () => {
    setSelectedPackage(null);
    toast.info("Payment cancelled");
  };

  const getPaystackConfig = (pkg: PricingPackage) => {
    if (!session?.user?.email || !publicKey) return null;

    // Create a package-specific success handler
    const handlePackagePaymentSuccess = async (reference: any) => {
      console.log("Package-specific payment success:", pkg.id, reference);

      if (!session?.user) {
        console.error("User session missing");
        toast.error("User session expired. Please login again.");
        return;
      }

      startTransition(async () => {
        try {
          console.log(
            "Creating order for package:",
            pkg.id,
            "with reference:",
            reference.reference
          );

          // Create order in database
          const result = await createCVOptimizationOrder(
            pkg.id as "deluxe" | "supreme" | "premium",
            reference.reference
          );

          console.log("Order creation result:", result);

          if (result.success) {
            toast.success("Payment successful! Redirecting to upload page...");
            // Clear selected package state
            setSelectedPackage(null);
            // Navigate to upload page with payment reference
            router.push(`/cv-optimization/upload?ref=${reference.reference}`);
          } else {
            console.error("Order creation failed:", result.error);
            toast.error(result.error || "Failed to create order");
          }
        } catch (error) {
          console.error("Payment success handler error:", error);
          toast.error("An error occurred while processing your payment");
        }
      });
    };

    return {
      reference: `cv_opt_${pkg.id}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`,
      email: session.user.email,
      amount: pkg.priceInKobo,
      currency: "NGN" as const,
      publicKey,
      text: "Pay Now",
      onSuccess: handlePackagePaymentSuccess,
      onClose: handlePaymentClose,
      metadata: {
        userId: session.user.id,
        packageType: pkg.id,
        packageName: pkg.name,
        custom_fields: [
          {
            display_name: "Package",
            variable_name: "package",
            value: pkg.name,
          },
        ],
      },
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-warm-700 via-warm-800 to-warm-900 dark:from-neutral-900 dark:via-neutral-900 dark:to-black">
      {/* Mobile Layout */}
      <div className="block lg:hidden">
        <div className="container mx-auto px-4 py-12">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-warm-100 dark:text-warm-200 text-base mb-3 font-medium">
              CV Optimization
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Pricing plans
            </h1>
          </motion.div>

          {/* Mobile Pricing Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
            onAnimationComplete={() => setIsAnimated(true)}
          >
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="relative bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-xl transition-all duration-300"
              >
                {/* Package Badge */}
                <div className="mb-4">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-warm-50 dark:bg-warm-900/20 border border-warm-200/20">
                    <div className="w-2 h-2 bg-warm-200 rounded-full mr-2"></div>
                    <span className="text-warm-700 dark:text-warm-200 text-sm font-medium">
                      {pkg.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-4">
                  <div className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
                    {pkg.price}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium text-sm">
                    {pkg.description}
                  </p>
                </div>

                {/* Additional Description */}
                {pkg.additionalDescription && (
                  <div className="mb-4">
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {pkg.additionalDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isAnimated ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-4 h-4 rounded-full bg-warm-100 dark:bg-warm-900/50 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-warm-600 dark:text-warm-400" />
                        </div>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="w-full">
                  {isMounted && session?.user && getPaystackConfig(pkg) ? (
                    <PaystackButton
                      {...getPaystackConfig(pkg)!}
                      className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl border-0 cursor-pointer disabled:opacity-50"
                      disabled={isPending}
                    />
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-3 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                      disabled={!isMounted}
                    >
                      {!isMounted
                        ? "Loading..."
                        : session?.user
                          ? "Pay Now"
                          : "Get started"}
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-warm-100 dark:text-warm-200 text-lg mb-4 font-medium">
              CV Optimization
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-white mb-4">
              Pricing plans
            </h1>
          </motion.div>

          {/* Desktop Pricing Cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-3 gap-8 max-w-6xl mx-auto"
            onAnimationComplete={() => setIsAnimated(true)}
          >
            {packages.map((pkg, index) => (
              <div
                key={pkg.id}
                className="relative bg-white dark:bg-neutral-800 rounded-3xl p-8 shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
              >
                {/* Package Badge */}
                <div className="mb-6">
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-warm-50 dark:bg-warm-900/20 border border-warm-200/20">
                    <div className="w-2 h-2 bg-warm-200 rounded-full mr-2"></div>
                    <span className="text-warm-700 dark:text-warm-200 text-sm font-medium">
                      {pkg.name}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6">
                  <div className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                    {pkg.price}
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 font-medium">
                    {pkg.description}
                  </p>
                </div>

                {/* Additional Description */}
                {pkg.additionalDescription && (
                  <div className="mb-6">
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                      {pkg.additionalDescription}
                    </p>
                  </div>
                )}

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {pkg.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isAnimated ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: index * 0.1 + featureIndex * 0.1 }}
                      className="flex items-start space-x-3"
                    >
                      <div className="flex-shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded-full bg-warm-100 dark:bg-warm-900/50 flex items-center justify-center">
                          <Check className="w-3 h-3 text-warm-600 dark:text-warm-400" />
                        </div>
                      </div>
                      <span className="text-neutral-700 dark:text-neutral-300 text-sm leading-relaxed">
                        {feature}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* CTA Button */}
                <div className="w-full">
                  {isMounted && session?.user && getPaystackConfig(pkg) ? (
                    <PaystackButton
                      {...getPaystackConfig(pkg)!}
                      className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl border-0 cursor-pointer disabled:opacity-50"
                      disabled={isPending}
                    />
                  ) : (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePackageSelect(pkg.id)}
                      className="w-full bg-warm-200 hover:bg-warm-300 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
                      disabled={!isMounted}
                    >
                      {!isMounted
                        ? "Loading..."
                        : session?.user
                          ? "Pay Now"
                          : "Get started"}
                    </motion.button>
                  )}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

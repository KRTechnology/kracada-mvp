"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/button";
import { TabSwitcher } from "@/components/specific/dashboard/TabSwitcher";
import { HotelsRestaurantsSubTabType } from "@/components/specific/dashboard/SubTabSwitcher";
import { useSession } from "next-auth/react";

export const HotelsRestaurantsHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();

  // Check if user is a Business Owner
  const isBusinessOwner =
    (session?.user as any)?.accountType === "Business Owner";
  const isAuthenticated = status === "authenticated";

  // Determine active tab based on pathname
  const getActiveTab = (): HotelsRestaurantsSubTabType => {
    if (pathname === "/hotels-restaurants/restaurants") return "Restaurants";
    return "Hotels";
  };

  const handleTabChange = (tab: HotelsRestaurantsSubTabType) => {
    if (tab === "Hotels") {
      router.push("/hotels-restaurants");
    } else if (tab === "Restaurants") {
      router.push("/hotels-restaurants/restaurants");
    }
  };

  const hotelRestaurantTabs = [
    { id: "Hotels" as HotelsRestaurantsSubTabType, label: "Hotels" },
    { id: "Restaurants" as HotelsRestaurantsSubTabType, label: "Restaurants" },
  ];

  return (
    <div className="bg-white dark:bg-dark border-b border-neutral-100 dark:border-neutral-800">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Title and Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neutral-900 via-neutral-700 to-neutral-900 dark:from-white dark:via-neutral-200 dark:to-white bg-clip-text text-transparent">
            Browse Accommodations
          </h2>

          {isAuthenticated && isBusinessOwner && (
            <Button
              onClick={() => router.push("/dashboard/hotels-restaurants")}
              className="bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white font-semibold px-8 py-4 rounded-xl transition-all duration-300 flex items-center gap-2 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              List your property
            </Button>
          )}
        </motion.div>

        {/* Tab Switcher */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-8"
        >
          <TabSwitcher
            activeTab={getActiveTab()}
            onTabChange={handleTabChange}
            customTabs={hotelRestaurantTabs}
            removeMargin={true}
          />
        </motion.div>
      </div>
    </div>
  );
};

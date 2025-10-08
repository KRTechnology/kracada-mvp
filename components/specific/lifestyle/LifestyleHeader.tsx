"use client";

import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/common/button";
import {
  TabSwitcher,
  TabType,
} from "@/components/specific/dashboard/TabSwitcher";
import { useSession } from "next-auth/react";

export const LifestyleHeader = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();

  // Determine active tab based on pathname
  const getActiveTab = (): TabType => {
    if (pathname === "/lifestyle/videos") return "Videos";
    return "All posts";
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === "All posts") {
      router.push("/lifestyle");
    } else if (tab === "Videos") {
      router.push("/lifestyle/videos");
    }
  };

  const lifestyleTabs = [
    { id: "All posts" as TabType, label: "All posts" },
    { id: "Videos" as TabType, label: "Videos" },
  ];

  // Check if user is a Contributor
  const isContributor =
    session?.user && (session.user as any).accountType === "Contributor";

  return (
    <div className="bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Header with Title and Create Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8"
        >
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-white">
            All Lifestyle Posts
          </h2>

          {isContributor && (
            <Button
              onClick={() => {
                router.push("/lifestyle/create");
              }}
              className="bg-orange-500 hover:bg-orange-600 text-white font-medium px-6 py-3 rounded-lg transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              Create a lifestyle post
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
            customTabs={lifestyleTabs}
            removeMargin={true}
          />
        </motion.div>
      </div>
    </div>
  );
};

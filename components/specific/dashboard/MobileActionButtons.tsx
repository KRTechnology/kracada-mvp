"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface MobileActionButtonsProps {
  accountType?: string;
}

export function MobileActionButtons({ accountType }: MobileActionButtonsProps) {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/dashboard/edit");
  };

  const handleCreateJobPost = () => {
    router.push("/jobs/create");
  };

  // Check if user can create job posts
  const canCreateJobPost =
    accountType === "Employer" || accountType === "Business Owner";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.8 }}
      className="flex gap-3 px-6 py-4 md:hidden"
    >
      <button
        onClick={handleEditProfile}
        className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-[#D8DDE7] rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
      >
        Edit Profile
      </button>
      {canCreateJobPost && (
        <button
          onClick={handleCreateJobPost}
          className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
        >
          Create job post
        </button>
      )}
    </motion.div>
  );
}

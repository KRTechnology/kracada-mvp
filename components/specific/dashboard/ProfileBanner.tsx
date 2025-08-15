"use client";

import { useAccountTypeStyles } from "@/lib/hooks/useAccountTypeStyles";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProfileBannerProps {
  firstName?: string;
  lastName?: string;
  accountType?: string;
  profileImageUrl?: string;
  showEditButton?: boolean;
}

export function ProfileBanner({
  firstName = "Imeh",
  lastName = "Usoro",
  accountType = "Job Seeker",
  profileImageUrl,
  showEditButton = true,
}: ProfileBannerProps) {
  const router = useRouter();
  const { pillStyles, statusColor } = useAccountTypeStyles(accountType);

  const handleEditProfile = () => {
    router.push("/dashboard/edit");
  };

  return (
    <div className="relative">
      {/* Banner Section with Padding - Apply padding to the container that holds the image */}
      <div className="px-1 pt-1 pb-1">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative w-full h-48 md:h-56 rounded-2xl overflow-hidden"
        >
          {/* Background Image */}
          <div className="absolute inset-0">
            <Image
              src="/images/profile-background-image.jpg"
              alt="Profile background"
              fill
              className="object-cover"
              priority
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-200/80 via-blue-200/80 to-purple-200/80" />
          </div>
        </motion.div>
      </div>

      {/* User Info Section - Below the banner, moved much closer */}
      <div className="px-6 md:px-8 pt-2 md:pt-4 pb-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex items-center gap-4"
        >
          {/* Profile Picture - 160px x 160px, positioned much closer to banner */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative w-40 h-40 rounded-full border-2 border-[#00000014] dark:border-[#FFFFFF14] bg-white dark:bg-[#0D0D0D] shadow-lg overflow-hidden flex-shrink-0"
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt={`${firstName} ${lastName}`}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
                <svg
                  className="w-16 h-16 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
              </div>
            )}
          </motion.div>

          {/* User Info - Centered vertically with profile image */}
          <div className="flex-1 space-y-2">
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900 dark:text-[#D8DDE7]">
              {firstName} {lastName}
            </h1>
            <div className="flex items-center gap-2">
              <span
                className="px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 border transition-all duration-200"
                style={pillStyles}
              >
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: statusColor }}
                />
                {accountType}
              </span>
            </div>
          </div>

          {/* Action Button - Centered vertically with profile image */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="hidden md:block flex-shrink-0"
          >
            {showEditButton && (
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 bg-white dark:bg-dark-container border border-neutral-300 dark:border-[#313337] text-neutral-700 dark:text-[#D8DDE7] rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors shadow-sm"
              >
                Edit profile
              </button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { CreateJobPostDialog } from "./CreateJobPostDialog";
import { AddCVDialog } from "./AddCVDialog";

interface MobileActionButtonsProps {
  accountType?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
}

export function MobileActionButtons({
  accountType,
  userId,
  firstName,
  lastName,
}: MobileActionButtonsProps) {
  const router = useRouter();
  const [isCreateJobPostOpen, setIsCreateJobPostOpen] = useState(false);
  const [isAddCVOpen, setIsAddCVOpen] = useState(false);

  const handleEditProfile = () => {
    router.push("/dashboard/edit");
  };

  const handleCreateJobPost = () => {
    setIsCreateJobPostOpen(true);
  };

  const handleAddCV = () => {
    setIsAddCVOpen(true);
  };

  // Check if user can create job posts
  const canCreateJobPost =
    accountType === "Recruiter" || accountType === "Business Owner";

  // Check if user can add CVs (Job Seekers and Contributors)
  const canAddCV =
    accountType === "Job Seeker" || accountType === "Contributor";

  return (
    <>
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
        {canAddCV && (
          <button
            onClick={handleAddCV}
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add CV
          </button>
        )}
      </motion.div>

      {/* Create Job Post Dialog */}
      <CreateJobPostDialog
        open={isCreateJobPostOpen}
        onOpenChange={setIsCreateJobPostOpen}
      />

      {/* Add CV Dialog */}
      {userId && (
        <AddCVDialog
          open={isAddCVOpen}
          onOpenChange={setIsAddCVOpen}
          userData={{
            id: userId,
            firstName: firstName || "",
            lastName: lastName || "",
          }}
          onSuccess={() => {
            setIsAddCVOpen(false);
          }}
        />
      )}
    </>
  );
}

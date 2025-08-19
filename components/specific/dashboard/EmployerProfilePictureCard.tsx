"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/common/button";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle } from "lucide-react";
import {
  uploadProfilePicture,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
import { updateEmployerProfilePictureAction } from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";

interface EmployerProfilePictureCardProps {
  userData: {
    profilePicture?: string | null;
    id: string; // User ID for uploads
    firstName: string;
    lastName: string;
  };
  onUserDataUpdate?: (updates: { profilePicture?: string | null }) => void;
  isEditMode?: boolean;
}

export function EmployerProfilePictureCard({
  userData,
  onUserDataUpdate,
  isEditMode = false,
}: EmployerProfilePictureCardProps) {
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    userData.profilePicture
  );
  const [profilePictureKey, setProfilePictureKey] = useState<string | null>(
    null
  );
  const [isPending, startTransition] = useTransition();
  const [uploadType, setUploadType] = useState<"profile" | null>(null);

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(
        "Image size exceeds 1MB limit. Please choose a smaller image."
      );
      event.target.value = "";
      return;
    }

    // Validate file type
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please upload a valid image file (JPEG, PNG, WebP, or GIF)."
      );
      event.target.value = "";
      return;
    }

    setUploadType("profile");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userData.id);
        formData.append(
          "fullName",
          `${userData.firstName} ${userData.lastName}`.trim()
        );

        const result = await uploadProfilePicture(formData);

        if (result.success && result.url) {
          setProfilePictureUrl(result.url);
          setProfilePictureKey(result.key || null);

          // Update database with new profile picture URL
          await updateEmployerProfilePictureAction(result.url);

          // Notify parent component of the update
          onUserDataUpdate?.({ profilePicture: result.url });

          // Only show toast if not in edit mode
          if (!isEditMode) {
            toast.success("Profile picture uploaded successfully!");
          }
        } else {
          toast.error(result.error || "Failed to upload profile picture");
        }
      } catch (error) {
        console.error("Profile picture upload error:", error);
        toast.error("Failed to upload profile picture");
      } finally {
        setUploadType(null);
        event.target.value = "";
      }
    });
  };

  const handleRemoveProfilePicture = async () => {
    if (!profilePictureUrl) return;

    startTransition(async () => {
      try {
        // Delete from cloud storage if we have a key
        if (profilePictureKey) {
          await deleteUploadedFile(profilePictureKey);
        }

        // Update database to remove profile picture
        await updateEmployerProfilePictureAction(null);

        // Update local state
        setProfilePictureUrl(null);
        setProfilePictureKey(null);

        // Notify parent component of the update
        onUserDataUpdate?.({ profilePicture: null });

        // Only show toast if not in edit mode
        if (!isEditMode) {
          toast.success("Profile picture removed successfully!");
        }
      } catch (error) {
        console.error("Profile picture removal error:", error);
        toast.error("Failed to remove profile picture");
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
          Profile Picture
        </h3>
        <p className="text-[#64748B] dark:text-neutral-400">
          Your profile picture is a quick way for other users to identify you.
        </p>
        <p className="text-base font-medium text-[#334155] dark:text-neutral-100 mt-3">
          Upload your profile picture
        </p>
      </div>

      <div className="flex items-center space-x-6">
        {/* Profile Picture Display */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {profilePictureUrl ? (
              <img
                src={profilePictureUrl}
                alt="Profile picture"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Upload Progress Indicator */}
          {isPending && uploadType === "profile" && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}

          {/* Success Checkmark */}
          {profilePictureUrl && !isPending && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              id="profile-picture-upload"
              accept="image/*"
              onChange={handleProfilePictureUpload}
              className="hidden"
              disabled={isPending}
            />
            <Button
              type="button"
              variant="outline"
              className="bg-warm-200 hover:bg-warm-300 text-white border-warm-200 hover:border-warm-300 px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={isPending}
              onClick={() =>
                document.getElementById("profile-picture-upload")?.click()
              }
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </Button>

            {profilePictureUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveProfilePicture}
                className="border-neutral-200 dark:text-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg flex items-center space-x-2"
                disabled={isPending}
              >
                <X className="w-4 h-4" />
                <span>Remove</span>
              </Button>
            )}
          </div>

          <p className="text-sm text-[#64748B] dark:text-neutral-400">
            Images should be at least 200px x 200px
          </p>
        </div>
      </div>
    </motion.div>
  );
}

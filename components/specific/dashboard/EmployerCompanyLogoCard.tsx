"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/common/button";
import { motion } from "framer-motion";
import { Upload, X, CheckCircle } from "lucide-react";
import {
  uploadCompanyLogo,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
import { updateCompanyLogoAction } from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";

interface EmployerCompanyLogoCardProps {
  userData: {
    companyLogo?: string | null;
    id: string; // User ID for uploads
    firstName: string;
    lastName: string;
  };
  onUserDataUpdate?: (updates: { companyLogo?: string | null }) => void;
  isEditMode?: boolean;
}

export function EmployerCompanyLogoCard({
  userData,
  onUserDataUpdate,
  isEditMode = false,
}: EmployerCompanyLogoCardProps) {
  const [companyLogoUrl, setCompanyLogoUrl] = useState(userData.companyLogo);
  const [companyLogoKey, setCompanyLogoKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadType, setUploadType] = useState<"logo" | null>(null);

  const handleCompanyLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_IMAGE_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_IMAGE_SIZE) {
      toast.error(
        "Logo size exceeds 1MB limit. Please choose a smaller image."
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

    setUploadType("logo");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userData.id);
        formData.append(
          "fullName",
          `${userData.firstName} ${userData.lastName}`.trim()
        );

        const result = await uploadCompanyLogo(formData);

        if (result.success && result.url) {
          setCompanyLogoUrl(result.url);
          setCompanyLogoKey(result.key || null);

          // Update database with new company logo URL
          await updateCompanyLogoAction(result.url);

          // Notify parent component of the update
          onUserDataUpdate?.({ companyLogo: result.url });

          // Only show toast if not in edit mode
          if (!isEditMode) {
            toast.success("Company logo uploaded successfully!");
          }
        } else {
          toast.error(result.error || "Failed to upload company logo");
        }
      } catch (error) {
        console.error("Company logo upload error:", error);
        toast.error("Failed to upload company logo");
      } finally {
        setUploadType(null);
        event.target.value = "";
      }
    });
  };

  const handleRemoveCompanyLogo = async () => {
    if (!companyLogoUrl) return;

    startTransition(async () => {
      try {
        // Delete from cloud storage if we have a key
        if (companyLogoKey) {
          await deleteUploadedFile(companyLogoKey);
        }

        // Update database to remove company logo
        await updateCompanyLogoAction(null);

        // Update local state
        setCompanyLogoUrl(null);
        setCompanyLogoKey(null);

        // Notify parent component of the update
        onUserDataUpdate?.({ companyLogo: null });

        // Only show toast if not in edit mode
        if (!isEditMode) {
          toast.success("Company logo removed successfully!");
        }
      } catch (error) {
        console.error("Company logo removal error:", error);
        toast.error("Failed to remove company logo");
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
          Company Logo
        </h3>
        <p className="text-[#64748B] dark:text-neutral-400">
          Your company logo helps establish brand recognition and
          professionalism.
        </p>
        <p className="text-base font-medium text-[#334155] dark:text-neutral-100 mt-3">
          Upload your company logo
        </p>
      </div>

      <div className="flex items-center space-x-6">
        {/* Company Logo Display */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
            {companyLogoUrl ? (
              <img
                src={companyLogoUrl}
                alt="Company logo"
                className="w-24 h-24 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 text-gray-400">
                <svg fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Upload Progress Indicator */}
          {isPending && uploadType === "logo" && (
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
            </div>
          )}

          {/* Success Checkmark */}
          {companyLogoUrl && !isPending && (
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex flex-col space-y-3">
          <div className="flex items-center space-x-3">
            <Button
              type="button"
              variant="outline"
              className="bg-warm-200 hover:bg-warm-300 text-white border-warm-200 hover:border-warm-300 px-4 py-2 rounded-lg flex items-center space-x-2"
              disabled={isPending || !!companyLogoUrl}
              onClick={() =>
                document.getElementById("company-logo-upload")?.click()
              }
            >
              <Upload className="w-4 h-4" />
              <span>Upload</span>
            </Button>

            <input
              type="file"
              id="company-logo-upload"
              accept="image/*"
              onChange={handleCompanyLogoUpload}
              className="hidden"
              disabled={isPending || !!companyLogoUrl}
            />

            {companyLogoUrl && (
              <Button
                type="button"
                variant="outline"
                onClick={handleRemoveCompanyLogo}
                className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg flex items-center space-x-2"
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

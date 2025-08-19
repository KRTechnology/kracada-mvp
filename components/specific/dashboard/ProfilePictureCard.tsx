"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/common/button";
import { motion } from "framer-motion";
import { Upload, Folder, X, CheckCircle } from "lucide-react";
import {
  uploadProfilePicture,
  uploadCV,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
import { updateFileUploadsAction } from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";

interface ProfilePictureCardProps {
  userData: {
    profilePicture?: string | null;
    cv?: string | null;
    id: string; // User ID for uploads
    firstName: string;
    lastName: string;
  };
  onUserDataUpdate?: (updates: {
    profilePicture?: string | null;
    cv?: string | null;
  }) => void;
  isEditMode?: boolean;
}

export function ProfilePictureCard({
  userData,
  onUserDataUpdate,
  isEditMode = false,
}: ProfilePictureCardProps) {
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    userData.profilePicture
  );
  const [profilePictureKey, setProfilePictureKey] = useState<string | null>(
    null
  );
  const [cvUrl, setCvUrl] = useState(userData.cv);
  const [cvKey, setCvKey] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadType, setUploadType] = useState<"profile" | "cv" | null>(null);

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
          await updateFileUploadsAction({ profilePicture: result.url });

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
        console.error("Upload error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setUploadType(null);
      }
    });

    // Reset input
    event.target.value = "";
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_CV_SIZE = 1 * 1024 * 1024; // 1MB
    if (file.size > MAX_CV_SIZE) {
      toast.error(
        "CV file size exceeds 1MB limit. Please choose a smaller file."
      );
      event.target.value = "";
      return;
    }

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      toast.error("Invalid file type. Please upload a PDF file.");
      event.target.value = "";
      return;
    }

    setUploadType("cv");

    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userData.id);
        formData.append(
          "fullName",
          `${userData.firstName} ${userData.lastName}`.trim()
        );

        const result = await uploadCV(formData);

        if (result.success && result.url) {
          setCvUrl(result.url);
          setCvKey(result.key || null);

          // Update database with new CV URL
          await updateFileUploadsAction({ cv: result.url });

          // Notify parent component of the update
          onUserDataUpdate?.({ cv: result.url });

          // Only show toast if not in edit mode
          if (!isEditMode) {
            toast.success("CV uploaded successfully!");
          }
        } else {
          toast.error(result.error || "Failed to upload CV");
        }
      } catch (error) {
        console.error("Upload error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setUploadType(null);
      }
    });

    // Reset input
    event.target.value = "";
  };

  const handleRemoveProfilePicture = async () => {
    if (profilePictureKey) {
      try {
        const result = await deleteUploadedFile(profilePictureKey);
        if (result.success) {
          setProfilePictureUrl(null);
          setProfilePictureKey(null);

          // Update database to remove profile picture URL
          await updateFileUploadsAction({ profilePicture: null });

          // Notify parent component of the update
          onUserDataUpdate?.({ profilePicture: null });

          // Only show toast if not in edit mode
          if (!isEditMode) {
            toast.success("Profile picture removed successfully");
          }
        } else {
          toast.error("Failed to remove profile picture from storage");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while removing the file");
      }
    } else {
      setProfilePictureUrl(null);
      setProfilePictureKey(null);

      // Update database to remove profile picture URL
      await updateFileUploadsAction({ profilePicture: null });

      // Notify parent component of the update
      onUserDataUpdate?.({ profilePicture: null });

      // Only show toast if not in edit mode
      if (!isEditMode) {
        toast.success("Profile picture removed");
      }
    }
  };

  const handleRemoveCV = async () => {
    if (cvKey) {
      try {
        const result = await deleteUploadedFile(cvKey);
        if (result.success) {
          setCvUrl(null);
          setCvKey(null);

          // Update database to remove CV URL
          await updateFileUploadsAction({ cv: null });

          // Notify parent component of the update
          onUserDataUpdate?.({ cv: null });

          // Only show toast if not in edit mode
          if (!isEditMode) {
            toast.success("CV removed successfully");
          }
        } else {
          toast.error("Failed to remove CV from storage");
        }
      } catch (error) {
        console.error("Delete error:", error);
        toast.error("An error occurred while removing the file");
      }
    } else {
      setCvUrl(null);
      setCvKey(null);

      // Update database to remove CV URL
      await updateFileUploadsAction({ cv: null });

      // Notify parent component of the update
      onUserDataUpdate?.({ cv: null });

      // Only show toast if not in edit mode
      if (!isEditMode) {
        toast.success("CV removed");
      }
    }
  };

  const isProfilePictureUploading = isPending && uploadType === "profile";
  const isCVUploading = isPending && uploadType === "cv";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-600 dark:text-neutral-200 mb-2">
          Profile Picture & CV
        </h2>
        <p className="text-slate-500 dark:text-neutral-100">
          Your profile picture is a quick way for other users to identify you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <div>
          <h3 className="text-lg font-medium text-slate-500 dark:text-neutral-100 mb-4">
            Upload your profile picture
          </h3>

          {/* Profile Picture Upload Container */}
          <div className="bg-gray-50 dark:bg-[#171717] rounded-sm p-6 mb-4">
            <div className="flex items-center gap-4">
              <div className="relative w-[72px] h-[72px] rounded-full bg-gray-100 dark:bg-[#171717] border-2 border-transparent dark:border-[#18212E] flex items-center justify-center overflow-hidden flex-shrink-0">
                {profilePictureUrl ? (
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <svg
                    width="36"
                    height="29"
                    viewBox="0 0 72 57"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-9 h-7"
                  >
                    <path
                      d="M72 47.982V57.003H0V48.015C4.18785 42.4184 9.62372 37.876 15.8754 34.7492C22.127 31.6223 29.022 29.9972 36.012 30.003C50.724 30.003 63.792 37.065 72 47.982ZM48.006 12C48.006 15.1826 46.7417 18.2348 44.4913 20.4853C42.2408 22.7357 39.1886 24 36.006 24C32.8234 24 29.7712 22.7357 27.5207 20.4853C25.2703 18.2348 24.006 15.1826 24.006 12C24.006 8.8174 25.2703 5.76515 27.5207 3.51472C29.7712 1.26428 32.8234 0 36.006 0C39.1886 0 42.2408 1.26428 44.4913 3.51472C46.7417 5.76515 48.006 8.8174 48.006 12Z"
                      fill="#CBD5E1"
                    />
                  </svg>
                )}

                {isProfilePictureUploading && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <label htmlFor="profile-picture-upload">
                  <Button
                    variant="default"
                    className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark cursor-pointer w-28"
                    disabled={isPending}
                    onClick={() => {
                      document
                        .getElementById("profile-picture-upload")
                        ?.click();
                    }}
                  >
                    {isProfilePictureUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload
                      </>
                    )}
                  </Button>
                  <input
                    id="profile-picture-upload"
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
                    onChange={handleProfilePictureUpload}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>

                {profilePictureUrl && (
                  <Button
                    variant="outline"
                    className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 w-28"
                    onClick={handleRemoveProfilePicture}
                    disabled={isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Image requirements text - outside the container */}
          <p className="text-sm text-neutral-500 dark:text-neutral-100">
            Images should be at least 200px x 200px (Max: 1MB)
            <br />
            Supported formats: JPEG, PNG, WebP, GIF
          </p>
        </div>

        {/* CV Upload Section */}
        <div>
          <h3 className="text-lg font-medium text-slate-500 dark:text-neutral-100 mb-4">
            Upload your CV
          </h3>

          <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-sm p-8 text-center bg-white dark:bg-[#171717] relative">
            {cvUrl ? (
              /* CV Uploaded State */
              <div className="flex flex-col items-center space-y-4">
                <div className="w-16 h-16 rounded-xl bg-green-100 dark:bg-green-900 flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>

                <div>
                  <p className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                    CV Uploaded Successfully
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Your CV is ready to be shared with employers
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                    onClick={() => window.open(cvUrl, "_blank")}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    View CV
                  </Button>

                  <Button
                    variant="outline"
                    className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={handleRemoveCV}
                    disabled={isPending}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            ) : (
              /* CV Upload State */
              <div className="flex flex-col items-center space-y-4">
                <Folder className="w-8 h-8 text-neutral-400" />

                <div>
                  <p className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                    Drop your CV or click to upload
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Supported file type: PDF (Max: 1MB)
                  </p>
                </div>

                <label htmlFor="cv-upload">
                  <Button
                    variant="outline"
                    className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    disabled={isPending}
                    onClick={() => {
                      document.getElementById("cv-upload")?.click();
                    }}
                  >
                    {isCVUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent mr-2"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Browse
                      </>
                    )}
                  </Button>
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleCVUpload}
                    className="hidden"
                    disabled={isPending}
                  />
                </label>
              </div>
            )}

            {/* Loading overlay for CV upload */}
            {isCVUploading && (
              <div className="absolute inset-0 bg-white/80 dark:bg-neutral-900/80 rounded-xl flex items-center justify-center">
                <div className="flex flex-col items-center space-y-2">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-200 border-t-transparent"></div>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">
                    Uploading CV...
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

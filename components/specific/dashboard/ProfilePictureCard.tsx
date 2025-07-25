"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/common/button";
import { motion } from "framer-motion";
import { Upload, FileText, Camera, X, CheckCircle } from "lucide-react";
import {
  uploadProfilePicture,
  uploadCV,
} from "@/app/(dashboard)/actions/upload-actions";
import { toast } from "sonner";

interface ProfilePictureCardProps {
  userData: {
    profilePicture?: string | null;
    cv?: string | null;
    id: string; // User ID for uploads
  };
}

export function ProfilePictureCard({ userData }: ProfilePictureCardProps) {
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    userData.profilePicture
  );
  const [cvUrl, setCvUrl] = useState(userData.cv);
  const [isPending, startTransition] = useTransition();
  const [uploadType, setUploadType] = useState<"profile" | "cv" | null>(null);

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    console.log("File selected for profile picture:", file?.name);
    if (!file) return;

    setUploadType("profile");

    startTransition(async () => {
      try {
        console.log("Creating FormData for profile picture upload...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userData.id);

        console.log("Calling uploadProfilePicture server action...");
        const result = await uploadProfilePicture(formData);
        console.log("Server action result:", result);

        if (result.success && result.url) {
          setProfilePictureUrl(result.url);
          toast.success("Profile picture uploaded successfully!");
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
    console.log("File selected for CV:", file?.name);
    if (!file) return;

    setUploadType("cv");

    startTransition(async () => {
      try {
        console.log("Creating FormData for CV upload...");
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userData.id);

        console.log("Calling uploadCV server action...");
        const result = await uploadCV(formData);
        console.log("CV server action result:", result);

        if (result.success && result.url) {
          setCvUrl(result.url);
          toast.success("CV uploaded successfully!");
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

  const handleRemoveProfilePicture = () => {
    setProfilePictureUrl(null);
    toast.success("Profile picture removed");
    // TODO: Implement actual deletion from server
  };

  const handleRemoveCV = () => {
    setCvUrl(null);
    toast.success("CV removed");
    // TODO: Implement actual deletion from server
  };

  const isProfilePictureUploading = isPending && uploadType === "profile";
  const isCVUploading = isPending && uploadType === "cv";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Profile Picture & CV
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Your profile picture is a quick way for other users to identify you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Profile Picture Section */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Upload your profile picture
          </h3>

          <div className="flex flex-col items-center space-y-4">
            <div className="relative w-32 h-32 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600 overflow-hidden">
              {profilePictureUrl ? (
                <>
                  <img
                    src={profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* Remove button overlay */}
                  <button
                    onClick={handleRemoveProfilePicture}
                    className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                    disabled={isPending}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <Camera className="w-8 h-8 text-neutral-400" />
              )}

              {isProfilePictureUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                </div>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="profile-picture-upload">
                <Button
                  variant="default"
                  className="bg-warm-200 hover:bg-warm-300 text-white cursor-pointer"
                  disabled={isPending}
                  onClick={() => {
                    console.log("Profile picture upload button clicked");
                    // Trigger the hidden file input
                    document.getElementById("profile-picture-upload")?.click();
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
                  onChange={(e) => {
                    console.log("Profile picture input onChange triggered");
                    handleProfilePictureUpload(e);
                  }}
                  className="hidden"
                  disabled={isPending}
                />
              </label>

              {profilePictureUrl && (
                <Button
                  variant="outline"
                  className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                  onClick={handleRemoveProfilePicture}
                  disabled={isPending}
                >
                  <X className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              )}
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              Images should be at least 200px x 200px (Max: 5MB)
              <br />
              Supported formats: JPEG, PNG, WebP, GIF
            </p>
          </div>
        </div>

        {/* CV Upload Section */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Upload your CV
          </h3>

          <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-8 text-center bg-neutral-50 dark:bg-neutral-800/50 relative">
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
                    <FileText className="w-4 h-4 mr-2" />
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
                <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                  <FileText className="w-8 h-8 text-neutral-400" />
                </div>

                <div>
                  <p className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                    Drop your CV or click to upload
                  </p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Supported file type: PDF (Max: 10MB)
                  </p>
                </div>

                <label htmlFor="cv-upload">
                  <Button
                    variant="outline"
                    className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                    disabled={isPending}
                    onClick={() => {
                      console.log("CV browse button clicked");
                      // Trigger the hidden file input
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
                    onChange={(e) => {
                      console.log("CV input onChange triggered");
                      handleCVUpload(e);
                    }}
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

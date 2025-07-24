"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { motion } from "framer-motion";
import { Upload, FileText, Camera } from "lucide-react";

interface ProfilePictureCardProps {
  userData: {
    profilePicture?: string | null;
    cv?: string | null;
  };
}

export function ProfilePictureCard({ userData }: ProfilePictureCardProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  const handleCVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    // Simulate upload delay
    setTimeout(() => {
      setIsUploading(false);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm border border-neutral-200 dark:border-neutral-700 p-6"
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
            <div className="relative w-32 h-32 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center border-2 border-dashed border-neutral-300 dark:border-neutral-600">
              {userData.profilePicture ? (
                <img
                  src={userData.profilePicture}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-neutral-400" />
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <label htmlFor="profile-picture-upload">
                <Button
                  variant="default"
                  className="bg-warm-200 hover:bg-warm-300 text-white cursor-pointer"
                  disabled={isUploading}
                >
                  {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <input
                  id="profile-picture-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePictureUpload}
                  className="hidden"
                />
              </label>

              <Button
                variant="outline"
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
              >
                Remove
              </Button>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
              Images should be at least 200px x 200px
            </p>
          </div>
        </div>

        {/* CV Upload Section */}
        <div>
          <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Upload your CV
          </h3>

          <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-xl p-8 text-center bg-neutral-50 dark:bg-neutral-800/50">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-16 h-16 rounded-xl bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                <FileText className="w-8 h-8 text-neutral-400" />
              </div>

              <div>
                <p className="text-neutral-900 dark:text-neutral-100 font-medium mb-1">
                  Drop your files or click to upload
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Supported file types: PDF
                </p>
              </div>

              <label htmlFor="cv-upload">
                <Button
                  variant="outline"
                  className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 cursor-pointer"
                  disabled={isUploading}
                >
                  Browse
                </Button>
                <input
                  id="cv-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleCVUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

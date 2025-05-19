"use client";

import { Button } from "@/components/common/button";
import { motion } from "framer-motion";
import { FileIcon, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";

export const ProfilePictureSection = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setProfileImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  const handleRemoveCv = () => {
    setCvFile(null);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-2">Profile Picture & CV</h2>
      <p className="text-neutral-500 text-sm mb-6">
        Your profile picture is a quick way for other users to identify you.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Picture Upload */}
        <div>
          <p className="text-neutral-700 mb-3 text-sm font-medium">
            Upload your profile picture
          </p>
          <div className="flex items-start space-x-4">
            <div className="relative w-[100px] h-[100px] rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-[40px] h-[40px] rounded-full bg-neutral-200" />
              )}
            </div>
            <div className="flex flex-col space-y-2">
              <label>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <Button
                  type="button"
                  className="bg-warm-200 hover:bg-warm-300 text-white"
                  size="sm"
                >
                  <UploadIcon className="mr-1 h-4 w-4" />
                  Upload
                </Button>
              </label>
              {profileImage && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveImage}
                >
                  Remove
                </Button>
              )}
              <p className="text-xs text-neutral-500">
                Images should be at least 200px x 200px
              </p>
            </div>
          </div>
        </div>

        {/* CV Upload */}
        <div>
          <p className="text-neutral-700 mb-3 text-sm font-medium">
            Upload your CV
          </p>
          <div className="border-2 border-dashed border-neutral-200 rounded-lg p-4 flex flex-col items-center justify-center h-[160px]">
            {!cvFile ? (
              <>
                <FileIcon className="h-8 w-8 text-neutral-400 mb-2" />
                <p className="text-sm text-neutral-600 mb-1">
                  Drop your files or click to upload
                </p>
                <p className="text-xs text-neutral-500 mb-3">
                  Supported file types: PDF
                </p>
                <label>
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf"
                    onChange={handleCvUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="text-sm"
                  >
                    Browse
                  </Button>
                </label>
              </>
            ) : (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex flex-col items-center"
              >
                <FileIcon className="h-8 w-8 text-warm-200 mb-2" />
                <p className="text-sm font-medium text-neutral-800 mb-1">
                  {cvFile.name}
                </p>
                <p className="text-xs text-neutral-500 mb-3">
                  {Math.round(cvFile.size / 1024)} KB
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRemoveCv}
                  className="text-sm"
                >
                  Remove
                </Button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

"use client";

import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, CheckCircle, AlertCircle, X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/common/dialog";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Checkbox } from "@/components/common/checkbox";
import { uploadCV } from "@/app/(dashboard)/actions/upload-actions";
import { addCVAction } from "@/app/(dashboard)/actions/profile-actions";

// Form validation schema
const addCVSchema = z.object({
  name: z
    .string()
    .min(1, "CV name is required")
    .max(255, "CV name is too long"),
  isDefault: z.boolean(),
});

type AddCVFormData = z.infer<typeof addCVSchema>;

interface AddCVDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userData: {
    id: string;
    firstName: string;
    lastName: string;
  };
  onSuccess?: () => void;
}

export function AddCVDialog({
  open,
  onOpenChange,
  userData,
  onSuccess,
}: AddCVDialogProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<AddCVFormData>({
    resolver: zodResolver(addCVSchema),
    defaultValues: {
      name: "",
      isDefault: false,
    },
  });

  const watchedName = watch("name");
  const watchedIsDefault = watch("isDefault");

  // Handle file selection
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Client-side validation
    const MAX_CV_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_CV_SIZE) {
      toast.error(
        "CV file size exceeds 10MB limit. Please choose a smaller file."
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

    setUploadedFile(file);

    // Auto-generate CV name from filename if empty
    if (!watchedName) {
      const fileName = file.name.replace(/\.[^/.]+$/, ""); // Remove extension
      const cleanName = fileName
        .replace(/[^a-zA-Z0-9\s-]/g, "")
        .replace(/\s+/g, " ")
        .trim();
      setValue("name", cleanName || "My CV");
    }

    // Start upload
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate progress for better UX
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 10;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("userId", userData.id);
      formData.append(
        "fullName",
        `${userData.firstName} ${userData.lastName}`.trim()
      );

      const result = await uploadCV(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (result.success && result.url) {
        setUploadedUrl(result.url);
        toast.success("CV uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload CV");
        setUploadedFile(null);
      }
    } catch (error) {
      clearInterval(progressInterval);
      console.error("Upload error:", error);
      toast.error("An unexpected error occurred during upload");
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }

    // Reset input
    event.target.value = "";
  };

  // Handle form submission
  const onSubmit: SubmitHandler<AddCVFormData> = async (data) => {
    if (!uploadedUrl) {
      toast.error("Please upload a CV file first");
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await addCVAction({
        name: data.name.trim(),
        fileUrl: uploadedUrl,
        isDefault: data.isDefault,
      });

      if (result.success) {
        toast.success(result.message);
        handleClose();
        onSuccess?.();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle dialog close
  const handleClose = () => {
    reset();
    setUploadedFile(null);
    setUploadedUrl(null);
    setIsUploading(false);
    setIsSubmitting(false);
    setUploadProgress(0);
    onOpenChange(false);
  };

  // Remove uploaded file
  const handleRemoveFile = () => {
    setUploadedFile(null);
    setUploadedUrl(null);
  };

  const isFormValid = uploadedUrl && watchedName.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
        <DialogHeader className="space-y-3">
          <DialogTitle className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Add New CV
          </DialogTitle>
          <DialogDescription className="text-sm text-neutral-600 dark:text-neutral-400">
            Upload a new CV to your profile. You can have multiple CVs for
            different job applications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-6">
          {/* File Upload Section */}
          <div className="space-y-4">
            <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              CV File (PDF only)
            </Label>

            {!uploadedFile ? (
              <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-600 rounded-lg p-6 text-center bg-neutral-50 dark:bg-neutral-800/50 transition-colors hover:border-neutral-400 dark:hover:border-neutral-500">
                <div className="flex flex-col items-center space-y-3">
                  <FileText className="w-8 h-8 text-neutral-400 dark:text-neutral-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      Drop your CV or click to upload
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      PDF only, max 10MB
                    </p>
                  </div>
                  <label htmlFor="cv-upload">
                    <Button
                      type="button"
                      variant="outline"
                      className="cursor-pointer border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                      onClick={() =>
                        document.getElementById("cv-upload")?.click()
                      }
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Browse Files
                    </Button>
                    <input
                      id="cv-upload"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      disabled={isUploading}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-white dark:bg-neutral-800">
                <AnimatePresence mode="wait">
                  {isUploading ? (
                    <motion.div
                      key="uploading"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-600 border-t-transparent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {uploadedFile.name}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-neutral-200 dark:bg-neutral-700 rounded-full h-2">
                            <motion.div
                              className="bg-blue-600 h-2 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${uploadProgress}%` }}
                              transition={{ duration: 0.3 }}
                            />
                          </div>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {Math.round(uploadProgress)}%
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ) : uploadedUrl ? (
                    <motion.div
                      key="uploaded"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400">
                          Upload completed successfully
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-neutral-500 hover:text-red-600 border-neutral-300 dark:border-neutral-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="error"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                          {uploadedFile.name}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400">
                          Upload failed
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleRemoveFile}
                        className="text-neutral-500 hover:text-red-600 border-neutral-300 dark:border-neutral-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* CV Name Input */}
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100"
            >
              CV Name
            </Label>
            <Input
              id="name"
              {...register("name")}
              placeholder="e.g., Software Engineer Resume, Marketing CV"
              className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 dark:placeholder:text-neutral-400"
            />
            {errors.name && (
              <p className="text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Make Default Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isDefault"
              checked={watchedIsDefault}
              onCheckedChange={(checked) =>
                setValue("isDefault", checked === true)
              }
              className="border-neutral-300 dark:border-neutral-600 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
            />
            <Label
              htmlFor="isDefault"
              className="text-sm font-medium text-neutral-900 dark:text-neutral-100 cursor-pointer"
            >
              Set as default CV
            </Label>
          </div>
          {watchedIsDefault && (
            <p className="text-xs text-orange-600 dark:text-orange-400 ml-6">
              This will become your primary CV for job applications
            </p>
          )}

          {/* Form Actions */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isUploading || isSubmitting}
              className="w-full sm:w-auto border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid || isUploading || isSubmitting}
              className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Adding CV...
                </>
              ) : (
                "Add CV"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

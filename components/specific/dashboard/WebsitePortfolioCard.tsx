"use client";

import { updateWebsitePortfolioAction } from "@/app/(dashboard)/actions/profile-actions";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { motion } from "framer-motion";
import { Globe, ExternalLink } from "lucide-react";
import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const websitePortfolioSchema = z.object({
  website: z
    .string()
    .url("Please enter a valid URL")
    .optional()
    .or(z.literal("")),
  portfolio: z.string().optional(),
});

type WebsitePortfolioFormData = z.infer<typeof websitePortfolioSchema>;

interface WebsitePortfolioCardProps {
  userData: {
    id: string;
    website?: string | null;
    portfolio?: string | null;
  };
  onUserDataUpdate?: (updates: {
    website?: string | null;
    portfolio?: string | null;
  }) => void;
  isEditMode?: boolean;
}

export interface WebsitePortfolioCardRef {
  save: () => Promise<void>;
}

export const WebsitePortfolioCard = forwardRef<
  WebsitePortfolioCardRef,
  WebsitePortfolioCardProps
>(({ userData, onUserDataUpdate, isEditMode = false }, ref) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Memoize defaultValues to prevent unnecessary re-renders
  const defaultValues = useMemo(
    () => ({
      website: userData.website || "",
      portfolio: userData.portfolio || "",
    }),
    [userData.website, userData.portfolio]
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
    setValue,
  } = useForm<WebsitePortfolioFormData>({
    resolver: zodResolver(websitePortfolioSchema),
    defaultValues,
    mode: "onChange",
  });

  // Expose save function to parent component
  useImperativeHandle(ref, () => ({
    save: async () => {
      const formData = {
        website: watch("website"),
        portfolio: watch("portfolio"),
      };
      await onSubmit(formData);
    },
  }));

  const onSubmit = async (data: WebsitePortfolioFormData) => {
    setIsSaving(true);
    try {
      const result = await updateWebsitePortfolioAction(data);

      if (result.success) {
        // Only show toast if not in edit mode (to avoid multiple toasts)
        if (!isEditMode) {
          toast.success(result.message);
        }

        // Notify parent component of the update with nullable format
        onUserDataUpdate?.({
          website: data.website || null,
          portfolio: data.portfolio || null,
        });

        // Reset form to mark as clean after successful save
        reset(data);

        // Only trigger collapse animation if not in edit mode
        if (!isEditMode) {
          setTimeout(() => {
            setIsCollapsed(true);
          }, 500);
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle form submission with validation
  const handleFormSubmit = handleSubmit(onSubmit, (errors) => {
    console.error("Form validation errors:", errors);
    toast.error("Please fix the validation errors before saving.");
  });

  const handleCardClick = () => {
    if (isCollapsed && !isEditMode) {
      setIsCollapsed(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
      className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-sm transition-all duration-300 p-6 ${
        isCollapsed && !isEditMode ? "cursor-pointer hover:shadow-md" : ""
      }`}
      onClick={handleCardClick}
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Website & Portfolio
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Add your website and portfolio links to showcase your work.
        </p>
      </div>

      {(!isCollapsed || isEditMode) && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleFormSubmit}
          className="space-y-6"
        >
          {/* Website Field */}
          <div className="space-y-2">
            <Label
              htmlFor="website"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Website
            </Label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="website"
                type="url"
                {...register("website")}
                placeholder="https://your-website.com"
                className={`pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                  errors.website ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.website && (
              <p className="text-sm text-red-500">{errors.website.message}</p>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Add your personal or professional website URL
            </p>
          </div>

          {/* Portfolio Field */}
          <div className="space-y-2">
            <Label
              htmlFor="portfolio"
              className="text-neutral-700 dark:text-neutral-300"
            >
              Portfolio
            </Label>
            <div className="relative">
              <ExternalLink className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <Input
                id="portfolio"
                type="text"
                {...register("portfolio")}
                placeholder="your-portfolio-handle"
                className="pl-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
              />
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Add your portfolio handle (e.g., @username, portfolio-link)
            </p>
          </div>

          {/* Action Buttons - Only show if not in edit mode */}
          {!isEditMode && (
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
              >
                {isSaving ? "Saving..." : "Save"}
              </Button>
            </div>
          )}
        </motion.form>
      )}
    </motion.div>
  );
});

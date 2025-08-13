"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { ChevronDown, ChevronRight } from "lucide-react";
import { updateEmployerCompanyDetailsAction } from "@/app/(dashboard)/actions/profile-actions";

interface EmployerCompanyDetailsCardProps {
  companyData: {
    companyName: string;
    companyDescription: string;
    companyWebsite: string;
    companyEmail: string;
  };
  onCompanyDataUpdate?: (
    updates: Partial<EmployerCompanyDetailsCardProps["companyData"]>
  ) => void;
  isEditMode?: boolean;
}

export function EmployerCompanyDetailsCard({
  companyData,
  onCompanyDataUpdate,
  isEditMode = false,
}: EmployerCompanyDetailsCardProps) {
  const [formData, setFormData] = useState({
    companyName: companyData.companyName || "",
    companyDescription: companyData.companyDescription || "",
    companyWebsite: companyData.companyWebsite || "",
    companyEmail: companyData.companyEmail || "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Handle form field changes
  const handleFieldChange = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    },
    []
  );

  // Handle form submission
  const handleSave = async () => {
    if (!formData.companyName.trim()) {
      toast.error("Company name is required");
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateEmployerCompanyDetailsAction({
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        companyWebsite: formData.companyWebsite,
        companyEmail: formData.companyEmail,
      });

      if (result.success) {
        // Notify parent component of updates
        onCompanyDataUpdate?.({
          companyName: formData.companyName,
          companyDescription: formData.companyDescription,
          companyWebsite: formData.companyWebsite,
          companyEmail: formData.companyEmail,
        });

        toast.success("Company details updated successfully!");

        // Auto-collapse the form after successful save
        setIsCollapsed(true);
      } else {
        toast.error(result.message || "Failed to update company details");
      }
    } catch (error) {
      console.error("Failed to update company details:", error);
      toast.error("Failed to update company details");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle form reset
  const handleCancel = () => {
    setFormData({
      companyName: companyData.companyName || "",
      companyDescription: companyData.companyDescription || "",
      companyWebsite: companyData.companyWebsite || "",
      companyEmail: companyData.companyEmail || "",
    });
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if form has been modified
  const hasChanges =
    formData.companyName !== (companyData.companyName || "") ||
    formData.companyDescription !== (companyData.companyDescription || "") ||
    formData.companyWebsite !== (companyData.companyWebsite || "") ||
    formData.companyEmail !== (companyData.companyEmail || "");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
    >
      {/* Header with collapse toggle */}
      <div
        className="mb-6 cursor-pointer flex items-center justify-between"
        onClick={toggleCollapse}
      >
        <div>
          <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
            Company Details
          </h3>
          <p className="text-[#64748B] dark:text-neutral-400">
            Tell us about your company and what you do.
          </p>
        </div>
        <div className="flex items-center space-x-2">
          {hasChanges && (
            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
              Unsaved changes
            </span>
          )}
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 text-[#64748B]" />
          ) : (
            <ChevronDown className="w-5 h-5 text-[#64748B]" />
          )}
        </div>
      </div>

      {/* Collapsed Summary View */}
      <AnimatePresence>
        {isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 text-sm"
          >
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Company Name:
                </span>
                <span className="ml-2 text-[#334155] dark:text-neutral-100">
                  {formData.companyName || "Not specified"}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Company Email:
                </span>
                <span className="ml-2 text-[#334155] dark:text-neutral-100">
                  {formData.companyEmail || "Not specified"}
                </span>
              </div>
              {formData.companyWebsite && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Website:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.companyWebsite}
                  </span>
                </div>
              )}
            </div>
            {formData.companyDescription && (
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Description:
                </span>
                <p className="mt-1 text-[#334155] dark:text-neutral-100">
                  {formData.companyDescription}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Form View */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Company Name Field */}
            <div className="space-y-2">
              <Label
                htmlFor="companyName"
                className="text-[#363231] dark:text-neutral-200"
              >
                Company Name *
              </Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) =>
                  handleFieldChange("companyName", e.target.value)
                }
                placeholder="Enter your company name"
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
              />
            </div>

            {/* Company Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="companyEmail"
                className="text-[#363231] dark:text-neutral-200"
              >
                Company Email
              </Label>
              <Input
                id="companyEmail"
                type="email"
                value={formData.companyEmail}
                onChange={(e) =>
                  handleFieldChange("companyEmail", e.target.value)
                }
                placeholder="Enter company email address"
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
              />
            </div>

            {/* Company Website Field */}
            <div className="space-y-2">
              <Label
                htmlFor="companyWebsite"
                className="text-[#363231] dark:text-neutral-200"
              >
                Company Website
              </Label>
              <div className="flex">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400">
                  www.
                </span>
                <Input
                  id="companyWebsite"
                  value={formData.companyWebsite}
                  onChange={(e) =>
                    handleFieldChange("companyWebsite", e.target.value)
                  }
                  className="rounded-l-none border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
                  placeholder="example.company.com"
                />
              </div>
            </div>

            {/* Company Description Field */}
            <div className="space-y-2">
              <Label
                htmlFor="companyDescription"
                className="text-[#363231] dark:text-neutral-200"
              >
                Company Description
              </Label>
              <Textarea
                id="companyDescription"
                value={formData.companyDescription}
                onChange={(e) =>
                  handleFieldChange("companyDescription", e.target.value)
                }
                placeholder="Describe what your company does..."
                rows={4}
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155] resize-none"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isUpdating}
                className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-warm-200 hover:bg-warm-300 text-white px-6 py-2"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

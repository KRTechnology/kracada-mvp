"use client";

import { useState, useCallback, forwardRef, useImperativeHandle } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { updateEmployerProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { ChevronDown, ChevronRight, Edit3 } from "lucide-react";

interface EmployerPersonalDetailsCardProps {
  userData: {
    firstName?: string | null;
    lastName?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    recruiterExperience?: string | null;
  };
  onUserDataUpdate?: (updates: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    recruiterExperience?: string | null;
    profilePicture?: string | null;
  }) => void;
  isEditMode?: boolean;
}

export interface EmployerPersonalDetailsCardRef {
  save: () => Promise<void>;
  hasUnsavedChanges: () => boolean;
}

export const EmployerPersonalDetailsCard = forwardRef<
  EmployerPersonalDetailsCardRef,
  EmployerPersonalDetailsCardProps
>(({ userData, onUserDataUpdate, isEditMode = false }, ref) => {
  const [formData, setFormData] = useState({
    firstName: userData.firstName || "",
    lastName: userData.lastName || "",
    email: userData.email || "",
    phone: userData.phone || "",
    location: userData.location || "",
    bio: userData.bio || "",
    recruiterExperience: userData.recruiterExperience || "",
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Expose save and hasUnsavedChanges methods via ref
  useImperativeHandle(ref, () => ({
    save: handleSave,
    hasUnsavedChanges: () => hasChanges,
  }));

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
    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim()
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsUpdating(true);

    try {
      const result = await updateEmployerProfileAction({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone || null,
        location: formData.location || null,
        bio: formData.bio || null,
        recruiterExperience: formData.recruiterExperience || null,
      });

      if (result.success) {
        // Notify parent component of updates
        onUserDataUpdate?.({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone || null,
          location: formData.location || null,
          bio: formData.bio || null,
          recruiterExperience: formData.recruiterExperience || null,
        });

        // Only show toast if not in edit mode
        if (!isEditMode) {
          toast.success("Personal details updated successfully!");
        }

        // Auto-collapse the form after successful save (only if not in edit mode)
        if (!isEditMode) {
          setIsCollapsed(true);
        }
      } else {
        toast.error(result.message || "Failed to update personal details");
      }
    } catch (error) {
      console.error("Failed to update personal details:", error);
      toast.error("Failed to update personal details");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle form reset
  const handleCancel = () => {
    setFormData({
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      phone: userData.phone || "",
      location: userData.location || "",
      bio: userData.bio || "",
      recruiterExperience: userData.recruiterExperience || "",
    });
  };

  // Toggle collapse state
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Check if form has been modified
  const hasChanges =
    formData.firstName !== (userData.firstName || "") ||
    formData.lastName !== (userData.lastName || "") ||
    formData.email !== (userData.email || "") ||
    formData.phone !== (userData.phone || "") ||
    formData.location !== (userData.location || "") ||
    formData.bio !== (userData.bio || "") ||
    formData.recruiterExperience !== (userData.recruiterExperience || "");

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
            Personal Details
          </h3>
          <p className="text-[#64748B] dark:text-neutral-400">
            Tell us about yourself and your recruiting experience.
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
                  Name:
                </span>
                <span className="ml-2 text-[#334155] dark:text-neutral-100">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Email:
                </span>
                <span className="ml-2 text-[#334155] dark:text-neutral-100">
                  {formData.email}
                </span>
              </div>
              {formData.phone && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Phone:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.phone}
                  </span>
                </div>
              )}
              {formData.location && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Location:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.location}
                  </span>
                </div>
              )}
              {formData.recruiterExperience && (
                <div>
                  <span className="text-[#64748B] dark:text-neutral-400">
                    Recruiter Experience:
                  </span>
                  <span className="ml-2 text-[#334155] dark:text-neutral-100">
                    {formData.recruiterExperience}
                  </span>
                </div>
              )}
            </div>
            {formData.bio && (
              <div>
                <span className="text-[#64748B] dark:text-neutral-400">
                  Bio:
                </span>
                <p className="mt-1 text-[#334155] dark:text-neutral-100">
                  {formData.bio}
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
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="firstName"
                  className="text-[#363231] dark:text-neutral-200"
                >
                  First Name *
                </Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleFieldChange("firstName", e.target.value)
                  }
                  placeholder="Enter your first name"
                  className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="lastName"
                  className="text-[#363231] dark:text-neutral-200"
                >
                  Last Name *
                </Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleFieldChange("lastName", e.target.value)
                  }
                  placeholder="Enter your last name"
                  className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-[#363231] dark:text-neutral-200"
              >
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
                placeholder="Enter your email address"
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
              />
            </div>

            {/* Phone Field */}
            <div className="space-y-2">
              <Label
                htmlFor="phone"
                className="text-[#363231] dark:text-neutral-200"
              >
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleFieldChange("phone", e.target.value)}
                placeholder="Enter your phone number"
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155]"
              />
            </div>

            {/* Location Field */}
            <div className="space-y-2">
              <Label
                htmlFor="location"
                className="text-[#363231] dark:text-neutral-200"
              >
                Location
              </Label>
              <Select
                value={formData.location}
                onValueChange={(value) => handleFieldChange("location", value)}
              >
                <SelectTrigger className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100">
                  <SelectValue placeholder="Select your location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States of America">
                    🇺🇸 United States of America
                  </SelectItem>
                  <SelectItem value="United Kingdom">
                    🇬🇧 United Kingdom
                  </SelectItem>
                  <SelectItem value="Canada">🇨🇦 Canada</SelectItem>
                  <SelectItem value="Australia">🇦🇺 Australia</SelectItem>
                  <SelectItem value="Germany">🇩🇪 Germany</SelectItem>
                  <SelectItem value="France">🇫🇷 France</SelectItem>
                  <SelectItem value="Japan">🇯🇵 Japan</SelectItem>
                  <SelectItem value="India">🇮🇳 India</SelectItem>
                  <SelectItem value="Nigeria">🇳🇬 Nigeria</SelectItem>
                  <SelectItem value="South Africa">🇿🇦 South Africa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Recruiter Experience Field */}
            <div className="space-y-2">
              <Label
                htmlFor="recruiterExperience"
                className="text-[#363231] dark:text-neutral-200"
              >
                How long have you been a recruiter? *
              </Label>
              <Select
                value={formData.recruiterExperience}
                onValueChange={(value) =>
                  handleFieldChange("recruiterExperience", value)
                }
              >
                <SelectTrigger className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-1">0-1 years</SelectItem>
                  <SelectItem value="1-3">1-3 years</SelectItem>
                  <SelectItem value="3-5">3-5 years</SelectItem>
                  <SelectItem value="5-10">5-10 years</SelectItem>
                  <SelectItem value="10+">10+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Bio Field */}
            <div className="space-y-2">
              <Label
                htmlFor="bio"
                className="text-[#363231] dark:text-neutral-200"
              >
                Bio
              </Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleFieldChange("bio", e.target.value)}
                placeholder="Tell us about yourself and your recruiting approach..."
                rows={4}
                className="border-neutral-200 dark:border-neutral-600 text-[#334155] dark:text-neutral-100 placeholder-[#334155] resize-none"
              />
            </div>

            {/* Action Buttons - Only show if not in edit mode */}
            {!isEditMode && (
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
});

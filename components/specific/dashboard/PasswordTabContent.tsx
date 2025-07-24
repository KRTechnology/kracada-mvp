"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { motion } from "framer-motion";
import { Eye, EyeOff, Shield, Key, AlertCircle } from "lucide-react";

export function PasswordTabContent() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const validatePassword = (password: string) => {
    const errors = [];
    if (password.length < 8) errors.push("at least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("1 uppercase letter");
    if (!/[0-9]/.test(password)) errors.push("1 number");
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password))
      errors.push("1 special character");
    return errors;
  };

  const handleSave = async () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else {
      const passwordErrors = validatePassword(formData.newPassword);
      if (passwordErrors.length > 0) {
        newErrors.newPassword = `Password must contain ${passwordErrors.join(", ")}`;
      }
    }

    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    }, 1500);
  };

  const handleCancel = () => {
    setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    setErrors({});
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
            <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Password Settings
          </h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Update your password to keep your account secure.
        </p>
      </div>

      <div className="space-y-6">
        {/* Current Password */}
        <div className="space-y-2">
          <Label
            htmlFor="currentPassword"
            className="text-neutral-700 dark:text-neutral-300"
          >
            Current Password
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className={`pl-10 pr-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                errors.currentPassword ? "border-red-500" : ""
              }`}
              placeholder="Enter your current password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("current")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPasswords.current ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <div className="flex items-center space-x-1 text-red-500 text-sm">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.currentPassword}</span>
            </div>
          )}
        </div>

        {/* New Password */}
        <div className="space-y-2">
          <Label
            htmlFor="newPassword"
            className="text-neutral-700 dark:text-neutral-300"
          >
            New Password
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className={`pl-10 pr-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                errors.newPassword ? "border-red-500" : ""
              }`}
              placeholder="Enter your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("new")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPasswords.new ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <div className="flex items-center space-x-1 text-red-500 text-sm">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.newPassword}</span>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-neutral-700 dark:text-neutral-300"
          >
            Confirm New Password
          </Label>
          <div className="relative">
            <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className={`pl-10 pr-10 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                errors.confirmPassword ? "border-red-500" : ""
              }`}
              placeholder="Confirm your new password"
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirm")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <div className="flex items-center space-x-1 text-red-500 text-sm">
              <AlertCircle className="w-3 h-3" />
              <span>{errors.confirmPassword}</span>
            </div>
          )}
        </div>

        {/* Password Requirements */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
            Password Requirements:
          </h4>
          <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li className="flex items-center space-x-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  formData.newPassword.length >= 8
                    ? "bg-green-500"
                    : "bg-neutral-300"
                }`}
              />
              <span>At least 8 characters</span>
            </li>
            <li className="flex items-center space-x-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  /[A-Z]/.test(formData.newPassword)
                    ? "bg-green-500"
                    : "bg-neutral-300"
                }`}
              />
              <span>At least 1 uppercase letter</span>
            </li>
            <li className="flex items-center space-x-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  /[0-9]/.test(formData.newPassword)
                    ? "bg-green-500"
                    : "bg-neutral-300"
                }`}
              />
              <span>At least 1 number</span>
            </li>
            <li className="flex items-center space-x-2">
              <div
                className={`w-1.5 h-1.5 rounded-full ${
                  /[!@#$%^&*(),.?":{}|<>]/.test(formData.newPassword)
                    ? "bg-green-500"
                    : "bg-neutral-300"
                }`}
              />
              <span>At least 1 special character</span>
            </li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white"
          >
            {isSaving ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

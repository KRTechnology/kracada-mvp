"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Laptop, Smartphone, Monitor, Eye, EyeOff, LogOut } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  changePasswordAction,
  type ChangePasswordData,
} from "@/app/(dashboard)/actions/password-actions";
import {
  getUserActiveSessionsAction,
  forceLogoutSessionAction,
  logoutAllOtherSessionsAction,
} from "@/app/(dashboard)/actions/session-actions";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/common/spinner";

// Password change schema with same validation as signup
const passwordChangeSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least 1 uppercase letter")
      .regex(/[0-9]/, "Must contain at least 1 number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Must contain at least 1 special character"
      ),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>;

interface SessionDisplayData {
  id: string;
  deviceType: "desktop" | "mobile" | "tablet";
  browser: string;
  os: string;
  location: string;
  lastActive: string;
  isCurrentSession: boolean;
  userAgent: string;
}

export function PasswordTabContent() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [activeSessions, setActiveSessions] = useState<SessionDisplayData[]>(
    []
  );
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoggingOutSession, setIsLoggingOutSession] = useState<string | null>(
    null
  );
  const router = useRouter();

  const form = useForm<PasswordChangeFormData>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Fetch active sessions on component mount
  useEffect(() => {
    fetchActiveSessions();
  }, []);

  const fetchActiveSessions = async () => {
    try {
      setIsLoadingSessions(true);
      const result = await getUserActiveSessionsAction();

      if (result.success && result.data) {
        setActiveSessions(result.data);
      } else {
        console.error("Failed to fetch sessions:", result.message);
        // For now, show empty state instead of error
      }
    } catch (error) {
      console.error("Error fetching sessions:", error);
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const onSubmit = async (data: PasswordChangeFormData) => {
    setIsUpdating(true);

    try {
      const result = await changePasswordAction({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });

      if (result.success) {
        toast.success(result.message);

        // Reset form
        form.reset();

        // Wait a moment for the toast to be visible, then sign out
        setTimeout(async () => {
          await signOut({ callbackUrl: "/login" });
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    form.reset();
  };

  const handleLogoutSession = async (sessionId: string) => {
    try {
      setIsLoggingOutSession(sessionId);

      const result = await forceLogoutSessionAction(sessionId);

      if (result.success) {
        toast.success(result.message);
        // Refresh sessions list
        await fetchActiveSessions();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error logging out session:", error);
      toast.error("Failed to log out session");
    } finally {
      setIsLoggingOutSession(null);
    }
  };

  const handleLogoutAllOtherSessions = async () => {
    try {
      const result = await logoutAllOtherSessionsAction();

      if (result.success) {
        toast.success(result.message);
        // Refresh sessions list
        await fetchActiveSessions();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error logging out all other sessions:", error);
      toast.error("Failed to log out other sessions");
    }
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "laptop":
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      case "smartphone":
      case "mobile":
        return <Smartphone className="w-4 h-4" />;
      case "tablet":
        return <Laptop className="w-4 h-4" />;
      default:
        return <Monitor className="w-4 h-4" />;
    }
  };

  const getDeviceDisplayName = (deviceType: string, os: string) => {
    switch (deviceType) {
      case "desktop":
        return `${os} Computer`;
      case "laptop":
        return `${os} Laptop`;
      case "mobile":
        return `${os} Phone`;
      case "tablet":
        return `${os} Tablet`;
      default:
        return `${os} Device`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Password Update Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
            Password
          </h3>
          <p className="text-[#64748B] dark:text-neutral-400">
            Update your password by first entering your current password.
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label
              htmlFor="currentPassword"
              className="text-[#363231] dark:text-neutral-100"
            >
              Current password
            </Label>
            <div className="relative">
              <Input
                id="currentPassword"
                type={showCurrentPassword ? "text" : "password"}
                {...form.register("currentPassword")}
                className={`mt-2 pr-10 ${
                  form.formState.errors.currentPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="Enter your current password"
                disabled={isUpdating}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                disabled={isUpdating}
                tabIndex={-1}
                aria-label={
                  showCurrentPassword ? "Hide password" : "Show password"
                }
              >
                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.formState.errors.currentPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="newPassword"
              className="text-[#363231] dark:text-neutral-100"
            >
              New password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                {...form.register("newPassword")}
                className={`mt-2 pr-10 ${
                  form.formState.errors.newPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="Enter your new password"
                disabled={isUpdating}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                onClick={() => setShowNewPassword(!showNewPassword)}
                disabled={isUpdating}
                tabIndex={-1}
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.formState.errors.newPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.newPassword.message}
              </p>
            )}
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              At least 8 characters, one uppercase letter, one number, and one
              special character.
            </p>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-[#363231] dark:text-neutral-100"
            >
              Confirm new password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                {...form.register("confirmPassword")}
                className={`mt-2 pr-10 ${
                  form.formState.errors.confirmPassword
                    ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                    : ""
                }`}
                placeholder="Confirm your new password"
                disabled={isUpdating}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={isUpdating}
                tabIndex={-1}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {form.formState.errors.confirmPassword && (
              <p className="text-sm text-red-500 mt-1">
                {form.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              onClick={handleCancel}
              variant="outline"
              className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg"
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isUpdating ||
                !form.formState.isValid ||
                form.formState.isSubmitting
              }
              className="bg-warm-200 hover:bg-warm-300 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdating ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      </motion.div>

      {/* Active Sessions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
                Active Sessions
              </h3>
              <p className="text-[#64748B] dark:text-neutral-400">
                You are logged in and have active sessions on these devices.
              </p>
            </div>
            {activeSessions.length > 1 && (
              <Button
                onClick={handleLogoutAllOtherSessions}
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                size="sm"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout All Others
              </Button>
            )}
          </div>
        </div>

        {isLoadingSessions ? (
          <div className="flex items-center justify-center py-8">
            <Spinner size="lg" />
          </div>
        ) : activeSessions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-[#64748B] dark:text-neutral-400">
              No active sessions found.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activeSessions.map((session, index) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 + index * 0.05 }}
                className="flex items-center justify-between py-4 border-b border-neutral-100 dark:border-neutral-800 last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center">
                    <div className="text-blue-600 dark:text-blue-400">
                      {getDeviceIcon(session.deviceType)}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-[#334155] dark:text-neutral-100">
                      {getDeviceDisplayName(session.deviceType, session.os)}
                    </h4>
                    <p className="text-sm text-[#64748B] dark:text-neutral-400">
                      {session.browser} • {session.location} •{" "}
                      {session.lastActive}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => handleLogoutSession(session.id)}
                  variant="outline"
                  className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-3 py-2 rounded-lg text-sm"
                  disabled={isLoggingOutSession === session.id}
                >
                  {isLoggingOutSession === session.id ? (
                    <Spinner size="sm" className="w-4 h-4" />
                  ) : (
                    "Log out"
                  )}
                </Button>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}

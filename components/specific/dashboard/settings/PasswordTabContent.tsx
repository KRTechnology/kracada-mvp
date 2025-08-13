"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Laptop, Smartphone, Monitor } from "lucide-react";
import { toast } from "sonner";

interface ActiveSession {
  id: string;
  deviceName: string;
  deviceType: "laptop" | "smartphone" | "desktop";
  location: string;
  lastActive: string;
}

export function PasswordTabContent() {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isUpdating, setIsUpdating] = useState(false);

  // Mock active sessions data
  const activeSessions: ActiveSession[] = [
    {
      id: "1",
      deviceName: "2022 MacBook Pro",
      deviceType: "laptop",
      location: "Indianapolis, Indiana, USA • June 12, 2022 at 10:32am",
      lastActive: "2022-06-12T10:32:00Z",
    },
    {
      id: "2",
      deviceName: "2022 MacBook Air",
      deviceType: "laptop",
      location: "Indianapolis, Indiana, USA • June 12, 2022 at 10:32am",
      lastActive: "2022-06-12T10:32:00Z",
    },
    {
      id: "3",
      deviceName: "2022 iPhone 13",
      deviceType: "smartphone",
      location: "Indianapolis, Indiana, USA • June 12, 2022 at 10:32am",
      lastActive: "2022-06-12T10:32:00Z",
    },
    {
      id: "4",
      deviceName: "2022 iMac",
      deviceType: "desktop",
      location: "Indianapolis, Indiana, USA • June 12, 2022 at 10:32am",
      lastActive: "2022-06-12T10:32:00Z",
    },
  ];

  const handleInputChange = (field: string, value: string) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      // TODO: Show error message
      return;
    }

    setIsUpdating(true);
    try {
      // TODO: Implement password update functionality
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
      console.log("Updating password:", passwordData);
      toast.success("Password updated successfully!");

      // Reset form
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Failed to update password.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogoutSession = (sessionId: string) => {
    // TODO: Implement session logout functionality
    console.log("Logging out session:", sessionId);

    // Show toast notification
    toast.success("Session logged out successfully!");
  };

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case "laptop":
        return <Laptop className="w-4 h-4" />;
      case "smartphone":
        return <Smartphone className="w-4 h-4" />;
      case "desktop":
        return <Monitor className="w-4 h-4" />;
      default:
        return <Laptop className="w-4 h-4" />;
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

        <div className="space-y-6">
          <div>
            <Label
              htmlFor="currentPassword"
              className="text-[#363231] dark:text-neutral-100"
            >
              Current password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              className="mt-2"
              placeholder="Enter your current password"
            />
          </div>

          <div>
            <Label
              htmlFor="newPassword"
              className="text-[#363231] dark:text-neutral-100"
            >
              New password
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              className="mt-2"
              placeholder="Enter your new password"
            />
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2">
              At least 8 characters and one number.
            </p>
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-[#363231] dark:text-neutral-100"
            >
              Confirm new password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              className="mt-2"
              placeholder="Confirm your new password"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-4 py-2 rounded-lg"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdatePassword}
            disabled={
              isUpdating ||
              !passwordData.currentPassword ||
              !passwordData.newPassword ||
              !passwordData.confirmPassword
            }
            className="bg-warm-200 hover:bg-warm-300 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? "Updating..." : "Update password"}
          </Button>
        </div>
      </motion.div>

      {/* Active Sessions Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
            Active Sessions
          </h3>
          <p className="text-[#64748B] dark:text-neutral-400">
            You are logged in and have active sessions on these devices.
          </p>
        </div>

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
                    {session.deviceName}
                  </h4>
                  <p className="text-sm text-[#64748B] dark:text-neutral-400">
                    {session.location}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleLogoutSession(session.id)}
                variant="outline"
                className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 px-3 py-2 rounded-lg text-sm"
              >
                Log out
              </Button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

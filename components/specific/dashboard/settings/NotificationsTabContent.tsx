"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/common/checkbox";
import { toast } from "sonner";
import {
  updateUserNotificationPreferencesAction,
  bulkUpdateNotificationPreferencesAction,
} from "@/app/(dashboard)/actions/notification-actions";

interface NotificationSetting {
  id: string;
  category: string;
  event: string;
  noneEnabled: boolean;
  inAppEnabled: boolean;
  emailEnabled: boolean;
  eventDescription: string;
  categoryDescription: string;
  displayOrder: number;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  settings: NotificationSetting[];
}

interface NotificationsTabContentProps {
  initialPreferences: NotificationCategory[];
}

export function NotificationsTabContent({
  initialPreferences,
}: NotificationsTabContentProps) {
  const [notificationSettings, setNotificationSettings] =
    useState<NotificationCategory[]>(initialPreferences);
  const [isUpdating, setIsUpdating] = useState(false);

  // Update local state when initialPreferences change
  useEffect(() => {
    setNotificationSettings(initialPreferences);
  }, [initialPreferences]);

  const handleNotificationChange = async (
    categoryId: string,
    settingId: string,
    type: "none" | "inApp" | "email",
    checked: boolean
  ) => {
    try {
      setIsUpdating(true);

      // Find the setting to update
      const category = notificationSettings.find(
        (cat) => cat.id === categoryId
      );
      const setting = category?.settings.find((set) => set.id === settingId);

      if (!setting) return;

      // Prepare new preferences
      let newPreferences = { ...setting };

      // If checking "none", uncheck others
      if (type === "none" && checked) {
        newPreferences = {
          ...newPreferences,
          noneEnabled: true,
          inAppEnabled: false,
          emailEnabled: false,
        };
      }
      // If checking other options, uncheck "none"
      else if (type !== "none" && checked) {
        newPreferences = {
          ...newPreferences,
          [type]: true,
          noneEnabled: false,
        };
      }
      // If unchecking, allow it
      else {
        newPreferences = {
          ...newPreferences,
          [type]: checked,
        };
      }

      // Update backend
      const result = await updateUserNotificationPreferencesAction(
        categoryId,
        settingId,
        {
          noneEnabled: newPreferences.noneEnabled,
          inAppEnabled: newPreferences.inAppEnabled,
          emailEnabled: newPreferences.emailEnabled,
        }
      );

      if (result.success) {
        // Update local state
        setNotificationSettings((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                settings: cat.settings.map((set) => {
                  if (set.id === settingId) {
                    return newPreferences;
                  }
                  return set;
                }),
              };
            }
            return cat;
          })
        );

        toast.success("Notification settings updated!");
      } else {
        toast.error(result.message || "Failed to update notification settings");
      }
    } catch (error) {
      console.error("Error updating notification settings:", error);
      toast.error("Failed to update notification settings");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAllOn = async (categoryId: string) => {
    try {
      setIsUpdating(true);

      const result = await bulkUpdateNotificationPreferencesAction(categoryId, {
        noneEnabled: false,
        inAppEnabled: true,
        emailEnabled: true,
      });

      if (result.success) {
        // Update local state
        setNotificationSettings((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                settings: cat.settings.map((set) => ({
                  ...set,
                  noneEnabled: false,
                  inAppEnabled: true,
                  emailEnabled: true,
                })),
              };
            }
            return cat;
          })
        );

        toast.success("All notifications enabled for this category!");
      } else {
        toast.error(
          result.message || "Failed to update category notifications"
        );
      }
    } catch (error) {
      console.error("Error bulk updating notifications:", error);
      toast.error("Failed to update category notifications");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAllOff = async (categoryId: string) => {
    try {
      setIsUpdating(true);

      const result = await bulkUpdateNotificationPreferencesAction(categoryId, {
        noneEnabled: true,
        inAppEnabled: false,
        emailEnabled: false,
      });

      if (result.success) {
        // Update local state
        setNotificationSettings((prev) =>
          prev.map((cat) => {
            if (cat.id === categoryId) {
              return {
                ...cat,
                settings: cat.settings.map((set) => ({
                  ...set,
                  noneEnabled: true,
                  inAppEnabled: false,
                  emailEnabled: false,
                })),
              };
            }
            return cat;
          })
        );

        toast.success("All notifications disabled for this category!");
      } else {
        toast.error(
          result.message || "Failed to update category notifications"
        );
      }
    } catch (error) {
      console.error("Error bulk updating notifications:", error);
      toast.error("Failed to update category notifications");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-dark-container rounded-2xl shadow-sm p-6"
      >
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-[#334155] dark:text-neutral-100 mb-2">
            Notifications
          </h3>
          <p className="text-[#64748B] dark:text-neutral-400">
            Manage how you would like to be notified of activity.
          </p>
        </div>

        <div className="space-y-8">
          {notificationSettings.map((category, categoryIndex) => (
            <motion.div
              key={category.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: categoryIndex * 0.1 }}
              className="border-b border-neutral-100 dark:border-neutral-800 last:border-b-0 pb-6 last:pb-0"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="text-base font-semibold text-[#334155] dark:text-neutral-100 mb-1">
                    {category.title}
                  </h4>
                  <p className="text-sm text-[#64748B] dark:text-neutral-400">
                    {category.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <button
                    onClick={() => handleAllOn(category.id)}
                    disabled={isUpdating}
                    className="text-warm-200 hover:text-warm-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    All On
                  </button>
                  <span className="text-neutral-300 dark:text-neutral-600">
                    /
                  </span>
                  <button
                    onClick={() => handleAllOff(category.id)}
                    disabled={isUpdating}
                    className="text-warm-200 hover:text-warm-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    All Off
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {category.settings.map((setting, settingIndex) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.3,
                      delay: categoryIndex * 0.1 + settingIndex * 0.05,
                    }}
                    className="flex items-center justify-between py-3"
                  >
                    <span className="text-sm text-[#363231] dark:text-neutral-100 flex-1">
                      {setting.eventDescription}
                    </span>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${setting.id}-none`}
                          checked={setting.noneEnabled}
                          disabled={isUpdating}
                          onCheckedChange={(checked) =>
                            handleNotificationChange(
                              category.id,
                              setting.id,
                              "none",
                              checked as boolean
                            )
                          }
                          className="data-[state=checked]:bg-warm-200 data-[state=checked]:border-warm-200"
                        />
                        <label
                          htmlFor={`${setting.id}-none`}
                          className="text-sm text-[#64748B] dark:text-neutral-400 cursor-pointer"
                        >
                          None
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${setting.id}-inapp`}
                          checked={setting.inAppEnabled}
                          disabled={isUpdating}
                          onCheckedChange={(checked) =>
                            handleNotificationChange(
                              category.id,
                              setting.id,
                              "inApp",
                              checked as boolean
                            )
                          }
                          className="data-[state=checked]:bg-warm-200 data-[state=checked]:border-warm-200"
                        />
                        <label
                          htmlFor={`${setting.id}-inapp`}
                          className="text-sm text-[#64748B] dark:text-neutral-400 cursor-pointer"
                        >
                          In-app
                        </label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${setting.id}-email`}
                          checked={setting.emailEnabled}
                          disabled={isUpdating}
                          onCheckedChange={(checked) =>
                            handleNotificationChange(
                              category.id,
                              setting.id,
                              "email",
                              checked as boolean
                            )
                          }
                          className="data-[state=checked]:bg-warm-200 data-[state=checked]:border-warm-200"
                        />
                        <label
                          htmlFor={`${setting.id}-email`}
                          className="text-sm text-[#64748B] dark:text-neutral-400 cursor-pointer"
                        >
                          Email
                        </label>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

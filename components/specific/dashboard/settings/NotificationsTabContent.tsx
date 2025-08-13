"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Checkbox } from "@/components/common/checkbox";

interface NotificationSetting {
  id: string;
  label: string;
  none: boolean;
  inApp: boolean;
  email: boolean;
}

interface NotificationCategory {
  id: string;
  title: string;
  description: string;
  settings: NotificationSetting[];
}

export function NotificationsTabContent() {
  const [notificationSettings, setNotificationSettings] = useState<
    NotificationCategory[]
  >([
    {
      id: "alerts",
      title: "Alerts",
      description: "Updates about critical activity.",
      settings: [
        {
          id: "password-change",
          label: "I change my password",
          none: false,
          inApp: true,
          email: true,
        },
        {
          id: "new-browser",
          label: "A new browser is used to sign in",
          none: true,
          inApp: false,
          email: false,
        },
        {
          id: "new-device",
          label: "A new device is linked",
          none: false,
          inApp: false,
          email: true,
        },
      ],
    },
    {
      id: "jobs",
      title: "Jobs",
      description: "Updates about job activity.",
      settings: [
        {
          id: "new-job-post",
          label: "A new job post",
          none: false,
          inApp: true,
          email: false,
        },
        {
          id: "job-application-status",
          label: "Job application status",
          none: false,
          inApp: true,
          email: false,
        },
      ],
    },
    {
      id: "articles",
      title: "Articles",
      description: "Updates from articles.",
      settings: [
        {
          id: "new-topics",
          label: "New topics",
          none: false,
          inApp: false,
          email: true,
        },
        {
          id: "new-comment",
          label: "New comment on article",
          none: true,
          inApp: false,
          email: false,
        },
        {
          id: "likes-on-article",
          label: "Likes on article post",
          none: true,
          inApp: false,
          email: false,
        },
      ],
    },
    {
      id: "news",
      title: "News",
      description: "Updates from news.",
      settings: [
        {
          id: "news-updates",
          label: "News updates",
          none: false,
          inApp: false,
          email: true,
        },
      ],
    },
  ]);

  const handleNotificationChange = (
    categoryId: string,
    settingId: string,
    type: "none" | "inApp" | "email",
    checked: boolean
  ) => {
    setNotificationSettings((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            settings: category.settings.map((setting) => {
              if (setting.id === settingId) {
                // If checking "none", uncheck others
                if (type === "none" && checked) {
                  return { ...setting, none: true, inApp: false, email: false };
                }
                // If checking other options, uncheck "none"
                if (type !== "none" && checked) {
                  return { ...setting, [type]: true, none: false };
                }
                // If unchecking, allow it
                return { ...setting, [type]: checked };
              }
              return setting;
            }),
          };
        }
        return category;
      })
    );
  };

  const handleAllOn = (categoryId: string) => {
    setNotificationSettings((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            settings: category.settings.map((setting) => ({
              ...setting,
              none: false,
              inApp: true,
              email: true,
            })),
          };
        }
        return category;
      })
    );
  };

  const handleAllOff = (categoryId: string) => {
    setNotificationSettings((prev) =>
      prev.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            settings: category.settings.map((setting) => ({
              ...setting,
              none: true,
              inApp: false,
              email: false,
            })),
          };
        }
        return category;
      })
    );
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
                    className="text-warm-200 hover:text-warm-300 transition-colors"
                  >
                    All On
                  </button>
                  <span className="text-neutral-300 dark:text-neutral-600">
                    /
                  </span>
                  <button
                    onClick={() => handleAllOff(category.id)}
                    className="text-warm-200 hover:text-warm-300 transition-colors"
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
                      {setting.label}
                    </span>

                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`${setting.id}-none`}
                          checked={setting.none}
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
                          checked={setting.inApp}
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
                          checked={setting.email}
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

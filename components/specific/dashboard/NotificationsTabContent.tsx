"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { Label } from "@/components/common/label";
import { motion } from "framer-motion";
import {
  Bell,
  Mail,
  MessageSquare,
  Briefcase,
  Globe,
  Smartphone,
} from "lucide-react";

interface NotificationSetting {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  email: boolean;
  push: boolean;
  sms: boolean;
}

export function NotificationsTabContent() {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    {
      id: "job-alerts",
      title: "Job Alerts",
      description:
        "Get notified about new job opportunities that match your preferences",
      icon: <Briefcase className="w-5 h-5" />,
      email: true,
      push: true,
      sms: false,
    },
    {
      id: "messages",
      title: "Messages",
      description:
        "Notifications for new messages from employers and recruiters",
      icon: <MessageSquare className="w-5 h-5" />,
      email: true,
      push: true,
      sms: true,
    },
    {
      id: "application-updates",
      title: "Application Updates",
      description: "Updates on your job applications and interview requests",
      icon: <Bell className="w-5 h-5" />,
      email: true,
      push: false,
      sms: false,
    },
    {
      id: "newsletter",
      title: "Newsletter & Updates",
      description:
        "Weekly newsletter with industry insights and platform updates",
      icon: <Globe className="w-5 h-5" />,
      email: false,
      push: false,
      sms: false,
    },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  const updateSetting = (
    id: string,
    channel: "email" | "push" | "sms",
    value: boolean
  ) => {
    setSettings((prev) =>
      prev.map((setting) =>
        setting.id === id ? { ...setting, [channel]: value } : setting
      )
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const renderToggle = (
    checked: boolean,
    onChange: (value: boolean) => void
  ) => (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors ${
        checked ? "bg-warm-200" : "bg-neutral-200 dark:bg-neutral-700"
      }`}
    >
      <div
        className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/20 flex items-center justify-center">
            <Bell className="w-4 h-4 text-purple-600 dark:text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
            Notification Settings
          </h2>
        </div>
        <p className="text-neutral-600 dark:text-neutral-400">
          Choose how you'd like to be notified about important updates.
        </p>
      </div>

      <div className="space-y-6">
        {/* Notification Channels Header */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 pb-4 border-b border-neutral-200 dark:border-neutral-700">
          <div className="lg:col-span-1">
            <Label className="text-neutral-700 dark:text-neutral-300 font-medium">
              Notification Type
            </Label>
          </div>
          <div className="lg:col-span-3 grid grid-cols-3 gap-4">
            <div className="flex items-center justify-center space-x-2">
              <Mail className="w-4 h-4 text-neutral-400" />
              <Label className="text-neutral-600 dark:text-neutral-400 text-sm">
                Email
              </Label>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Bell className="w-4 h-4 text-neutral-400" />
              <Label className="text-neutral-600 dark:text-neutral-400 text-sm">
                Push
              </Label>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Smartphone className="w-4 h-4 text-neutral-400" />
              <Label className="text-neutral-600 dark:text-neutral-400 text-sm">
                SMS
              </Label>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="space-y-6">
          {settings.map((setting, index) => (
            <motion.div
              key={setting.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-center py-4"
            >
              <div className="lg:col-span-1">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-600 dark:text-neutral-400">
                    {setting.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-neutral-900 dark:text-neutral-100">
                      {setting.title}
                    </h3>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 hidden lg:block">
                      {setting.description}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 lg:hidden">
                  {setting.description}
                </p>
              </div>

              <div className="lg:col-span-3 grid grid-cols-3 gap-4">
                <div className="flex justify-center">
                  {renderToggle(setting.email, (value) =>
                    updateSetting(setting.id, "email", value)
                  )}
                </div>
                <div className="flex justify-center">
                  {renderToggle(setting.push, (value) =>
                    updateSetting(setting.id, "push", value)
                  )}
                </div>
                <div className="flex justify-center">
                  {renderToggle(setting.sms, (value) =>
                    updateSetting(setting.id, "sms", value)
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Settings */}
        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-700">
          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 mb-4">
            Global Settings
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-neutral-700 dark:text-neutral-300">
                  Pause all notifications
                </Label>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Temporarily disable all notifications for 1 hour
                </p>
              </div>
              {renderToggle(false, () => {})}
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-neutral-700 dark:text-neutral-300">
                  Digest mode
                </Label>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Receive a daily summary instead of individual notifications
                </p>
              </div>
              {renderToggle(false, () => {})}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-6">
          <Button
            onClick={() => {}}
            variant="outline"
            className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
          >
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white"
          >
            {isSaving ? "Saving..." : "Save Preferences"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

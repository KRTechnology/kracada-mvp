"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileTabContent } from "@/components/specific/dashboard/settings/ProfileTabContent";
import { PasswordTabContent } from "@/components/specific/dashboard/settings/PasswordTabContent";
import { NotificationsTabContent } from "@/components/specific/dashboard/settings/NotificationsTabContent";

type TabType = "profile" | "password" | "notifications";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  yearsOfExperience: string | null;
  skills: string[];
  jobPreferences: string[];
  profilePicture: string | null;
  cv: string | null;
  hasCompletedProfile: boolean;
  accountType: string;
  website: string | null;
  portfolio: string | null;
}

interface ExperienceData {
  id: string;
  jobTitle: string;
  employmentType: string;
  company: string;
  currentlyWorking: boolean;
  startMonth: string | null;
  startYear: string | null;
  endMonth: string | null;
  endYear: string | null;
  description: string | null;
  skills: string[];
}

interface SettingsClientProps {
  userData: UserData;
  experiences: ExperienceData[];
}

export function SettingsClient({ userData, experiences }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  const tabs = [
    { id: "profile" as TabType, label: "Profile" },
    { id: "password" as TabType, label: "Password" },
    { id: "notifications" as TabType, label: "Notifications" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <ProfileTabContent userData={userData} experiences={experiences} />
        );
      case "password":
        return <PasswordTabContent />;
      case "notifications":
        return <NotificationsTabContent />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Top Section - White Background */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1010px] mx-auto">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-[#334155] dark:text-neutral-100 mb-2">
                Settings
              </h1>
              <p className="text-[#64748B] dark:text-neutral-100">
                Manage your personal and organization settings.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative pb-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-[#334155] dark:text-neutral-100"
                      : "text-[#64748B] dark:text-neutral-400 hover:text-[#334155] dark:hover:text-neutral-300"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-200"
                      layoutId="activeTab"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Content */}
      <div className="bg-slate-100 dark:bg-neutral-800 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1010px] mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePictureCard } from "@/components/specific/dashboard/ProfilePictureCard";
import { ProfileCard } from "@/components/specific/dashboard/ProfileCard";
import { ExperienceCard } from "@/components/specific/dashboard/ExperienceCard";
import { PasswordTabContent } from "@/components/specific/dashboard/PasswordTabContent";
import { NotificationsTabContent } from "@/components/specific/dashboard/NotificationsTabContent";

type TabType = "profile" | "password" | "notifications";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");

  // Mock user data - will be replaced with actual API calls
  const userData = {
    id: "mock-user-123", // Add user ID for uploads
    firstName: "Rudra",
    lastName: "Devi",
    email: "rudra.devi@gmail.com",
    phone: "(555) 764 - 1982",
    location: "United States of America",
    bio: "I am a product designer who loves photography, hiking, and camping. I have a passion for creating products that are both functional and beautiful. In my free time, I spend time outdoors, explore new places, and capture the world through my camera lens.",
    yearsOfExperience: "",
    skills: [],
    jobPreferences: [],
    profilePicture: null,
    cv: null,
  };

  const tabs = [
    { id: "profile" as TabType, label: "Profile" },
    { id: "password" as TabType, label: "Password" },
    { id: "notifications" as TabType, label: "Notifications" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ProfilePictureCard userData={userData} />
            <ProfileCard userData={userData} />
            <ExperienceCard userData={userData} />
          </div>
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
              <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                Complete your profile
              </h1>
              <p className="text-neutral-600 dark:text-neutral-400">
                Manage your personal and organization settings.
              </p>
            </div>

            {/* Tabs */}
            <div className="border-b border-neutral-100 dark:border-neutral-800">
              <div className="flex space-x-6">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 font-medium relative transition-colors ${
                      activeTab === tab.id
                        ? "text-neutral-900 dark:text-neutral-100"
                        : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300"
                    }`}
                  >
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-warm-200 rounded-full"
                        style={{ width: "80%" }}
                        initial={false}
                        transition={{
                          type: "spring",
                          stiffness: 500,
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
      </div>

      {/* Bottom Section - #F1F5F9 Background */}
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

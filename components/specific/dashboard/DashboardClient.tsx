"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PasswordTabContent } from "@/components/specific/dashboard/PasswordTabContent";
import { NotificationsTabContent } from "@/components/specific/dashboard/NotificationsTabContent";

type TabType = "password" | "notifications";

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>("password");

  const tabs = [
    { id: "password" as TabType, label: "Password" },
    { id: "notifications" as TabType, label: "Notifications" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
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
                Manage your account settings and preferences.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex space-x-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`pb-3 font-medium relative transition-colors ${
                    activeTab === tab.id
                      ? "text-warm-200 dark:text-[#FF7D1A]"
                      : "text-[#64748B] dark:text-neutral-100 hover:text-warm-200  dark:hover:text-[#FF7D1A]"
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-200 rounded-full"
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

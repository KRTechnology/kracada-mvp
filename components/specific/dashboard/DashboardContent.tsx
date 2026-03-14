"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { TabSwitcher, TabType } from "./TabSwitcher";
import { MobileTabDropdown } from "./MobileTabDropdown";
import { TabContentRenderer } from "./TabContentRenderer";

interface DashboardContentProps {
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    website?: string | null;
    portfolio?: string | null;
    skills?: string[];
    jobPreferences?: string[];
    profilePicture?: string | null;
    cv?: string | null;
    yearsOfExperience?: number | null;
    recruiterExperience?: string | null;
    companyLogo?: string | null;
    companyName?: string | null;
    companyDescription?: string | null;
    companyWebsite?: string | null;
    companyEmail?: string | null;
    accountType?: string;
  };
  experiences: Array<{
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
  }>;
  accountType?: string;
}

export function DashboardContent({
  userData,
  experiences,
  accountType,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Profile");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger refresh of job posts
  const triggerJobRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
  };

  // Ensure accountType is included in userData
  const enrichedUserData = {
    ...userData,
    accountType: accountType || userData.accountType,
  };

  return (
    <div className="space-y-6">
      {/* Desktop Tab Switcher */}
      <div className="pt-6 hidden md:block">
        <TabSwitcher
          activeTab={activeTab}
          onTabChange={handleTabChange}
          applicationsCount={2}
          accountType={accountType}
        />
      </div>

      {/* Mobile Tab Dropdown */}
      <MobileTabDropdown
        activeTab={activeTab}
        onTabChange={handleTabChange}
        accountType={accountType}
      />

      {/* Tab Content */}
      <div className="px-6 pb-6">
        <AnimatePresence mode="wait">
          <TabContentRenderer
            activeTab={activeTab}
            userData={enrichedUserData}
            experiences={experiences}
            refreshTrigger={refreshTrigger}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

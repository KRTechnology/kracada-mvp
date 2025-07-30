"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePictureCard } from "@/components/specific/dashboard/ProfilePictureCard";
import { ProfileCard } from "@/components/specific/dashboard/ProfileCard";
import { ExperienceCard } from "@/components/specific/dashboard/ExperienceCard";
import { PasswordTabContent } from "@/components/specific/dashboard/PasswordTabContent";
import { NotificationsTabContent } from "@/components/specific/dashboard/NotificationsTabContent";
import { Button } from "@/components/common/button";
import {
  getUserProfileAction,
  getUserExperiencesAction,
  markProfileCompletedAction,
} from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type TabType = "profile" | "password" | "notifications";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  yearsOfExperience: string;
  skills: string[];
  jobPreferences: string[];
  profilePicture: string | null;
  cv: string | null;
  hasCompletedProfile: boolean;
  accountType: string;
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

export function DashboardClient() {
  const [activeTab, setActiveTab] = useState<TabType>("profile");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [experiences, setExperiences] = useState<ExperienceData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isContinuing, setIsContinuing] = useState(false);
  const router = useRouter();

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [profileResult, experiencesResult] = await Promise.all([
          getUserProfileAction(),
          getUserExperiencesAction(),
        ]);

        if (profileResult.success && profileResult.data) {
          setUserData({
            id: profileResult.data.id,
            firstName: profileResult.data.firstName || "",
            lastName: profileResult.data.lastName || "",
            email: profileResult.data.email,
            phone: profileResult.data.phone || "",
            location: profileResult.data.location || "",
            bio: profileResult.data.bio || "",
            yearsOfExperience:
              profileResult.data.yearsOfExperience?.toString() || "",
            skills: profileResult.data.skills || [],
            jobPreferences: profileResult.data.jobPreferences || [],
            profilePicture: profileResult.data.profilePicture,
            cv: profileResult.data.cv,
            hasCompletedProfile: profileResult.data.hasCompletedProfile,
            accountType: profileResult.data.accountType,
          });
        } else {
          console.error("Failed to fetch user profile:", profileResult.message);
          toast.error("Failed to load profile data");
        }

        if (experiencesResult.success && experiencesResult.data) {
          setExperiences(experiencesResult.data);
        } else {
          console.error(
            "Failed to fetch experiences:",
            experiencesResult.message
          );
          toast.error("Failed to load experiences");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const tabs = [
    { id: "profile" as TabType, label: "Profile" },
    { id: "password" as TabType, label: "Password" },
    { id: "notifications" as TabType, label: "Notifications" },
  ];

  // Check if all required fields are completed
  const isProfileComplete =
    userData &&
    userData.firstName &&
    userData.lastName &&
    userData.email &&
    userData.phone &&
    userData.location &&
    userData.bio &&
    userData.profilePicture && // Profile picture is required
    userData.cv && // CV is required
    (userData.accountType === "Employer" ||
    userData.accountType === "Business Owner"
      ? userData.yearsOfExperience
      : true);

  const isSkillsComplete =
    userData &&
    userData.skills.length > 0 &&
    userData.jobPreferences.length > 0;

  const isExperiencesComplete = experiences.length > 0;

  const canContinue =
    isProfileComplete && isSkillsComplete && isExperiencesComplete;

  const handleContinue = async () => {
    if (!canContinue) return;

    setIsContinuing(true);
    try {
      const result = await markProfileCompletedAction();

      if (result.success) {
        toast.success("Profile completed successfully!");
        router.push("/dashboard/home");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Continue error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsContinuing(false);
    }
  };

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-warm-200 border-t-transparent"></div>
        </div>
      );
    }

    if (!userData) {
      return (
        <div className="text-center py-12">
          <p className="text-neutral-600 dark:text-neutral-400">
            Failed to load profile data
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "profile":
        return (
          <div className="space-y-6">
            <ProfilePictureCard userData={userData} />
            <ProfileCard userData={userData} />
            <ExperienceCard
              userData={userData}
              experiences={experiences}
              onExperiencesUpdate={setExperiences}
            />

            {/* Continue Button */}
            <div className="flex flex-col items-center pt-8 space-y-4">
              <Button
                onClick={handleContinue}
                disabled={!canContinue || isContinuing}
                className="px-8 py-3 bg-warm-200 hover:bg-warm-300 text-white dark:text-dark text-lg font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isContinuing ? "Completing..." : "Continue"}
              </Button>

              {/* Progress Feedback */}
              {!canContinue && (
                <div className="w-full max-w-md">
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                      Complete your profile to continue:
                    </h4>
                    <div className="space-y-2 text-sm">
                      {!isProfileComplete && (
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Fill out all profile information</span>
                        </div>
                      )}
                      {userData && !userData.profilePicture && (
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Upload a profile picture</span>
                        </div>
                      )}
                      {userData && !userData.cv && (
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Upload your CV</span>
                        </div>
                      )}
                      {!isSkillsComplete && (
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Add at least one skill and job preference</span>
                        </div>
                      )}
                      {!isExperiencesComplete && (
                        <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                          <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                          <span>Add at least one work experience</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
              <h1 className="text-2xl font-semibold text-[#334155] dark:text-neutral-100 mb-2">
                Complete your profile
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

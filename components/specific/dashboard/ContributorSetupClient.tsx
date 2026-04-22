"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfilePictureCard } from "@/components/specific/dashboard/ProfilePictureCard";
import { ProfileCard } from "@/components/specific/dashboard/ProfileCard";
import { ExperienceCard } from "@/components/specific/dashboard/ExperienceCard";
import { Button } from "@/components/common/button";
import { markProfileCompletedAction } from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

interface ContributorSetupClientProps {
  profileData: any;
}

export function ContributorSetupClient({
  profileData,
}: ContributorSetupClientProps) {
  const [userData, setUserData] = useState<UserData>({
    id: profileData.id,
    firstName: profileData.firstName || "",
    lastName: profileData.lastName || "",
    email: profileData.email,
    phone: profileData.phone || null,
    location: profileData.location || null,
    bio: profileData.bio || null,
    yearsOfExperience: profileData.yearsOfExperience?.toString() || null,
    skills: profileData.skills || [],
    jobPreferences: profileData.jobPreferences || [],
    profilePicture: profileData.profilePicture,
    cv: profileData.cv,
    hasCompletedProfile: profileData.hasCompletedProfile,
    accountType: profileData.accountType,
  });

  const [experiences, setExperiences] = useState<ExperienceData[]>(
    profileData.experiences || [],
  );
  const [isContinuing, setIsContinuing] = useState(false);
  const router = useRouter();

  // Callback to update user data when profile picture or CV is updated
  const handleUserDataUpdate = useCallback(
    (updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string | null;
      location?: string | null;
      bio?: string | null;
      yearsOfExperience?: string | null;
      skills?: string[];
      jobPreferences?: string[];
      profilePicture?: string | null;
      cv?: string | null;
    }) => {
      setUserData((prevData) => {
        if (prevData) {
          return { ...prevData, ...updates };
        }
        return prevData;
      });
    },
    [],
  );

  // Check if all required fields are completed
  const isProfileComplete =
    !!userData.firstName?.trim() &&
    !!userData.lastName?.trim() &&
    !!userData.email?.trim() &&
    !!userData.phone?.trim() &&
    !!userData.location?.trim() &&
    !!userData.bio?.trim() &&
    !!userData.profilePicture?.trim() &&
    !!userData.cv?.trim();

  const isSkillsComplete =
    userData.skills.length > 0 && userData.jobPreferences.length > 0;

  const isExperiencesComplete = experiences.length > 0;

  const canContinue = Boolean(
    isProfileComplete && isSkillsComplete && isExperiencesComplete,
  );
  console.log({
    firstName: !!userData.firstName?.trim(),
    lastName: !!userData.lastName?.trim(),
    email: !!userData.email?.trim(),
    phone: !!userData.phone?.trim(),
    location: !!userData.location?.trim(),
    bio: !!userData.bio?.trim(),
    profilePicture: !!userData.profilePicture?.trim(),
    cv: !!userData.cv?.trim(),
    skills: userData.skills.length > 0,
    jobPreferences: userData.jobPreferences.length > 0,
    experiences: experiences.length > 0,
    canContinue,
  });
  const handleContinue = async () => {
    if (!canContinue) return;

    setIsContinuing(true);
    try {
      const result = await markProfileCompletedAction();

      if (result.success) {
        toast.success("Profile completed successfully!");
        router.push("/dashboard");
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

  return (
    <div className="space-y-6">
      <ProfilePictureCard
        userData={userData}
        onUserDataUpdate={handleUserDataUpdate}
      />
      <ProfileCard
        userData={userData}
        onUserDataUpdate={handleUserDataUpdate}
      />
      <ExperienceCard
        userData={userData}
        experiences={experiences}
        onExperiencesUpdate={setExperiences}
        onUserDataUpdate={handleUserDataUpdate}
      />

      {/* Continue Button */}
      <motion.div
        className="flex flex-col items-center pt-8 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.6 }}
      >
        <Button
          onClick={handleContinue}
          disabled={!canContinue || isContinuing}
          className="px-8 py-3 bg-warm-200 hover:bg-warm-300 text-white dark:text-dark text-lg font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isContinuing ? "Completing..." : "Complete Profile"}
        </Button>

        {/* Progress Feedback */}
        {!canContinue && (
          <motion.div
            className="w-full max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
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
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

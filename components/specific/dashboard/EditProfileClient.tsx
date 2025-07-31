"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { ProfileBanner } from "@/components/specific/dashboard/ProfileBanner";
import { ProfilePictureCard } from "@/components/specific/dashboard/ProfilePictureCard";
import {
  ProfileCard,
  ProfileCardRef,
} from "@/components/specific/dashboard/ProfileCard";
import {
  ExperienceCard,
  ExperienceCardRef,
} from "@/components/specific/dashboard/ExperienceCard";
import { Button } from "@/components/common/button";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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

interface EditProfileClientProps {
  userData: UserData;
  experiences: ExperienceData[];
}

export function EditProfileClient({
  userData,
  experiences,
}: EditProfileClientProps) {
  const [currentUserData, setCurrentUserData] = useState<UserData>(userData);
  const [currentExperiences, setCurrentExperiences] =
    useState<ExperienceData[]>(experiences);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const experienceCardRef = useRef<ExperienceCardRef>(null);
  const profileCardRef = useRef<ProfileCardRef>(null);

  // Callback to update user data when any component updates
  const handleUserDataUpdate = useCallback((updates: Partial<UserData>) => {
    setCurrentUserData((prevData) => {
      if (prevData) {
        return { ...prevData, ...updates };
      }
      return prevData;
    });
  }, []);

  // Callback to update experiences
  const handleExperiencesUpdate = useCallback(
    (newExperiences: ExperienceData[]) => {
      setCurrentExperiences(newExperiences);
    },
    []
  );

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Trigger ExperienceCard save if it has unsaved changes
      if (experienceCardRef.current) {
        await experienceCardRef.current.save();
      }

      // Trigger ProfileCard save if it has unsaved changes
      if (profileCardRef.current) {
        await profileCardRef.current.save();
      }

      // Show success message
      toast.success("Profile updated successfully!");

      // Navigate back to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-dark-bg">
      {/* Main Content Container */}
      <div className="mx-4 md:mx-[88px] mt-4">
        {/* White Card Container */}
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden">
          {/* Banner Section */}
          <ProfileBanner
            firstName={currentUserData.firstName}
            lastName={currentUserData.lastName}
            accountType={currentUserData.accountType}
            profileImageUrl={currentUserData.profilePicture || undefined}
            showEditButton={false}
          />

          {/* Edit Profile Content */}
          <div className="p-6 space-y-6">
            {/* Profile Picture & CV Section */}
            <ProfilePictureCard
              userData={currentUserData}
              onUserDataUpdate={handleUserDataUpdate}
              isEditMode={true}
            />

            {/* Profile Information Section */}
            <ProfileCard
              userData={currentUserData}
              onUserDataUpdate={handleUserDataUpdate}
              isEditMode={true}
              ref={profileCardRef}
            />

            {/* Experience & Skills Section */}
            <ExperienceCard
              userData={currentUserData}
              experiences={currentExperiences}
              onExperiencesUpdate={handleExperiencesUpdate}
              onUserDataUpdate={handleUserDataUpdate}
              isEditMode={true}
              ref={experienceCardRef}
            />

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="flex justify-end gap-4 pt-6 border-t border-neutral-200 dark:border-neutral-700"
            >
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}

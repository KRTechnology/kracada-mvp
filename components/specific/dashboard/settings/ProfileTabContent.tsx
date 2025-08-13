"use client";

import { useState, useCallback, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import {
  Upload,
  X,
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  Plus,
  Trash2,
} from "lucide-react";
import { ProfilePictureCard } from "@/components/specific/dashboard/ProfilePictureCard";
import {
  ProfileCard,
  ProfileCardRef,
} from "@/components/specific/dashboard/ProfileCard";
import {
  ExperienceCard,
  ExperienceCardRef,
} from "@/components/specific/dashboard/ExperienceCard";
import {
  WebsitePortfolioCard,
  WebsitePortfolioCardRef,
} from "@/components/specific/dashboard/WebsitePortfolioCard";

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

interface ProfileTabContentProps {
  userData: UserData;
  experiences: ExperienceData[];
}

export function ProfileTabContent({
  userData,
  experiences,
}: ProfileTabContentProps) {
  const [currentUserData, setCurrentUserData] = useState<UserData>(userData);
  const [currentExperiences, setCurrentExperiences] =
    useState<ExperienceData[]>(experiences);
  const [isSaving, setIsSaving] = useState(false);

  // Refs for the different sections
  const experienceCardRef = useRef<ExperienceCardRef>(null);
  const profileCardRef = useRef<ProfileCardRef>(null);
  const websitePortfolioCardRef = useRef<WebsitePortfolioCardRef>(null);

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

      // Trigger WebsitePortfolioCard save if it has unsaved changes
      if (websitePortfolioCardRef.current) {
        await websitePortfolioCardRef.current.save();
      }

      // Show success message
      console.log("Profile updated successfully!");

      // TODO: Show toast notification
    } catch (error) {
      console.error("Save error:", error);
      // TODO: Show error toast
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset to original data
    setCurrentUserData(userData);
    setCurrentExperiences([]);
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture & CV Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ProfilePictureCard
          userData={currentUserData}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={true}
        />
      </motion.div>

      {/* Profile Information Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <ProfileCard
          userData={currentUserData}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={true}
          ref={profileCardRef}
        />
      </motion.div>

      {/* Experience & Skills Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <ExperienceCard
          userData={currentUserData}
          experiences={currentExperiences}
          onExperiencesUpdate={handleExperiencesUpdate}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={true}
          ref={experienceCardRef}
        />
      </motion.div>

      {/* Website & Portfolio Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <WebsitePortfolioCard
          userData={currentUserData}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={true}
          ref={websitePortfolioCardRef}
        />
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
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
  );
}

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
import { EmployerProfilePictureCard } from "@/components/specific/dashboard/EmployerProfilePictureCard";
import {
  EmployerPersonalDetailsCard,
  EmployerPersonalDetailsCardRef,
} from "@/components/specific/dashboard/EmployerPersonalDetailsCard";
import {
  EmployerCompanyDetailsCard,
  EmployerCompanyDetailsCardRef,
} from "@/components/specific/dashboard/EmployerCompanyDetailsCard";
import { EmployerCompanyLogoCard } from "@/components/specific/dashboard/EmployerCompanyLogoCard";
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
  website: string | null;
  portfolio: string | null;
  // Employer-specific fields
  recruiterExperience: string | null;
  companyLogo: string | null;
  companyName: string | null;
  companyDescription: string | null;
  companyWebsite: string | null;
  companyEmail: string | null;
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

interface EmployerProfileTabContentProps {
  userData: UserData;
  experiences: ExperienceData[];
}

export function EmployerProfileTabContent({
  userData,
  experiences,
}: EmployerProfileTabContentProps) {
  const [currentUserData, setCurrentUserData] = useState<UserData>(userData);
  const [currentExperiences, setCurrentExperiences] =
    useState<ExperienceData[]>(experiences);
  const [isSaving, setIsSaving] = useState(false);
  const personalDetailsCardRef = useRef<EmployerPersonalDetailsCardRef>(null);
  const companyDetailsCardRef = useRef<EmployerCompanyDetailsCardRef>(null);

  // Callback to update user data when any component updates
  const handleUserDataUpdate = useCallback((updates: Partial<UserData>) => {
    setCurrentUserData((prevData) => {
      if (prevData) {
        return { ...prevData, ...updates };
      }
      return prevData;
    });
  }, []);

  // Callback to update company data
  const handleCompanyDataUpdate = useCallback((updates: any) => {
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
      // Trigger PersonalDetailsCard save if it has unsaved changes
      if (personalDetailsCardRef.current) {
        await personalDetailsCardRef.current.save();
      }

      // Trigger CompanyDetailsCard save if it has unsaved changes
      if (companyDetailsCardRef.current) {
        await companyDetailsCardRef.current.save();
      }

      // Show success message
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Picture Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <EmployerProfilePictureCard
          userData={currentUserData}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={false}
        />
      </motion.div>

      {/* Personal Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <EmployerPersonalDetailsCard
          userData={currentUserData}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={true}
          ref={personalDetailsCardRef}
        />
      </motion.div>

      {/* Company Logo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <EmployerCompanyLogoCard
          userData={currentUserData}
          onUserDataUpdate={handleUserDataUpdate}
          isEditMode={false}
        />
      </motion.div>

      {/* Company Details Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <EmployerCompanyDetailsCard
          companyData={{
            companyName: currentUserData.companyName || "",
            companyDescription: currentUserData.companyDescription || "",
            companyWebsite: currentUserData.companyWebsite || "",
            companyEmail: currentUserData.companyEmail || "",
          }}
          onCompanyDataUpdate={handleCompanyDataUpdate}
          isEditMode={true}
          ref={companyDetailsCardRef}
        />
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
        className="flex justify-end pt-6"
      >
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark px-8 py-3"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </motion.div>
    </div>
  );
}

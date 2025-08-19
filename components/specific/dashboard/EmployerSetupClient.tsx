"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { EmployerProfilePictureCard } from "@/components/specific/dashboard/EmployerProfilePictureCard";
import { EmployerPersonalDetailsCard } from "./EmployerPersonalDetailsCard";
import { EmployerCompanyLogoCard } from "./EmployerCompanyLogoCard";
import { EmployerCompanyDetailsCard } from "./EmployerCompanyDetailsCard";
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
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  markProfileCompletedAction,
} from "@/app/(dashboard)/actions/profile-actions";

interface UserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  location: string | null;
  bio: string | null;
  yearsOfExperience: number | null;
  profilePicture: string | null;
  hasCompletedProfile: boolean;
  accountType: string;
  companyLogo?: string | null;
  recruiterExperience?: string | null;
}

interface CompanyData {
  companyLogo: string | null;
  companyName: string;
  companyDescription: string;
  companyWebsite: string;
  companyEmail: string;
}

interface EmployerSetupClientProps {
  profileData: any;
}

export function EmployerSetupClient({ profileData }: EmployerSetupClientProps) {
  const [userData, setUserData] = useState<UserData>({
    id: profileData.id,
    firstName: profileData.firstName || "",
    lastName: profileData.lastName || "",
    email: profileData.email,
    phone: profileData.phone || null,
    location: profileData.location || null,
    bio: profileData.bio || null,
    yearsOfExperience: profileData.yearsOfExperience || null,
    profilePicture: profileData.profilePicture,
    hasCompletedProfile: profileData.hasCompletedProfile,
    accountType: profileData.accountType,
    companyLogo: profileData.companyLogo || null,
    recruiterExperience: profileData.recruiterExperience || null,
  });
  
  const [companyData, setCompanyData] = useState<CompanyData>({
    companyLogo: profileData.companyLogo || null,
    companyName: profileData.companyName || "",
    companyDescription: profileData.companyDescription || "",
    companyWebsite: profileData.companyWebsite || "",
    companyEmail: profileData.companyEmail || "",
  });
  
  const [isContinuing, setIsContinuing] = useState(false);
  const router = useRouter();

  // Callback to update user data when profile picture is updated
  const handleUserDataUpdate = useCallback(
    (updates: {
      firstName?: string;
      lastName?: string;
      email?: string;
      phone?: string | null;
      location?: string | null;
      bio?: string | null;
      yearsOfExperience?: number | null;
      profilePicture?: string | null;
    }) => {
      setUserData((prevData) => {
        if (prevData) {
          return { ...prevData, ...updates };
        }
        return prevData;
      });
    },
    []
  );

  // Handle company data updates
  const handleCompanyDataUpdate = useCallback(
    (updates: Partial<CompanyData>) => {
      setCompanyData((prevData) => ({
        ...prevData,
        ...updates,
      }));
    },
    []
  );

  // Handle company logo updates
  const handleCompanyLogoUpdate = useCallback(
    (updates: { companyLogo?: string | null }) => {
      if (updates.companyLogo !== undefined) {
        setCompanyData((prevData) => ({
          ...prevData,
          companyLogo: updates.companyLogo || null,
        }));
      }
    },
    []
  );

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
    userData.recruiterExperience; // Recruiter experience is required for employers

  const isCompanyComplete =
    companyData.companyLogo &&
    companyData.companyName &&
    companyData.companyDescription &&
    companyData.companyWebsite &&
    companyData.companyEmail;

  const canContinue = isProfileComplete && isCompanyComplete;

  const handleContinue = async () => {
    if (!canContinue) return;

    setIsContinuing(true);
    try {
      const result = await markProfileCompletedAction();

      if (result.success) {
        toast.success("Profile completed successfully!");
        router.push("/dashboard");
      } else {
        toast.error(result.message || "Failed to complete profile");
      }
    } catch (error) {
      console.error("Continue error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsContinuing(false);
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
                Let's get to know you better. Complete your profile to get
                started.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - #F1F5F9 Background */}
      <div className="bg-slate-100 dark:bg-neutral-800 min-h-[calc(100vh-200px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1010px] mx-auto">
            <div className="space-y-6">
              {/* Profile Picture Section */}
              <EmployerProfilePictureCard
                userData={userData}
                onUserDataUpdate={handleUserDataUpdate}
              />

              {/* Profile (Personal Details) Section */}
              <EmployerPersonalDetailsCard
                userData={userData}
                onUserDataUpdate={handleUserDataUpdate}
              />

              {/* Company Details Section */}
              <EmployerCompanyLogoCard
                userData={userData!}
                onUserDataUpdate={handleCompanyLogoUpdate}
              />

              <EmployerCompanyDetailsCard
                companyData={companyData}
                onCompanyDataUpdate={handleCompanyDataUpdate}
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
                        {userData && !userData.recruiterExperience && (
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Specify years of recruiting experience</span>
                          </div>
                        )}
                        {!isCompanyComplete && (
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Complete company details</span>
                          </div>
                        )}
                        {companyData && !companyData.companyLogo && (
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Upload company logo</span>
                          </div>
                        )}
                        {companyData && !companyData.companyDescription && (
                          <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                            <span>Add company description</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

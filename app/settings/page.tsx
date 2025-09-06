import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { getUserNotificationPreferencesAction } from "@/app/(dashboard)/actions/notification-actions";
import { JobSeekerSettingsClient } from "@/components/specific/dashboard/JobSeekerSettingsClient";
import { EmployerSettingsClient } from "@/components/specific/dashboard/EmployerSettingsClient";

// Force dynamic rendering since this page uses auth() which calls headers()
export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile
  const profileResult = await getUserProfileWithExperiencesAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/setup");
  }

  const { accountType, ...profileData } = profileResult.data;
  const finalAccountType = accountType || "Job Seeker";

  // Get user notification preferences
  const notificationPreferencesResult =
    await getUserNotificationPreferencesAction();

  // Convert the profile data to match the client component interfaces
  const userData = {
    id: profileData.id,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    bio: profileData.bio,
    yearsOfExperience: profileData.yearsOfExperience?.toString() || null,
    skills: profileData.skills || [],
    jobPreferences: profileData.jobPreferences || [],
    profilePicture: profileData.profilePicture,
    cv: profileData.cv,
    hasCompletedProfile: profileData.hasCompletedProfile,
    accountType: finalAccountType,
    website: profileData.website,
    portfolio: profileData.portfolio,
    // Employer-specific fields
    recruiterExperience: profileData.recruiterExperience,
    companyLogo: profileData.companyLogo,
    companyName: profileData.companyName,
    companyDescription: profileData.companyDescription,
    companyWebsite: profileData.companyWebsite,
    companyEmail: profileData.companyEmail,
  };

  // Convert experiences data to match the interface
  const experiences = (profileData.experiences || []).map((exp) => ({
    id: exp.id,
    jobTitle: exp.jobTitle,
    employmentType: exp.employmentType,
    company: exp.company,
    currentlyWorking: exp.currentlyWorking,
    startMonth: exp.startMonth,
    startYear: exp.startYear,
    endMonth: exp.endMonth,
    endYear: exp.endYear,
    description: exp.description,
    skills: exp.skills || [],
  }));

  // Get notification preferences data
  const notificationPreferences =
    notificationPreferencesResult.success && notificationPreferencesResult.data
      ? notificationPreferencesResult.data
      : [];

  return (
    <div className="min-h-screen">
      {/* White top section */}
      <div className="bg-white dark:bg-neutral-900 ">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Settings
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your personal and organization settings.
            </p>
          </div>
        </div>
      </div>

      {/* Light gray background for content area */}
      <div className="bg-[#F1F5F9] dark:bg-neutral-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="">
              {/* Render appropriate client component based on account type */}
              {(() => {
                if (
                  finalAccountType === "Job Seeker" ||
                  finalAccountType === "Contributor"
                ) {
                  return (
                    <JobSeekerSettingsClient
                      userData={userData}
                      experiences={experiences}
                      notificationPreferences={notificationPreferences}
                    />
                  );
                } else if (
                  finalAccountType === "Recruiter" ||
                  finalAccountType === "Business Owner"
                ) {
                  return (
                    <EmployerSettingsClient
                      userData={userData}
                      experiences={experiences}
                      notificationPreferences={notificationPreferences}
                    />
                  );
                } else {
                  // Fallback to Job Seeker for unknown account types
                  console.warn(
                    `Unknown account type: ${finalAccountType}, falling back to Job Seeker`
                  );
                  return (
                    <JobSeekerSettingsClient
                      userData={userData}
                      experiences={experiences}
                      notificationPreferences={notificationPreferences}
                    />
                  );
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { auth } from "@/auth";
import { DashboardContent } from "@/components/specific/dashboard/DashboardContent";
import { MobileActionButtons } from "@/components/specific/dashboard/MobileActionButtons";
import { ProfileBanner } from "@/components/specific/dashboard/ProfileBanner";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile and get all profile data
  const profileResult = await getUserProfileWithExperiencesAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard/setup");
  }

  // Prepare complete user data for the dashboard
  const userData = {
    firstName: profileResult.data.firstName,
    lastName: profileResult.data.lastName,
    email: profileResult.data.email,
    phone: profileResult.data.phone,
    location: profileResult.data.location,
    bio: profileResult.data.bio,
    website: profileResult.data.website,
    portfolio: profileResult.data.portfolio,
    skills: profileResult.data.skills || [],
    jobPreferences: profileResult.data.jobPreferences || [],
    profilePicture: profileResult.data.profilePicture,
    cv: profileResult.data.cv,
    yearsOfExperience: profileResult.data.yearsOfExperience,
    recruiterExperience: profileResult.data.recruiterExperience,
    companyLogo: profileResult.data.companyLogo,
    companyName: profileResult.data.companyName,
    companyDescription: profileResult.data.companyDescription,
    companyWebsite: profileResult.data.companyWebsite,
    companyEmail: profileResult.data.companyEmail,
    accountType: profileResult.data.accountType,
  };

  // Prepare experiences data
  const experiences = profileResult.data.experiences || [];

  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <div className="mx-4 md:mx-[88px] mt-4">
        {/* White Card Container */}
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden">
          {/* Banner Section */}
          <ProfileBanner
            firstName={profileResult.data?.firstName}
            lastName={profileResult.data?.lastName}
            accountType={profileResult.data?.accountType}
            profileImageUrl={profileResult.data?.profilePicture || undefined}
          />

          {/* Mobile Action Buttons */}
          <MobileActionButtons accountType={profileResult.data?.accountType} />

          {/* Tab Switcher and Content */}
          <DashboardContent
            userData={userData}
            experiences={experiences}
            accountType={profileResult.data?.accountType}
          />
        </div>
      </div>
    </div>
  );
}

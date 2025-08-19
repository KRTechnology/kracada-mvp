import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { JobSeekerSetupClient } from "@/components/specific/dashboard/JobSeekerSetupClient";
import { EmployerSetupClient } from "@/components/specific/dashboard/EmployerSetupClient";
import { BusinessOwnerSetupClient } from "@/components/specific/dashboard/BusinessOwnerSetupClient";
import { ContributorSetupClient } from "@/components/specific/dashboard/ContributorSetupClient";

export default async function SetupPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has already completed profile and get all profile data
  const profileResult = await getUserProfileWithExperiencesAction();
  if (profileResult.success && profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard");
  }

  if (!profileResult.success || !profileResult.data) {
    redirect("/login");
  }

  // Get user's account type and profile data
  const { accountType, ...profileData } = profileResult.data;
  const finalAccountType = accountType || "Job Seeker";

  // Render the appropriate setup client based on account type
  switch (finalAccountType) {
    case "Job Seeker":
      return <JobSeekerSetupClient profileData={profileData} />;
    case "Employer":
      return <EmployerSetupClient profileData={profileData} />;
    case "Business Owner":
      return <BusinessOwnerSetupClient profileData={profileData} />;
    case "Contributor":
      return <ContributorSetupClient profileData={profileData} />;
    default:
      // Fallback to Job Seeker if account type is unknown
      console.warn(
        `Unknown account type: ${finalAccountType}, falling back to Job Seeker`
      );
      return <JobSeekerSetupClient profileData={profileData} />;
  }
}

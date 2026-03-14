import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { JobSeekerSetupClient } from "@/components/specific/dashboard/JobSeekerSetupClient";
import { EmployerSetupClient } from "@/components/specific/dashboard/EmployerSetupClient";
import { BusinessOwnerSetupClient } from "@/components/specific/dashboard/BusinessOwnerSetupClient";
import { ContributorSetupClient } from "@/components/specific/dashboard/ContributorSetupClient";

// Force dynamic rendering since this page uses auth() which calls headers()
export const dynamic = "force-dynamic";

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

  return (
    <div className="min-h-screen">
      {/* White top section */}
      <div className="bg-white dark:bg-neutral-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
              Complete your profile
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Let's get to know you better. Complete your profile to get
              started.
            </p>
          </div>
        </div>
      </div>

      {/* Light gray background for content area */}
      <div className="bg-[#F1F5F9] dark:bg-neutral-900 min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="rounded-2xl">
              {/* Render the appropriate setup client based on account type */}
              {(() => {
                switch (finalAccountType) {
                  case "Job Seeker":
                    return <JobSeekerSetupClient profileData={profileData} />;
                  case "Recruiter":
                    return <EmployerSetupClient profileData={profileData} />;
                  case "Business Owner":
                    return (
                      <BusinessOwnerSetupClient profileData={profileData} />
                    );
                  case "Contributor":
                    return <ContributorSetupClient profileData={profileData} />;
                  default:
                    // Fallback to Job Seeker if account type is unknown
                    console.warn(
                      `Unknown account type: ${finalAccountType}, falling back to Job Seeker`
                    );
                    return <JobSeekerSetupClient profileData={profileData} />;
                }
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

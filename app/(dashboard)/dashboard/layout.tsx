import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { ProfileBanner } from "@/components/specific/dashboard/ProfileBanner";
import { MobileActionButtons } from "@/components/specific/dashboard/MobileActionButtons";
import { DashboardNavigation } from "@/components/specific/dashboard/DashboardNavigation";

export const metadata: Metadata = {
  title: "Dashboard | Kracada",
  description: "Manage your profile and settings",
};

// Force dynamic rendering since we need to access user session
export const dynamic = "force-dynamic";

export default async function DashboardPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  // Protect dashboard routes - redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile and get all profile data
  const profileResult = await getUserProfileWithExperiencesAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard/setup");
  }

  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <div className="mx-4 md:mx-[88px] mt-4 pb-10">
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

          {/* Dashboard Navigation */}
          <DashboardNavigation accountType={profileResult.data?.accountType} />

          {/* Tab Content */}
          <div className="px-6 pb-6 pt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

import { getUserProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { auth } from "@/auth";
import { MobileActionButtons } from "@/components/specific/dashboard/MobileActionButtons";
import { ProfileBanner } from "@/components/specific/dashboard/ProfileBanner";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile
  const profileResult = await getUserProfileAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard/setup");
  }

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
          />

          {/* Mobile Action Buttons */}
          <MobileActionButtons />

          {/* Content will go here in future iterations */}
          <div className="p-6">
            <p className="text-neutral-500 text-center">
              Additional content sections will be implemented here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

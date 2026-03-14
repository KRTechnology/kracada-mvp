"use client";

import { usePathname } from "next/navigation";
import { ProfileBanner } from "@/components/specific/dashboard/ProfileBanner";
import { MobileActionButtons } from "@/components/specific/dashboard/MobileActionButtons";
import { DashboardNavigation } from "@/components/specific/dashboard/DashboardNavigation";

interface DashboardLayoutClientProps {
  profileData: any;
  userId: string;
  children: React.ReactNode;
}

export function DashboardLayoutClient({
  profileData,
  userId,
  children,
}: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const isEditPage = pathname.includes("/edit");

  return (
    <div className="min-h-screen">
      {/* Main Content Container */}
      <div className="mx-4 md:mx-[88px] mt-4 pb-10">
        {/* White Card Container */}
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden">
          {/* Banner Section */}
          <ProfileBanner
            firstName={profileData?.firstName}
            lastName={profileData?.lastName}
            accountType={profileData?.accountType}
            profileImageUrl={profileData?.profilePicture || undefined}
            userId={userId}
            showEditButton={!isEditPage}
            showAddCVButton={!isEditPage}
          />

          {/* Mobile Action Buttons - Only show on non-edit pages */}
          {!isEditPage && (
            <MobileActionButtons
              accountType={profileData?.accountType}
              userId={userId}
              firstName={profileData?.firstName}
              lastName={profileData?.lastName}
            />
          )}

          {/* Dashboard Navigation - Only show on non-edit pages */}
          {!isEditPage && (
            <DashboardNavigation accountType={profileData?.accountType} />
          )}

          {/* Tab Content */}
          <div className={isEditPage ? "" : "px-6 pb-6 pt-6"}>{children}</div>
        </div>
      </div>
    </div>
  );
}

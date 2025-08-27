import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { DashboardLayoutClient } from "@/components/specific/dashboard/DashboardLayoutClient";

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
    redirect("/setup");
  }

  return (
    <DashboardLayoutClient
      profileData={profileResult.data}
      userId={session.user.id}
    >
      {children}
    </DashboardLayoutClient>
  );
}

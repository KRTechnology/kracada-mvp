import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { SetupClientFactory } from "@/components/specific/dashboard/SetupClientFactory";

export default async function SetupPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has already completed profile
  const profileResult = await getUserProfileAction();
  if (profileResult.success && profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard");
  }

  // Get user's account type to determine which setup client to render
  const accountType =
    profileResult.success && profileResult.data?.accountType
      ? profileResult.data.accountType
      : "Job Seeker"; // Default fallback

  return <SetupClientFactory accountType={accountType} />;
}

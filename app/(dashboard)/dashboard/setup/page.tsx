import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileAction } from "@/app/(dashboard)/actions/profile-actions";
import { SetupClient } from "@/components/specific/dashboard/SetupClient";

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

  return <SetupClient />;
}

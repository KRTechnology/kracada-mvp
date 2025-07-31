import { redirect } from "next/navigation";
import { auth } from "@/auth";
import {
  getUserProfileAction,
  getUserExperiencesAction,
} from "@/app/(dashboard)/actions/profile-actions";
import { EditProfileClient } from "@/components/specific/dashboard/EditProfileClient";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile
  const profileResult = await getUserProfileAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard/setup");
  }

  // Get user experiences
  const experiencesResult = await getUserExperiencesAction();

  // Convert the profile data to match the EditProfileClient interface
  const userData = {
    id: profileResult.data.id,
    firstName: profileResult.data.firstName,
    lastName: profileResult.data.lastName,
    email: profileResult.data.email,
    phone: profileResult.data.phone,
    location: profileResult.data.location,
    bio: profileResult.data.bio,
    yearsOfExperience: profileResult.data.yearsOfExperience?.toString() || null,
    skills: profileResult.data.skills || [],
    jobPreferences: profileResult.data.jobPreferences || [],
    profilePicture: profileResult.data.profilePicture,
    cv: profileResult.data.cv,
    hasCompletedProfile: profileResult.data.hasCompletedProfile,
    accountType: profileResult.data.accountType,
    website: profileResult.data.website,
    portfolio: profileResult.data.portfolio,
  };

  // Convert experiences data to match the interface
  const experiences =
    experiencesResult.success && experiencesResult.data
      ? experiencesResult.data.map((exp) => ({
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
        }))
      : [];

  return <EditProfileClient userData={userData} experiences={experiences} />;
}

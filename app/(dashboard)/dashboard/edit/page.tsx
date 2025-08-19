import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { JobSeekerEditProfileClient } from "@/components/specific/dashboard/JobSeekerEditProfileClient";
import { EmployerEditProfileClient } from "@/components/specific/dashboard/EmployerEditProfileClient";

export default async function EditProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile
  const profileResult = await getUserProfileWithExperiencesAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard/setup");
  }

  const { accountType, ...profileData } = profileResult.data;
  const finalAccountType = accountType || "Job Seeker";

  // Convert the profile data to match the client component interfaces
  const userData = {
    id: profileData.id,
    firstName: profileData.firstName,
    lastName: profileData.lastName,
    email: profileData.email,
    phone: profileData.phone,
    location: profileData.location,
    bio: profileData.bio,
    yearsOfExperience: profileData.yearsOfExperience?.toString() || null,
    skills: profileData.skills || [],
    jobPreferences: profileData.jobPreferences || [],
    profilePicture: profileData.profilePicture,
    cv: profileData.cv,
    hasCompletedProfile: profileData.hasCompletedProfile,
    accountType: finalAccountType,
    website: profileData.website,
    portfolio: profileData.portfolio,
    // Employer-specific fields
    recruiterExperience: profileData.recruiterExperience,
    companyLogo: profileData.companyLogo,
    companyName: profileData.companyName,
    companyDescription: profileData.companyDescription,
    companyWebsite: profileData.companyWebsite,
    companyEmail: profileData.companyEmail,
  };

  // Convert experiences data to match the interface
  const experiences = (profileData.experiences || []).map((exp) => ({
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
  }));

  // Render appropriate client component based on account type
  if (finalAccountType === "Job Seeker" || finalAccountType === "Contributor") {
    return (
      <JobSeekerEditProfileClient
        userData={userData}
        experiences={experiences}
      />
    );
  } else if (
    finalAccountType === "Employer" ||
    finalAccountType === "Business Owner"
  ) {
    return (
      <EmployerEditProfileClient
        userData={userData}
        experiences={experiences}
      />
    );
  } else {
    // Fallback to Job Seeker for unknown account types
    console.warn(
      `Unknown account type: ${finalAccountType}, falling back to Job Seeker`
    );
    return (
      <JobSeekerEditProfileClient
        userData={userData}
        experiences={experiences}
      />
    );
  }
}

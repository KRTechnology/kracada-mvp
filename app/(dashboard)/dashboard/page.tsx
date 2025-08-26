import { getUserProfileWithExperiencesAction } from "@/app/(dashboard)/actions/profile-actions";
import { ProfileContent } from "@/components/specific/dashboard/ProfileContent";
import { JobSeekerProfileContent } from "@/components/specific/dashboard/JobSeekerProfileContent";
import { EmployerProfileContent } from "@/components/specific/dashboard/EmployerProfileContent";

// Force dynamic rendering since we need to access user session
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  // Get profile data
  const profileResult = await getUserProfileWithExperiencesAction();

  if (!profileResult.success || !profileResult.data) {
    return <div>Error loading profile data</div>;
  }

  // Prepare complete user data
  const userData = {
    firstName: profileResult.data.firstName,
    lastName: profileResult.data.lastName,
    email: profileResult.data.email,
    phone: profileResult.data.phone,
    location: profileResult.data.location,
    bio: profileResult.data.bio,
    website: profileResult.data.website,
    portfolio: profileResult.data.portfolio,
    skills: profileResult.data.skills || [],
    jobPreferences: profileResult.data.jobPreferences || [],
    profilePicture: profileResult.data.profilePicture,
    cv: profileResult.data.cv,
    yearsOfExperience: profileResult.data.yearsOfExperience,
    recruiterExperience: profileResult.data.recruiterExperience,
    companyLogo: profileResult.data.companyLogo,
    companyName: profileResult.data.companyName,
    companyDescription: profileResult.data.companyDescription,
    companyWebsite: profileResult.data.companyWebsite,
    companyEmail: profileResult.data.companyEmail,
    accountType: profileResult.data.accountType,
  };

  // Prepare experiences data
  const experiences = profileResult.data.experiences || [];
  const accountType = profileResult.data.accountType;

  // Render different profile content based on account type
  const renderProfileContent = () => {
    if (accountType === "Job Seeker" || accountType === "Contributor") {
      return (
        <JobSeekerProfileContent
          userData={userData}
          experiences={experiences}
        />
      );
    } else if (accountType === "Employer" || accountType === "Business Owner") {
      return <EmployerProfileContent userData={userData} />;
    } else {
      // Fallback to the original ProfileContent for unknown account types
      return <ProfileContent userData={userData} experiences={experiences} />;
    }
  };

  return renderProfileContent();
}

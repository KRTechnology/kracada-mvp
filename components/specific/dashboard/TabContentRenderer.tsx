import { motion } from "framer-motion";
import { TabType } from "./TabSwitcher";
import { ProfileContent } from "./ProfileContent";
import { JobSeekerProfileContent } from "./JobSeekerProfileContent";
import { EmployerProfileContent } from "./EmployerProfileContent";
import { BookmarksContent } from "./BookmarksContent";
import { ApplicationsContent } from "./ApplicationsContent";
import { JobPostsContent } from "./JobPostsContent";
import { ActivitiesContent } from "./ActivitiesContent";

interface TabContentRendererProps {
  activeTab: TabType;
  userData: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string | null;
    location?: string | null;
    bio?: string | null;
    website?: string | null;
    portfolio?: string | null;
    skills?: string[];
    jobPreferences?: string[];
    profilePicture?: string | null;
    cv?: string | null;
    yearsOfExperience?: number | null;
    recruiterExperience?: string | null;
    companyLogo?: string | null;
    companyName?: string | null;
    companyDescription?: string | null;
    companyWebsite?: string | null;
    companyEmail?: string | null;
    accountType?: string;
  };
  experiences: Array<{
    id: string;
    jobTitle: string;
    employmentType: string;
    company: string;
    currentlyWorking: boolean;
    startMonth: string | null;
    startYear: string | null;
    endMonth: string | null;
    endYear: string | null;
    description: string | null;
    skills: string[];
  }>;
}

export function TabContentRenderer({
  activeTab,
  userData,
  experiences,
}: TabContentRendererProps) {
  const renderTabContent = () => {
    switch (activeTab) {
      case "Profile":
        // Render different profile content based on account type
        const accountType = userData.accountType;

        if (accountType === "Job Seeker" || accountType === "Contributor") {
          return (
            <JobSeekerProfileContent
              userData={userData}
              experiences={experiences}
            />
          );
        } else if (
          accountType === "Employer" ||
          accountType === "Business Owner"
        ) {
          return <EmployerProfileContent userData={userData} />;
        } else {
          // Fallback to the original ProfileContent for unknown account types
          return (
            <ProfileContent userData={userData} experiences={experiences} />
          );
        }

      case "Activities":
        return <ActivitiesContent />;

      case "Bookmarks":
        return <BookmarksContent />;

      case "Applications":
        return <ApplicationsContent />;

      case "Job Posts":
        return <JobPostsContent />;

      default:
        return <ProfileContent userData={userData} experiences={experiences} />;
    }
  };

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="min-h-[400px]"
    >
      {renderTabContent()}
    </motion.div>
  );
}

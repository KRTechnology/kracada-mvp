import { motion } from "framer-motion";
import { TabType } from "./TabSwitcher";
import { ProfileContent } from "./ProfileContent";
import { BookmarksContent } from "./BookmarksContent";
import { ApplicationsContent } from "./ApplicationsContent";
import { JobPostsContent } from "./JobPostsContent";

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
        return <ProfileContent userData={userData} experiences={experiences} />;

      case "Activities":
        return (
          <div className="space-y-4">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 bg-neutral-100 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-4">
                <svg
                  className="w-8 h-8 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h4 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                No activities yet
              </h4>
              <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                Your recent activities will appear here. This could include job
                applications, profile updates, and other interactions.
              </p>
            </div>
          </div>
        );

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

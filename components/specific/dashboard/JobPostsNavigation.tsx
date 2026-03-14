"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type JobPostsSubTabType = "Active Jobs" | "Closed Jobs";

interface JobPostsNavigationProps {}

interface SubTabItem {
  id: JobPostsSubTabType;
  label: string;
  path: string;
  count: number;
}

const jobPostsSubTabs: SubTabItem[] = [
  {
    id: "Active Jobs",
    label: "Active Jobs",
    path: "/dashboard/job-posts",
    count: 0,
  },
  {
    id: "Closed Jobs",
    label: "Closed jobs",
    path: "/dashboard/job-posts/closed",
    count: 0,
  },
];

const getActiveSubTabFromPath = (pathname: string): JobPostsSubTabType => {
  if (pathname === "/dashboard/job-posts") return "Active Jobs";
  if (pathname.includes("/dashboard/job-posts/closed")) return "Closed Jobs";
  return "Active Jobs"; // Default fallback
};

export function JobPostsNavigation({}: JobPostsNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeSubTab = getActiveSubTabFromPath(pathname);

  const handleSubTabChange = (tab: SubTabItem) => {
    router.push(tab.path);
  };

  return (
    <div>
      <div className="flex justify-between">
        {jobPostsSubTabs.map((tab, index) => (
          <button
            key={tab.id}
            onClick={() => handleSubTabChange(tab)}
            className="relative pb-3 transition-colors duration-200 flex-1 flex justify-center items-center"
          >
            <div className="flex items-center gap-2">
              <span
                className={`font-medium text-sm transition-colors ${
                  activeSubTab === tab.id
                    ? "text-warm-200 dark:text-warm-200"
                    : "text-[#717680] dark:text-[#717680]"
                }`}
              >
                {tab.label}
              </span>
              {/* {tab.count > 0 && (
                <span className="text-xs text-neutral-500 dark:text-neutral-400">
                  {tab.count}
                </span>
              )} */}
            </div>

            {/* Animated underline */}
            {activeSubTab === tab.id && (
              <motion.div
                layoutId="jobposts-subtab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-warm-200 dark:bg-warm-200"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";

export type BookmarksSubTabType = "Jobs" | "Articles" | "Videos" | "Hotels";

interface BookmarksNavigationProps {}

interface SubTabItem {
  id: BookmarksSubTabType;
  label: string;
  path: string;
  count: number;
}

const bookmarksSubTabs: SubTabItem[] = [
  { id: "Jobs", label: "Jobs", path: "/dashboard/bookmarks", count: 0 },
  {
    id: "Articles",
    label: "Articles",
    path: "/dashboard/bookmarks/articles",
    count: 0,
  },
  {
    id: "Videos",
    label: "Videos",
    path: "/dashboard/bookmarks/videos",
    count: 0,
  },
  {
    id: "Hotels",
    label: "Hotels",
    path: "/dashboard/bookmarks/hotels",
    count: 0,
  },
];

const getActiveSubTabFromPath = (pathname: string): BookmarksSubTabType => {
  if (pathname === "/dashboard/bookmarks") return "Jobs";
  if (pathname.includes("/dashboard/bookmarks/articles")) return "Articles";
  if (pathname.includes("/dashboard/bookmarks/videos")) return "Videos";
  if (pathname.includes("/dashboard/bookmarks/hotels")) return "Hotels";
  return "Jobs"; // Default fallback
};

export function BookmarksNavigation({}: BookmarksNavigationProps) {
  const router = useRouter();
  const pathname = usePathname();

  const activeSubTab = getActiveSubTabFromPath(pathname);
  const activeTabIndex = bookmarksSubTabs.findIndex(
    (tab) => tab.id === activeSubTab
  );

  const handleSubTabChange = (tab: SubTabItem) => {
    router.push(tab.path);
  };

  return (
    <div>
      <div className="flex justify-between">
        {bookmarksSubTabs.map((tab, index) => (
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
                layoutId="bookmarks-subtab-underline"
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

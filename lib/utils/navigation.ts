import { restaurants } from "../db/schema";

export interface NavigationItem {
  href: string;
  label: string;
  patterns: string[];
  isActive: (path: string) => boolean;
  children?: NavigationItem[];
  variant?: "link" | "button";
}

export interface NavigationConfig {
  items: NavigationItem[];
}

// Default navigation configuration
export const defaultNavigationConfig: NavigationConfig = {
  items: [
    {
      href: "/news",
      label: "News",
      patterns: ["/news"],
      isActive: (path: string) => path.startsWith("/news"),
    },

    {
      href: "/lifestyle",
      label: "Lifestyle",
      patterns: ["/lifestyle"],
      isActive: (path: string) => path.startsWith("/lifestyle"),
    },
    {
      href: "/entertainment",
      label: "Entertainment",
      patterns: ["/entertainment"],
      isActive: (path: string) => path.startsWith("/entertainment"),
    },
    {
      href: "/jobs",
      label: "Jobs",
      patterns: ["/jobs", "/jobs/[id]", "/jobs/applications"],
      isActive: (path: string) => path.startsWith("/jobs"),
    },
    {
      href: "/cv-optimization",
      label: "CV Optimization",
      patterns: ["/cv-optimization"],
      isActive: (path: string) => path.startsWith("/cv-optimization"),
    },
    {
      href: "/hotels-restaurants",
      label: "Hospitality & Tourism",
      patterns: ["/hotels-restaurants"],
      isActive: (path: string) => path.startsWith("/hotels-restaurants"),
      children: [
        {
          href: "/cv-optimization",
          label: "CV Optimization",
          patterns: ["/cv-optimization"],
          isActive: (path: string) => path.startsWith("/cv-optimization"),
        },
        {
          href: "/cv-optimization",
          label: "CV Optimization",
          patterns: ["/cv-optimization"],
          isActive: (path: string) => path.startsWith("/cv-optimization"),
        },
      ],

      // hotels & restaurants
      // Travel & Tourism
    },
    // {
    //   href: "/travel-tourism",
    //   label: "Travel & Tourism",
    //   patterns: ["/travel-tourism"],
    //   isActive: (path: string) => path.startsWith("/travel-tourism"),
    // },
    {
      href: "/tv",
      label: "KracadaTV",
      patterns: ["/tv"],
      isActive: (path: string) => path.startsWith("/tv"),
      variant: "button",
    },
  ],
};

// Utility function to check if a navigation item is active
export const isNavigationActive = (
  navItem: NavigationItem,
  pathname: string,
): boolean => {
  return navItem.isActive(pathname);
};

// Utility function to get navigation classes based on active state
export const getNavigationClasses = (
  navItem: NavigationItem,
  pathname: string,
  variant: "desktop" | "mobile" = "desktop",
): string => {
  const isActive = isNavigationActive(navItem, pathname);

  // 🔥 CTA Button style
  if (navItem.variant === "button") {
    return `
      bg-orange-500 hover:bg-orange-600 text-white font-semibold
      px-4 py-2 rounded-xl transition-all duration-300
      transform hover:scale-105 shadow-lg hover:shadow-xl
      flex items-center gap-2 whitespace-nowrap
    `;
  }

  // 👇 Existing logic for normal links
  if (variant === "mobile") {
    return isActive
      ? "text-warm-200 dark:text-warm-200 text-base font-bold"
      : "text-neutral-900 dark:text-neutral-100 text-base font-bold";
  }

  return isActive
    ? "text-warm-200 dark:text-warm-200 font-semibold whitespace-nowrap transition-colors"
    : "text-[#414651] dark:text-neutral-300 hover:text-neutral-600 dark:hover:text-neutral-200 font-semibold whitespace-nowrap transition-colors";
};

// Function to create a navigation item with custom active logic
export const createNavigationItem = (
  href: string,
  label: string,
  patterns: string[],
  customActiveLogic?: (path: string) => boolean,
): NavigationItem => {
  return {
    href,
    label,
    patterns,
    isActive: customActiveLogic || ((path: string) => path.startsWith(href)),
  };
};

// Function to add a new navigation item to the config
export const addNavigationItem = (
  config: NavigationConfig,
  item: NavigationItem,
): NavigationConfig => {
  return {
    ...config,
    items: [...config.items, item],
  };
};

// Function to remove a navigation item from the config
export const removeNavigationItem = (
  config: NavigationConfig,
  href: string,
): NavigationConfig => {
  return {
    ...config,
    items: config.items.filter((item) => item.href !== href),
  };
};

// Function to update a navigation item in the config
export const updateNavigationItem = (
  config: NavigationConfig,
  href: string,
  updates: Partial<NavigationItem>,
): NavigationConfig => {
  return {
    ...config,
    items: config.items.map((item) =>
      item.href === href ? { ...item, ...updates } : item,
    ),
  };
};

export interface AccountTypeColors {
  light: {
    background: string;
    border: string;
    text: string;
    status: string;
  };
  dark: {
    background: string;
    border: string;
    text: string;
    status: string;
  };
}

export const accountTypeColorMap: Record<string, AccountTypeColors> = {
  "Job Seeker": {
    light: {
      background: "#FFF6EE",
      border: "#F9DBAF",
      text: "#D03F17",
      status: "#F97316", // orange-500
    },
    dark: {
      background: "#161616",
      border: "#684108",
      text: "#D8DDE7",
      status: "#F97316", // orange-500
    },
  },
  Employer: {
    light: {
      background: "#EFF8FF",
      border: "#B2DDFF",
      text: "#175CD3",
      status: "#2E90FA",
    },
    dark: {
      background: "#151515",
      border: "#003A66",
      text: "#175CD3",
      status: "#2E90FA",
    },
  },
  "Business Owner": {
    light: {
      background: "#F0FDF4",
      border: "#BBF7D0",
      text: "#166534",
      status: "#22C55E", // green-500
    },
    dark: {
      background: "#0A0A0A",
      border: "#16A34A",
      text: "#BBF7D0",
      status: "#22C55E", // green-500
    },
  },
  Contributor: {
    light: {
      background: "#FDF4FF",
      border: "#E9D5FF",
      text: "#7C3AED",
      status: "#A855F7", // purple-500
    },
    dark: {
      background: "#1A0B1A",
      border: "#9333EA",
      text: "#E9D5FF",
      status: "#A855F7", // purple-500
    },
  },
  Recruiter: {
    light: {
      background: "#EFF8FF",
      border: "#B2DDFF",
      text: "#175CD3",
      status: "#2E90FA",
    },
    dark: {
      background: "#151515",
      border: "#B2DDFF",
      text: "#175CD3",
      status: "#2E90FA",
    },
  },
  Freelancer: {
    light: {
      background: "#FEF3C7",
      border: "#FCD34D",
      text: "#92400E",
      status: "#F59E0B", // amber-500
    },
    dark: {
      background: "#1C1917",
      border: "#F59E0B",
      text: "#FEF3C7",
      status: "#F59E0B", // amber-500
    },
  },
  Consultant: {
    light: {
      background: "#FCE7F3",
      border: "#F9A8D4",
      text: "#BE185D",
      status: "#EC4899", // pink-500
    },
    dark: {
      background: "#1F1F23",
      border: "#EC4899",
      text: "#FCE7F3",
      status: "#EC4899", // pink-500
    },
  },
  Student: {
    light: {
      background: "#F0F9FF",
      border: "#7DD3FC",
      text: "#0C4A6E",
      status: "#06B6D4", // cyan-500
    },
    dark: {
      background: "#0C0C0C",
      border: "#06B6D4",
      text: "#7DD3FC",
      status: "#06B6D4", // cyan-500
    },
  },
};

export function getAccountTypeColors(accountType: string): AccountTypeColors {
  return accountTypeColorMap[accountType] || accountTypeColorMap["Job Seeker"];
}

export function getAccountTypeColorClasses(accountType: string): string {
  const colors = getAccountTypeColors(accountType);

  return `px-3 py-1 bg-[${colors.light.background}] dark:bg-[${colors.dark.background}] border border-[${colors.light.border}] dark:border-[${colors.dark.border}] text-[${colors.light.text}] dark:text-[${colors.dark.text}] rounded-full text-sm font-medium flex items-center gap-2`;
}

export function getAccountTypeStatusColor(accountType: string): string {
  const colors = getAccountTypeColors(accountType);
  return colors.light.status; // Use light mode status color for both themes
}

// Helper function to get all available account types
export function getAvailableAccountTypes(): string[] {
  return Object.keys(accountTypeColorMap);
}

// Helper function to check if an account type is valid
export function isValidAccountType(accountType: string): boolean {
  return accountType in accountTypeColorMap;
}

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const lineClamp = (lines: number) => ({
  display: "-webkit-box",
  WebkitLineClamp: lines,
  WebkitBoxOrient: "vertical" as const,
  overflow: "hidden",
  textOverflow: "ellipsis",
});

// Account type utilities
export const ACCOUNT_TYPES = {
  JOB_SEEKER: "Job Seeker",
  EMPLOYER: "Employer",
  BUSINESS_OWNER: "Business Owner",
  CONTRIBUTOR: "Contributor",
} as const;

export type AccountType = (typeof ACCOUNT_TYPES)[keyof typeof ACCOUNT_TYPES];

// Check if account type should show recruiter experience field
export const shouldShowRecruiterExperience = (accountType: string): boolean => {
  return (
    accountType === ACCOUNT_TYPES.EMPLOYER ||
    accountType === ACCOUNT_TYPES.BUSINESS_OWNER
  );
};

// Get account types that should show recruiter experience
export const getRecruiterAccountTypes = (): AccountType[] => {
  return [ACCOUNT_TYPES.EMPLOYER, ACCOUNT_TYPES.BUSINESS_OWNER];
};

// Get all account types
export const getAllAccountTypes = (): AccountType[] => {
  return Object.values(ACCOUNT_TYPES);
};

// Check if account type is valid
export const isValidAccountType = (
  accountType: string
): accountType is AccountType => {
  return getAllAccountTypes().includes(accountType as AccountType);
};

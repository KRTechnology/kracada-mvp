"use client";

import { JobSeekerSetupClient } from "./JobSeekerSetupClient";
import { EmployerSetupClient } from "./EmployerSetupClient";
import { BusinessOwnerSetupClient } from "./BusinessOwnerSetupClient";
import { ContributorSetupClient } from "./ContributorSetupClient";

interface SetupClientFactoryProps {
  accountType: string;
}

export function SetupClientFactory({ accountType }: SetupClientFactoryProps) {
  // Render the appropriate setup client based on account type
  switch (accountType) {
    case "Job Seeker":
      return <JobSeekerSetupClient />;
    case "Employer":
      return <EmployerSetupClient />;
    case "Business Owner":
      return <BusinessOwnerSetupClient />;
    case "Contributor":
      return <ContributorSetupClient />;
    default:
      // Fallback to Job Seeker if account type is unknown
      console.warn(
        `Unknown account type: ${accountType}, falling back to Job Seeker`
      );
      return <JobSeekerSetupClient />;
  }
}

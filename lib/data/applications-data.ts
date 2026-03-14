export type ApplicationStatus =
  | "Submitted"
  | "Under review"
  | "Shortlisted"
  | "Rejected"
  | "Interview"
  | "Offer";

export interface JobApplication {
  id: string;
  jobTitle: string;
  company: string;
  location: string;
  appliedDate: string;
  status: ApplicationStatus;
  logo?: string;
}

export const applicationsData: JobApplication[] = [
  {
    id: "1",
    jobTitle: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Remote - Based in Lagos, Nigeria",
    appliedDate: "Applied 2 minutes ago",
    status: "Submitted",
  },
  {
    id: "2",
    jobTitle: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Remote - Based in Lagos, Nigeria",
    appliedDate: "Applied 2 minutes ago",
    status: "Under review",
  },
  {
    id: "3",
    jobTitle: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Remote - Based in Lagos, Nigeria",
    appliedDate: "Applied 2 minutes ago",
    status: "Shortlisted",
  },
  {
    id: "4",
    jobTitle: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Remote - Based in Lagos, Nigeria",
    appliedDate: "Applied 2 minutes ago",
    status: "Rejected",
  },
  {
    id: "5",
    jobTitle: "Senior Frontend Developer",
    company: "TechNova Solutions",
    location: "Remote - Based in Lagos, Nigeria",
    appliedDate: "Applied 2 minutes ago",
    status: "Rejected",
  },
  {
    id: "6",
    jobTitle: "Full Stack Engineer",
    company: "InnovateTech",
    location: "Abuja, Nigeria",
    appliedDate: "Applied 1 hour ago",
    status: "Under review",
  },
  {
    id: "7",
    jobTitle: "React Developer",
    company: "CodeCraft Inc.",
    location: "Port Harcourt, Nigeria",
    appliedDate: "Applied 3 hours ago",
    status: "Shortlisted",
  },
  {
    id: "8",
    jobTitle: "UI/UX Designer",
    company: "DesignHub",
    location: "Kano, Nigeria",
    appliedDate: "Applied 1 day ago",
    status: "Rejected",
  },
  {
    id: "9",
    jobTitle: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Ibadan, Nigeria",
    appliedDate: "Applied 2 days ago",
    status: "Rejected",
  },
  {
    id: "10",
    jobTitle: "Product Manager",
    company: "ProductVision",
    location: "Kaduna, Nigeria",
    appliedDate: "Applied 3 days ago",
    status: "Interview",
  },
  {
    id: "11",
    jobTitle: "Data Scientist",
    company: "Analytics Pro",
    location: "Enugu, Nigeria",
    appliedDate: "Applied 4 days ago",
    status: "Under review",
  },
  {
    id: "12",
    jobTitle: "Mobile App Developer",
    company: "AppTech Solutions",
    location: "Jos, Nigeria",
    appliedDate: "Applied 5 days ago",
    status: "Shortlisted",
  },
  {
    id: "13",
    jobTitle: "Backend Developer",
    company: "ServerLogic",
    location: "Calabar, Nigeria",
    appliedDate: "Applied 1 week ago",
    status: "Offer",
  },
  {
    id: "14",
    jobTitle: "Frontend Architect",
    company: "WebTech Pro",
    location: "Benin City, Nigeria",
    appliedDate: "Applied 1 week ago",
    status: "Submitted",
  },
  {
    id: "15",
    jobTitle: "Security Engineer",
    company: "CyberDefense Inc.",
    location: "Maiduguri, Nigeria",
    appliedDate: "Applied 1 week ago",
    status: "Under review",
  },
];

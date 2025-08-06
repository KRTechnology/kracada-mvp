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
    jobTitle: "Full Stack Engineer",
    company: "InnovateTech",
    location: "San Francisco, CA",
    appliedDate: "Applied 1 hour ago",
    status: "Under review",
  },
  {
    id: "3",
    jobTitle: "React Developer",
    company: "CodeCraft Inc.",
    location: "New York, NY",
    appliedDate: "Applied 3 hours ago",
    status: "Shortlisted",
  },
  {
    id: "4",
    jobTitle: "UI/UX Designer",
    company: "DesignHub",
    location: "Austin, TX",
    appliedDate: "Applied 1 day ago",
    status: "Rejected",
  },
  {
    id: "5",
    jobTitle: "DevOps Engineer",
    company: "CloudScale Systems",
    location: "Seattle, WA",
    appliedDate: "Applied 2 days ago",
    status: "Rejected",
  },
  {
    id: "6",
    jobTitle: "Product Manager",
    company: "ProductVision",
    location: "Boston, MA",
    appliedDate: "Applied 3 days ago",
    status: "Interview",
  },
  {
    id: "7",
    jobTitle: "Data Scientist",
    company: "Analytics Pro",
    location: "Chicago, IL",
    appliedDate: "Applied 4 days ago",
    status: "Under review",
  },
  {
    id: "8",
    jobTitle: "Mobile App Developer",
    company: "AppTech Solutions",
    location: "Los Angeles, CA",
    appliedDate: "Applied 5 days ago",
    status: "Shortlisted",
  },
  {
    id: "9",
    jobTitle: "Backend Developer",
    company: "ServerLogic",
    location: "Denver, CO",
    appliedDate: "Applied 1 week ago",
    status: "Offer",
  },
  {
    id: "10",
    jobTitle: "Frontend Architect",
    company: "WebTech Pro",
    location: "Portland, OR",
    appliedDate: "Applied 1 week ago",
    status: "Submitted",
  },
  {
    id: "11",
    jobTitle: "Security Engineer",
    company: "CyberDefense Inc.",
    location: "Washington, DC",
    appliedDate: "Applied 1 week ago",
    status: "Under review",
  },
  {
    id: "12",
    jobTitle: "Machine Learning Engineer",
    company: "AI Innovations",
    location: "Palo Alto, CA",
    appliedDate: "Applied 2 weeks ago",
    status: "Rejected",
  },
  {
    id: "13",
    jobTitle: "QA Automation Engineer",
    company: "TestPro Solutions",
    location: "Raleigh, NC",
    appliedDate: "Applied 2 weeks ago",
    status: "Shortlisted",
  },
  {
    id: "14",
    jobTitle: "Cloud Architect",
    company: "CloudScale Systems",
    location: "Atlanta, GA",
    appliedDate: "Applied 2 weeks ago",
    status: "Interview",
  },
  {
    id: "15",
    jobTitle: "Technical Writer",
    company: "DocTech",
    location: "San Diego, CA",
    appliedDate: "Applied 3 weeks ago",
    status: "Submitted",
  },
];

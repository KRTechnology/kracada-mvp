import { JobPostsNavigation } from "@/components/specific/dashboard/JobPostsNavigation";

export default function JobPostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Job Posts Sub-Navigation */}
      <JobPostsNavigation />

      {/* Sub-tab Content */}
      {children}
    </div>
  );
}

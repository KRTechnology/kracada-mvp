// import { ProfileSection } from "./components/ProfileSection";
import { ProfileSection } from "@/components/specific/dashboard/profile-section";
import { ExperienceSkillsSection } from "@/components/specific/dashboard/experience-skills-section";
import { ProfilePictureSection } from "@/components/specific/dashboard/profile-picture-section";

export default async function DashboardPage() {
  // This would normally fetch data from your API or database
  // For now, we'll use placeholder data
  const profileCompletion = 65; // Percentage of profile completion
  const userData = {
    firstName: "Rudra",
    lastName: "Devi",
    email: "rudra.devi@gmail.com",
    phone: "(555) 764 - 1982",
    location: "United States of America",
    bio: "I am a product designer who loves photography, hiking, and camping. I have a passion for creating products that are both functional and beautiful. In my free time, I spend time outdoors, explore new places, and capture the world through my camera lens.",
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-[1010px] mx-auto space-y-6">
        <h1 className="text-2xl font-semibold">Complete your profile</h1>
        <p className="text-neutral-600">
          Manage your personal and organization settings.
        </p>

        {/* Profile Tabs */}
        <div className="border-b border-neutral-100">
          <div className="flex space-x-6">
            <button className="text-neutral-900 border-b-2 border-warm-200 pb-3 font-medium">
              Profile
            </button>
            <button className="text-neutral-500 pb-3 font-medium">
              Password
            </button>
            <button className="text-neutral-500 pb-3 font-medium">
              Notifications
            </button>
          </div>
        </div>

        {/* Main Content Sections */}
        <div className="space-y-6">
          <ProfilePictureSection />
          <ProfileSection user={userData} />
          <ExperienceSkillsSection />
        </div>
      </div>
    </div>
  );
}

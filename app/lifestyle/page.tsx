import { LifestyleHeroSection } from "@/components/specific/lifestyle/LifestyleHeroSection";
import { LifestyleListingHeader } from "@/components/specific/lifestyle/LifestyleListingHeader";
import { LifestyleListingSection } from "@/components/specific/lifestyle/LifestyleListingSection";

export default function LifestylePage() {
  return (
    <div className="min-h-screen">
      <LifestyleHeroSection />
      <LifestyleListingHeader />
      <LifestyleListingSection />
    </div>
  );
}

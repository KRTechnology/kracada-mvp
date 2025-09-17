import { LifestyleHeroSection } from "@/components/specific/lifestyle/LifestyleHeroSection";
import { LifestyleListingHeader } from "@/components/specific/lifestyle/LifestyleListingHeader";
import { LifestyleHeader } from "@/components/specific/lifestyle/LifestyleHeader";

export default function LifestyleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <LifestyleHeroSection />
      <LifestyleListingHeader />
      <LifestyleHeader />
      {children}
    </div>
  );
}

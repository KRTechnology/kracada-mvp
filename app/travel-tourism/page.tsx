import { TravelTourismHeroSection } from "@/components/specific/travel-tourism/TravelTourismHeroSection";
import { TravelTourismProvidersSection } from "@/components/specific/travel-tourism/TravelTourismProvidersSection";
import { TravelTourismListingSection } from "@/components/specific/travel-tourism/TravelTourismListingSection";

export default function TravelTourismPage() {
  return (
    <div className="min-h-screen">
      <TravelTourismHeroSection />
      <TravelTourismProvidersSection />
      <TravelTourismListingSection />
    </div>
  );
}

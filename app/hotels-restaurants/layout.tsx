import { HotelsRestaurantsHeroSection } from "@/components/specific/hotels-restaurants/HotelsRestaurantsHeroSection";
import { HotelsRestaurantsHeader } from "@/components/specific/hotels-restaurants/HotelsRestaurantsHeader";

export default function HotelsRestaurantsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <HotelsRestaurantsHeroSection />
      <HotelsRestaurantsHeader />
      {children}
    </div>
  );
}

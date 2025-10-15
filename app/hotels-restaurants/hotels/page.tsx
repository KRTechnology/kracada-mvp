import { HotelsRestaurantsListingSection } from "@/components/specific/hotels-restaurants/HotelsRestaurantsListingSection";
import { getPublishedHotelsAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";

export default async function HotelsPage() {
  const hotelsResult = await getPublishedHotelsAction();
  const hotels = hotelsResult.success ? hotelsResult.data || [] : [];

  return (
    <HotelsRestaurantsListingSection
      activeTab="Hotels"
      initialHotels={hotels}
    />
  );
}

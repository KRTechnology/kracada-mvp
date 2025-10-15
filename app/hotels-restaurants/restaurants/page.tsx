import { HotelsRestaurantsListingSection } from "@/components/specific/hotels-restaurants/HotelsRestaurantsListingSection";
import { getPublishedRestaurantsAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";

export default async function RestaurantsPage() {
  const restaurantsResult = await getPublishedRestaurantsAction();
  const restaurants = restaurantsResult.success
    ? restaurantsResult.data || []
    : [];

  return (
    <HotelsRestaurantsListingSection
      activeTab="Restaurants"
      initialRestaurants={restaurants}
    />
  );
}

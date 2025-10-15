import { RestaurantDetailContent } from "@/components/specific/hotels-restaurants/RestaurantDetailContent";
import { getPublishedRestaurantByIdAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import { redirect } from "next/navigation";

interface RestaurantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params;

  // Fetch restaurant data from database
  const restaurantResult = await getPublishedRestaurantByIdAction(id);

  if (!restaurantResult.success || !restaurantResult.data) {
    redirect("/hotels-restaurants/restaurants");
  }

  return <RestaurantDetailContent restaurant={restaurantResult.data} />;
}

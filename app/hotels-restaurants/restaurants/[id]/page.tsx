import { RestaurantDetailContent } from "@/components/specific/hotels-restaurants/RestaurantDetailContent";

interface RestaurantDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function RestaurantDetailPage({
  params,
}: RestaurantDetailPageProps) {
  const { id } = await params;
  return <RestaurantDetailContent restaurantId={id} />;
}

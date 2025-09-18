import { HotelDetailContent } from "@/components/specific/hotels-restaurants/HotelDetailContent";

interface HotelDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HotelDetailPage({
  params,
}: HotelDetailPageProps) {
  const { id } = await params;
  return <HotelDetailContent hotelId={id} />;
}

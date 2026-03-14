import { HotelDetailContent } from "@/components/specific/hotels-restaurants/HotelDetailContent";
import { getPublishedHotelByIdAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import { redirect } from "next/navigation";

interface HotelDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function HotelDetailPage({
  params,
}: HotelDetailPageProps) {
  const { id } = await params;

  // Fetch hotel data from database
  const hotelResult = await getPublishedHotelByIdAction(id);

  if (!hotelResult.success || !hotelResult.data) {
    redirect("/hotels-restaurants/hotels");
  }

  return <HotelDetailContent hotel={hotelResult.data} />;
}

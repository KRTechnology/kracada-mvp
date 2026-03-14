import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getUserHotelsAction,
  getUserRestaurantsAction,
} from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import { HotelsRestaurantsManagementClient } from "@/components/specific/dashboard/HotelsRestaurantsManagementClient";

export const metadata = {
  title: "Manage Properties | Kracada",
  description: "Manage your hotels and restaurants",
};

export const dynamic = "force-dynamic";

export default async function HotelsRestaurantsManagementPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch user's hotels and restaurants
  const [hotelsResult, restaurantsResult] = await Promise.all([
    getUserHotelsAction(),
    getUserRestaurantsAction(),
  ]);

  const hotels = hotelsResult.success ? hotelsResult.data || [] : [];
  const restaurants = restaurantsResult.success
    ? restaurantsResult.data || []
    : [];

  return (
    <HotelsRestaurantsManagementClient
      hotels={hotels}
      restaurants={restaurants}
      userId={session.user.id}
    />
  );
}

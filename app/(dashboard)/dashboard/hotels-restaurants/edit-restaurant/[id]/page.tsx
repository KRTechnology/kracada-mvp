import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getRestaurantByIdAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import { EditRestaurantForm } from "@/components/specific/dashboard/EditRestaurantForm";

export const metadata = {
  title: "Edit Restaurant | Kracada",
  description: "Edit your restaurant details",
};

export const dynamic = "force-dynamic";

export default async function EditRestaurantPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch restaurant data
  const restaurantResult = await getRestaurantByIdAction(params.id);

  if (!restaurantResult.success || !restaurantResult.data) {
    redirect("/dashboard/hotels-restaurants");
  }

  return (
    <div className="min-h-screen">
      <div className="mx-4 md:mx-[88px] mt-4 pb-10">
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
          <EditRestaurantForm
            userId={session.user.id}
            initialData={restaurantResult.data}
          />
        </div>
      </div>
    </div>
  );
}

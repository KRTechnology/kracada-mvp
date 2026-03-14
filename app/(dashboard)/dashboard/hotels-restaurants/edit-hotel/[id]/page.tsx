import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getHotelByIdAction } from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import { EditHotelForm } from "@/components/specific/dashboard/EditHotelForm";

export const metadata = {
  title: "Edit Hotel | Kracada",
  description: "Edit your hotel details",
};

export const dynamic = "force-dynamic";

export default async function EditHotelPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  // Await params
  const { id } = await params;

  // Fetch hotel data
  const hotelResult = await getHotelByIdAction(id);

  if (!hotelResult.success || !hotelResult.data) {
    redirect("/dashboard/hotels-restaurants");
  }

  return (
    <div className="min-h-screen">
      <div className="mx-4 md:mx-[88px] mt-4 pb-10">
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
          <EditHotelForm
            userId={session.user.id}
            initialData={hotelResult.data}
          />
        </div>
      </div>
    </div>
  );
}

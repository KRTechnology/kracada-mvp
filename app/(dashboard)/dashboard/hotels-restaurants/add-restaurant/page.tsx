import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AddRestaurantForm } from "@/components/specific/dashboard/AddRestaurantForm";

export const metadata = {
  title: "Add Restaurant | Kracada",
  description: "Add a new restaurant to your properties",
};

export const dynamic = "force-dynamic";

export default async function AddRestaurantPage() {
  const session = await auth();

  // Redirect if not authenticated
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen">
      <div className="mx-4 md:mx-[88px] mt-4 pb-10">
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
          <AddRestaurantForm userId={session.user.id} />
        </div>
      </div>
    </div>
  );
}

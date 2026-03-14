import { redirect } from "next/navigation";

export default function AdminDashboardPage() {
  // Redirect to admin management as the default page
  redirect("/admin/dashboard/admin-management");
}

import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CreateNewsPostForm } from "@/components/specific/news/CreateNewsPostForm";

export const metadata: Metadata = {
  title: "Create News Post | Admin Dashboard",
  description: "Create and publish news articles",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function CreateNewsPostPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user?.email) {
    redirect("/admin/login?redirect=/admin/dashboard/news/create");
  }

  // Get admin data
  const [admin] = await db
    .select({
      id: admins.id,
      firstName: admins.firstName,
      lastName: admins.lastName,
      role: admins.role,
      status: admins.status,
    })
    .from(admins)
    .where(eq(admins.email, session.user.email))
    .limit(1);

  // Redirect if user is not an admin
  if (!admin || admin.status !== "Active") {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <CreateNewsPostForm
        adminId={admin.id}
        adminName={`${admin.firstName} ${admin.lastName}`}
      />
    </div>
  );
}

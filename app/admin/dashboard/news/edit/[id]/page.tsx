import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { admins } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getNewsPostAction } from "@/app/(dashboard)/actions/news-actions";
import { EditNewsPostForm } from "@/components/specific/news/EditNewsPostForm";

export const metadata: Metadata = {
  title: "Edit News Post | Admin Dashboard",
  description: "Edit news article",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface EditNewsPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditNewsPostPage({
  params,
}: EditNewsPostPageProps) {
  const session = await auth();
  const { id } = await params;

  // Redirect to login if not authenticated
  if (!session?.user?.email) {
    redirect(`/admin/login?redirect=/admin/dashboard/news/edit/${id}`);
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

  // Fetch the post
  const postResult = await getNewsPostAction(id);

  if (!postResult.success || !postResult.data) {
    notFound();
  }

  const post = postResult.data;

  // Check if admin owns the post or is Super Admin
  if (post.authorId !== admin.id && admin.role !== "Super Admin") {
    redirect("/admin/dashboard/news");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <EditNewsPostForm
        adminId={admin.id}
        adminName={`${admin.firstName} ${admin.lastName}`}
        post={post}
      />
    </div>
  );
}

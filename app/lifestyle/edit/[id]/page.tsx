import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getLifestylePostAction } from "@/app/actions/lifestyle-actions";
import { EditLifestylePostForm } from "@/components/specific/lifestyle/EditLifestylePostForm";

export const metadata: Metadata = {
  title: "Edit Lifestyle Post | Kracada",
  description: "Edit your lifestyle post",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

interface EditLifestylePostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditLifestylePostPage({
  params,
}: EditLifestylePostPageProps) {
  const session = await auth();
  const { id } = await params;

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect(`/login?redirect=/lifestyle/edit/${id}`);
  }

  // Get user data
  const [user] = await db
    .select({
      id: users.id,
      firstName: users.firstName,
      lastName: users.lastName,
      accountType: users.accountType,
    })
    .from(users)
    .where(eq(users.id, session.user.id))
    .limit(1);

  // Redirect if user is not a Contributor
  if (!user || user.accountType !== "Contributor") {
    redirect("/lifestyle");
  }

  // Fetch the post
  const postResult = await getLifestylePostAction(id);

  if (!postResult.success || !postResult.data) {
    notFound();
  }

  const post = postResult.data;

  // Check if user owns the post
  if (post.authorId !== user.id) {
    redirect("/lifestyle");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <EditLifestylePostForm
        userId={user.id}
        authorName={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
        post={post}
      />
    </div>
  );
}

import { Metadata } from "next";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { CreateLifestylePostForm } from "@/components/specific/lifestyle/CreateLifestylePostForm";

export const metadata: Metadata = {
  title: "Create Lifestyle Post | Kracada",
  description: "Share your lifestyle insights with the community",
};

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function CreateLifestylePostPage() {
  const session = await auth();

  // Redirect to login if not authenticated
  if (!session?.user?.id) {
    redirect("/login?redirect=/lifestyle/create");
  }

  // Get user data and check if they're a Contributor
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

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <CreateLifestylePostForm
        userId={user.id}
        authorName={`${user.firstName || ""} ${user.lastName || ""}`.trim()}
      />
    </div>
  );
}

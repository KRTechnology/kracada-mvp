import { BookmarkedJobsContent } from "@/components/specific/dashboard/BookmarkedJobsContent";
import { getBookmarkedJobsAction } from "@/app/(dashboard)/actions/bookmark-actions";
import { auth } from "@/auth";

// Force dynamic rendering since this page uses auth() which calls headers()
export const dynamic = "force-dynamic";

export default async function BookmarksJobsPage() {
  const session = await auth();

  // If user is not authenticated, let the client component handle it
  if (!session?.user?.id) {
    return <BookmarkedJobsContent bookmarkedJobs={[]} />;
  }

  // Fetch bookmarked jobs on the server
  const result = await getBookmarkedJobsAction();
  const bookmarkedJobs = result.success ? result.data || [] : [];

  return <BookmarkedJobsContent bookmarkedJobs={bookmarkedJobs} />;
}

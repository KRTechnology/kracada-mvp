import { BookmarkedVideosContent } from "@/components/specific/dashboard/BookmarkedVideosContent";
import { getBookmarkedVideosAction } from "@/app/(dashboard)/actions/bookmark-actions";
import { auth } from "@/auth";

// Force dynamic rendering since this page uses auth() which calls headers()
export const dynamic = "force-dynamic";

export default async function BookmarksVideosPage() {
  const session = await auth();

  // If user is not authenticated, let the client component handle it
  if (!session?.user?.id) {
    return <BookmarkedVideosContent bookmarkedVideos={[]} />;
  }

  // Fetch bookmarked videos on the server
  const result = await getBookmarkedVideosAction();
  const bookmarkedVideos = result.success ? result.data || [] : [];

  return <BookmarkedVideosContent bookmarkedVideos={bookmarkedVideos} />;
}

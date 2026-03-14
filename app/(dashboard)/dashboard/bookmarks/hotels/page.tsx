import { BookmarkedHotelsContent } from "@/components/specific/dashboard/BookmarkedHotelsContent";
import { getBookmarkedHotelsAction } from "@/app/(dashboard)/actions/bookmark-actions";
import { auth } from "@/auth";

// Force dynamic rendering since this page uses auth() which calls headers()
export const dynamic = "force-dynamic";

export default async function BookmarksHotelsPage() {
  const session = await auth();

  // If user is not authenticated, let the client component handle it
  if (!session?.user?.id) {
    return <BookmarkedHotelsContent bookmarkedHotels={[]} />;
  }

  // Fetch bookmarked hotels on the server
  const result = await getBookmarkedHotelsAction();
  const bookmarkedHotels = result.success ? result.data || [] : [];

  return <BookmarkedHotelsContent bookmarkedHotels={bookmarkedHotels} />;
}

import { BookmarkedRestaurantsContent } from "@/components/specific/dashboard/BookmarkedRestaurantsContent";
import { getBookmarkedRestaurantsAction } from "@/app/(dashboard)/actions/bookmark-actions";
import { auth } from "@/auth";

// Force dynamic rendering since this page uses auth() which calls headers()
export const dynamic = "force-dynamic";

export default async function BookmarksRestaurantsPage() {
  const session = await auth();

  // If user is not authenticated, let the client component handle it
  if (!session?.user?.id) {
    return <BookmarkedRestaurantsContent bookmarkedRestaurants={[]} />;
  }

  // Fetch bookmarked restaurants on the server
  const result = await getBookmarkedRestaurantsAction();
  const bookmarkedRestaurants = result.success ? result.data || [] : [];

  return (
    <BookmarkedRestaurantsContent
      bookmarkedRestaurants={bookmarkedRestaurants}
    />
  );
}

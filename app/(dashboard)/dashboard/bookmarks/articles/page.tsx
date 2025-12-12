import { getBookmarkedArticleAction } from "@/app/(dashboard)/actions/bookmark-actions";
import { BookmarkedArticlesContent } from "@/components/specific/dashboard/BookmarkedArticlesContent";

export default async function BookmarksArticlesPage() {
  const resi = await getBookmarkedArticleAction();
  console.log(resi, "HERE");
  // For now, articles are static data since only jobs are implemented
  // When article bookmarks are implemented, fetch them here like jobs
  return <BookmarkedArticlesContent />;
}

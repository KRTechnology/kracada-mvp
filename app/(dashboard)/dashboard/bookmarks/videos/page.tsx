import { BookmarkedVideosContent } from "@/components/specific/dashboard/BookmarkedVideosContent";

export default async function BookmarksVideosPage() {
  // For now, videos are static data since only jobs are implemented
  // When video bookmarks are implemented, fetch them here like jobs
  return <BookmarkedVideosContent />;
}

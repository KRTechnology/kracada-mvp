import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { NewsHeroSection } from "@/components/specific/news/NewsHeroSection";
import { NewsListingHeader } from "@/components/specific/news/NewsListingHeader";
import { NewsListingSection } from "@/components/specific/news/NewsListingSection";
import { getNewsPostsAction } from "@/app/(dashboard)/actions/news-actions";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = params.page ? parseInt(params.page) : 1;

  // Fetch posts from database
  const postsResult = await getNewsPostsAction({
    page,
    limit: 6,
    status: "published",
  });

  const posts = postsResult.success ? postsResult.data?.posts || [] : [];
  const pagination =
    postsResult.success && postsResult.data?.pagination
      ? postsResult.data.pagination
      : { page: 1, limit: 6, total: 0, totalPages: 0 };

  return (
    <div className="min-h-screen">
      <NewsHeroSection />
      <NewsListingHeader totalResults={pagination.total} />
      <NewsListingSection initialPosts={posts} initialPagination={pagination} />
      <EntertainmentQuizBanner />
    </div>
  );
}

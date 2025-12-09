import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { TvHeroSection } from "@/components/specific/tv/TvHeroSection";
import { TvListingSection } from "@/components/specific/tv/TvListingSection";

import {
  getNewsApi,
  getNewsPostsAction,
} from "@/app/(dashboard)/actions/news-actions";
import { getKracadaTVVideosAction } from "../(dashboard)/actions/video-actions";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function TvPage({
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
  const kracadaTVResult = await getKracadaTVVideosAction();

  const apiPosts = await getNewsApi();

  const posts = postsResult.success ? postsResult.data?.posts || [] : [];
  const tvPosts = kracadaTVResult.success ? kracadaTVResult.data || [] : [];

  const pagination =
    postsResult.success && postsResult.data?.pagination
      ? postsResult.data.pagination
      : { page: 1, limit: 6, total: 0, totalPages: 0 };

  return (
    <div className="min-h-screen">
      <TvHeroSection />
      {/* <TvListingHeader totalResults={pagination.total} /> */}
      <TvListingSection videos={tvPosts} />

      <EntertainmentQuizBanner />
    </div>
  );
}

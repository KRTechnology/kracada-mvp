import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import NewsSection from "@/components/specific/landing/NewsSection";

import { EntertainmentKracadaTV } from "@/components/specific/entertainment/EntertainmentKracadaTV";
import {
  getEntertainmentPostsAction,
  getTrendingArticlesAction,
  getTrendingNewsAction,
} from "@/app/actions/entertainment-actions";
import {
  getKracadaTVVideosAction,
  getTrendingVideosAction,
} from "@/app/(dashboard)/actions/video-actions";
import { LifestyleListingSection } from "@/components/specific/lifestyle/LifestyleListingSection";
import {
  getChannelVideos,
  getNewsApi,
} from "../(dashboard)/actions/news-actions";

export default async function EntertainmentPage() {
  // Fetch trending articles and news
  const youtubeVideos = await getChannelVideos();
  const newNews = await getNewsApi();

  const postsResult = await getEntertainmentPostsAction({
    page: 1,
    limit: 12,
    status: "published",
  });
  const posts = postsResult.success ? postsResult.data?.posts || [] : [];
  const pagination = postsResult.success
    ? postsResult.data?.pagination
    : { page: 1, limit: 12, total: 0, totalPages: 0 };

  // Fetch Kracada TV videos (limit to 3)

  // Fetch trending videos (initial page)
  const trendingVideosResult = await getTrendingVideosAction({
    page: 1,
    limit: 18,
  });

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <LifestyleListingSection
        activeTab="All posts"
        initialPosts={posts}
        initialPagination={pagination}
        type="entertainment"
      />
      <EntertainmentQuizBanner />
      <EntertainmentKracadaTV videos={youtubeVideos.items.slice(0, 3)} />

      <NewsSection latestNews={[]} newNews={newNews.articles} />
    </div>
  );
}

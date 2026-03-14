import { EntertainmentTrendingArticles } from "@/components/specific/entertainment/EntertainmentTrendingArticles";
import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { EntertainmentKracadaTV } from "@/components/specific/entertainment/EntertainmentKracadaTV";
import { EntertainmentTrendingNews } from "@/components/specific/entertainment/EntertainmentTrendingNews";
import { EntertainmentTrendingVideos } from "@/components/specific/entertainment/EntertainmentTrendingVideos";
import {
  getTrendingArticlesAction,
  getTrendingNewsAction,
} from "@/app/actions/entertainment-actions";
import {
  getKracadaTVVideosAction,
  getTrendingVideosAction,
} from "@/app/(dashboard)/actions/video-actions";

export default async function EntertainmentPage() {
  // Fetch trending articles and news
  const articlesResult = await getTrendingArticlesAction({ limit: 18 });
  const trendingArticles = articlesResult.success
    ? articlesResult.data || []
    : [];

  const newsResult = await getTrendingNewsAction({ limit: 18 });
  const trendingNews = newsResult.success ? newsResult.data || [] : [];

  // Fetch Kracada TV videos (limit to 3)
  const kracadaTVResult = await getKracadaTVVideosAction({ limit: 3 });
  const kracadaTVVideos = kracadaTVResult.success
    ? kracadaTVResult.data || []
    : [];

  // Fetch trending videos (initial page)
  const trendingVideosResult = await getTrendingVideosAction({
    page: 1,
    limit: 18,
  });
  const trendingVideos = trendingVideosResult.success
    ? trendingVideosResult.data?.videos || []
    : [];
  const trendingVideosPagination = trendingVideosResult.success
    ? trendingVideosResult.data?.pagination
    : { total: 0, totalPages: 1 };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <EntertainmentTrendingArticles initialArticles={trendingArticles} />
      <EntertainmentQuizBanner />
      <EntertainmentKracadaTV videos={kracadaTVVideos} />
      <EntertainmentTrendingNews initialNews={trendingNews} />
      <EntertainmentTrendingVideos
        initialVideos={trendingVideos}
        initialTotal={trendingVideosPagination?.total}
        initialTotalPages={trendingVideosPagination?.totalPages}
      />
    </div>
  );
}

import { EntertainmentTrendingArticles } from "@/components/specific/entertainment/EntertainmentTrendingArticles";
import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { EntertainmentKracadaTV } from "@/components/specific/entertainment/EntertainmentKracadaTV";
import { EntertainmentTrendingNews } from "@/components/specific/entertainment/EntertainmentTrendingNews";
import { EntertainmentTrendingVideos } from "@/components/specific/entertainment/EntertainmentTrendingVideos";
import {
  getTrendingArticlesAction,
  getTrendingNewsAction,
} from "@/app/actions/entertainment-actions";

export default async function EntertainmentPage() {
  // Fetch trending articles and news
  const articlesResult = await getTrendingArticlesAction({ limit: 18 });
  const trendingArticles = articlesResult.success
    ? articlesResult.data || []
    : [];

  const newsResult = await getTrendingNewsAction({ limit: 18 });
  const trendingNews = newsResult.success ? newsResult.data || [] : [];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <EntertainmentTrendingArticles initialArticles={trendingArticles} />
      <EntertainmentQuizBanner />
      <EntertainmentKracadaTV />
      <EntertainmentTrendingNews initialNews={trendingNews} />
      <EntertainmentTrendingVideos />
    </div>
  );
}

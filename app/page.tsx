import HeroSection from "@/components/specific/landing/HeroSection";
import NewsSection from "@/components/specific/landing/NewsSection";
import JobsSection from "@/components/specific/landing/JobsSection";
import ArticlesSection from "@/components/specific/landing/ArticlesSection";
import TravelSection from "@/components/specific/landing/TravelSection";
import {
  getLatestJobsAction,
  getLatestLifestylePostsAction,
  getLatestNewsPostsAction,
} from "@/app/actions/home-actions";
import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { EntertainmentKracadaTV } from "@/components/specific/entertainment/EntertainmentKracadaTV";
import { getKracadaTVVideosAction } from "./(dashboard)/actions/video-actions";
import { getNewsApi } from "./(dashboard)/actions/news-actions";

export default async function Home() {
  // Fetch latest jobs, lifestyle posts, and news posts data
  const jobsResult = await getLatestJobsAction();
  const latestJobs = jobsResult.success ? jobsResult.data || [] : [];

  const postsResult = await getLatestLifestylePostsAction();
  const latestPosts = postsResult.success ? postsResult.data || [] : [];

  const newsResult = await getLatestNewsPostsAction();
  const latestNews = newsResult.success ? newsResult.data || [] : [];

  const newNews = await getNewsApi();

  // Fetch Kracada TV videos (limit to 3)
  const kracadaTVResult = await getKracadaTVVideosAction({ limit: 3 });
  const kracadaTVVideos = kracadaTVResult.success
    ? kracadaTVResult.data || []
    : [];

  return (
    <>
      <HeroSection />
      <NewsSection latestNews={latestNews} newNews={newNews.articles} />
      <EntertainmentQuizBanner />
      <JobsSection latestJobs={latestJobs} />
      <EntertainmentKracadaTV videos={kracadaTVVideos} />
      <ArticlesSection latestPosts={latestPosts} />
      <TravelSection />
    </>
  );
}

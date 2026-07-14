import HeroSection from "@/components/specific/landing/HeroSection";
import NewsSection from "@/components/specific/landing/NewsSection";
import JobsSection from "@/components/specific/landing/JobsSection";
import ArticlesSection from "@/components/specific/landing/ArticlesSection";
import TravelSection from "@/components/specific/landing/TravelSection";
import {
  getLatestJobsAction,
  getLatestLifestylePostsAction,
} from "@/app/actions/home-actions";
import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { EntertainmentKracadaTV } from "@/components/specific/entertainment/EntertainmentKracadaTV";
import {
  getChannelVideos,
  getNewsApi,
} from "./(dashboard)/actions/news-actions";

export const dynamic = "force-dynamic";

export default async function Home() {
  const jobsResult = await getLatestJobsAction();
  const latestJobs = jobsResult.success ? jobsResult.data || [] : [];

  const postsResult = await getLatestLifestylePostsAction();
  const latestPosts = postsResult.success ? postsResult.data || [] : [];

  const newNews = await getNewsApi();

  const youtubeVideos = await getChannelVideos();

  return (
    <div style={{ scrollBehavior: "smooth" }}>
      <HeroSection />
      <NewsSection latestNews={[]} newNews={newNews.articles} />
      <EntertainmentQuizBanner />
      <JobsSection latestJobs={latestJobs} />
      <EntertainmentKracadaTV videos={youtubeVideos.items.slice(0, 3)} />
      <ArticlesSection latestPosts={latestPosts} />
      {/* <TravelSection /> */}
    </div>
  );
}

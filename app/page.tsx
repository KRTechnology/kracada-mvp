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

export default async function Home() {
  // Fetch latest jobs and lifestyle posts data
  const jobsResult = await getLatestJobsAction();
  const latestJobs = jobsResult.success ? jobsResult.data || [] : [];

  const postsResult = await getLatestLifestylePostsAction();
  const latestPosts = postsResult.success ? postsResult.data || [] : [];

  return (
    <>
      <HeroSection />
      <NewsSection />
      <EntertainmentQuizBanner />
      <JobsSection latestJobs={latestJobs} />
      <ArticlesSection latestPosts={latestPosts} />
      <TravelSection />
    </>
  );
}

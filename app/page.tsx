import HeroSection from "@/components/specific/landing/HeroSection";
import NewsSection from "@/components/specific/landing/NewsSection";
import JobsSection from "@/components/specific/landing/JobsSection";
import ArticlesSection from "@/components/specific/landing/ArticlesSection";
import TravelSection from "@/components/specific/landing/TravelSection";
import { getLatestJobsAction } from "@/app/actions/home-actions";

export default async function Home() {
  // Fetch latest jobs data
  const jobsResult = await getLatestJobsAction();
  const latestJobs = jobsResult.success ? jobsResult.data || [] : [];

  return (
    <>
      <HeroSection />
      <NewsSection />
      <JobsSection latestJobs={latestJobs} />
      <ArticlesSection />
      <TravelSection />
    </>
  );
}

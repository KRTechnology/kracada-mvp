import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { TvHeroSection } from "@/components/specific/tv/TvHeroSection";
import { TvListingSection } from "@/components/specific/tv/TvListingSection";
import { getChannelVideos } from "@/app/(dashboard)/actions/news-actions";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function TvPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const youtubeVideos = await getChannelVideos();

  return (
    <div className="min-h-screen">
      <TvHeroSection />
      <TvListingSection videos={youtubeVideos.items.slice(0, 9)} />

      <EntertainmentQuizBanner />
    </div>
  );
}

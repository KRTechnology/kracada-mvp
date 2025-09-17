import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { NewsHeroSection } from "@/components/specific/news/NewsHeroSection";
import { NewsListingHeader } from "@/components/specific/news/NewsListingHeader";
import { NewsListingSection } from "@/components/specific/news/NewsListingSection";

export default function NewsPage() {
  return (
    <div className="min-h-screen">
      <NewsHeroSection />
      <NewsListingHeader />
      <NewsListingSection />
      <EntertainmentQuizBanner />

    </div>
  );
}

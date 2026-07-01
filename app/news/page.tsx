import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { NewsHeroSection } from "@/components/specific/news/NewsHeroSection";
import { NewsListingSection } from "@/components/specific/news/NewsListingSection";

import { getNewsApi } from "@/app/(dashboard)/actions/news-actions";

// Force dynamic rendering
export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const apiPosts = await getNewsApi();

  return (
    <div className="min-h-screen">
      <NewsHeroSection />
      {/* <NewsListingHeader totalResults={pagination.total} /> */}
      <NewsListingSection
        // initialPosts={}
        // initialPagination={}
        apiPost={apiPosts}
      />
      <EntertainmentQuizBanner />
    </div>
  );
}

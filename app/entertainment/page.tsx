import { EntertainmentTrendingArticles } from "@/components/specific/entertainment/EntertainmentTrendingArticles";
import { EntertainmentQuizBanner } from "@/components/specific/entertainment/EntertainmentQuizBanner";
import { EntertainmentKracadaTV } from "@/components/specific/entertainment/EntertainmentKracadaTV";
import { EntertainmentTrendingNews } from "@/components/specific/entertainment/EntertainmentTrendingNews";
import { EntertainmentTrendingVideos } from "@/components/specific/entertainment/EntertainmentTrendingVideos";

export default function EntertainmentPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <EntertainmentTrendingArticles />
      <EntertainmentQuizBanner />
      <EntertainmentKracadaTV />
      <EntertainmentTrendingNews />
      <EntertainmentTrendingVideos />
    </div>
  );
}

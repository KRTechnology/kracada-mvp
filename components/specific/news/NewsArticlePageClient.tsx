"use client";

import { NewsArticleHeaderDynamic } from "./NewsArticleHeaderDynamic";
import { NewsArticleContentDynamic } from "./NewsArticleContentDynamic";

interface NewsArticlePageClientProps {
  post: any;
}

export function NewsArticlePageClient({ post }: NewsArticlePageClientProps) {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D0D]">
      <NewsArticleHeaderDynamic post={post} />
      <NewsArticleContentDynamic post={post} />
    </div>
  );
}

"use client";

import { Metadata } from "next";

export interface SEOProps {
  title?: string;
  description?: string;
  ogImage?: string;
  canonicalUrl?: string;
  keywords?: string;
}

// For use in page.tsx metadata export
export function generateMetadata({
  title = "Kracada - One stop shop for everything important to you",
  description = "Kracada is a lifestyle blog in Nigeria for everything you can think of. Jobs, News, Lifestyle, Entertainment, and CV Optimization.",
  ogImage = "/og-image.jpg",
  canonicalUrl,
  keywords = "kracada, lifestyle blog, nigeria, jobs, news, entertainment, cv optimization",
}: SEOProps): Metadata {
  const siteUrl = "https://kracada.com"; // Replace with actual domain when available

  return {
    title,
    description,
    keywords: keywords.split(",").map((keyword) => keyword.trim()),
    openGraph: {
      title,
      description,
      url: canonicalUrl || siteUrl,
      siteName: "Kracada",
      images: [
        {
          url: `${siteUrl}${ogImage}`,
          width: 1200,
          height: 630,
          alt: "Kracada - One stop shop for everything important to you",
        },
      ],
      locale: "en_NG",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${siteUrl}${ogImage}`],
    },
    alternates: {
      canonical: canonicalUrl || siteUrl,
    },
    metadataBase: new URL(siteUrl),
  };
}
 
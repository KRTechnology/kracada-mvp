"use server";

import { db } from "@/lib/db/drizzle";
import { lifestylePosts, newsPosts, users, admins } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

// Types for entertainment page
export interface EntertainmentArticle {
  id: string;
  slug: string;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
}

export interface EntertainmentNews {
  id: string;
  slug: string;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
}

/**
 * Fetch trending lifestyle articles for entertainment page
 */
export async function getTrendingArticlesAction(params?: {
  limit?: number;
}): Promise<{
  success: boolean;
  data?: EntertainmentArticle[];
  message?: string;
}> {
  try {
    const limit = params?.limit || 18;

    // Fetch published lifestyle posts ordered by views and likes
    const articles = await db
      .select({
        id: lifestylePosts.id,
        slug: lifestylePosts.slug,
        title: lifestylePosts.title,
        description: lifestylePosts.description,
        featuredImage: lifestylePosts.featuredImage,
        categories: lifestylePosts.categories,
        publishedAt: lifestylePosts.publishedAt,
        createdAt: lifestylePosts.createdAt,
        viewCount: lifestylePosts.viewCount,
        likeCount: lifestylePosts.likeCount,
        authorFullName: users.fullName,
        authorFirstName: users.firstName,
        authorLastName: users.lastName,
      })
      .from(lifestylePosts)
      .innerJoin(users, eq(lifestylePosts.authorId, users.id))
      .where(eq(lifestylePosts.status, "published"))
      .orderBy(desc(lifestylePosts.viewCount), desc(lifestylePosts.publishedAt))
      .limit(limit);

    // Transform the data
    const transformedArticles: EntertainmentArticle[] = articles.map(
      (article) => {
        const authorName =
          article.authorFullName ||
          (article.authorFirstName && article.authorLastName
            ? `${article.authorFirstName} ${article.authorLastName}`
            : "Anonymous");

        const postDate = article.publishedAt || article.createdAt;
        const formattedDate = new Date(postDate).toLocaleDateString("en-US", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });

        return {
          id: article.id,
          slug: article.slug,
          author: authorName,
          date: formattedDate,
          title: article.title,
          description: article.description || "",
          image: article.featuredImage || "/images/news-sample-image.jpg",
          categories: article.categories ? JSON.parse(article.categories) : [],
        };
      }
    );

    return {
      success: true,
      data: transformedArticles,
    };
  } catch (error) {
    console.error("Error fetching trending articles:", error);
    return {
      success: false,
      message: "Failed to fetch trending articles",
    };
  }
}

/**
 * Fetch trending news for entertainment page
 */
export async function getTrendingNewsAction(params?: {
  limit?: number;
}): Promise<{
  success: boolean;
  data?: EntertainmentNews[];
  message?: string;
}> {
  try {
    const limit = params?.limit || 18;

    // Fetch published news posts ordered by views and likes
    const news = await db
      .select({
        id: newsPosts.id,
        slug: newsPosts.slug,
        title: newsPosts.title,
        description: newsPosts.description,
        featuredImage: newsPosts.featuredImage,
        categories: newsPosts.categories,
        publishedAt: newsPosts.publishedAt,
        createdAt: newsPosts.createdAt,
        viewCount: newsPosts.viewCount,
        likeCount: newsPosts.likeCount,
        authorFirstName: admins.firstName,
        authorLastName: admins.lastName,
      })
      .from(newsPosts)
      .innerJoin(admins, eq(newsPosts.authorId, admins.id))
      .where(eq(newsPosts.status, "published"))
      .orderBy(desc(newsPosts.viewCount), desc(newsPosts.publishedAt))
      .limit(limit);

    // Transform the data
    const transformedNews: EntertainmentNews[] = news.map((newsItem) => {
      const authorName = `${newsItem.authorFirstName} ${newsItem.authorLastName}`;

      const postDate = newsItem.publishedAt || newsItem.createdAt;
      const formattedDate = new Date(postDate).toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      return {
        id: newsItem.id,
        slug: newsItem.slug,
        author: authorName,
        date: formattedDate,
        title: newsItem.title,
        description: newsItem.description || "",
        image: newsItem.featuredImage || "/images/news-sample-image.jpg",
        categories: newsItem.categories ? JSON.parse(newsItem.categories) : [],
      };
    });

    return {
      success: true,
      data: transformedNews,
    };
  } catch (error) {
    console.error("Error fetching trending news:", error);
    return {
      success: false,
      message: "Failed to fetch trending news",
    };
  }
}

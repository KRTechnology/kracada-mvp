"use client";

import { TabType } from "@/components/specific/dashboard/TabSwitcher";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { LifestyleArticleCard } from "./LifestyleArticleCard";
import { Pagination } from "@/components/common/Pagination";
import { LifestyleVideoCard } from "./LifestyleVideoCard";
import { getLifestylePostsAction } from "@/app/actions/lifestyle-actions";

// Types for content items
interface LifestyleArticle {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  isVideo?: false;
}

interface LifestyleVideo {
  id: number;
  author: string;
  date: string;
  title: string;
  description: string;
  image: string;
  categories: string[];
  isVideo: true;
}

type LifestyleContent = LifestyleArticle | LifestyleVideo;

// Sample lifestyle articles data - in a real app, this would come from an API
const lifestyleArticlesData: LifestyleArticle[] = [
  {
    id: 1,
    author: "Sarah Johnson",
    date: "17 Jan 2025",
    title: "5 Morning Routines for Peak Productivity",
    description:
      "Start your day with intention and energy using these proven morning routines that successful people swear by.",
    image: "/images/news-sample-image.jpg",
    categories: ["Personal Development", "Productivity"],
  },
  {
    id: 2,
    author: "Dr. Michael Chen",
    date: "16 Jan 2025",
    title: "The Science of Healthy Eating",
    description:
      "Discover the latest research on nutrition and how to build sustainable healthy eating habits that last.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Health", "Nutrition"],
  },
  {
    id: 3,
    author: "Emma Rodriguez",
    date: "15 Jan 2025",
    title: "Sustainable Fashion: Building a Conscious Wardrobe",
    description:
      "Learn how to create a stylish, sustainable wardrobe that reflects your values and reduces environmental impact.",
    image: "/images/news-sample-image.jpg",
    categories: ["Fashion", "Sustainability"],
  },
  {
    id: 4,
    author: "James Wilson",
    date: "14 Jan 2025",
    title: "Mental Health in the Digital Age",
    description:
      "Navigating the challenges of modern life while maintaining good mental health and digital wellness.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Mental Health", "Wellness"],
  },
  {
    id: 5,
    author: "Lisa Park",
    date: "13 Jan 2025",
    title: "Work-Life Balance: Finding Your Sweet Spot",
    description:
      "Practical strategies for creating boundaries and achieving a fulfilling balance between work and personal life.",
    image: "/images/news-sample-image.jpg",
    categories: ["Work-Life Balance", "Career"],
  },
  {
    id: 6,
    author: "David Kim",
    date: "12 Jan 2025",
    title: "Fitness Trends That Actually Work",
    description:
      "Cut through the noise and focus on fitness approaches that deliver real, sustainable results for your lifestyle.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Fitness", "Health"],
  },
  {
    id: 7,
    author: "Maria Garcia",
    date: "11 Jan 2025",
    title: "Building Confidence Through Self-Care",
    description:
      "How a consistent self-care routine can boost your confidence and improve your overall quality of life.",
    image: "/images/news-sample-image.jpg",
    categories: ["Self-Care", "Personal Development"],
  },
  {
    id: 8,
    author: "Alex Thompson",
    date: "10 Jan 2025",
    title: "Minimalist Living: Less is More",
    description:
      "Embrace minimalism to reduce stress, increase focus, and create more space for what truly matters in life.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Minimalism", "Lifestyle"],
  },
  {
    id: 9,
    author: "Rachel Brown",
    date: "9 Jan 2025",
    title: "The Art of Mindful Communication",
    description:
      "Improve your relationships and reduce conflict through mindful communication techniques and active listening.",
    image: "/images/news-sample-image.jpg",
    categories: ["Communication", "Relationships"],
  },
  {
    id: 10,
    author: "Kevin Martinez",
    date: "8 Jan 2025",
    title: "Financial Wellness for Millennials",
    description:
      "Practical money management tips and strategies specifically tailored for the millennial generation.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Finance", "Personal Development"],
  },
  {
    id: 11,
    author: "Sophie Anderson",
    date: "7 Jan 2025",
    title: "Creating a Home Sanctuary",
    description:
      "Transform your living space into a peaceful sanctuary that supports your well-being and personal growth.",
    image: "/images/news-sample-image.jpg",
    categories: ["Home", "Wellness"],
  },
  {
    id: 12,
    author: "Daniel White",
    date: "6 Jan 2025",
    title: "The Power of Gratitude Practice",
    description:
      "How a simple daily gratitude practice can transform your mindset and improve your overall happiness.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Mindfulness", "Personal Development"],
  },
  {
    id: 13,
    author: "Jessica Moore",
    date: "5 Jan 2025",
    title: "Building Inclusive Workplaces",
    description:
      "Creating environments where all employees feel valued, respected, and able to contribute their best work.",
    image: "/images/news-sample-image.jpg",
    categories: ["Diversity", "Career"],
  },
  {
    id: 14,
    author: "Robert Taylor",
    date: "4 Jan 2025",
    title: "Digital Wellness for Modern Life",
    description:
      "Practical tips for maintaining a healthy relationship with technology and preventing digital overwhelm.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Digital Wellness", "Mental Health"],
  },
  {
    id: 15,
    author: "Amanda Clark",
    date: "3 Jan 2025",
    title: "The Psychology of Habit Formation",
    description:
      "Understanding how habits work in your brain and using this knowledge to build positive, lasting changes.",
    image: "/images/news-sample-image.jpg",
    categories: ["Psychology", "Personal Development"],
  },
  {
    id: 16,
    author: "Marcus Johnson",
    date: "2 Jan 2025",
    title: "Sustainable Living on a Budget",
    description:
      "Practical ways to live more sustainably without breaking the bank, from eco-friendly swaps to zero-waste tips.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Sustainability", "Finance"],
  },
  {
    id: 17,
    author: "Priya Patel",
    date: "1 Jan 2025",
    title: "Cultural Wellness Practices",
    description:
      "Exploring traditional wellness practices from around the world and how to incorporate them into modern life.",
    image: "/images/news-sample-image.jpg",
    categories: ["Wellness", "Culture"],
  },
  {
    id: 18,
    author: "Elena Vasquez",
    date: "31 Dec 2024",
    title: "The Art of Slow Living",
    description:
      "Embracing a slower pace of life to reduce stress, increase mindfulness, and improve overall well-being.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Slow Living", "Mindfulness"],
  },
];

// Sample video data - in a real app, this would come from an API
const lifestyleVideosData: LifestyleVideo[] = [
  {
    id: 101,
    author: "Demi Wilkinson",
    date: "16 Jan 2025",
    title: "PM mental models",
    description:
      "Mental models are simple expressions of complex processes or relationships.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Product", "Research", "Frameworks"],
    isVideo: true,
  },
  {
    id: 102,
    author: "Sarah Johnson",
    date: "15 Jan 2025",
    title: "Morning Routine Masterclass",
    description:
      "A comprehensive video guide to building the perfect morning routine for maximum productivity.",
    image: "/images/news-sample-image.jpg",
    categories: ["Personal Development", "Wellness"],
    isVideo: true,
  },
  {
    id: 103,
    author: "Michael Chen",
    date: "14 Jan 2025",
    title: "Mindful Meditation Techniques",
    description:
      "Learn practical meditation techniques you can use anywhere to reduce stress and improve focus.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Mental Health", "Mindfulness"],
    isVideo: true,
  },
  {
    id: 104,
    author: "Fitness Coach Maya",
    date: "13 Jan 2025",
    title: "Home Workout Essentials",
    description:
      "Complete guide to creating an effective workout routine that you can do from the comfort of your home.",
    image: "/images/news-sample-image.jpg",
    categories: ["Fitness", "Health"],
    isVideo: true,
  },
  {
    id: 105,
    author: "Chef Rodriguez",
    date: "12 Jan 2025",
    title: "Healthy Meal Prep Masterclass",
    description:
      "Step-by-step video guide to meal prepping nutritious, delicious meals for the entire week.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Nutrition", "Health"],
    isVideo: true,
  },
  {
    id: 106,
    author: "Style Expert Lisa",
    date: "11 Jan 2025",
    title: "Capsule Wardrobe Creation",
    description:
      "Learn how to build a versatile, sustainable wardrobe with fewer pieces that work together perfectly.",
    image: "/images/news-sample-image.jpg",
    categories: ["Fashion", "Sustainability"],
    isVideo: true,
  },
  {
    id: 107,
    author: "Dr. Wellness",
    date: "10 Jan 2025",
    title: "Stress Management Techniques",
    description:
      "Evidence-based stress management strategies that you can implement immediately for better mental health.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Mental Health", "Wellness"],
    isVideo: true,
  },
  {
    id: 108,
    author: "Financial Guru Tom",
    date: "9 Jan 2025",
    title: "Budgeting for Beginners",
    description:
      "Simple, practical budgeting strategies that anyone can follow to take control of their financial health.",
    image: "/images/news-sample-image.jpg",
    categories: ["Finance", "Personal Development"],
    isVideo: true,
  },
  {
    id: 109,
    author: "Home Designer Ana",
    date: "8 Jan 2025",
    title: "Creating Zen Spaces at Home",
    description:
      "Transform any space in your home into a peaceful sanctuary using simple design principles and mindful decor.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Home", "Wellness"],
    isVideo: true,
  },
  {
    id: 110,
    author: "Productivity Expert Jake",
    date: "7 Jan 2025",
    title: "Time Management Mastery",
    description:
      "Proven time management techniques to help you accomplish more while maintaining work-life balance.",
    image: "/images/news-sample-image.jpg",
    categories: ["Productivity", "Personal Development"],
    isVideo: true,
  },
  {
    id: 111,
    author: "Relationship Coach Emma",
    date: "6 Jan 2025",
    title: "Communication Skills Workshop",
    description:
      "Learn effective communication techniques to improve your relationships and resolve conflicts peacefully.",
    image: "/images/landing-hero-image.jpg",
    categories: ["Communication", "Relationships"],
    isVideo: true,
  },
  {
    id: 112,
    author: "Mindfulness Teacher Sam",
    date: "5 Jan 2025",
    title: "Daily Mindfulness Practice",
    description:
      "Simple mindfulness exercises that you can incorporate into your daily routine for greater peace and clarity.",
    image: "/images/news-sample-image.jpg",
    categories: ["Mindfulness", "Mental Health"],
    isVideo: true,
  },
];

// Function to mix articles and videos for "All posts" tab
const getMixedContent = (): LifestyleContent[] => {
  const mixed: LifestyleContent[] = [...lifestyleArticlesData];
  // Insert videos at strategic positions to create a natural mix
  mixed.splice(2, 0, lifestyleVideosData[0]); // Insert video at position 3
  mixed.splice(5, 0, lifestyleVideosData[1]); // Insert video at position 6
  mixed.splice(9, 0, lifestyleVideosData[2]); // Insert video at position 10
  mixed.splice(13, 0, lifestyleVideosData[3]); // Insert video at position 14
  mixed.splice(17, 0, lifestyleVideosData[4]); // Insert video at position 18
  mixed.splice(21, 0, lifestyleVideosData[5]); // Insert video at position 22

  return mixed;
};

interface LifestyleListingSectionProps {
  activeTab?: TabType;
  initialPosts?: any[];
  initialPagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const LifestyleListingSection = ({
  activeTab = "All posts",
  initialPosts = [],
  initialPagination = { page: 1, limit: 6, total: 0, totalPages: 0 },
}: LifestyleListingSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [posts, setPosts] = useState(initialPosts);
  const [pagination, setPagination] = useState(initialPagination);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch posts when page changes
  const fetchPosts = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await getLifestylePostsAction({
        page,
        limit: 6,
        status: "published",
      });

      if (result.success && result.data) {
        setPosts(result.data.posts);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (page: number) => {
    // Update URL with page parameter
    const params = new URLSearchParams(window.location.search);
    params.set("page", page.toString());
    router.push(`${pathname}?${params.toString()}`);

    // Fetch new posts
    fetchPosts(page);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleTabChange = (tab: TabType) => {
    if (tab === "All posts") {
      router.push("/lifestyle");
    } else if (tab === "Videos") {
      router.push("/lifestyle/videos");
    }
  };

  // Transform database posts to match the expected format
  const transformedPosts = posts.map((post: any) => ({
    id: post.id,
    author: post.author
      ? `${post.author.firstName || ""} ${post.author.lastName || ""}`.trim() ||
        "Anonymous"
      : "Anonymous",
    date: new Date(post.publishedAt || post.createdAt).toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ),
    title: post.title,
    description: post.description || post.content.substring(0, 150) + "...",
    image: post.featuredImage || "/images/news-sample-image.jpg",
    categories: post.categories || [],
    isVideo: false,
  }));

  const lifestyleTabs = [
    { id: "All posts" as TabType, label: "All posts" },
    { id: "Videos" as TabType, label: "Videos" },
  ];

  return (
    <section className="bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-8">
        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-orange-500 border-t-transparent"></div>
          </div>
        ) : transformedPosts.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20">
            <p className="text-neutral-600 dark:text-neutral-400 text-lg">
              No posts found. Check back later for new content!
            </p>
          </div>
        ) : (
          <>
            {/* Lifestyle Content Grid */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
            >
              {transformedPosts.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="h-full"
                >
                  {activeTab === "Videos" || item.isVideo ? (
                    <LifestyleVideoCard video={item} index={index} />
                  ) : (
                    <LifestyleArticleCard article={item} index={index} />
                  )}
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <Pagination
                currentPage={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </div>
    </section>
  );
};

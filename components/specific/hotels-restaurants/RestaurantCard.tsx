"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star, Clock, Phone, Globe } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Restaurant } from "@/lib/db/schema";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";

interface RestaurantCardProps {
  restaurant: Restaurant;
  index: number;
}

export const RestaurantCard = ({ restaurant, index }: RestaurantCardProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (status === "authenticated" && session?.user?.id) {
        const result = await checkBookmarkStatusAction(
          "restaurant",
          restaurant.id
        );
        if (result.success) {
          setIsBookmarked(result.isBookmarked);
        }
      }
      setIsCheckingStatus(false);
    };

    checkStatus();
  }, [restaurant.id, session, status]);

  const getPriceRangeColor = (range: string) => {
    switch (range) {
      case "$":
        return "text-green-600 dark:text-green-400";
      case "$$":
        return "text-yellow-600 dark:text-yellow-400";
      case "$$$":
        return "text-orange-600 dark:text-orange-400";
      case "$$$$":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-neutral-600 dark:text-neutral-400";
    }
  };

  const handleCardClick = () => {
    router.push(`/hotels-restaurants/restaurants/${restaurant.id}`);
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (status === "unauthenticated") {
      toast.error("Please sign in to bookmark restaurants");
      router.push("/login");
      return;
    }

    if (status === "loading" || isTogglingBookmark) {
      return;
    }

    setIsTogglingBookmark(true);

    try {
      const result = await toggleBookmarkAction({
        contentType: "restaurant",
        contentId: restaurant.id,
      });

      if (result.success) {
        setIsBookmarked(result.isBookmarked || false);
        toast.success(
          result.isBookmarked
            ? "Restaurant added to bookmarks"
            : "Restaurant removed from bookmarks"
        );
      } else {
        toast.error(result.message || "Failed to update bookmark");
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsTogglingBookmark(false);
    }
  };

  // Parse rating from string to number
  const rating = parseFloat(restaurant.rating || "0");
  // Get the featured image or first gallery image
  const image =
    restaurant.featuredImage ||
    (Array.isArray(restaurant.images) && restaurant.images[0]) ||
    "/images/hotel-image-one.jpg";
  // Get contact phone from contact object
  const contactPhone = restaurant.contact?.phone || "N/A";

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-neutral-100 dark:border-neutral-700 hover:-translate-y-1 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={image}
          alt={restaurant.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          disabled={isTogglingBookmark}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Heart
            className={`w-4 h-4 transition-all ${
              isBookmarked
                ? "fill-red-500 text-red-500"
                : "text-neutral-600 dark:text-neutral-400"
            } ${isTogglingBookmark ? "scale-90" : "scale-100"}`}
          />
        </button>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-warm-200 to-peach-200 text-white rounded-full shadow-lg">
            {restaurant.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white line-clamp-1 flex-1">
              {restaurant.name}
            </h3>
            <span
              className={`text-lg font-bold ml-2 ${getPriceRangeColor(restaurant.priceRange)}`}
            >
              {restaurant.priceRange}
            </span>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {restaurant.description}
          </p>
        </div>

        {/* Cuisine Type */}
        <div className="mb-3">
          <span className="inline-block px-2 py-1 text-xs font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full">
            {restaurant.cuisine}
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {restaurant.location}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-neutral-300 dark:text-neutral-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {rating.toFixed(1)}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            ({restaurant.reviewCount || 0} reviews)
          </span>
        </div>

        {/* Details */}
        <div className="space-y-3 pt-4 border-t border-neutral-100 dark:border-neutral-700 mt-auto">
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Clock className="w-4 h-4 text-warm-200" />
            <span>{restaurant.openingHours || "Hours not specified"}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
            <Phone className="w-4 h-4 text-peach-200" />
            <span>{contactPhone}</span>
          </div>
          <div className="flex items-center justify-between mt-4">
            <button className="px-4 py-2 bg-gradient-to-r from-warm-200 to-peach-200 text-white text-sm font-semibold rounded-lg hover:from-warm-300 hover:to-peach-300 transition-all duration-200 shadow-lg hover:shadow-xl">
              View Menu
            </button>
            <button className="px-4 py-2 border-2 border-warm-200 text-warm-200 text-sm font-semibold rounded-lg hover:bg-warm-200 hover:text-white transition-all duration-200">
              Reserve
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

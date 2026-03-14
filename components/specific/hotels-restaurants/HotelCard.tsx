"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star, Wifi, Car, Coffee } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Hotel } from "@/lib/db/schema";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";

interface HotelCardProps {
  hotel: Hotel;
  index: number;
}

export const HotelCard = ({ hotel, index }: HotelCardProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);

  // Check bookmark status on mount
  useEffect(() => {
    const checkStatus = async () => {
      if (status === "authenticated" && session?.user?.id) {
        const result = await checkBookmarkStatusAction("hotel", hotel.id);
        if (result.success) {
          setIsBookmarked(result.isBookmarked);
        }
      }
      setIsCheckingStatus(false);
    };

    checkStatus();
  }, [hotel.id, session, status]);

  const getAmenityIcon = (amenity: string) => {
    const lowerAmenity = amenity.toLowerCase();
    if (lowerAmenity.includes("wi-fi") || lowerAmenity.includes("wifi")) {
      return <Wifi className="w-4 h-4" />;
    }
    if (lowerAmenity.includes("parking") || lowerAmenity.includes("park")) {
      return <Car className="w-4 h-4" />;
    }
    if (lowerAmenity.includes("breakfast") || lowerAmenity.includes("meal")) {
      return <Coffee className="w-4 h-4" />;
    }
    return null;
  };

  const handleCardClick = () => {
    router.push(`/hotels-restaurants/hotels/${hotel.id}`);
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();

    // Check if user is authenticated
    if (status === "unauthenticated") {
      toast.error("Please sign in to bookmark hotels");
      router.push("/login");
      return;
    }

    if (status === "loading" || isTogglingBookmark) {
      return;
    }

    setIsTogglingBookmark(true);

    try {
      const result = await toggleBookmarkAction({
        contentType: "hotel",
        contentId: hotel.id,
      });

      if (result.success) {
        setIsBookmarked(result.isBookmarked || false);
        toast.success(
          result.isBookmarked
            ? "Hotel added to bookmarks"
            : "Hotel removed from bookmarks"
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
  const rating = parseFloat(hotel.rating || "0");
  // Get amenities array (ensure it's an array)
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
  // Get the featured image or first gallery image
  const image =
    hotel.featuredImage ||
    (Array.isArray(hotel.images) && hotel.images[0]) ||
    "/images/hotel-image-one.jpg";

  return (
    <div
      onClick={handleCardClick}
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-neutral-100 dark:border-neutral-700 hover:-translate-y-1 h-full flex flex-col"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={image}
          alt={hotel.name}
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
            {hotel.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-1 line-clamp-1">
            {hotel.name}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
            {hotel.description}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-1 mb-3">
          <MapPin className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {hotel.location}
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
            ({hotel.reviewCount || 0} reviews)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 mb-4">
          {amenities.slice(0, 3).map((amenity, i) => (
            <div
              key={i}
              className="flex items-center gap-1 text-neutral-600 dark:text-neutral-400"
            >
              {getAmenityIcon(amenity)}
              <span className="text-xs">{amenity}</span>
            </div>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700 mt-auto">
          <div>
            <span className="text-2xl font-bold bg-gradient-to-r from-warm-200 to-peach-200 bg-clip-text text-transparent">
              {hotel.currency}
              {hotel.pricePerNight.toLocaleString()}
            </span>
            <span className="text-sm text-neutral-500 dark:text-neutral-400 ml-1">
              {hotel.currency === "₦" ? "per night" : "AUD total"}
            </span>
          </div>
          <button className="px-4 py-2 bg-gradient-to-r from-warm-200 to-peach-200 text-white text-sm font-semibold rounded-lg hover:from-warm-300 hover:to-peach-300 transition-all duration-200 shadow-lg hover:shadow-xl">
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

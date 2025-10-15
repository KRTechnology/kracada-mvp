"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Coffee,
  Share,
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Users,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/common/button";
import { CommentsSection } from "./CommentsSection";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Hotel } from "@/lib/db/schema";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";

interface HotelDetailContentProps {
  hotel: Hotel;
}

// Sample hotel detail data - in real app, this would come from API
const hotelDetailData = {
  id: "1",
  name: "Eko Hotel & Suites",
  description:
    "Experience luxury waterfront living at Eko Hotel & Suites, Lagos' premier destination for discerning travelers. Nestled along the stunning Lagos lagoon, our hotel offers world-class amenities, exceptional service, and breathtaking views that create unforgettable memories.",
  fullDescription:
    "Eko Hotel & Suites stands as a beacon of luxury and sophistication in the heart of Lagos, Nigeria. Our waterfront location provides guests with stunning panoramic views of the Lagos lagoon while maintaining easy access to the city's business and entertainment districts. Each of our elegantly appointed rooms and suites combines modern comfort with traditional Nigerian hospitality, featuring premium furnishings, state-of-the-art technology, and thoughtful amenities designed to exceed your expectations. Whether you're visiting for business or leisure, our comprehensive facilities including multiple restaurants, conference rooms, spa services, and recreational activities ensure a memorable stay.",
  images: [
    "/images/detail-image-one.jpg",
    "/images/detail-image-two.jpg",
    "/images/hotel-image-one.jpg",
    "/images/hotel-image-two.jpg",
    "/images/hotel-image-three.jpg",
  ],
  location: "Victoria Island, Lagos",
  rating: 4.5,
  reviewCount: 1247,
  pricePerNight: 85000,
  currency: "₦",
  category: "Luxury Hotel",
  amenities: [
    "Free Wi-Fi",
    "Parking",
    "Breakfast",
    "Swimming Pool",
    "Spa & Wellness",
    "Fitness Center",
    "Restaurant",
    "Bar",
    "Conference Rooms",
    "24/7 Room Service",
    "Laundry Service",
    "Airport Shuttle",
  ],
  features: [
    "Waterfront Location",
    "Lagos Lagoon Views",
    "Business Center",
    "Event Facilities",
    "Multiple Dining Options",
    "Premium Suites Available",
  ],
  policies: {
    checkIn: "3:00 PM",
    checkOut: "12:00 PM",
    cancellation: "Free cancellation up to 24 hours before check-in",
    pets: "Pets not allowed",
    smoking: "Non-smoking property",
  },
  contact: {
    phone: "+234 1 277 7000",
    email: "reservations@ekohotels.com",
    website: "www.ekohotels.com",
  },
};

export const HotelDetailContent = ({ hotel }: HotelDetailContentProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
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

  // Parse rating and prepare data
  const rating = parseFloat(hotel.rating || "0");
  const images = [
    hotel.featuredImage,
    ...(Array.isArray(hotel.images) ? hotel.images : []),
  ].filter(Boolean);
  const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
  const features = Array.isArray(hotel.features) ? hotel.features : [];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleBookmarkClick = async () => {
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

  return (
    <div className="min-h-screen bg-white dark:bg-dark pt-20">
      {/* Header with Back Button */}
      <div className="border-b border-neutral-200 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-warm-200 dark:hover:text-warm-200 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to hotels</span>
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hotel Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 text-sm font-semibold bg-gradient-to-r from-warm-200 to-peach-200 text-white rounded-full mb-3">
                  {hotel.category}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                  {hotel.name}
                </h1>
                <div className="flex items-center gap-4 text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{hotel.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
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
                    <span className="font-medium">{rating.toFixed(1)}</span>
                    <span>({hotel.reviewCount || 0} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {hotel.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleBookmarkClick}
                disabled={isTogglingBookmark}
                className="w-12 h-12 rounded-full border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-warm-200 dark:hover:border-warm-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Heart
                  className={`w-5 h-5 transition-all ${
                    isBookmarked
                      ? "fill-red-500 text-red-500"
                      : "text-neutral-600 dark:text-neutral-400"
                  } ${isTogglingBookmark ? "scale-90" : "scale-100"}`}
                />
              </button>
              <button className="w-12 h-12 rounded-full border-2 border-neutral-200 dark:border-neutral-700 flex items-center justify-center hover:border-warm-200 dark:hover:border-warm-200 transition-colors">
                <Share className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Image Gallery */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <div className="relative h-96 md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800">
            <Image
              src={images[currentImageIndex] || "/images/hotel-image-one.jpg"}
              alt={hotel.name}
              fill
              className="object-cover"
            />

            {/* Navigation Buttons */}
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronLeft className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
            >
              <ChevronRight className="w-6 h-6 text-neutral-700 dark:text-neutral-300" />
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/60 text-white text-sm rounded-full">
              {currentImageIndex + 1} of {hotel.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {hotel.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors ${
                  index === currentImageIndex
                    ? "border-warm-200"
                    : "border-neutral-200 dark:border-neutral-700"
                }`}
              >
                <Image
                  src={image}
                  alt={`${hotel.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">
                About this hotel
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {hotel.fullDescription}
              </p>
            </motion.div>

            {/* Amenities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Amenities & Services
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {amenities.map((amenity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-warm-200 rounded-full"></div>
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {amenity}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Special Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="p-4 border border-neutral-200 dark:border-neutral-700 rounded-xl hover:border-warm-200 dark:hover:border-warm-200 transition-colors"
                  >
                    <span className="text-neutral-700 dark:text-neutral-300 font-medium">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Hotel Policies
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Check-in
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {hotel.policies.checkIn}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Check-out
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {hotel.policies.checkOut}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Cancellation
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {hotel.policies.cancellation}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Pets
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {hotel.policies.pets}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Smoking
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {hotel.policies.smoking}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <CommentsSection itemId={hotel.id} itemType="hotel" />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-8"
            >
              {/* Booking Card */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold bg-gradient-to-r from-warm-200 to-peach-200 bg-clip-text text-transparent">
                    {hotel.currency}
                    {hotel.pricePerNight.toLocaleString()}
                  </div>
                  <div className="text-neutral-500 dark:text-neutral-400">
                    per night
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Check-in
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        Select date
                      </div>
                    </div>
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Check-out
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        Select date
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Guests
                    </div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      1 guest
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl">
                  Reserve Now
                </Button>

                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                  You won't be charged yet
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Phone:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white">
                      {hotel.contact.phone}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Email:{" "}
                    </span>
                    <span className="text-neutral-900 dark:text-white">
                      {hotel.contact.email}
                    </span>
                  </div>
                  <div className="text-sm">
                    <span className="text-neutral-500 dark:text-neutral-400">
                      Website:{" "}
                    </span>
                    <span className="text-warm-200">
                      {hotel.contact.website}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

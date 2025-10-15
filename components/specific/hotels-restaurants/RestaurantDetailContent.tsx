"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Clock,
  Phone,
  Share,
  Heart,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Utensils,
  Globe,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/common/button";
import { CommentsSection } from "./CommentsSection";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Restaurant } from "@/lib/db/schema";
import {
  toggleBookmarkAction,
  checkBookmarkStatusAction,
} from "@/app/(dashboard)/actions/bookmark-actions";
import { toast } from "sonner";

interface RestaurantDetailContentProps {
  restaurant: Restaurant;
}

// Sample restaurant detail data - in real app, this would come from API
const restaurantDetailData = {
  id: "1",
  name: "Sky Restaurant & Bar",
  description:
    "Experience fine dining at its pinnacle with Sky Restaurant & Bar, Lagos' premier rooftop destination offering panoramic city views, international cuisine, and premium cocktails in an atmosphere of sophisticated elegance.",
  fullDescription:
    "Perched high above the bustling streets of Victoria Island, Sky Restaurant & Bar represents the epitome of fine dining in Lagos. Our rooftop location provides breathtaking 360-degree views of the city skyline and Lagos lagoon, creating an unforgettable backdrop for any dining experience. Our world-class culinary team crafts exquisite dishes that blend international flavors with local Nigerian ingredients, resulting in a unique and sophisticated menu that caters to the most discerning palates. Whether you're enjoying a romantic dinner under the stars, hosting a business lunch, or celebrating a special occasion, Sky Restaurant & Bar delivers an unparalleled experience that combines exceptional cuisine, premium beverages, and impeccable service in one of the most stunning settings in West Africa.",
  images: [
    "/images/detail-image-one.jpg",
    "/images/detail-image-two.jpg",
    "/images/hotel-image-one.jpg",
    "/images/hotel-image-two.jpg",
    "/images/hotel-image-three.jpg",
  ],
  location: "Victoria Island, Lagos",
  rating: 4.6,
  reviewCount: 892,
  priceRange: "$$$",
  cuisine: "International",
  category: "Fine Dining",
  openingHours: "6:00 PM - 12:00 AM",
  contact: {
    phone: "+234 801 234 5678",
    email: "reservations@skyrestaurant.ng",
    website: "www.skyrestaurant.ng",
  },
  features: [
    "Rooftop Dining",
    "Panoramic City Views",
    "Premium Cocktail Bar",
    "Private Dining Rooms",
    "Live Entertainment",
    "Valet Parking",
  ],
  menuHighlights: [
    {
      category: "Appetizers",
      items: [
        {
          name: "Lagos Lagoon Prawns",
          description: "Grilled tiger prawns with pepper sauce",
          price: "₦8,500",
        },
        {
          name: "Suya Beef Carpaccio",
          description: "Thinly sliced beef with suya spice",
          price: "₦12,000",
        },
        {
          name: "Plantain & Goat Cheese Bruschetta",
          description: "Caramelized plantain with local goat cheese",
          price: "₦6,500",
        },
      ],
    },
    {
      category: "Main Courses",
      items: [
        {
          name: "Grilled Croaker with Jollof Risotto",
          description: "Fresh local croaker with spiced risotto",
          price: "₦18,500",
        },
        {
          name: "Wagyu Beef with Yam Puree",
          description: "Premium wagyu beef with native yam puree",
          price: "₦35,000",
        },
        {
          name: "Pan-Seared Chicken Suya Style",
          description: "Free-range chicken with suya marinade",
          price: "₦15,500",
        },
      ],
    },
    {
      category: "Desserts",
      items: [
        {
          name: "Coconut Panna Cotta",
          description: "Fresh coconut with palm wine reduction",
          price: "₦5,500",
        },
        {
          name: "Chocolate Plantain Tart",
          description: "Dark chocolate with caramelized plantain",
          price: "₦6,000",
        },
      ],
    },
  ],
  specialties: [
    "Contemporary Nigerian Cuisine",
    "Premium Steaks & Seafood",
    "Craft Cocktails",
    "Wine Pairing Dinners",
    "Chef's Tasting Menu",
    "Weekend Brunch",
  ],
  ambiance: [
    "Romantic Atmosphere",
    "Business Friendly",
    "Special Occasions",
    "Date Night Perfect",
    "Instagram Worthy",
    "City Views",
  ],
  policies: {
    reservations: "Recommended, especially for dinner",
    dressCode: "Smart casual to formal",
    minimumAge: "18+ after 9:00 PM",
    cancellation: "24-hour cancellation policy",
    payment: "All major cards accepted",
  },
};

export const RestaurantDetailContent = ({
  restaurant,
}: RestaurantDetailContentProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const [isTogglingBookmark, setIsTogglingBookmark] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState(0);

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

  // Parse rating and prepare data
  const rating = parseFloat(restaurant.rating || "0");
  const images = [
    restaurant.featuredImage,
    ...(Array.isArray(restaurant.images) ? restaurant.images : []),
  ].filter(Boolean);
  const specialties = Array.isArray(restaurant.specialties)
    ? restaurant.specialties
    : [];
  const ambiance = Array.isArray(restaurant.ambiance)
    ? restaurant.ambiance
    : [];
  const menuHighlights = Array.isArray(restaurant.menuHighlights)
    ? restaurant.menuHighlights
    : [];
  const contactPhone = restaurant.contact?.phone || "N/A";
  const contactEmail = restaurant.contact?.email || "";
  const contactWebsite = restaurant.contact?.website || "";

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleBookmarkClick = async () => {
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
            <span className="font-medium">Back to restaurants</span>
          </motion.button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Restaurant Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1">
              <div className="mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="inline-block px-3 py-1 text-sm font-semibold bg-gradient-to-r from-warm-200 to-peach-200 text-white rounded-full">
                    {restaurant.category}
                  </span>
                  <span className="inline-block px-2 py-1 text-sm font-medium bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full">
                    {restaurant.cuisine}
                  </span>
                  <span
                    className={`text-2xl font-bold ${getPriceRangeColor(restaurant.priceRange)}`}
                  >
                    {restaurant.priceRange}
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-2">
                  {restaurant.name}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-neutral-600 dark:text-neutral-400">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{restaurant.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.openingHours}</span>
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
                    <span>({restaurant.reviewCount || 0} reviews)</span>
                  </div>
                </div>
              </div>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {restaurant.description}
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
              alt={restaurant.name}
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
              {currentImageIndex + 1} of {restaurant.images.length}
            </div>
          </div>

          {/* Thumbnail Strip */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {restaurant.images.map((image, index) => (
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
                  alt={`${restaurant.name} ${index + 1}`}
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
                About this restaurant
              </h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {restaurant.fullDescription}
              </p>
            </motion.div>

            {/* Menu Highlights */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Menu Highlights
              </h2>

              {/* Menu Category Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {restaurant.menuHighlights.map((category, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveMenuCategory(index)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors whitespace-nowrap ${
                      activeMenuCategory === index
                        ? "bg-gradient-to-r from-warm-200 to-peach-200 text-white"
                        : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                    }`}
                  >
                    {category.category}
                  </button>
                ))}
              </div>

              {/* Menu Items */}
              <div className="space-y-4">
                {restaurant.menuHighlights[activeMenuCategory].items.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-start p-4 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-neutral-900 dark:text-white mb-1">
                          {item.name}
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          {item.description}
                        </p>
                      </div>
                      <div className="ml-4 text-lg font-bold text-warm-200">
                        {item.price}
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>

            {/* Specialties */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Our Specialties
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {restaurant.specialties.map((specialty, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-lg"
                  >
                    <Utensils className="w-5 h-5 text-warm-200" />
                    <span className="text-neutral-700 dark:text-neutral-300">
                      {specialty}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Ambiance & Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Ambiance & Features
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Perfect For
                  </h3>
                  <div className="space-y-2">
                    {restaurant.ambiance.map((item, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-warm-200 rounded-full"></div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-white mb-3">
                    Special Features
                  </h3>
                  <div className="space-y-2">
                    {restaurant.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-peach-200 rounded-full"></div>
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Policies */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-6">
                Restaurant Policies
              </h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Reservations
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {restaurant.policies.reservations}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Dress Code
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {restaurant.policies.dressCode}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Age Requirement
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {restaurant.policies.minimumAge}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-neutral-200 dark:border-neutral-700">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Cancellation
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {restaurant.policies.cancellation}
                  </span>
                </div>
                <div className="flex justify-between items-center py-3">
                  <span className="text-neutral-600 dark:text-neutral-400">
                    Payment
                  </span>
                  <span className="text-neutral-900 dark:text-white font-medium">
                    {restaurant.policies.payment}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Comments Section */}
            <CommentsSection itemId={restaurant.id} itemType="restaurant" />
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="sticky top-8"
            >
              {/* Reservation Card */}
              <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg border border-neutral-200 dark:border-neutral-700 p-6 mb-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
                    Make a Reservation
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    Book your table for an unforgettable dining experience
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Date
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        Select date
                      </div>
                    </div>
                    <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                      <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                        Time
                      </div>
                      <div className="text-sm font-medium text-neutral-900 dark:text-white">
                        Select time
                      </div>
                    </div>
                  </div>
                  <div className="p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                    <div className="text-xs text-neutral-500 dark:text-neutral-400 mb-1">
                      Party Size
                    </div>
                    <div className="text-sm font-medium text-neutral-900 dark:text-white">
                      2 guests
                    </div>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-3">
                  Reserve Table
                </Button>

                <Button className="w-full border-2 border-warm-200 text-warm-200 hover:bg-warm-200 hover:text-white font-semibold py-4 rounded-xl transition-all duration-300">
                  View Full Menu
                </Button>

                <div className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-3">
                  Free cancellation up to 2 hours before
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-neutral-50 dark:bg-neutral-800 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-warm-200" />
                    <span className="text-neutral-900 dark:text-white">
                      {restaurant.contact.phone}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Globe className="w-4 h-4 text-peach-200" />
                    <span className="text-warm-200">
                      {restaurant.contact.website}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Clock className="w-4 h-4 text-orange-500" />
                    <span className="text-neutral-900 dark:text-white">
                      {restaurant.openingHours}
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

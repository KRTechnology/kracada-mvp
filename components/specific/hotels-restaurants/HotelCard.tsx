"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, Star, Wifi, Car, Coffee } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface Hotel {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  category: string;
}

interface HotelCardProps {
  hotel: Hotel;
  index: number;
}

export const HotelCard = ({ hotel, index }: HotelCardProps) => {
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const getAmenityIcon = (amenity: string) => {
    switch (amenity.toLowerCase()) {
      case "wi-fi":
        return <Wifi className="w-4 h-4" />;
      case "parking":
        return <Car className="w-4 h-4" />;
      case "breakfast":
        return <Coffee className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleCardClick = () => {
    router.push(`/hotels-restaurants/hotels/${hotel.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      onClick={handleCardClick}
      className="bg-white dark:bg-neutral-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-neutral-100 dark:border-neutral-700 hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative h-48 md:h-56 overflow-hidden">
        <Image
          src={hotel.image}
          alt={hotel.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Bookmark Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsBookmarked(!isBookmarked);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 transition-colors"
        >
          <Heart
            className={`w-4 h-4 ${
              isBookmarked
                ? "fill-red-500 text-red-500"
                : "text-neutral-600 dark:text-neutral-400"
            }`}
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
      <div className="p-6">
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
                  i < Math.floor(hotel.rating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-neutral-300 dark:text-neutral-600"
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-neutral-900 dark:text-white">
            {hotel.rating}
          </span>
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            ({hotel.reviewCount} reviews)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex items-center gap-3 mb-4">
          {hotel.amenities.slice(0, 3).map((amenity, i) => (
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
        <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
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
    </motion.div>
  );
};

"use client";

import { MoreVertical, MapPin, Star, DollarSign } from "lucide-react";
import { HotelBookmark } from "@/lib/data/bookmarks-data";
import { lineClamp } from "@/lib/utils";

interface HotelCardProps {
  hotel: HotelBookmark;
}

export function HotelCard({ hotel }: HotelCardProps) {
  return (
    <div className="bg-white dark:bg-dark rounded-lg border border-neutral-50 dark:border-[#232020] p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        {/* Hotel Image Placeholder */}
        <div className="w-20 h-16 bg-neutral-50 dark:bg-neutral-700 rounded-lg flex items-center justify-center mr-3">
          <div className="w-16 h-12 bg-neutral-100 dark:bg-neutral-600 rounded"></div>
        </div>

        {/* Hotel Name */}
        <div className="flex-1">
          <h3
            className="font-semibold text-neutral-900 dark:text-neutral-100 text-base mb-1"
            style={lineClamp(2)}
          >
            {hotel.name}
          </h3>
        </div>

        {/* More Options Icon */}
        <button className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors">
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Location */}
      <div className="flex items-center mb-2">
        <MapPin className="w-3 h-3 text-neutral-500 dark:text-white mr-1" />
        <span className="text-neutral-600 dark:text-white text-sm">
          {hotel.location}
        </span>
      </div>

      {/* Rating and Price */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <Star className="w-3 h-3 text-yellow-500 mr-1" />
          <span className="text-neutral-600 dark:text-white text-sm">
            {hotel.rating}
          </span>
        </div>
        <div className="flex items-center">
          <DollarSign className="w-3 h-3 text-neutral-500 dark:text-white mr-1" />
          <span className="text-neutral-600 dark:text-white text-sm font-medium">
            {hotel.price}
          </span>
        </div>
      </div>

      {/* Hotel Description */}
      <p
        className="text-neutral-600 dark:text-white text-sm mb-3"
        style={lineClamp(2)}
      >
        {hotel.description}
      </p>

      {/* Amenities */}
      <div className="flex flex-wrap gap-1 mb-3">
        {hotel.amenities.slice(0, 3).map((amenity, index) => (
          <span
            key={index}
            className="px-2 py-1 text-xs rounded-md bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text"
          >
            {amenity}
          </span>
        ))}
        {hotel.amenities.length > 3 && (
          <span className="px-2 py-1 text-xs rounded-md bg-skillPill-light-bg dark:bg-skillPill-dark-bg text-skillPill-light-text dark:text-skillPill-dark-text">
            +{hotel.amenities.length - 3} more
          </span>
        )}
      </div>

      {/* Check-in/Check-out */}
      <div className="flex justify-between items-center text-xs text-neutral-500 dark:text-white">
        <span>Check-in: {hotel.checkIn}</span>
        <span>Check-out: {hotel.checkOut}</span>
      </div>
    </div>
  );
}

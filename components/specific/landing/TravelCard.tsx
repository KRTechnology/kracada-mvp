"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Heart, Star } from "lucide-react";

interface TravelItem {
  id: number;
  category: string;
  title: string;
  rating: number;
  reviewCount: number;
  location: string;
  price: number;
  currency: string;
  image: string;
  badge?: string;
}

interface TravelCardProps {
  travel: TravelItem;
  index: number;
}

const TravelCard = ({ travel, index }: TravelCardProps) => {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        delay: index * 0.1,
      },
    },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="bg-white dark:bg-[#121212] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
    >
      {/* Heart Icon - positioned on card */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white dark:bg-neutral-800 bg-opacity-90 dark:bg-opacity-90 rounded-full p-2 shadow-sm hover:bg-opacity-100 dark:hover:bg-opacity-100 transition-all"
        >
          <Heart className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
        </motion.button>
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {/* Desktop Layout */}
        <div className="hidden lg:flex">
          {/* Image */}
          <div className="relative w-64 h-48 flex-shrink-0">
            <Image
              src={travel.image}
              alt={travel.title}
              fill
              className="object-cover"
              sizes="256px"
            />
            {/* Badge */}
            {travel.badge && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-white dark:bg-neutral-800 px-2 py-1 rounded-full text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-sm">
                  {travel.badge}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 p-6 pr-12">
            <div className="h-full flex flex-col">
              {/* Price */}
              <div className="mb-2">
                <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                  ${travel.price}{" "}
                  <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
                    {travel.currency} total
                  </span>
                </span>
              </div>

              {/* Category */}
              <p className="text-sm text-warm-200 mb-2 font-medium">
                {travel.category}
              </p>

              {/* Title */}
              <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3 leading-tight">
                {travel.title}
              </h3>

              {/* Rating */}
              <div className="flex items-center mb-3">
                <div className="flex items-center mr-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`w-4 h-4 ${
                        star <= Math.floor(travel.rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300 dark:text-gray-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mr-1">
                  {travel.rating}
                </span>
                <span className="text-sm text-neutral-600 dark:text-neutral-400">
                  {travel.reviewCount} reviews
                </span>
              </div>

              {/* Location */}
              <div className="flex items-center text-neutral-600 dark:text-neutral-400 mt-auto">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{travel.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="lg:hidden">
          {/* Image */}
          <div className="relative h-64">
            <Image
              src={travel.image}
              alt={travel.title}
              fill
              className="object-cover"
              sizes="100vw"
            />
            {/* Badge */}
            {travel.badge && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-white dark:bg-neutral-800 px-2 py-1 rounded-full text-xs font-medium text-neutral-800 dark:text-neutral-200 shadow-sm">
                  {travel.badge}
                </span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 pr-12">
            {/* Price */}
            <div className="mb-2">
              <span className="text-lg font-bold text-neutral-800 dark:text-neutral-200">
                ${travel.price}{" "}
                <span className="text-sm font-normal text-neutral-600 dark:text-neutral-400">
                  {travel.currency} total
                </span>
              </span>
            </div>

            {/* Category */}
            <p className="text-sm text-warm-200 mb-2 font-medium">
              {travel.category}
            </p>

            {/* Title */}
            <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-3 leading-tight">
              {travel.title}
            </h3>

            {/* Rating */}
            <div className="flex items-center mb-3">
              <div className="flex items-center mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.floor(travel.rating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-300 dark:text-gray-600"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200 mr-1">
                {travel.rating}
              </span>
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {travel.reviewCount} reviews
              </span>
            </div>

            {/* Location */}
            <div className="flex items-center text-neutral-600 dark:text-neutral-400">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="text-sm">{travel.location}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TravelCard;

"use client";

import { motion } from "framer-motion";
import { Plane, Compass, Map, Star } from "lucide-react";
import Image from "next/image";

export const TravelTourismHeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-cyan-400 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-teal-400 rounded-full blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative">
        {/* Header Content */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="space-y-6"
          >
            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-500 bg-clip-text text-transparent leading-tight"
            >
              Travel & Tourism
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto"
            >
              Book your next stay at one of our properties
            </motion.p>

            {/* Stats/Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap justify-center items-center gap-8 mt-8"
            >
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Plane className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Flight Bookings</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Compass className="w-5 h-5 text-cyan-500" />
                <span className="text-sm font-medium">Travel Packages</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Star className="w-5 h-5 text-teal-500" />
                <span className="text-sm font-medium">Premium Service</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Map className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Global Destinations</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Hero Image Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <div className="relative h-[400px] md:h-[500px] lg:h-[600px]">
              <Image
                src="/images/travel-tourism-header-image.jpg"
                alt="Travel & Tourism - Beautiful tropical destination"
                fill
                className="object-cover"
                priority
              />
              {/* Overlay with gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

              {/* Floating Badge */}
              <div className="absolute bottom-6 left-6 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm rounded-2xl p-4 shadow-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                    <Plane className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      Start Your Journey
                    </p>
                    <p className="text-xs text-neutral-600 dark:text-neutral-400">
                      Discover amazing destinations
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

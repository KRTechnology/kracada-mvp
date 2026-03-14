"use client";

import { motion } from "framer-motion";
import { MapPin, Star, Utensils, Hotel } from "lucide-react";

export const HotelsRestaurantsHeroSection = () => {
  return (
    <section className="w-full bg-gradient-to-br from-warm-50 via-orange-50 to-peach-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900 relative overflow-hidden pt-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-warm-200 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-peach-200 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-orange-300 rounded-full blur-2xl"></div>
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
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-gradient-to-r from-warm-200 via-peach-200 to-orange-500 bg-clip-text text-transparent leading-tight"
            >
              Hotels & Restaurants
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-xl md:text-2xl text-neutral-700 dark:text-neutral-300 leading-relaxed max-w-3xl mx-auto"
            >
              Discover amazing accommodations and dining experiences in Lagos,
              Nigeria
            </motion.p>

            {/* Stats/Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
              className="flex flex-wrap justify-center items-center gap-8 mt-8"
            >
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Hotel className="w-5 h-5 text-warm-200" />
                <span className="text-sm font-medium">18+ Premium Hotels</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Utensils className="w-5 h-5 text-peach-200" />
                <span className="text-sm font-medium">18+ Top Restaurants</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <Star className="w-5 h-5 text-orange-500" />
                <span className="text-sm font-medium">Verified Reviews</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                <MapPin className="w-5 h-5 text-warm-200" />
                <span className="text-sm font-medium">Lagos Locations</span>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Google Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          <div className="bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl overflow-hidden border border-neutral-200 dark:border-neutral-700">
            <div className="p-6 bg-gradient-to-r from-warm-200 to-peach-200">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Explore Lagos Hospitality
              </h3>
              <p className="text-white/90 text-sm mt-1">
                Find hotels and restaurants across Lagos, Nigeria
              </p>
            </div>
            <div className="h-[500px] md:h-[600px] bg-neutral-100 dark:bg-neutral-800">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126851.02204826682!2d3.3396956999999998!3d6.4550575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sus!4v1705842000000!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Lagos Map - Hotels & Restaurants"
                className="w-full h-full"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

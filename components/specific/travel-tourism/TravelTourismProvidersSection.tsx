"use client";

import { motion } from "framer-motion";
import Image from "next/image";

export const TravelTourismProvidersSection = () => {
  const providers = [
    {
      name: "InterContinental Hotels & Resorts",
      logo: "/images/intercontinental-image.png",
      alt: "InterContinental Hotels & Resorts",
    },
    {
      name: "Hyatt",
      logo: "/images/hyatt-image.png",
      alt: "Hyatt Hotels",
    },
    {
      name: "Booking.com",
      logo: "/images/booking-image.png",
      alt: "Booking.com",
    },
    {
      name: "Trip.com",
      logo: "/images/trip-image.png",
      alt: "Trip.com",
    },
    {
      name: "Hotels.com",
      logo: "/images/booking-image.png",
      alt: "Hotels.com",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="py-16 lg:py-24 bg-white dark:bg-dark">
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 dark:text-neutral-200 mb-4">
              Get the best prices from top hotel providers
            </h2>
          </motion.div>

          {/* Desktop Layout - Single Row */}
          <motion.div
            variants={itemVariants}
            className="hidden md:flex justify-center items-center gap-8 lg:gap-12 flex-wrap"
          >
            {providers.map((provider, index) => (
              <motion.div
                key={provider.name}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="flex items-center justify-center p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300"
              >
                <Image
                  src={provider.logo}
                  alt={provider.alt}
                  width={160}
                  height={60}
                  className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Mobile Layout - Two Rows */}
          <div className="md:hidden space-y-6">
            {/* First Row - 3 logos */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-4"
            >
              {providers.slice(0, 3).map((provider, index) => (
                <motion.div
                  key={provider.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300"
                >
                  <Image
                    src={provider.logo}
                    alt={provider.alt}
                    width={100}
                    height={40}
                    className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </motion.div>

            {/* Second Row - 2 logos */}
            <motion.div
              variants={itemVariants}
              className="flex justify-center items-center gap-4"
            >
              {providers.slice(3, 5).map((provider, index) => (
                <motion.div
                  key={provider.name}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-center p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-300"
                >
                  <Image
                    src={provider.logo}
                    alt={provider.alt}
                    width={100}
                    height={40}
                    className="object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

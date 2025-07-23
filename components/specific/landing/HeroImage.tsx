"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const HeroImage = () => {
  return (
    <div className="relative w-full h-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.8,
          ease: "easeOut",
          delay: 0.3,
        }}
        className="relative"
      >
        {/* Floating Animation Wrapper */}
        <motion.div
          animate={{
            y: [0, -10, 0],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="relative"
        >
          {/* Image Container with custom border radius */}
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden ">
            <Image
              src="/images/landing-hero-image.jpg"
              alt="Woman working on laptop with coffee"
              fill
              className="object-cover"
              style={{
                borderTopRightRadius: "150px",
                borderTopLeftRadius: "24px",
                borderBottomLeftRadius: "24px",
                borderBottomRightRadius: "24px",
              }}
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HeroImage;

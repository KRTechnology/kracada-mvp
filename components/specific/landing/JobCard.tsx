"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, MoreVertical } from "lucide-react";

interface JobItem {
  id: number;
  title: string;
  company: string;
  location: string;
  description: string;
  skills: string[];
}

interface JobCardProps {
  job: JobItem;
  index: number;
}

const JobCard = ({ job, index }: JobCardProps) => {
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
      className="bg-white dark:bg-[#121212] rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer relative"
    >
      {/* Three Dots Menu - positioned outside the hover scale container */}
      <div className="absolute top-6 right-6 z-10">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-full transition-colors flex items-center justify-center"
          style={{ width: "24px", height: "24px" }}
        >
          <MoreVertical className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
        </motion.button>
      </div>

      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="h-full"
      >
        {/* Company Logo Placeholder */}
        <div className="w-12 h-12 mb-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex items-center justify-center">
          <div
            className="w-full h-full rounded-lg"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #f3f4f6 25%, transparent 25%), 
                linear-gradient(-45deg, #f3f4f6 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #f3f4f6 75%), 
                linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)
              `,
              backgroundSize: "8px 8px",
              backgroundPosition: "0 0, 0 4px, 4px -4px, -4px 0px",
            }}
          />
        </div>

        {/* Job Title */}
        <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-200 mb-2 pr-8">
          {job.title}
        </h3>

        {/* Company Name and Location */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-neutral-600 dark:text-neutral-300 font-medium">
            {job.company}
          </span>
          <div className="flex items-center text-neutral-500 dark:text-neutral-400 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{job.location}</span>
          </div>
        </div>

        {/* Job Description */}
        <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6 line-clamp-3">
          {job.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-2">
          {job.skills.map((skill, skillIndex) => (
            <span
              key={skillIndex}
              className="px-3 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 text-xs font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default JobCard;

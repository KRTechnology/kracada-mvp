"use client";

import React from "react";
import { motion } from "framer-motion";
import JobCard from "./JobCard";

const JobsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  // Sample job data
  const jobsData: Array<{
    id: number;
    title: string;
    company: string;
    location: string;
    description: string;
    skills: string[];
  }> = [
    {
      id: 1,
      title: "Frontend Developer",
      company: "TechCorp Inc",
      location: "Lagos, Nigeria",
      description:
        "We are looking for a skilled Frontend Developer to join our dynamic team. You will be responsible for building user-facing features and ensuring seamless user experiences across multiple platforms.",
      skills: ["React", "TypeScript"],
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "Design Studio",
      location: "Abuja, Nigeria",
      description:
        "Creative UI/UX Designer needed to design intuitive and engaging user interfaces. Experience with Figma and user research methodologies required for this exciting role.",
      skills: ["Figma", "Prototyping"],
    },
    {
      id: 3,
      title: "Backend Engineer",
      company: "StartupXYZ",
      location: "Remote, Nigeria",
      description:
        "Backend Engineer position available for building scalable server-side applications. Strong knowledge of Node.js and database management systems required.",
      skills: ["Node.js", "MongoDB"],
    },
    {
      id: 4,
      title: "Product Manager",
      company: "Growth Labs",
      location: "Port Harcourt, Nigeria",
      description:
        "Product Manager role focusing on strategy and roadmap development. Experience in agile methodologies and cross-functional team leadership preferred.",
      skills: ["Strategy", "Analytics"],
    },
    {
      id: 5,
      title: "DevOps Engineer",
      company: "CloudTech",
      location: "Lagos, Nigeria",
      description:
        "DevOps Engineer to manage cloud infrastructure and deployment pipelines. AWS/Azure experience and containerization knowledge essential for success.",
      skills: ["AWS", "Docker"],
    },
    {
      id: 6,
      title: "Data Scientist",
      company: "DataFlow Inc",
      location: "Ibadan, Nigeria",
      description:
        "Data Scientist position for analyzing complex datasets and building predictive models. Python and machine learning experience required for this analytical role.",
      skills: ["Python", "Machine Learning"],
    },
  ];

  return (
    <section className="py-16 lg:py-24" style={{ backgroundColor: "#EBE9E9" }}>
      <div className="container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start mb-12">
            <motion.div variants={itemVariants} className="mb-8 lg:mb-0">
              <p
                className="text-sm font-medium mb-3"
                style={{ color: "#2A0C00" }}
              >
                Jobs
              </p>
              <h2
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{ color: "#363231" }}
              >
                Latest Job posts
              </h2>
            </motion.div>

            {/* View All Button - Desktop Only */}
            <motion.div variants={itemVariants} className="hidden lg:block">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-warm-200 hover:bg-warm-300 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300"
              >
                View all job posts
              </motion.button>
            </motion.div>
          </div>

          {/* Jobs Cards Grid */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8"
          >
            {jobsData.map((job, index) => (
              <JobCard key={job.id} job={job} index={index} />
            ))}
          </motion.div>

          {/* Mobile View All Button */}
          <motion.div variants={itemVariants} className="lg:hidden mt-8">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-warm-200 hover:bg-warm-300 text-white py-4 rounded-xl font-semibold transition-all duration-300"
            >
              View all job posts
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default JobsSection;

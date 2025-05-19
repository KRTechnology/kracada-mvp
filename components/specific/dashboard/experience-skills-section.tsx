"use client";

import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { motion } from "framer-motion";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

export const ExperienceSkillsSection = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState("");
  const [jobPreferences, setJobPreferences] = useState("");

  const handleAddSkill = () => {
    if (currentSkill.trim() && !skills.includes(currentSkill.trim())) {
      setSkills([...skills, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const handleSkillInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, this would submit the form data to your API
    console.log("Skills submitted:", skills);
    console.log("Job preferences submitted:", jobPreferences);
    // Show success toast or message
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-white rounded-lg p-6 shadow-sm"
    >
      <h2 className="text-xl font-semibold mb-2">Experience & Skills</h2>
      <p className="text-neutral-500 text-sm mb-6">
        Let others know how they can find you online.
      </p>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Skills Input */}
          <div>
            <label
              htmlFor="skills"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Skills
            </label>
            <div className="relative mb-2">
              <Input
                id="skills"
                value={currentSkill}
                onChange={(e) => setCurrentSkill(e.target.value)}
                onKeyDown={handleSkillInputKeyDown}
                placeholder="Input your skills"
                className="pr-20"
              />
              <Button
                type="button"
                size="sm"
                className="absolute right-1 top-1 bg-white text-neutral-700 hover:bg-neutral-100"
                onClick={handleAddSkill}
              >
                Add
              </Button>
            </div>
            <p className="text-xs text-neutral-500 mb-3">
              Add or select your skills
            </p>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {skills.map((skill) => (
                <motion.div
                  key={skill}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-neutral-100 rounded-full px-3 py-1 flex items-center text-sm"
                >
                  <span className="mr-1">{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-neutral-500 hover:text-neutral-700 focus:outline-none"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Job Preferences */}
          <div>
            <label
              htmlFor="jobPreferences"
              className="block text-sm font-medium text-neutral-700 mb-1"
            >
              Job preferences
            </label>
            <Input
              id="jobPreferences"
              value={jobPreferences}
              onChange={(e) => setJobPreferences(e.target.value)}
              placeholder="Input your job preferences"
            />
          </div>

          {/* Add Experience Button */}
          <div>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2"
            >
              <PlusIcon className="h-4 w-4" /> Add Experience
            </Button>
          </div>
        </div>

        <div className="flex justify-start space-x-4 mt-6">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button
            type="submit"
            className="bg-warm-200 hover:bg-warm-300 text-white"
          >
            Save
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

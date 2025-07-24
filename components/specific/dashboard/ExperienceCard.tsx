"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { motion } from "framer-motion";
import { Plus, X } from "lucide-react";

interface ExperienceCardProps {
  userData: {
    skills?: string[];
    jobPreferences?: string[];
  };
}

export function ExperienceCard({ userData }: ExperienceCardProps) {
  const [skills, setSkills] = useState<string[]>(userData.skills || []);
  const [jobPreferences, setJobPreferences] = useState<string[]>(
    userData.jobPreferences || []
  );
  const [newSkill, setNewSkill] = useState("");
  const [newJobPreference, setNewJobPreference] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove));
  };

  const addJobPreference = () => {
    if (
      newJobPreference.trim() &&
      !jobPreferences.includes(newJobPreference.trim())
    ) {
      setJobPreferences([...jobPreferences, newJobPreference.trim()]);
      setNewJobPreference("");
    }
  };

  const removeJobPreference = (preferenceToRemove: string) => {
    setJobPreferences(
      jobPreferences.filter((pref) => pref !== preferenceToRemove)
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
    }, 1500);
  };

  const handleCancel = () => {
    setSkills(userData.skills || []);
    setJobPreferences(userData.jobPreferences || []);
    setNewSkill("");
    setNewJobPreference("");
  };

  const predefinedSkills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Node.js",
    "Python",
    "Java",
    "C++",
    "HTML/CSS",
    "SQL",
    "MongoDB",
    "PostgreSQL",
    "AWS",
    "Docker",
    "Kubernetes",
    "Git",
    "Figma",
    "Photoshop",
    "Project Management",
  ];

  const predefinedJobPreferences = [
    "Remote Work",
    "Hybrid Work",
    "On-site Work",
    "Flexible Hours",
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Startup Environment",
    "Large Corporation",
    "Tech Industry",
    "Healthcare",
    "Finance",
    "Education",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          Experience & Skills
        </h2>
        <p className="text-neutral-600 dark:text-neutral-400">
          Let others know how they can find you online.
        </p>
      </div>

      <div className="space-y-8">
        {/* Skills Section */}
        <div className="space-y-4">
          <Label className="text-neutral-700 dark:text-neutral-300 text-base">
            Skills
          </Label>

          {/* Skills Display */}
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <motion.span
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-warm-50 dark:bg-warm-900/20 text-warm-700 dark:text-warm-300 rounded-full text-sm"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="ml-1 hover:text-warm-900 dark:hover:text-warm-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* Skills Input */}
          <div className="space-y-3">
            <Select value={newSkill} onValueChange={setNewSkill}>
              <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
                <SelectValue placeholder="Input your skills" />
              </SelectTrigger>
              <SelectContent>
                {predefinedSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                placeholder="Or type a custom skill"
                className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                onKeyPress={(e) => e.key === "Enter" && addSkill()}
              />
              <Button
                onClick={addSkill}
                variant="outline"
                size="sm"
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Add or select your skills
            </p>
          </div>
        </div>

        {/* Job Preferences Section */}
        <div className="space-y-4">
          <Label className="text-neutral-700 dark:text-neutral-300 text-base">
            Job preferences
          </Label>

          {/* Job Preferences Display */}
          {jobPreferences.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {jobPreferences.map((preference, index) => (
                <motion.span
                  key={preference}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                >
                  {preference}
                  <button
                    onClick={() => removeJobPreference(preference)}
                    className="ml-1 hover:text-blue-900 dark:hover:text-blue-100"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </motion.span>
              ))}
            </div>
          )}

          {/* Job Preferences Input */}
          <div className="space-y-3">
            <Select
              value={newJobPreference}
              onValueChange={setNewJobPreference}
            >
              <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
                <SelectValue placeholder="Input your job preferences" />
              </SelectTrigger>
              <SelectContent>
                {predefinedJobPreferences.map((preference) => (
                  <SelectItem key={preference} value={preference}>
                    {preference}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <Input
                value={newJobPreference}
                onChange={(e) => setNewJobPreference(e.target.value)}
                placeholder="Or type a custom preference"
                className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                onKeyPress={(e) => e.key === "Enter" && addJobPreference()}
              />
              <Button
                onClick={addJobPreference}
                variant="outline"
                size="sm"
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Add Experience Section */}
        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-700">
          <Button
            variant="outline"
            className="border-warm-200 text-warm-600 hover:bg-warm-50 dark:hover:bg-warm-900/20"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Experience
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

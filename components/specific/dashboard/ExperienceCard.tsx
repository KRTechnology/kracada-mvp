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
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, Edit, Trash2 } from "lucide-react";
import {
  updateSkillsPreferencesAction,
  deleteExperienceAction,
} from "@/app/(dashboard)/actions/profile-actions";
import { ExperienceForm } from "./ExperienceForm";
import { toast } from "sonner";

interface ExperienceCardProps {
  userData: {
    id: string;
    skills: string[];
    jobPreferences: string[];
  };
  experiences: Array<{
    id: string;
    jobTitle: string;
    employmentType: string;
    company: string;
    currentlyWorking: boolean;
    startMonth: string | null;
    startYear: string | null;
    endMonth: string | null;
    endYear: string | null;
    description: string | null;
    skills: string[];
  }>;
  onExperiencesUpdate: (experiences: any[]) => void;
}

export function ExperienceCard({
  userData,
  experiences,
  onExperiencesUpdate,
}: ExperienceCardProps) {
  const [skills, setSkills] = useState<string[]>(userData.skills || []);
  const [jobPreferences, setJobPreferences] = useState<string[]>(
    userData.jobPreferences || []
  );
  const [newSkill, setNewSkill] = useState("");
  const [newJobPreference, setNewJobPreference] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [showExperienceForm, setShowExperienceForm] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);

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

  const handleSaveSkillsPreferences = async () => {
    setIsSaving(true);
    try {
      const result = await updateSkillsPreferencesAction({
        skills,
        jobPreferences,
      });

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setSkills(userData.skills || []);
    setJobPreferences(userData.jobPreferences || []);
    setNewSkill("");
    setNewJobPreference("");
  };

  const handleAddExperience = () => {
    setEditingExperience(null);
    setShowExperienceForm(true);
  };

  const handleEditExperience = (experience: any) => {
    setEditingExperience(experience);
    setShowExperienceForm(true);
  };

  const handleDeleteExperience = async (experienceId: string) => {
    try {
      const result = await deleteExperienceAction(experienceId);
      if (result.success) {
        const updatedExperiences = experiences.filter(
          (exp) => exp.id !== experienceId
        );
        onExperiencesUpdate(updatedExperiences);
        toast.success("Experience deleted successfully");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const handleExperienceFormSave = () => {
    setShowExperienceForm(false);
    setEditingExperience(null);
    // Refresh experiences from server
    // This will be handled by the parent component
  };

  const handleExperienceFormCancel = () => {
    setShowExperienceForm(false);
    setEditingExperience(null);
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

        {/* Experiences Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-neutral-700 dark:text-neutral-300 text-base">
              Work Experience
            </Label>
            <Button
              onClick={handleAddExperience}
              variant="outline"
              className="border-warm-200 dark:border-warm-300 text-warm-600 dark:text-warm-300 hover:bg-warm-50 dark:hover:bg-warm-900/20"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Experience
            </Button>
          </div>

          {/* Experience List */}
          {experiences.length > 0 && (
            <div className="space-y-4">
              {experiences.map((experience) => (
                <motion.div
                  key={experience.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gray-50 dark:bg-neutral-800 rounded-lg p-4 border border-neutral-200 dark:border-neutral-700"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                        {experience.jobTitle}
                      </h4>
                      <p className="text-sm text-neutral-600 dark:text-neutral-400">
                        {experience.company} • {experience.employmentType}
                      </p>
                      <p className="text-sm text-neutral-500 dark:text-neutral-500">
                        {experience.startMonth} {experience.startYear} -{" "}
                        {experience.currentlyWorking
                          ? "Present"
                          : `${experience.endMonth} ${experience.endYear}`}
                      </p>
                      {experience.description && (
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                          {experience.description}
                        </p>
                      )}
                      {experience.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {experience.skills.map((skill) => (
                            <span
                              key={skill}
                              className="px-2 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded text-xs"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => handleEditExperience(experience)}
                        variant="outline"
                        size="sm"
                        className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteExperience(experience.id)}
                        variant="outline"
                        size="sm"
                        className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {experiences.length === 0 && (
            <div className="text-center py-8 text-neutral-500 dark:text-neutral-400">
              <p>No work experience added yet.</p>
              <p className="text-sm mt-1">
                Click "Add Experience" to get started.
              </p>
            </div>
          )}
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
            onClick={handleSaveSkillsPreferences}
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      {/* Experience Form Modal */}
      <AnimatePresence>
        {showExperienceForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) =>
              e.target === e.currentTarget && handleExperienceFormCancel()
            }
          >
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <ExperienceForm
                experience={editingExperience}
                onSave={handleExperienceFormSave}
                onCancel={handleExperienceFormCancel}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

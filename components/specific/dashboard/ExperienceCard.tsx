"use client";

import { useState, useMemo, forwardRef, useImperativeHandle } from "react";
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
import { Plus, X, Edit, Trash2 } from "lucide-react";
import {
  updateSkillsPreferencesAction,
  deleteExperienceAction,
} from "@/app/(dashboard)/actions/profile-actions";
import { ExperienceForm } from "./ExperienceForm";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { usePreventFormSubmit } from "@/lib/hooks/usePreventFormSubmit";
import { SkillTag } from "@/components/common/SkillTag";

// Form validation schema
const skillsPreferencesSchema = z.object({
  skills: z.array(z.string()).optional(),
  jobPreferences: z.array(z.string()).optional(),
});

type SkillsPreferencesData = z.infer<typeof skillsPreferencesSchema>;

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
  onUserDataUpdate?: (updates: {
    skills?: string[];
    jobPreferences?: string[];
  }) => void;
  isEditMode?: boolean;
}

export interface ExperienceCardRef {
  save: () => Promise<void>;
}

export const ExperienceCard = forwardRef<
  ExperienceCardRef,
  ExperienceCardProps
>(
  (
    {
      userData,
      experiences,
      onExperiencesUpdate,
      onUserDataUpdate,
      isEditMode = false,
    },
    ref
  ) => {
    const [isSaving, setIsSaving] = useState(false);
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showExperienceForm, setShowExperienceForm] = useState(false);
    const [editingExperience, setEditingExperience] = useState<any>(null);

    // Memoize defaultValues to prevent unnecessary re-renders
    const defaultValues = useMemo(
      () => ({
        skills: userData.skills || [],
        jobPreferences: userData.jobPreferences || [],
      }),
      [userData.skills, userData.jobPreferences]
    );

    const {
      register,
      handleSubmit,
      formState: { errors, isDirty },
      reset,
      watch,
      setValue,
    } = useForm<SkillsPreferencesData>({
      resolver: zodResolver(skillsPreferencesSchema),
      defaultValues,
    });

    const watchedSkills = watch("skills") || [];
    const watchedJobPreferences = watch("jobPreferences") || [];

    const [newSkill, setNewSkill] = useState("");
    const [newJobPreference, setNewJobPreference] = useState("");

    // Expose save function to parent component
    useImperativeHandle(ref, () => ({
      save: async () => {
        const formData = {
          skills: watchedSkills,
          jobPreferences: watchedJobPreferences,
        };
        await onSubmit(formData);
      },
    }));

    const { preventSubmit } = usePreventFormSubmit();

    const addSkill = () => {
      if (newSkill.trim() && !watchedSkills.includes(newSkill.trim())) {
        setValue("skills", [...watchedSkills, newSkill.trim()], {
          shouldDirty: true,
        });
        setNewSkill("");
      }
    };

    const removeSkill = (skillToRemove: string) => {
      setValue(
        "skills",
        watchedSkills.filter((skill) => skill !== skillToRemove),
        { shouldDirty: true }
      );
    };

    const addJobPreference = () => {
      if (
        newJobPreference.trim() &&
        !watchedJobPreferences.includes(newJobPreference.trim())
      ) {
        setValue(
          "jobPreferences",
          [...watchedJobPreferences, newJobPreference.trim()],
          { shouldDirty: true }
        );
        setNewJobPreference("");
      }
    };

    const removeJobPreference = (preferenceToRemove: string) => {
      setValue(
        "jobPreferences",
        watchedJobPreferences.filter((pref) => pref !== preferenceToRemove),
        { shouldDirty: true }
      );
    };

    const onSubmit = async (data: SkillsPreferencesData) => {
      setIsSaving(true);
      try {
        const result = await updateSkillsPreferencesAction(data);

        if (result.success) {
          // Only show toast if not in edit mode (to avoid multiple toasts)
          if (!isEditMode) {
            toast.success(result.message);
          }

          // Notify parent component of the update
          onUserDataUpdate?.(data);

          // Reset form to mark as clean after successful save
          reset(data);

          // Only trigger collapse animation if not in edit mode
          if (!isEditMode) {
            setTimeout(() => {
              setIsCollapsed(true);
            }, 500);
          }
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

    // Prevent collapse when modal is open
    const handleCardClick = () => {
      if (isCollapsed && !showExperienceForm && !isEditMode) {
        setIsCollapsed(false);
      }
    };

    const handleCancel = () => {
      reset();
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

    const handleExperienceFormSave = (newExperience?: any) => {
      setShowExperienceForm(false);
      setEditingExperience(null);

      // Update experiences list in real-time
      if (newExperience) {
        if (editingExperience) {
          // Update existing experience
          const updatedExperiences = experiences.map((exp) =>
            exp.id === editingExperience.id ? newExperience : exp
          );
          onExperiencesUpdate(updatedExperiences);
        } else {
          // Add new experience
          onExperiencesUpdate([...experiences, newExperience]);
        }
      }
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
        transition={{ duration: 0.3, delay: 0.4 }}
        className={`bg-white dark:bg-neutral-900 rounded-2xl shadow-sm transition-all duration-300 p-6 ${
          isCollapsed && !isEditMode ? "cursor-pointer hover:shadow-md" : ""
        }`}
        onClick={handleCardClick}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            Experience & Skills
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Let others know how they can find you online.
          </p>
        </div>

        {(!isCollapsed || isEditMode) && (
          <motion.form
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-8"
          >
            {/* Skills Section */}
            <div className="space-y-4">
              <Label className="text-neutral-700 dark:text-neutral-300 text-base">
                Skills
              </Label>

              {/* Skills Display */}
              {watchedSkills.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedSkills.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-warm-50 dark:bg-warm-900/20 text-warm-700 dark:text-warm-300 rounded-full text-sm"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={preventSubmit(() => removeSkill(skill))}
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
                <div>
                  <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                    Select from common skills:
                  </Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !watchedSkills.includes(value)) {
                        setValue("skills", [...watchedSkills, value], {
                          shouldDirty: true,
                        });
                      }
                    }}
                  >
                    <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
                      <SelectValue placeholder="Choose a skill to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedSkills
                        .filter((skill) => !watchedSkills.includes(skill))
                        .map((skill) => (
                          <SelectItem key={skill} value={skill}>
                            {skill}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                    Or add a custom skill:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Type your custom skill"
                      className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                      onKeyPress={(e) => e.key === "Enter" && addSkill()}
                    />
                    <Button
                      type="button"
                      onClick={preventSubmit(addSkill)}
                      variant="outline"
                      size="sm"
                      className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                      disabled={!newSkill.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
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
              {watchedJobPreferences.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {watchedJobPreferences.map((preference) => (
                    <motion.span
                      key={preference}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-full text-sm"
                    >
                      {preference}
                      <button
                        type="button"
                        onClick={preventSubmit(() =>
                          removeJobPreference(preference)
                        )}
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
                <div>
                  <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                    Select from common preferences:
                  </Label>
                  <Select
                    value=""
                    onValueChange={(value) => {
                      if (value && !watchedJobPreferences.includes(value)) {
                        setValue(
                          "jobPreferences",
                          [...watchedJobPreferences, value],
                          { shouldDirty: true }
                        );
                      }
                    }}
                  >
                    <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
                      <SelectValue placeholder="Choose a preference to add" />
                    </SelectTrigger>
                    <SelectContent>
                      {predefinedJobPreferences
                        .filter(
                          (preference) =>
                            !watchedJobPreferences.includes(preference)
                        )
                        .map((preference) => (
                          <SelectItem key={preference} value={preference}>
                            {preference}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 block">
                    Or add a custom preference:
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={newJobPreference}
                      onChange={(e) => setNewJobPreference(e.target.value)}
                      placeholder="Type your custom preference"
                      className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
                      onKeyPress={(e) =>
                        e.key === "Enter" && addJobPreference()
                      }
                    />
                    <Button
                      type="button"
                      onClick={preventSubmit(addJobPreference)}
                      variant="outline"
                      size="sm"
                      className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                      disabled={!newJobPreference.trim()}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
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
                  type="button"
                  onClick={preventSubmit(handleAddExperience)}
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
                          <p className="text-sm text-neutral-600 dark:text-neutral-200">
                            {experience.company} • {experience.employmentType}
                          </p>
                          <p className="text-sm text-neutral-500 dark:text-neutral-200">
                            {experience.startMonth} {experience.startYear} -{" "}
                            {experience.currentlyWorking
                              ? "Present"
                              : `${experience.endMonth} ${experience.endYear}`}
                          </p>
                          {experience.description && (
                            <p className="text-sm text-neutral-600 dark:text-neutral-200 mt-2">
                              {experience.description}
                            </p>
                          )}
                          {experience.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {experience.skills.map((skill) => (
                                <SkillTag key={skill}>{skill}</SkillTag>
                              ))}
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 ml-4">
                          <Button
                            type="button"
                            onClick={preventSubmit(() =>
                              handleEditExperience(experience)
                            )}
                            variant="outline"
                            size="sm"
                            className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            onClick={preventSubmit(() =>
                              handleDeleteExperience(experience.id)
                            )}
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

            {/* Action Buttons - Only show if not in edit mode */}
            {!isEditMode && (
              <div className="flex justify-end pt-4">
                <Button
                  type="submit"
                  disabled={isSaving}
                  className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
                >
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </motion.form>
        )}

        {/* Experience Form Modal */}
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
      </motion.div>
    );
  }
);

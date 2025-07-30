"use client";

import { useState } from "react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Label } from "@/components/common/label";
import { Textarea } from "@/components/common/textarea";
import { Checkbox } from "@/components/common/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import {
  createExperienceAction,
  updateExperienceAction,
} from "@/app/(dashboard)/actions/profile-actions";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Form validation schema
const experienceFormSchema = z
  .object({
    jobTitle: z.string().min(1, "Job title is required"),
    employmentType: z.enum([
      "Full-time",
      "Part-time",
      "Contract",
      "Freelance",
      "Internship",
      "Temporary",
    ]),
    company: z.string().min(1, "Company is required"),
    currentlyWorking: z.boolean(),
    startMonth: z.string().min(1, "Start month is required"),
    startYear: z.string().min(1, "Start year is required"),
    endMonth: z.string().optional(),
    endYear: z.string().optional(),
    description: z.string().optional(),
    skills: z.array(z.string()).optional(),
  })
  .refine(
    (data) => {
      // If not currently working, end date is required
      if (!data.currentlyWorking) {
        return data.endMonth && data.endYear;
      }
      return true;
    },
    {
      message: "End date is required when not currently working",
      path: ["endMonth"], // This will show the error on the end month field
    }
  );

type ExperienceFormData = z.infer<typeof experienceFormSchema>;

interface ExperienceFormProps {
  experience?: {
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
  } | null;
  onSave: (data?: any) => void;
  onCancel: () => void;
}

export function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: ExperienceFormProps) {
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceFormSchema),
    defaultValues: {
      jobTitle: experience?.jobTitle || "",
      employmentType: (experience?.employmentType as any) || "Full-time",
      company: experience?.company || "",
      currentlyWorking: experience?.currentlyWorking || false,
      startMonth: experience?.startMonth || "",
      startYear: experience?.startYear || "",
      endMonth: experience?.endMonth || "",
      endYear: experience?.endYear || "",
      description: experience?.description || "",
      skills: experience?.skills || [],
    },
  });

  const watchedSkills = watch("skills") || [];
  const watchedCurrentlyWorking = watch("currentlyWorking");

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from({ length: 30 }, (_, i) =>
    (new Date().getFullYear() - i).toString()
  );

  const employmentTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Freelance",
    "Internship",
    "Temporary",
  ];

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
    "Leadership",
    "Communication",
  ];

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

  const onSubmit = async (data: ExperienceFormData) => {
    setIsSaving(true);
    try {
      const result = experience
        ? await updateExperienceAction({ ...data, id: experience.id })
        : await createExperienceAction(data);

      if (result.success) {
        toast.success(result.message);
        onSave(result.data);
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6 border border-neutral-200 dark:border-neutral-700"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
          {experience ? "Edit Experience" : "Add Experience"}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-400">
          Add your work experience details
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Job Title
          </Label>
          <Input
            {...register("jobTitle")}
            placeholder="Input your job title"
            className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
              errors.jobTitle ? "border-red-500" : ""
            }`}
          />
          {errors.jobTitle && (
            <p className="text-sm text-red-500">{errors.jobTitle.message}</p>
          )}
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Employment Type
          </Label>
          <Select
            value={watch("employmentType") || ""}
            onValueChange={(value) => {
              setValue("employmentType", value as any);
            }}
          >
            <SelectTrigger
              className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                errors.employmentType ? "border-red-500" : ""
              }`}
            >
              <SelectValue placeholder="Select employment type" />
            </SelectTrigger>
            <SelectContent>
              {employmentTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.employmentType && (
            <p className="text-sm text-red-500">
              {errors.employmentType.message}
            </p>
          )}
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Company/Organization
          </Label>
          <Input
            {...register("company")}
            placeholder="Input company name"
            className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
              errors.company ? "border-red-500" : ""
            }`}
          />
          {errors.company && (
            <p className="text-sm text-red-500">{errors.company.message}</p>
          )}
        </div>

        {/* Currently Working */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="currentlyWorking"
            checked={watchedCurrentlyWorking}
            onCheckedChange={(checked) => {
              setValue("currentlyWorking", checked as boolean);
            }}
          />
          <Label
            htmlFor="currentlyWorking"
            className="text-neutral-700 dark:text-neutral-300"
          >
            I currently work here
          </Label>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Date */}
          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              Start Date
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Select
                  value={watch("startMonth") || ""}
                  onValueChange={(value) => {
                    setValue("startMonth", value);
                  }}
                >
                  <SelectTrigger
                    className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                      errors.startMonth ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startMonth && (
                  <p className="text-sm text-red-500">
                    {errors.startMonth.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Select
                  value={watch("startYear") || ""}
                  onValueChange={(value) => {
                    setValue("startYear", value);
                  }}
                >
                  <SelectTrigger
                    className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                      errors.startYear ? "border-red-500" : ""
                    }`}
                  >
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.startYear && (
                  <p className="text-sm text-red-500">
                    {errors.startYear.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              End Date
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Select
                  value={watch("endMonth") || ""}
                  onValueChange={(value) => {
                    setValue("endMonth", value);
                  }}
                  disabled={watchedCurrentlyWorking}
                >
                  <SelectTrigger
                    className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                      !watchedCurrentlyWorking && errors.endMonth
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Month" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!watchedCurrentlyWorking && errors.endMonth && (
                  <p className="text-sm text-red-500">
                    {errors.endMonth.message}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <Select
                  value={watch("endYear") || ""}
                  onValueChange={(value) => {
                    setValue("endYear", value);
                  }}
                  disabled={watchedCurrentlyWorking}
                >
                  <SelectTrigger
                    className={`bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 ${
                      !watchedCurrentlyWorking && errors.endYear
                        ? "border-red-500"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {!watchedCurrentlyWorking && errors.endYear && (
                  <p className="text-sm text-red-500">
                    {errors.endYear.message}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Description
          </Label>
          <Textarea
            {...register("description")}
            placeholder="Describe your role and responsibilities..."
            className="min-h-[100px] bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 resize-none"
          />
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Skills
          </Label>

          {/* Skills Display */}
          {watchedSkills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeSkill(skill);
                      }}
                      className="ml-1 hover:text-warm-900 dark:hover:text-warm-100"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
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
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  addSkill();
                }}
                variant="outline"
                size="sm"
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
}

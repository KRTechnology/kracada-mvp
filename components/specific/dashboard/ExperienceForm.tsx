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
  onSave: () => void;
  onCancel: () => void;
}

export function ExperienceForm({
  experience,
  onSave,
  onCancel,
}: ExperienceFormProps) {
  const [formData, setFormData] = useState({
    jobTitle: experience?.jobTitle || "",
    employmentType: experience?.employmentType || "Full-time",
    company: experience?.company || "",
    currentlyWorking: experience?.currentlyWorking || false,
    startMonth: experience?.startMonth || "",
    startYear: experience?.startYear || "",
    endMonth: experience?.endMonth || "",
    endYear: experience?.endYear || "",
    description: experience?.description || "",
    skills: experience?.skills || [],
  });
  const [newSkill, setNewSkill] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleSave = async () => {
    if (!formData.jobTitle.trim() || !formData.company.trim()) {
      toast.error("Job title and company are required");
      return;
    }

    setIsSaving(true);
    try {
      const result = experience
        ? await updateExperienceAction({ ...formData, id: experience.id })
        : await createExperienceAction(formData);

      if (result.success) {
        toast.success(result.message);
        onSave();
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

      <div className="space-y-6">
        {/* Job Title */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Job Title
          </Label>
          <Input
            value={formData.jobTitle}
            onChange={(e) => handleInputChange("jobTitle", e.target.value)}
            placeholder="Input your job title"
            className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
          />
        </div>

        {/* Employment Type */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Employment Type
          </Label>
          <Select
            value={formData.employmentType}
            onValueChange={(value) =>
              handleInputChange("employmentType", value)
            }
          >
            <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
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
        </div>

        {/* Company */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Company/Organization
          </Label>
          <Input
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            placeholder="Input company name"
            className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600"
          />
        </div>

        {/* Currently Working */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="currentlyWorking"
            checked={formData.currentlyWorking}
            onCheckedChange={(checked) =>
              handleInputChange("currentlyWorking", checked as boolean)
            }
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
              <Select
                value={formData.startMonth}
                onValueChange={(value) =>
                  handleInputChange("startMonth", value)
                }
              >
                <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
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
              <Select
                value={formData.startYear}
                onValueChange={(value) => handleInputChange("startYear", value)}
              >
                <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
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
            </div>
          </div>

          {/* End Date */}
          <div className="space-y-2">
            <Label className="text-neutral-700 dark:text-neutral-300">
              End Date
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Select
                value={formData.endMonth}
                onValueChange={(value) => handleInputChange("endMonth", value)}
                disabled={formData.currentlyWorking}
              >
                <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
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
              <Select
                value={formData.endYear}
                onValueChange={(value) => handleInputChange("endYear", value)}
                disabled={formData.currentlyWorking}
              >
                <SelectTrigger className="bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600">
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
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label className="text-neutral-700 dark:text-neutral-300">
            Description
          </Label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
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
          {formData.skills.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {formData.skills.map((skill) => (
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
                onClick={addSkill}
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
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            onClick={onCancel}
            variant="outline"
            className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

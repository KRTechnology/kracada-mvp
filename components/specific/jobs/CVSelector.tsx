"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Star, Plus, Eye, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { CV } from "@/lib/db/schema/cvs";
import { getUserCVsAction } from "@/app/(dashboard)/actions/profile-actions";
import { Button } from "@/components/common/button";
import { Label } from "@/components/common/label";
import { Loader } from "@/components/common/Loader";
import { AddCVDialog } from "@/components/specific/dashboard/AddCVDialog";

interface CVSelectorProps {
  selectedCvId: string | null;
  onSelectCV: (cvId: string, cvUrl: string) => void;
  userData: {
    id: string;
    firstName: string;
    lastName: string;
  };
  className?: string;
}

export function CVSelector({
  selectedCvId,
  onSelectCV,
  userData,
  className = "",
}: CVSelectorProps) {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isAddCVOpen, setIsAddCVOpen] = useState(false);

  const loadCVs = async () => {
    try {
      setIsLoading(true);
      const result = await getUserCVsAction();

      if (result.success && result.data) {
        setCvs(result.data);

        // Auto-select default CV if no CV is selected
        if (!selectedCvId && result.data.length > 0) {
          const defaultCV =
            result.data.find((cv) => cv.isDefault) || result.data[0];
          if (defaultCV) {
            onSelectCV(defaultCV.id, defaultCV.fileUrl);
          }
        }
      } else {
        toast.error(result.message || "Failed to load CVs");
      }
    } catch (error) {
      console.error("Error loading CVs:", error);
      toast.error("Failed to load CVs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  const handleCVSelect = (cv: CV) => {
    onSelectCV(cv.id, cv.fileUrl);
    setIsExpanded(false);
  };

  const handleViewCV = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  const handleAddCVSuccess = () => {
    loadCVs(); // Reload CVs after adding a new one
  };

  const selectedCV = cvs.find((cv) => cv.id === selectedCvId);

  if (isLoading) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Select CV for Application
        </Label>
        <div className="flex items-center justify-center py-8 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
          <Loader size="sm" />
          <span className="ml-2 text-sm text-neutral-600 dark:text-neutral-400">
            Loading your CVs...
          </span>
        </div>
      </div>
    );
  }

  if (cvs.length === 0) {
    return (
      <div className={`space-y-3 ${className}`}>
        <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
          Select CV for Application
        </Label>
        <div className="border border-neutral-300 dark:border-neutral-600 rounded-lg p-6 bg-neutral-50 dark:bg-neutral-800/50">
          <div className="text-center space-y-4">
            <FileText className="w-12 h-12 text-neutral-400 dark:text-neutral-500 mx-auto" />
            <div>
              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                No CVs found
              </p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                You need to upload a CV before applying for jobs
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setIsAddCVOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First CV
            </Button>
          </div>
        </div>

        <AddCVDialog
          open={isAddCVOpen}
          onOpenChange={setIsAddCVOpen}
          userData={userData}
          onSuccess={handleAddCVSuccess}
        />
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <Label className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        Select CV for Application
      </Label>

      <div className="space-y-3">
        {/* Selected CV Display */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full border border-neutral-300 dark:border-neutral-600 rounded-lg p-4 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors text-left"
          >
            {selectedCV ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                        {selectedCV.name}
                      </p>
                      {selectedCV.isDefault && (
                        <Star className="w-4 h-4 text-orange-500 fill-current" />
                      )}
                    </div>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                      Added{" "}
                      {format(new Date(selectedCV.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-neutral-400 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <span className="text-sm text-neutral-500 dark:text-neutral-400">
                  Select a CV...
                </span>
                <ChevronDown className="w-5 h-5 text-neutral-400" />
              </div>
            )}
          </button>

          {/* CV Options Dropdown */}
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full left-0 right-0 z-10 mt-1 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 shadow-lg max-h-60 overflow-y-auto"
              >
                <div className="p-2 space-y-1">
                  {cvs.map((cv) => (
                    <button
                      key={cv.id}
                      type="button"
                      onClick={() => handleCVSelect(cv)}
                      className={`w-full p-3 rounded-md text-left hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors ${
                        selectedCvId === cv.id
                          ? "bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">
                                {cv.name}
                              </p>
                              {cv.isDefault && (
                                <Star className="w-3 h-3 text-orange-500 fill-current flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                              Added{" "}
                              {format(new Date(cv.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewCV(cv.fileUrl);
                          }}
                          className="text-neutral-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors ml-2 cursor-pointer p-1 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Add New CV Button */}
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsAddCVOpen(true)}
          className="w-full border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New CV
        </Button>
      </div>

      {/* Selected CV Actions */}
      {selectedCV && (
        <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm text-blue-800 dark:text-blue-200">
              This CV will be attached to your application
            </span>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => handleViewCV(selectedCV.fileUrl)}
            className="text-blue-600 dark:text-blue-400 border-blue-300 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30"
          >
            <Eye className="w-4 h-4 mr-1" />
            Preview
          </Button>
        </div>
      )}

      <AddCVDialog
        open={isAddCVOpen}
        onOpenChange={setIsAddCVOpen}
        userData={userData}
        onSuccess={handleAddCVSuccess}
      />
    </div>
  );
}

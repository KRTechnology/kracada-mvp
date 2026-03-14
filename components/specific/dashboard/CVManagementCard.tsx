"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  FileText,
  Star,
  StarOff,
  Eye,
  Trash2,
  MoreVertical,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

import { Button } from "@/components/common/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/common/alert-dialog";
import { AddCVDialog } from "./AddCVDialog";
import {
  getUserCVsAction,
  updateCVAction,
  deleteCVAction,
} from "@/app/(dashboard)/actions/profile-actions";

interface CV {
  id: string;
  name: string;
  fileUrl: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface CVManagementCardProps {
  userData: {
    id: string;
    firstName: string;
    lastName: string;
  };
  onUserDataUpdate?: (updates: any) => void;
}

export function CVManagementCard({
  userData,
  onUserDataUpdate,
}: CVManagementCardProps) {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCVOpen, setIsAddCVOpen] = useState(false);
  const [deletingCvId, setDeletingCvId] = useState<string | null>(null);
  const [updatingCvId, setUpdatingCvId] = useState<string | null>(null);

  // Load user's CVs
  const loadCVs = async () => {
    try {
      setIsLoading(true);
      const result = await getUserCVsAction();
      if (result.success && result.data) {
        setCvs(result.data);
      } else {
        toast.error("Failed to load CVs");
      }
    } catch (error) {
      console.error("Load CVs error:", error);
      toast.error("An error occurred while loading CVs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCVs();
  }, []);

  // Handle making CV default
  const handleMakeDefault = async (cvId: string) => {
    setUpdatingCvId(cvId);
    try {
      const result = await updateCVAction(cvId, { isDefault: true });
      if (result.success) {
        toast.success("CV set as default successfully");
        await loadCVs(); // Reload to get updated state
        // Update parent component if needed
        const updatedCV = cvs.find((cv) => cv.id === cvId);
        if (updatedCV && onUserDataUpdate) {
          onUserDataUpdate({ cv: updatedCV.fileUrl });
        }
      } else {
        toast.error(result.message || "Failed to set CV as default");
      }
    } catch (error) {
      console.error("Set default CV error:", error);
      toast.error("An error occurred");
    } finally {
      setUpdatingCvId(null);
    }
  };

  // Handle CV deletion
  const handleDeleteCV = async (cvId: string) => {
    try {
      const result = await deleteCVAction(cvId);
      if (result.success) {
        toast.success("CV deleted successfully");
        await loadCVs(); // Reload CVs

        // If deleted CV was default, update parent component
        const deletedCV = cvs.find((cv) => cv.id === cvId);
        if (deletedCV?.isDefault && onUserDataUpdate) {
          onUserDataUpdate({ cv: null });
        }
      } else {
        toast.error(result.message || "Failed to delete CV");
      }
    } catch (error) {
      console.error("Delete CV error:", error);
      toast.error("An error occurred while deleting CV");
    } finally {
      setDeletingCvId(null);
    }
  };

  // Handle viewing CV
  const handleViewCV = (fileUrl: string) => {
    window.open(fileUrl, "_blank");
  };

  // Handle successful CV addition
  const handleCVAdded = () => {
    setIsAddCVOpen(false);
    loadCVs(); // Reload CVs to show the new one
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm p-6">
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white dark:bg-[#121212] rounded-2xl shadow-sm p-6"
      >
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-xl font-semibold text-slate-600 dark:text-neutral-200">
              CV Management
            </h2>
            <Button
              onClick={() => setIsAddCVOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add CV
            </Button>
          </div>
          <p className="text-slate-500 dark:text-neutral-100">
            Manage your CVs and set your default CV for job applications.
          </p>
        </div>

        {cvs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              No CVs uploaded yet
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              Upload your first CV to get started with job applications.
            </p>
            <Button
              onClick={() => setIsAddCVOpen(true)}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Your First CV
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {cvs.map((cv) => (
                <motion.div
                  key={cv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border rounded-lg p-4 bg-white dark:bg-neutral-800/50 border-sectionBorder-light dark:border-neutral-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      {/* CV Icon */}
                      <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>

                      {/* CV Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-neutral-900 dark:text-neutral-100 truncate">
                            {cv.name}
                          </h3>
                          {cv.isDefault && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                              <Star className="w-3 h-3 text-orange-600 dark:text-orange-400 fill-current" />
                              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">
                                Default
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Added {format(new Date(cv.createdAt), "MMM d, yyyy")}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Quick Actions - Desktop */}
                      <div className="hidden md:flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewCV(cv.fileUrl)}
                          className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        {!cv.isDefault && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMakeDefault(cv.id)}
                            disabled={updatingCvId === cv.id}
                            className="border-orange-300 dark:border-orange-600 text-orange-700 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20"
                          >
                            {updatingCvId === cv.id ? (
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange-600 border-t-transparent mr-1" />
                            ) : (
                              <StarOff className="w-4 h-4 mr-1" />
                            )}
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setDeletingCvId(cv.id)}
                          className="border-red-300 dark:border-red-600 text-red-700 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* Mobile Dropdown */}
                      <div className="md:hidden">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewCV(cv.fileUrl)}
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View CV
                            </DropdownMenuItem>
                            {!cv.isDefault && (
                              <DropdownMenuItem
                                onClick={() => handleMakeDefault(cv.id)}
                                disabled={updatingCvId === cv.id}
                              >
                                <StarOff className="w-4 h-4 mr-2" />
                                Set as Default
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              onClick={() => setDeletingCvId(cv.id)}
                              className="text-red-600 dark:text-red-400"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete CV
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </motion.div>

      {/* Add CV Dialog */}
      <AddCVDialog
        open={isAddCVOpen}
        onOpenChange={setIsAddCVOpen}
        userData={userData}
        onSuccess={handleCVAdded}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deletingCvId}
        onOpenChange={() => setDeletingCvId(null)}
      >
        <AlertDialogContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-neutral-900 dark:text-neutral-100">
              Delete CV
            </AlertDialogTitle>
            <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
              Are you sure you want to delete this CV? This action cannot be
              undone.
              {cvs.find((cv) => cv.id === deletingCvId)?.isDefault && (
                <span className="block mt-2 text-orange-600 dark:text-orange-400 font-medium">
                  This is your default CV. Deleting it will remove your default
                  CV setting.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingCvId && handleDeleteCV(deletingCvId)}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete CV
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

"use client";

import { useRouter } from "next/navigation";
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

interface AuthRequiredAlertProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
}

export function AuthRequiredAlert({
  isOpen,
  onClose,
  title = "Authentication Required",
  description = "You need to be logged in to apply for jobs. Please log in to continue.",
}: AuthRequiredAlertProps) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push("/login");
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold text-neutral-900 dark:text-white">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-neutral-600 dark:text-neutral-400">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={onClose}
            className="border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogin}
            className="bg-warm-200 hover:bg-warm-300 text-white"
          >
            Login
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/form";
import { Spinner } from "@/components/common/spinner";
import { createAdminAction } from "../actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";

const nameRegex = /^[A-Za-z]+(?:[-'][A-Za-z]+)*$/;

const createAdminSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name is required")
    .regex(
      nameRegex,
      "First name must contain only letters and may include hyphens or apostrophes",
    ),

  lastName: z
    .string()
    .trim()
    .min(1, "Last name is required")
    .regex(
      nameRegex,
      "Last name must contain only letters and may include hyphens or apostrophes",
    ),

  email: z.string().email("Invalid email address"),
});

type CreateAdminFormData = z.infer<typeof createAdminSchema>;

interface CreateAdminFormProps {
  onSuccess?: () => void;
}

export default function CreateAdminForm({ onSuccess }: CreateAdminFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [newAdminEmail, setNewAdminEmail] = useState("");

  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  async function onSubmit(values: CreateAdminFormData) {
    setIsSubmitting(true);

    try {
      const result = await createAdminAction(values);

      if (result.success && result.data) {
        toast.success("Admin created successfully!");
        setNewAdminEmail(values.email);
        setGeneratedPassword(result.data.defaultPassword);
        setShowPasswordDialog(true);
        form.reset();
        onSuccess?.();
      } else {
        toast.error(result.error || "Failed to create admin");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <>
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-8 shadow-sm">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-warm-800 dark:text-warm-200 mb-2">
            Create New Admin
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Add a new administrator to the platform
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-warm-700 dark:text-warm-300 font-semibold">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter first name"
                        className="h-12 border-warm-200/30 dark:border-neutral-600 focus:border-warm-200 focus:ring-warm-200 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-warm-700 dark:text-warm-300 font-semibold">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter last name"
                        className="h-12 border-warm-200/30 dark:border-neutral-600 focus:border-warm-200 focus:ring-warm-200 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200"
                        disabled={isSubmitting}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-warm-700 dark:text-warm-300 font-semibold">
                    Company Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@kimberly-ryan.net"
                      className="h-12 border-warm-200/30 dark:border-neutral-600 focus:border-warm-200 focus:ring-warm-200 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-200"
                      disabled={isSubmitting}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="bg-gradient-to-r from-warm-200 to-warm-700 hover:from-warm-300 hover:to-warm-800 text-white font-semibold h-12 px-8 shadow-lg hover:shadow-xl transition-all"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>Creating Admin...</span>
                </>
              ) : (
                "Create Admin"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Password Display Dialog - Enhanced */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-lg border-warm-200/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-green-600 dark:text-green-400">
              ✅ Admin Created Successfully!
            </DialogTitle>
            <DialogDescription className="text-base">
              Please save these credentials securely. The password will not be
              shown again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="bg-warm-50 dark:bg-warm-900/20 border border-warm-200/30 dark:border-warm-700/30 rounded-xl p-6 space-y-4">
              <div>
                <label className="text-sm font-semibold text-warm-700 dark:text-warm-300 mb-2 block">
                  Email Address
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={newAdminEmail}
                    readOnly
                    className="flex-1 font-medium border-warm-200/30"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyToClipboard(newAdminEmail)}
                    className="border-warm-200 text-warm-700 hover:bg-warm-50"
                  >
                    Copy
                  </Button>
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-warm-700 dark:text-warm-300 mb-2 block">
                  Temporary Password
                </label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generatedPassword}
                    readOnly
                    className="flex-1 font-mono font-bold border-warm-200/30"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => copyToClipboard(generatedPassword)}
                    className="border-warm-200 text-warm-700 hover:bg-warm-50"
                  >
                    Copy
                  </Button>
                </div>
              </div>
            </div>
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4">
              <p className="text-sm text-blue-800 dark:text-blue-300 font-medium">
                📋 Important: The new admin must change this password after
                their first login.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

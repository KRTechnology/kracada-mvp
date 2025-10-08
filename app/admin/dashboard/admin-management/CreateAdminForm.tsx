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

const createAdminSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
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
      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-6">
        <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-6">
          Admin Creation
        </h2>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">
                      First Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Input first name"
                        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200"
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
                    <FormLabel className="text-neutral-700 dark:text-neutral-300">
                      Last Name <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Input last name"
                        className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200"
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
                  <FormLabel className="text-neutral-700 dark:text-neutral-300">
                    Company Email <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Input company's email address"
                      className="bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200"
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
              className="bg-warm-200 hover:bg-warm-300 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner size="sm" className="mr-2" />
                  <span>Creating...</span>
                </>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </Form>
      </div>

      {/* Password Display Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Admin Created Successfully</DialogTitle>
            <DialogDescription>
              Please save these credentials. The password will not be shown
              again.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <Input value={newAdminEmail} readOnly className="flex-1" />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyToClipboard(newAdminEmail)}
                >
                  Copy
                </Button>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Temporary Password
              </label>
              <div className="mt-1 flex items-center space-x-2">
                <Input
                  value={generatedPassword}
                  readOnly
                  className="flex-1 font-mono"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => copyToClipboard(generatedPassword)}
                >
                  Copy
                </Button>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              The new admin should change this password after their first login.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

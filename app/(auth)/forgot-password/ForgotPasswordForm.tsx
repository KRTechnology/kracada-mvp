"use client";

import { Button } from "@/components/common/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/form";
import { Input } from "@/components/common/input";
import { Spinner } from "@/components/common/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { forgotPasswordAction, type ForgotPasswordFormData } from "../actions";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: ForgotPasswordFormData) {
    setIsSubmitting(true);

    try {
      const result = await forgotPasswordAction(values);

      if (result.success) {
        toast.success("Reset link sent to your email");
        router.push("/forgot-password/confirmation");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error requesting password reset:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = form.formState.isValid;

  return (
    <div className="w-full space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-200">
          Forgot password
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Enter the email on your account and we will send you a password reset
          link.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-neutral-700 dark:text-neutral-300">
                  Email
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@domain.com"
                    className="focus-visible:ring-warm-200 bg-white dark:bg-neutral-800 border-neutral-300 dark:border-neutral-600 text-neutral-900 dark:text-neutral-200"
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
            className={`w-full flex justify-center items-center ${
              isFormValid
                ? "bg-warm-200 hover:bg-warm-300 text-white dark:text-dark"
                : "bg-[#E2E8F0] dark:bg-neutral-700 text-[#64748B] dark:text-neutral-400 cursor-not-allowed"
            }`}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2 border-white" />
                <span>Sending link...</span>
              </>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link
          href="/login"
          className="text-warm-200 hover:underline text-sm block mt-2"
        >
          Back to log in
        </Link>
      </div>
    </div>
  );
}

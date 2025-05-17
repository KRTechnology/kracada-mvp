"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input } from "@/components/common/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/common/form";
import { Button } from "@/components/common/button";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true);

    try {
      // Here you would connect to your API to send the password reset email
      console.log("Password reset requested for:", values.email);

      // For now, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Redirect to the confirmation page
      router.push("/forgot-password/confirmation");
    } catch (error) {
      console.error("Error requesting password reset:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = form.formState.isValid;

  return (
    <div className="w-full space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Forgot password</h1>
        <p className="text-gray-500 mt-2">
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
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder="example@domain.com"
                    className="focus-visible:ring-warm-200"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className={`w-full ${
              isFormValid
                ? "bg-warm-200 hover:bg-warm-300"
                : "bg-[#E2E8F0] text-[#64748B] cursor-not-allowed"
            }`}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? "Sending link..." : "Reset password"}
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

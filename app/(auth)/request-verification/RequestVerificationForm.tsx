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
import { Spinner } from "@/components/common/spinner";
import { toast } from "sonner";
import {
  requestVerificationEmailAction,
  type VerificationEmailFormData,
} from "../actions";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function RequestVerificationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<VerificationEmailFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: VerificationEmailFormData) {
    setIsSubmitting(true);

    try {
      const result = await requestVerificationEmailAction(values);

      if (result.success) {
        toast.success(result.message);
        // Redirect to login page
        router.push("/login");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Error requesting verification email:", error);
    } finally {
      setIsSubmitting(false);
    }
  }

  const isFormValid = form.formState.isValid;

  return (
    <div className="w-full space-y-6">
      <div className="text-left">
        <h1 className="text-3xl font-bold">Verify your email</h1>
        <p className="text-gray-500 mt-2">
          Enter your email address and we'll send you a verification link.
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
                ? "bg-warm-200 hover:bg-warm-300"
                : "bg-[#E2E8F0] text-[#64748B] cursor-not-allowed"
            }`}
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" className="mr-2" />
                <span>Sending link...</span>
              </>
            ) : (
              "Send verification link"
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

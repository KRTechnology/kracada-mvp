"use client";

import { useState } from "react";
import { Input } from "../common/input";
import { Button } from "../common/button";
import { subscribeToMailingListAction } from "@/app/(dashboard)/actions/mailing-list-actions";
import { toast } from "sonner";

interface NewsletterProps {
  title?: string;
  description?: string;
  className?: string;
  darkMode?: boolean;
}

const Newsletter = ({
  title = "Delivering the latest lifestyle content straight to your inbox",
  description = "We'll never share your email address with a third-party.",
  className = "",
  darkMode = true,
}: NewsletterProps) => {
  const [email, setEmail] = useState("");

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();

  //   // Here you would typically implement newsletter subscription logic
  //   console.log(`Subscribing email: ${email}`);
  //   setEmail("");
  //   // Add actual API call for subscription here
  // };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // setIsSubmitting(true);

      // Get user info for analytics
      const userAgent =
        typeof navigator !== "undefined" ? navigator.userAgent : undefined;

      const result = await subscribeToMailingListAction({
        email,
        source: "lifestyle_page",
        userAgent,
      });

      if (result.success) {
        // setIsSubmitted(true);
        setEmail("");

        toast.success(result.message);

        // Reset success state after 5 seconds
        setTimeout(() => {
          // setIsSubmitted(false);
        }, 5000);
      } else {
        // toast.error(result.message || "Failed to subscribe");
      }
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      // setIsSubmitting(false);
    }
  };

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-2xl">
          <h2 className={`text-xl font-semibold mb-2 text-white`}>{title}</h2>
          <p className={darkMode ? "text-warm-50" : "text-warm-50"}>
            {description}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center sm:flex-row gap-4 w-full lg:w-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="placeholder:text-neutral-50"
          />
          <Button
            type="submit"
            className="bg-warm-200 hover:bg-warm-300 text-white"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;

"use client";

import { useState } from "react";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically implement newsletter subscription logic
    console.log(`Subscribing email: ${email}`);
    setEmail("");
    // Add actual API call for subscription here
  };

  return (
    <div className={className}>
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
        <div className="max-w-xl">
          <h2
            className={`text-2xl font-bold mb-2 ${
              darkMode ? "text-white" : "text-neutral-800"
            }`}
          >
            {title}
          </h2>
          <p className={darkMode ? "text-neutral-400" : "text-neutral-500"}>
            {description}
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto"
        >
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={
              darkMode
                ? "flex-grow bg-neutral-800 border-neutral-700 text-white placeholder:text-neutral-500"
                : "flex-grow"
            }
          />
          <Button
            type="submit"
            className="bg-peach-200 hover:bg-peach-300 text-white"
          >
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Newsletter;

import { Metadata } from "next";
import CVSuccessContent from "@/app/cv-optimization/success/CVSuccessContent";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "CV Submitted Successfully - CV Optimization",
  description:
    "Your CV has been successfully submitted for optimization. We'll be in touch soon with your optimized CV.",
};

export default function CVSuccessPage() {
  return (
    <Suspense>
      <CVSuccessContent />
    </Suspense>
  );
}

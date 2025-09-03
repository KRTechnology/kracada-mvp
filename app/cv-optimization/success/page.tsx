import { Metadata } from "next";
import CVSuccessContent from "@/app/cv-optimization/success/CVSuccessContent";

export const metadata: Metadata = {
  title: "CV Submitted Successfully - CV Optimization",
  description:
    "Your CV has been successfully submitted for optimization. We'll be in touch soon with your optimized CV.",
};

export default function CVSuccessPage() {
  return <CVSuccessContent />;
}

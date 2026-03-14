import { Metadata } from "next";
import CVOptimizationContent from "@/app/cv-optimization/CVOptimizationContent";

export const metadata: Metadata = {
  title: "CV Optimization",
  description:
    "Professional CV writing services to help you stand out in the job market. Choose from our affordable packages designed for different career levels.",
};

export default function CVOptimizationPage() {
  return <CVOptimizationContent />;
}
